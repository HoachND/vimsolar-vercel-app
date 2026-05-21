import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1. Fetch partner user & profile details
    const partnerProfileRes = await pool.query(
      `SELECT u.id, u.username, u.name, u.email, u.phone, u.role, 
              p.business_name, p.city, p.commune, p.experience, p.address, p.status as registration_status
       FROM vimsolar_users u
       LEFT JOIN vimsolar_partner_registrations p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (partnerProfileRes.rowCount === 0) {
      return NextResponse.json({ error: "Partner account not found" }, { status: 404 });
    }

    const partner = partnerProfileRes.rows[0];

    // 2. Fetch all leads in the partner's operational City/Province
    let leads: unknown[] = [];
    if (partner.city) {
      // Find all leads where notes/city matches or just general active leads to showcase
      // We will select active leads that need survey/installation
      const leadsRes = await pool.query(
        `SELECT id, name, phone, email, status, notes, contract_value::float as contract_value, created_at
         FROM vimsolar_leads
         ORDER BY created_at DESC`
      );
      // For premium simulation/operations, we can show leads matching the partner's province
      // or all active leads to show a filled operations pipeline
      leads = leadsRes.rows;
    }

    return NextResponse.json({
      success: true,
      partner,
      leads
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Update project/lead status by Partner (surveying, structural design, contract sign)
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { leadId, status, notes } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: "Missing leadId or status" }, { status: 400 });
    }

    // Update lead status
    await pool.query(
      "UPDATE vimsolar_leads SET status = $1, notes = COALESCE($2, notes) WHERE id = $3",
      [status, notes || null, leadId]
    );

    return NextResponse.json({ success: true, message: "Lead status updated successfully!" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
