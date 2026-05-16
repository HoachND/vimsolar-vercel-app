import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mail";

// Generate a 6-char code
function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8724327895:AAG4lf55tebnB0RhCqxwoTa_-rG4T8QXutQ";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003947452569";
const PROJECT_GAS_URL = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbyEdnk__IV7PAx4X8LoCB6lfkil0u1q7Zsa9RborC4zSBeKAKwLyNiilFV4A_GPNAg/exec";
const GLOBAL_GAS_URL = "https://script.google.com/macros/s/AKfycbzVK3sPVnbDfcRxk8n_5vi-gRU2X_1GTXVHuU8kcrk6Kfk3wkpqKRDJACtb3msUFRm6/exec";
const GLOBAL_SHEET_ID = "1LAtBjiRbwTxt7qu9XSYwzbVMNYBvC6guq-Zv_Yp3Cf0";

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { action } = body;

    // Register for ROI access (new member)
    if (action === "register") {
      const { name, phone, email } = body;
      const phoneClean = phone.replace(/\D/g, "");
      
      if (phoneClean.length !== 10) return NextResponse.json({ error: "Số điện thoại phải đúng 10 số!" }, { status: 400 });
      if (!email || !email.includes("@")) return NextResponse.json({ error: "Email không hợp lệ! Phải có ký tự @" }, { status: 400 });

      // Check if already registered
      const checkRes = await pool.query(
        `SELECT access_code, expires_at FROM vimsolar_roi_access WHERE phone = $1 AND expires_at > CURRENT_TIMESTAMP`,
        [phoneClean]
      );
      
      let code = "";
      if (checkRes.rowCount && checkRes.rowCount > 0) {
        code = checkRes.rows[0].access_code;
      } else {
        code = generateCode();
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        const newId = Date.now().toString();

        await pool.query(
          `INSERT INTO vimsolar_roi_access (id, name, phone, email, access_code, expires_at) VALUES ($1, $2, $3, $4, $5, $6)`,
          [newId, name, phoneClean, email, code, expires]
        );
      }

      // 1. Send Welcome Email (Wait for this to ensure it sends)
      try {
        await sendWelcomeEmail(email, name, code);
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
      }

      // 2. Sync background (Telegram & GAS)
      const tgMessage = `🔓 ĐĂNG KÝ ROI TOOL - VIMSOLAR!\n\n👤 Tên: ${name}\n📞 SĐT: ${phoneClean}\n📧 Email: ${email}\n🔑 Mã truy cập: ${code}\n📌 Nguồn: ROI Tool Registration\n\n⚡ Khách hàng quan tâm Solar!`;
      
      Promise.all([
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage }),
        }),
        fetch(PROJECT_GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name, phone: phoneClean, email, projectType: "Đăng ký ROI Tool", source: "solar.vimgroup.vn (roi-register)" }),
        }),
        fetch(GLOBAL_GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name, phone: phoneClean, email, projectType: "Đăng ký ROI Tool", source: "solar.vimgroup.vn (roi-register)", targetSheetId: GLOBAL_SHEET_ID }),
        })
      ]).catch(e => console.error("Sync Background Error:", e));

      return NextResponse.json({
        success: true,
        accessCode: code,
        message: "Đăng ký thành công! Sử dụng mã bên dưới để truy cập ROI Tool.",
      });
    }

    // Verify access code or staff login
    if (action === "verify") {
      const { accessCode, username, password } = body;

      if (accessCode) {
        const checkRes = await pool.query(
          `SELECT name FROM vimsolar_roi_access WHERE access_code = $1 AND expires_at > CURRENT_TIMESTAMP`,
          [accessCode.toUpperCase()]
        );
        if (checkRes.rowCount && checkRes.rowCount > 0) {
          return NextResponse.json({ success: true, name: checkRes.rows[0].name, type: "member" });
        }
        return NextResponse.json({ error: "Mã truy cập không hợp lệ hoặc đã hết hạn!" }, { status: 401 });
      }

      if (username && password) {
        const res = await pool.query(
          `SELECT name, role FROM vimsolar_users WHERE (username = $1 OR email = $1) AND password = $2`,
          [username, password]
        );
        if (res.rowCount && res.rowCount > 0) {
          return NextResponse.json({ success: true, name: res.rows[0].name, type: res.rows[0].role });
        }
        return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu!" }, { status: 401 });
      }

      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
