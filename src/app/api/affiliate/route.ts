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

    // 1. Verify user role
    const userRes = await pool.query(
      "SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder FROM vimsolar_users WHERE id = $1",
      [userId]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRes.rows[0];

    // 2. Fetch Clicks count
    const clicksRes = await pool.query(
      "SELECT COUNT(*)::int as count FROM vimsolar_clicks WHERE referrer_id = $1",
      [userId]
    );
    const clicksCount = clicksRes.rows[0].count;

    // 3. Fetch Leads list
    const leadsRes = await pool.query(
      `SELECT id, name, phone, email, status, contract_value::float as contract_value, 
              commission_amount::float as commission_amount, created_at 
       FROM vimsolar_leads 
       WHERE referrer_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    const leads = leadsRes.rows;

    // 4. Fetch Payout & Earnings logs
    const earningsRes = await pool.query(
      `SELECT id, amount::float as amount, status, reason, created_at 
       FROM vimsolar_earnings 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    const earnings = earningsRes.rows;

    // Calculate dynamic stats
    let totalEarned = 0;
    let totalPaid = 0;
    let pendingEarned = 0;

    earnings.forEach((e: { amount: number; status: string }) => {
      if (e.amount > 0) {
        if (e.status === "paid") {
          totalPaid += e.amount;
          totalEarned += e.amount;
        } else if (e.status === "approved") {
          totalEarned += e.amount;
        } else if (e.status === "pending") {
          pendingEarned += e.amount;
        }
      } else {
        // Payouts (negative amounts)
        if (e.status === "paid") {
          totalPaid += Math.abs(e.amount);
        }
      }
    });

    return NextResponse.json({
      success: true,
      user,
      stats: {
        clicks: clicksCount,
        leadsCount: leads.length,
        balance: parseFloat(user.balance),
        totalEarned,
        totalPaid,
        pendingEarned
      },
      leads,
      earnings
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
    const { action } = body;

    if (action === "submit-lead-manual") {
      const { referrerId, name, phone, email, projectType, systemSize, notes, address } = body;

      if (!referrerId || !name || !phone) {
        return NextResponse.json({ error: "Thiếu thông tin bắt buộc (Người giới thiệu, Tên hoặc SĐT)!" }, { status: 400 });
      }

      // Enforce strict phone & email checks
      if (!/^[0-9]{10}$/.test(phone)) {
        return NextResponse.json({ error: "Số điện thoại phải bao gồm đúng 10 chữ số!" }, { status: 400 });
      }
      if (email && !email.includes("@")) {
        return NextResponse.json({ error: "Email không hợp lệ (phải có ký tự @)!" }, { status: 400 });
      }

      // Check if referrer exists
      const refRes = await pool.query(
        "SELECT id, name, ref_code FROM vimsolar_users WHERE id = $1",
        [referrerId]
      );
      if (refRes.rowCount === 0) {
        return NextResponse.json({ error: "Tài khoản Đại sứ không tồn tại!" }, { status: 404 });
      }
      const referrer = refRes.rows[0];

      // Formulate consolidated notes to maintain schema compatibility
      const fullNotes = `[Địa chỉ: ${address || "Chưa rõ"}] [Hạng mục: ${projectType || "Chưa rõ"} - Gói ${systemSize || "Chưa rõ"}] | Ghi chú: ${notes || "Không có"}`;

      // Insert lead into database
      const insertRes = await pool.query(
        `INSERT INTO vimsolar_leads (name, phone, email, referrer_id, status, notes, contract_value, commission_amount) 
         VALUES ($1, $2, $3, $4, 'pending', $5, 0, 0) 
         RETURNING id, name, phone, email, status, created_at`,
        [name, phone, email || null, referrerId, fullNotes]
      );

      const newLead = insertRes.rows[0];

      // Telegram notification double sync
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8724327895:AAG4lf55tebnB0RhCqxwoTa_-rG4T8QXutQ';
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003947452569';

      const tgMessage = `☀️ LEAD MỚI CỔNG ĐẠI SỨ - VIMSOLAR!
━━━━━━━━━━━━━━━━━━
👤 Đại sứ giới thiệu: ${referrer.name} (${referrer.ref_code})
👤 Tên KH: ${name}
📞 SĐT: ${phone}
📧 Email: ${email || 'Không có'}
🏢 Địa chỉ: ${address || 'Không rõ'}
🏗️ Loại công trình: ${projectType || 'Không rõ'} - Gói ${systemSize || 'Chưa rõ'}
📝 Ghi chú: ${notes || 'Không có'}
📌 Nguồn: Tự nhập từ Cổng Đại Sứ Xanh
━━━━━━━━━━━━━━━━━━
⚡ Kỹ sư liên hệ khảo sát ngay!`;

      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage }),
        });
      } catch (tgErr) {
        console.error("Telegram notification error:", tgErr);
      }

      // Double-sync to Google Sheets via GAS
      const PROJECT_GAS_URL = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbyEdnk__IV7PAx4X8LoCB6lfkil0u1q7Zsa9RborC4zSBeKAKwLyNiilFV4A_GPNAg/exec";
      const GLOBAL_GAS_URL = "https://script.google.com/macros/s/AKfycbzVK3sPVnbDfcRxk8n_5vi-gRU2X_1GTXVHuU8kcrk6Kfk3wkpqKRDJACtb3msUFRm6/exec";
      const GLOBAL_SHEET_ID = "1LAtBjiRbwTxt7qu9XSYwzbVMNYBvC6guq-Zv_Yp3Cf0";

      const gasPayload = {
        name,
        phone,
        email: email || "",
        projectType: `${projectType || "Chưa rõ"} (Gói ${systemSize || "Chưa rõ"})`,
        source: `Cổng Đại Sứ (Mã: ${referrer.ref_code})`,
        notes: notes || "",
        address: address || "",
        targetSheetId: GLOBAL_SHEET_ID
      };

      try {
        await Promise.all([
          fetch(PROJECT_GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ ...gasPayload, source: `solar.vimgroup.vn (Cổng Đại Sứ: ${referrer.ref_code})` }),
          }),
          fetch(GLOBAL_GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(gasPayload),
          })
        ]);
      } catch (gasErr) {
        console.error("GAS sync error:", gasErr);
      }

      return NextResponse.json({ success: true, lead: newLead });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
