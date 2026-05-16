import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ACCESS_FILE = path.join(process.cwd(), "data", "roi-access.json");
const USERS_FILE = path.join(process.cwd(), "data", "users.json");

interface ROIAccess {
  id: string;
  name: string;
  phone: string;
  email: string;
  accessCode: string;
  createdAt: string;
  expiresAt: string;
}

function ensureFile(f: string) {
  const dir = path.dirname(f);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(f)) fs.writeFileSync(f, "[]", "utf-8");
}

function readAccess(): ROIAccess[] {
  ensureFile(ACCESS_FILE);
  return JSON.parse(fs.readFileSync(ACCESS_FILE, "utf-8"));
}

function writeAccess(data: ROIAccess[]) {
  ensureFile(ACCESS_FILE);
  fs.writeFileSync(ACCESS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Generate a 6-char code
function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8724327895:AAG4lf55tebnB0RhCqxwoTa_-rG4T8QXutQ";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-5179603882";
const PROJECT_GAS_URL = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbyEdnk__IV7PAx4X8LoCB6lfkil0u1q7Zsa9RborC4zSBeKAKwLyNiilFV4A_GPNAg/exec";
const GLOBAL_GAS_URL = "https://script.google.com/macros/s/AKfycbzVK3sPVnbDfcRxk8n_5vi-gRU2X_1GTXVHuU8kcrk6Kfk3wkpqKRDJACtb3msUFRm6/exec";
const GLOBAL_SHEET_ID = "1LAtBjiRbwTxt7qu9XSYwzbVMNYBvC6guq-Zv_Yp3Cf0";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Register for ROI access (new member)
    if (action === "register") {
      const { name, phone, email } = body;

      // Validate phone: must be exactly 10 digits
      const phoneClean = phone.replace(/\D/g, "");
      if (phoneClean.length !== 10) {
        return NextResponse.json(
          { error: "Số điện thoại phải đúng 10 số!" },
          { status: 400 }
        );
      }

      // Validate email: must contain @
      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { error: "Email không hợp lệ! Phải có ký tự @" },
          { status: 400 }
        );
      }

      const accessList = readAccess();
      // Check if already registered by phone
      const existing = accessList.find((a) => a.phone === phoneClean);
      if (existing && new Date(existing.expiresAt) > new Date()) {
        return NextResponse.json({
          success: true,
          accessCode: existing.accessCode,
          message: "Bạn đã đăng ký trước đó. Đây là mã truy cập của bạn.",
        });
      }

      const code = generateCode();
      const now = new Date();
      const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

      const newAccess: ROIAccess = {
        id: Date.now().toString(),
        name,
        phone: phoneClean,
        email,
        accessCode: code,
        createdAt: now.toISOString(),
        expiresAt: expires.toISOString(),
      };

      accessList.push(newAccess);
      writeAccess(accessList);

      // Send Telegram notification
      const tgMessage = `🔐 ĐĂNG KÝ ROI TOOL - VIMSOLAR!
━━━━━━━━━━━━━━━━━━
👤 Tên: ${name}
📞 SĐT: ${phoneClean}
📧 Email: ${email}
🔑 Mã truy cập: ${code}
📌 Nguồn: ROI Tool Registration
━━━━━━━━━━━━━━━━━━
⚡ Khách hàng quan tâm Solar!`;

      try {
        await Promise.all([
          // Telegram
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage }),
          }),
          // Google Sheet - Project
          fetch(PROJECT_GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              name,
              phone: phoneClean,
              email,
              projectType: "Đăng ký ROI Tool",
              source: "solar.vimgroup.vn (roi-register)",
            }),
          }),
          // Google Sheet - TOTAL
          fetch(GLOBAL_GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              name,
              phone: phoneClean,
              email,
              projectType: "Đăng ký ROI Tool",
              source: "solar.vimgroup.vn (roi-register)",
              targetSheetId: GLOBAL_SHEET_ID,
            }),
          }),
        ]);
      } catch (syncError) {
        console.error("Sync error (non-blocking):", syncError);
      }

      return NextResponse.json({
        success: true,
        accessCode: code,
        message: "Đăng ký thành công! Sử dụng mã bên dưới để truy cập ROI Tool.",
      });
    }

    // Verify access code or staff login
    if (action === "verify") {
      const { accessCode, username, password } = body;

      // Check access code from ROI registrations
      if (accessCode) {
        const accessList = readAccess();
        const found = accessList.find(
          (a) => a.accessCode === accessCode.toUpperCase() && new Date(a.expiresAt) > new Date()
        );
        if (found) {
          return NextResponse.json({
            success: true,
            name: found.name,
            type: "member",
          });
        }
        return NextResponse.json(
          { error: "Mã truy cập không hợp lệ hoặc đã hết hạn!" },
          { status: 401 }
        );
      }

      // Check staff/admin login
      if (username && password) {
        ensureFile(USERS_FILE);
        const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        const user = users.find(
          (u: { username: string; email: string; password: string }) =>
            (u.username === username || u.email === username) &&
            u.password === password
        );
        if (user) {
          return NextResponse.json({
            success: true,
            name: user.name,
            type: user.role,
          });
        }
        return NextResponse.json(
          { error: "Sai tên đăng nhập hoặc mật khẩu!" },
          { status: 401 }
        );
      }

      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
