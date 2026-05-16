import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_83tbClFSLvmn@ep-patient-voice-aqutbb2b-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Use connection pooling
export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
});

let isInitialized = false;

// Initialize tables if they don't exist
export async function initDb() {
  if (isInitialized) return;
  
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS vimsolar_users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        role VARCHAR(20) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vimsolar_roi_access (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        access_code VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vimsolar_music (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        sort_order INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS vimsolar_blogs (
        id VARCHAR(50) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_vi TEXT,
        title_en TEXT,
        excerpt_vi TEXT,
        excerpt_en TEXT,
        content_vi TEXT,
        content_en TEXT,
        category VARCHAR(100),
        seo_title TEXT,
        seo_description TEXT,
        seo_image TEXT,
        tags JSONB DEFAULT '[]',
        author VARCHAR(100),
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin if not exists
    const adminCheck = await client.query(`SELECT id FROM vimsolar_users WHERE username = 'admin'`);
    if (adminCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO vimsolar_users (id, username, password, name, role) 
        VALUES ('admin_001', 'admin', 'vimsolar99', 'Admin VimSolar', 'admin')
      `);
    }

    // Seed staff and sale
    const staffCheck = await client.query(`SELECT id FROM vimsolar_users WHERE username = 'staff'`);
    if (staffCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO vimsolar_users (id, username, password, name, role) 
        VALUES ('staff_001', 'staff', 'vimgroup99', 'VimSolar Staff', 'staff')
      `);
    }

    const saleCheck = await client.query(`SELECT id FROM vimsolar_users WHERE username = 'sale'`);
    if (saleCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO vimsolar_users (id, username, password, name, role) 
        VALUES ('sale_001', 'sale', 'vimgroup99', 'VimSolar Sale', 'staff')
      `);
    }

    // Seed default music if empty
    const musicCheck = await client.query(`SELECT id FROM vimsolar_music`);
    if (musicCheck.rowCount === 0) {
      const defaultMusic = [
        { title: "Maroon 5 - Memories", url: "https://youtube.com/watch?v=SlPhMPnQ58k", order: 1 },
        { title: "Shane Filan - Beautiful In White", url: "https://youtube.com/watch?v=06-XXOTP3Gc", order: 2 },
        { title: "Avicii - The Nights", url: "https://youtube.com/watch?v=W4C-NEWrnSQ", order: 3 },
        { title: "Shayne Ward - Until You", url: "https://youtube.com/watch?v=Ga-RSTJbFjo", order: 4 },
        { title: "Wiz Khalifa - See You Again", url: "https://youtube.com/watch?v=RgKAFK5djSk", order: 5 }
      ];
      for (const m of defaultMusic) {
        await client.query(
          `INSERT INTO vimsolar_music (title, url, sort_order) VALUES ($1, $2, $3)`,
          [m.title, m.url, m.order]
        );
      }
    }

    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
  } finally {
    client.release();
  }
}
