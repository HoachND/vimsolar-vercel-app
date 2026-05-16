import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

// POST: Login / Register / Change Password / Update Profile / Add Staff
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { username, password } = body;
      const res = await pool.query(
        `SELECT id, username, name, email, phone, role, created_at FROM vimsolar_users WHERE (username = $1 OR email = $1) AND password = $2`,
        [username, password]
      );
      if (res.rowCount === 0) {
        return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu!" }, { status: 401 });
      }
      return NextResponse.json({ success: true, user: res.rows[0] });
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
        `UPDATE vimsolar_users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone) WHERE id = $4 RETURNING id, username, name, email, phone, role, created_at`,
        [name, email, phone, userId]
      );
      const res = await pool.query(`SELECT id, username, name, email, phone, role, created_at FROM vimsolar_users WHERE id = $1`, [userId]);
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

      const listRes = await pool.query(`SELECT id, username, name, email, phone, role, created_at FROM vimsolar_users ORDER BY created_at DESC`);
      return NextResponse.json(listRes.rows);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
