import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/mail";

const GLOBAL_GAS_URL = "https://script.google.com/macros/s/AKfycbzVK3sPVnbDfcRxk8n_5vi-gRU2X_1GTXVHuU8kcrk6Kfk3wkpqKRDJACtb3msUFRm6/exec";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8724327895:AAG4lf55tebnB0RhCqxwoTa_-rG4T8QXutQ";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003947452569";

// POST: Login / Register / Change Password / Update Profile / Add Staff
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { username, password } = body;
      const res = await pool.query(
        `SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder, created_at FROM vimsolar_users WHERE (username = $1 OR email = $1) AND password = $2`,
        [username, password]
      );
      if (res.rowCount === 0) {
        return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu!" }, { status: 401 });
      }
      return NextResponse.json({ success: true, user: res.rows[0] });
    }

    if (action === "forgot-password") {
      const { email } = body;
      const checkRes = await pool.query(`SELECT id FROM vimsolar_users WHERE email = $1`, [email]);
      if (checkRes.rowCount === 0) {
        return NextResponse.json({ error: "Không tìm thấy tài khoản với email này!" }, { status: 404 });
      }

      // Generate a simple temporary password
      const tempPassword = Math.random().toString(36).substring(2, 10);
      await pool.query(`UPDATE vimsolar_users SET password = $1 WHERE email = $2`, [tempPassword, email]);

      // Send email
      await sendPasswordResetEmail(email, tempPassword);

      return NextResponse.json({ success: true, message: "Đã gửi email khôi phục mật khẩu!" });
    }

    if (action === "change-password") {
      const { userId, currentPassword, newPassword } = body;
      const res = await pool.query(`SELECT password FROM vimsolar_users WHERE id = $1`, [userId]);
      if (res.rowCount === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (res.rows[0].password !== currentPassword) {
        return NextResponse.json({ error: "Mật khẩu hiện tại không đúng!" }, { status: 400 });
      }
      await pool.query(`UPDATE vimsolar_users SET password = $1 WHERE id = $2`, [newPassword, userId]);
      return NextResponse.json({ success: true, message: "Đổi mật khẩu thành công!" });
    }

    if (action === "update-profile") {
      const { userId, name, email, phone } = body;
      await pool.query(
        `UPDATE vimsolar_users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone) WHERE id = $4 RETURNING id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder, created_at`,
        [name, email, phone, userId]
      );
      const res = await pool.query(`SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder, created_at FROM vimsolar_users WHERE id = $1`, [userId]);
      return NextResponse.json({ success: true, user: res.rows[0] });
    }

    if (action === "add-staff") {
      const { adminId, username, password, name, email, phone, role } = body;
      const adminRes = await pool.query(`SELECT id FROM vimsolar_users WHERE id = $1 AND role = 'admin'`, [adminId]);
      if (adminRes.rowCount === 0) return NextResponse.json({ error: "Chỉ Admin mới có quyền thêm Staff!" }, { status: 403 });
      
      const checkRes = await pool.query(`SELECT id FROM vimsolar_users WHERE username = $1`, [username]);
      if (checkRes.rowCount && checkRes.rowCount > 0) return NextResponse.json({ error: "Username đã tồn tại!" }, { status: 400 });

      const newId = Date.now().toString();
      const insertRes = await pool.query(
        `INSERT INTO vimsolar_users (id, username, password, name, email, phone, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, name, email, phone, role, created_at`,
        [newId, username, password || "vimsolar123", name || username, email || "", phone || "", role || "staff"]
      );
      return NextResponse.json({ success: true, user: insertRes.rows[0] }, { status: 201 });
    }

    if (action === "delete-staff") {
      const { adminId, userId } = body;
      const adminRes = await pool.query(`SELECT id FROM vimsolar_users WHERE id = $1 AND role = 'admin'`, [adminId]);
      if (adminRes.rowCount === 0) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      
      const targetRes = await pool.query(`SELECT role FROM vimsolar_users WHERE id = $1`, [userId]);
      if (targetRes.rowCount === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (targetRes.rows[0].role === "admin") return NextResponse.json({ error: "Không thể xóa Admin!" }, { status: 400 });

      await pool.query(`DELETE FROM vimsolar_users WHERE id = $1`, [userId]);
      return NextResponse.json({ success: true });
    }

    if (action === "change-role") {
      const { adminId, userId, newRole } = body;
      const adminRes = await pool.query(`SELECT id FROM vimsolar_users WHERE id = $1 AND role = 'admin'`, [adminId]);
      if (adminRes.rowCount === 0) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      
      await pool.query(`UPDATE vimsolar_users SET role = $1 WHERE id = $2`, [newRole, userId]);
      return NextResponse.json({ success: true });
    }

    if (action === "list-users") {
      const { adminId } = body;
      const adminRes = await pool.query(`SELECT id FROM vimsolar_users WHERE id = $1 AND role IN ('admin', 'staff')`, [adminId]);
      if (adminRes.rowCount === 0) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

      const listRes = await pool.query(`SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder, created_at FROM vimsolar_users ORDER BY created_at DESC`);
      return NextResponse.json(listRes.rows);
    }

    if (action === "register-ambassador") {
      const { username, password, name, email, phone } = body;
      const checkRes = await pool.query(
        `SELECT id FROM vimsolar_users WHERE username = $1 OR email = $2 OR phone = $3`,
        [username, email, phone]
      );
      if (checkRes.rowCount && checkRes.rowCount > 0) {
        return NextResponse.json({ error: "Tên đăng nhập, Email hoặc Số điện thoại đã tồn tại!" }, { status: 400 });
      }

      const newId = "amb_" + Date.now().toString();
      const refCode = "VS" + Math.random().toString(36).substring(2, 7).toUpperCase();

      const insertRes = await pool.query(
        `INSERT INTO vimsolar_users (id, username, password, name, email, phone, role, ref_code, balance) 
         VALUES ($1, $2, $3, $4, $5, $6, 'member', $7, 0) 
         RETURNING id, username, name, email, phone, role, ref_code, balance, created_at`,
        [newId, username, password, name, email, phone, refCode]
      );

      // Gửi email chào mừng
      try { await sendWelcomeEmail(email, name || username, "Đại Sứ Xanh"); } catch (e) { console.error('[MAIL] Error:', e); }

      // Telegram + GAS Sync
      const tgMsgAmb = `🌱 ĐĂNG KÝ ĐẠI SỨ XANH - VIMSOLAR!\n━━━━━━━━━━━━━━━━━━\n👤 Tên: ${name || username}\n📞 SĐT: ${phone}\n📧 Email: ${email}\n🔑 Ref Code: ${refCode}\n📌 Nguồn: Đăng ký Đại Sứ Xanh\n━━━━━━━━━━━━━━━━━━\n⚡ Đại sứ mới tham gia!`;
      try {
        await Promise.all([
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMsgAmb }),
          }),
          fetch(GLOBAL_GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ 
              name: name || username,
              email: email,
              phone: phone,
              source: "solar.vimgroup.vn (Đăng ký Đại Sứ Xanh)",
              targetSheetId: "1LAtBjiRbwTxt7qu9XSYwzbVMNYBvC6guq-Zv_Yp3Cf0"
            }),
          })
        ]);
      } catch (e) { console.error('[SYNC] Telegram/GAS error:', e); }

      return NextResponse.json({ success: true, user: insertRes.rows[0] }, { status: 201 });
    }

    if (action === "register-partner") {
      const { username, password, name, email, phone, businessName, city, commune, experience, address } = body;
      const checkRes = await pool.query(
        `SELECT id FROM vimsolar_users WHERE username = $1 OR email = $2 OR phone = $3`,
        [username, email, phone]
      );
      if (checkRes.rowCount && checkRes.rowCount > 0) {
        return NextResponse.json({ error: "Tên đăng nhập, Email hoặc Số điện thoại đã tồn tại!" }, { status: 400 });
      }

      const newId = "part_" + Date.now().toString();
      
      // Create user in vimsolar_users with role 'partner'
      const userInsert = await pool.query(
        `INSERT INTO vimsolar_users (id, username, password, name, email, phone, role, balance) 
         VALUES ($1, $2, $3, $4, $5, $6, 'partner', 0) 
         RETURNING id, username, name, email, phone, role, created_at`,
        [newId, username, password, name, email, phone]
      );

      // Create partner registration details
      await pool.query(
        `INSERT INTO vimsolar_partner_registrations (user_id, business_name, phone, email, city, commune, experience, address, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
        [newId, businessName, phone, email, city, commune, experience, address]
      );

      // Gửi email chào mừng
      try { await sendWelcomeEmail(email, name || username, "Đối Tác Lắp Đặt"); } catch (e) { console.error('[MAIL] Error:', e); }

      // Telegram + GAS Sync
      const tgMsgPart = `🔧 ĐĂNG KÝ ĐỐI TÁC LẮP ĐẶT - VIMSOLAR!\n━━━━━━━━━━━━━━━━━━\n🏢 Doanh nghiệp: ${businessName}\n👤 Đại diện: ${name || username}\n📞 SĐT: ${phone}\n📧 Email: ${email}\n📍 Tỉnh: ${city}\n🔧 Kinh nghiệm: ${experience}\n📌 Nguồn: Đăng ký Đối Tác Lắp Đặt\n━━━━━━━━━━━━━━━━━━\n⚡ Đối tác mới gia nhập!`;
      try {
        await Promise.all([
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMsgPart }),
          }),
          fetch(GLOBAL_GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ 
              name: name || username,
              email: email,
              phone: phone,
              source: "solar.vimgroup.vn (Đăng ký Đối Tác)",
              targetSheetId: "1qHj3Jee25PRetL2JKww4XJgUIJ5BatPOHARKiJBTdek/edit?gid=581083408"
            }),
          })
        ]);
      } catch (e) { console.error('[SYNC] Telegram/GAS error:', e); }

      return NextResponse.json({ success: true, user: userInsert.rows[0] }, { status: 201 });
    }

    if (action === "update-affiliate-bank") {
      const { userId, bankName, bankAccount, bankHolder } = body;
      await pool.query(
        `UPDATE vimsolar_users SET bank_name = $1, bank_account = $2, bank_holder = $3 WHERE id = $4`,
        [bankName, bankAccount, bankHolder, userId]
      );
      const res = await pool.query(
        `SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder, created_at FROM vimsolar_users WHERE id = $1`,
        [userId]
      );
      return NextResponse.json({ success: true, user: res.rows[0] });
    }

    if (action === "request-payout") {
      const { userId, amount } = body;
      
      const userCheck = await pool.query(`SELECT balance FROM vimsolar_users WHERE id = $1`, [userId]);
      if (userCheck.rowCount === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
      const currentBalance = parseFloat(userCheck.rows[0].balance);
      
      if (amount <= 0 || amount > currentBalance) {
        return NextResponse.json({ error: "Số dư không đủ hoặc số tiền rút không hợp lệ!" }, { status: 400 });
      }

      // Insert pending negative earning representing payout
      await pool.query(
        `INSERT INTO vimsolar_earnings (user_id, amount, status, reason) VALUES ($1, $2, 'pending', 'Yêu cầu rút tiền')`,
        [userId, -amount]
      );

      // Subtract balance immediately
      await pool.query(
        `UPDATE vimsolar_users SET balance = balance - $1 WHERE id = $2`,
        [amount, userId]
      );

      const res = await pool.query(
        `SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder, created_at FROM vimsolar_users WHERE id = $1`,
        [userId]
      );
      return NextResponse.json({ success: true, user: res.rows[0] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
