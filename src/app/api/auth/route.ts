import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;
const DATA_DIR = isVercel ? "/tmp" : path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "member";
  createdAt: string;
}

function ensureFile() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]", "utf-8");
}

function readUsers(): User[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function writeUsers(users: User[]) {
  ensureFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// POST: Login / Register / Change Password / Update Profile / Add Staff
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { username, password } = body;
      const users = readUsers();
      const user = users.find(
        (u) =>
          (u.username === username || u.email === username) &&
          u.password === password
      );
      if (!user) {
        return NextResponse.json(
          { error: "Sai tên đăng nhập hoặc mật khẩu!" },
          { status: 401 }
        );
      }
      const { password: _, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });
    }

    if (action === "change-password") {
      const { userId, currentPassword, newPassword } = body;
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (users[idx].password !== currentPassword) {
        return NextResponse.json(
          { error: "Mật khẩu hiện tại không đúng!" },
          { status: 400 }
        );
      }
      users[idx].password = newPassword;
      writeUsers(users);
      return NextResponse.json({ success: true, message: "Đổi mật khẩu thành công!" });
    }

    if (action === "update-profile") {
      const { userId, name, email, phone } = body;
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (name) users[idx].name = name;
      if (email) users[idx].email = email;
      if (phone) users[idx].phone = phone;
      writeUsers(users);
      const { password: _, ...safeUser } = users[idx];
      return NextResponse.json({ success: true, user: safeUser });
    }

    if (action === "add-staff") {
      const { adminId, username, password, name, email, phone, role } = body;
      const users = readUsers();
      const admin = users.find((u) => u.id === adminId && u.role === "admin");
      if (!admin) {
        return NextResponse.json(
          { error: "Chỉ Admin mới có quyền thêm Staff!" },
          { status: 403 }
        );
      }
      if (users.find((u) => u.username === username)) {
        return NextResponse.json(
          { error: "Username đã tồn tại!" },
          { status: 400 }
        );
      }
      const newUser: User = {
        id: Date.now().toString(),
        username,
        password: password || "vimsolar123",
        name: name || username,
        email: email || "",
        phone: phone || "",
        role: role || "staff",
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeUsers(users);
      const { password: _, ...safeUser } = newUser;
      return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
    }

    if (action === "delete-staff") {
      const { adminId, userId } = body;
      const users = readUsers();
      const admin = users.find((u) => u.id === adminId && u.role === "admin");
      if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      const target = users.find((u) => u.id === userId);
      if (!target)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (target.role === "admin")
        return NextResponse.json(
          { error: "Không thể xóa Admin!" },
          { status: 400 }
        );
      const filtered = users.filter((u) => u.id !== userId);
      writeUsers(filtered);
      return NextResponse.json({ success: true });
    }

    if (action === "change-role") {
      const { adminId, userId, newRole } = body;
      const users = readUsers();
      const admin = users.find((u) => u.id === adminId && u.role === "admin");
      if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      users[idx].role = newRole;
      writeUsers(users);
      return NextResponse.json({ success: true });
    }

    if (action === "list-users") {
      const { adminId } = body;
      const users = readUsers();
      const admin = users.find(
        (u) => u.id === adminId && (u.role === "admin" || u.role === "staff")
      );
      if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      return NextResponse.json(
        users.map(({ password: _, ...u }) => u)
      );
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
