import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    
    // Check if requester is admin/staff
    const searchParams = req.nextUrl.searchParams;
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await pool.query(
      "SELECT id FROM vimsolar_users WHERE id = $1 AND role IN ('admin', 'staff')",
      [adminId]
    );

    if (adminCheck.rowCount === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Fetch all members and partners
    const usersRes = await pool.query(
      `SELECT id, username, name, email, phone, role, ref_code, balance::float as balance, 
              bank_name, bank_account, bank_holder, created_at 
       FROM vimsolar_users 
       WHERE role IN ('member', 'partner')
       ORDER BY created_at DESC`
    );

    // 2. Fetch pending partner registrations
    const registrationsRes = await pool.query(
      `SELECT r.id, r.user_id, r.business_name, r.phone, r.email, r.city, r.commune, r.experience, r.address, r.status, r.created_at,
              u.username
       FROM vimsolar_partner_registrations r
       LEFT JOIN vimsolar_users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    // 3. Fetch all leads
    const leadsRes = await pool.query(
      `SELECT l.id, l.name, l.phone, l.email, l.referrer_id, l.status, l.notes, 
              l.contract_value::float as contract_value, l.commission_amount::float as commission_amount, l.created_at,
              u.name as referrer_name
       FROM vimsolar_leads l
       LEFT JOIN vimsolar_users u ON l.referrer_id = u.id
       ORDER BY l.created_at DESC`
    );

    // 4. Fetch payout requests
    const payoutsRes = await pool.query(
      `SELECT e.id, e.user_id, e.amount::float as amount, e.status, e.reason, e.created_at,
              u.name as user_name, u.bank_name, u.bank_account, u.bank_holder
       FROM vimsolar_earnings e
       LEFT JOIN vimsolar_users u ON e.user_id = u.id
       WHERE e.amount < 0
       ORDER BY e.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      users: usersRes.rows,
      registrations: registrationsRes.rows,
      leads: leadsRes.rows,
      payouts: payoutsRes.rows
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { action, adminId } = body;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await pool.query(
      "SELECT id FROM vimsolar_users WHERE id = $1 AND role IN ('admin', 'staff')",
      [adminId]
    );

    if (adminCheck.rowCount === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ACTION: Approve Partner Registration
    if (action === "approve-partner") {
      const { registrationId, userId } = body;
      
      // Update registration status
      await pool.query(
        "UPDATE vimsolar_partner_registrations SET status = 'approved' WHERE id = $1",
        [registrationId]
      );

      // Verify the user details have role partner
      if (userId) {
        await pool.query(
          "UPDATE vimsolar_users SET role = 'partner' WHERE id = $1",
          [userId]
        );
      }

      return NextResponse.json({ success: true, message: "Partner registration approved!" });
    }

    // ACTION: Reject Partner Registration
    if (action === "reject-partner") {
      const { registrationId } = body;
      
      await pool.query(
        "UPDATE vimsolar_partner_registrations SET status = 'rejected' WHERE id = $1",
        [registrationId]
      );

      return NextResponse.json({ success: true, message: "Partner registration rejected!" });
    }

    // ACTION: Update Lead Contract & Calculate 2% Commission
    if (action === "update-lead-contract") {
      const { leadId, contractValue, status, notes } = body;
      const parsedVal = parseFloat(contractValue) || 0;

      // 1. Get current lead details
      const leadRes = await pool.query(
        "SELECT id, referrer_id, status, commission_amount FROM vimsolar_leads WHERE id = $1",
        [leadId]
      );
      if (leadRes.rowCount === 0) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      const currentLead = leadRes.rows[0];

      // Calculate 2% commission
      const commissionAmount = parsedVal * 0.02;

      // 2. Update lead columns
      await pool.query(
        `UPDATE vimsolar_leads 
         SET contract_value = $1, commission_amount = $2, status = $3, notes = COALESCE($4, notes) 
         WHERE id = $5`,
        [parsedVal, commissionAmount, status, notes || null, leadId]
      );

      // 3. If there is a referrer and lead completed/contract signed, reward the referrer!
      if (currentLead.referrer_id && (status === "contract" || status === "completed")) {
        // Check if earning already exists for this lead to prevent double payment
        const earningCheck = await pool.query(
          "SELECT id FROM vimsolar_earnings WHERE lead_id = $1 AND amount > 0",
          [leadId]
        );

        if (earningCheck.rowCount === 0) {
          // Record earning log for ambassador
          await pool.query(
            `INSERT INTO vimsolar_earnings (user_id, amount, status, reason, lead_id) 
             VALUES ($1, $2, 'approved', $3, $4)`,
            [
              currentLead.referrer_id, 
              commissionAmount, 
              `Hoa hồng 2% giới thiệu hợp đồng cho khách hàng mới`,
              leadId
            ]
          );

          // Add to ambassador balance
          await pool.query(
            "UPDATE vimsolar_users SET balance = balance + $1 WHERE id = $2",
            [commissionAmount, currentLead.referrer_id]
          );
        }
      }

      return NextResponse.json({ success: true, message: "Lead status updated and commissions audited!" });
    }

    // ACTION: Approve Payout Request (mark as Paid)
    if (action === "approve-payout") {
      const { payoutId } = body;
      
      await pool.query(
        "UPDATE vimsolar_earnings SET status = 'paid' WHERE id = $1",
        [payoutId]
      );

      return NextResponse.json({ success: true, message: "Payout request approved and flagged as Paid!" });
    }

    // ACTION: Reject Payout Request (revert amount to balance)
    if (action === "reject-payout") {
      const { payoutId } = body;
      
      const earningRes = await pool.query(
        "SELECT user_id, amount, status FROM vimsolar_earnings WHERE id = $1",
        [payoutId]
      );

      if (earningRes.rowCount === 0) return NextResponse.json({ error: "Payout log not found" }, { status: 404 });
      const payout = earningRes.rows[0];

      if (payout.status !== "pending") {
        return NextResponse.json({ error: "Payout request already processed" }, { status: 400 });
      }

      // Revert status to rejected
      await pool.query(
        "UPDATE vimsolar_earnings SET status = 'rejected' WHERE id = $1",
        [payoutId]
      );

      // Return the negative amount (make it positive) back to user balance
      const revertAmount = Math.abs(parseFloat(payout.amount));
      await pool.query(
        "UPDATE vimsolar_users SET balance = balance + $1 WHERE id = $2",
        [revertAmount, payout.user_id]
      );

      return NextResponse.json({ success: true, message: "Payout request rejected and balance reverted successfully!" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
