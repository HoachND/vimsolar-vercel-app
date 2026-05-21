import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pool, initDb } from './db';
import { sendWelcomeEmail } from './mail';

function generateRefCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'VS';
  for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

const providers: any[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Username / Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.username || !credentials?.password) {
        throw new Error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      }

      await initDb();
      // For now, we compare plaintext passwords as it was before. 
      // If we use bcrypt, we would need to migrate existing users.
      const res = await pool.query(
        `SELECT id, username, name, email, phone, role, ref_code, balance FROM vimsolar_users WHERE (username = $1 OR email = $1) AND password = $2`,
        [credentials.username, credentials.password]
      );

      if (res.rowCount === 0) {
        throw new Error('Sai tên đăng nhập hoặc mật khẩu!');
      }

      const user = res.rows[0];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        refCode: user.ref_code,
      };
    }
  })
);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/', // Using homepage since LoginModal is there
    error: '/',
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          await initDb();
          const existingUserRes = await pool.query(
            `SELECT id, role, ref_code FROM vimsolar_users WHERE email = $1`,
            [user.email]
          );

          if (existingUserRes.rowCount && existingUserRes.rowCount > 0) {
            // User exists
            const dbUser = existingUserRes.rows[0];
            (user as any).role = dbUser.role;
            (user as any).id = dbUser.id;
            (user as any).refCode = dbUser.ref_code;
          } else {
            // New User via Google
            const { cookies } = await import("next/headers");
            const cookieStore = cookies();
            const roleCookie = cookieStore.get("googleAuthRole")?.value;
            const isPartner = roleCookie === "partner";
            
            const newId = (isPartner ? "part_" : "amb_") + Date.now().toString();
            const refCode = generateRefCode();
            const username = user.email.split('@')[0];
            const role = isPartner ? "partner" : "member";
            const roleName = isPartner ? "Đối Tác Lắp Đặt" : "Đại Sứ Xanh";
            const targetSheetId = isPartner 
              ? "1qHj3Jee25PRetL2JKww4XJgUIJ5BatPOHARKiJBTdek/edit?gid=581083408" 
              : "1LAtBjiRbwTxt7qu9XSYwzbVMNYBvC6guq-Zv_Yp3Cf0";
            
            await pool.query(
              `INSERT INTO vimsolar_users (id, username, password, name, email, phone, role, ref_code, balance) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0)`,
              [newId, username, "google-auth", user.name || username, user.email, "", role, refCode]
            );

            if (isPartner) {
              await pool.query(
                `INSERT INTO vimsolar_partner_registrations (user_id, business_name, phone, email, city, commune, experience, address, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
                [newId, user.name || username, "", user.email, "", "", "", "", "pending"]
              );
            }

            (user as any).role = role;
            (user as any).id = newId;
            (user as any).refCode = refCode;

            // Gửi email chào mừng và bắn Webhook
            sendWelcomeEmail(user.email, user.name || username, roleName);
            
            const GLOBAL_GAS_URL = "https://script.google.com/macros/s/AKfycbzVK3sPVnbDfcRxk8n_5vi-gRU2X_1GTXVHuU8kcrk6Kfk3wkpqKRDJACtb3msUFRm6/exec";
            try {
              await fetch(GLOBAL_GAS_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ 
                  name: user.name || username,
                  email: user.email,
                  phone: "",
                  source: \`solar.vimgroup.vn (Google OAuth - \${roleName})\`,
                  targetSheetId
                }),
              });
            } catch (e) {
              console.error('[SHEETS] Sync error:', e);
            }
          }
        } catch (error) {
          console.error('[AUTH] Google sign-in error:', error);
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, account }) {
      if (user) {
        const u = user as any;
        token.role = u.role;
        token.id = u.id;
        token.refCode = u.refCode;
      }

      // If missing data after Google login, fetch from DB
      if (account?.provider === 'google' || !token.role) {
        try {
          await initDb();
          const dbUser = await pool.query(
            `SELECT id, role, ref_code FROM vimsolar_users WHERE email = $1`,
            [token.email]
          );
          if (dbUser.rowCount && dbUser.rowCount > 0) {
            token.role = dbUser.rows[0].role;
            token.id = dbUser.rows[0].id;
            token.refCode = dbUser.rows[0].ref_code;
          }
        } catch (error) {
          console.error('[AUTH] JWT callback error:', error);
        }
      }

      // Clean up base64 images
      if (token.picture && typeof token.picture === 'string' && token.picture.startsWith('data:image')) {
        delete token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any;
        u.role = token.role as string;
        u.id = (token.id || token.sub) as string;
        u.refCode = token.refCode as string;
      }
      return session;
    },
  }
};
