import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

// GET: List all posts
export async function GET(req: NextRequest) {
  try {
    await initDb();
    const isAdmin = req.nextUrl.searchParams.get("admin") === "true";
    
    let query = `SELECT id, slug, title_vi as "titleVi", title_en as "titleEn", excerpt_vi as "excerptVi", excerpt_en as "excerptEn", content_vi as "contentVi", content_en as "contentEn", category, seo_title as "seoTitle", seo_description as "seoDescription", seo_image as "seoImage", tags, author, published, created_at as "createdAt", updated_at as "updatedAt" FROM vimsolar_blogs`;
    
    if (!isAdmin) {
      query += ` WHERE published = true`;
    }
    query += ` ORDER BY created_at DESC`;
    
    const res = await pool.query(query);
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST: Create new post
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const slug = body.slug || body.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || body.titleVi?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    const newId = Date.now().toString();
    const tagsJson = JSON.stringify(body.tags || []);
    
    await pool.query(
      `INSERT INTO vimsolar_blogs (
        id, slug, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, 
        category, seo_title, seo_description, seo_image, tags, author, published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        newId, slug, body.titleVi || "", body.titleEn || "", body.excerptVi || "", body.excerptEn || "",
        body.contentVi || "", body.contentEn || "", body.category || "general",
        body.seoTitle || body.titleEn || body.titleVi, body.seoDescription || body.excerptEn || body.excerptVi,
        body.seoImage || "", tagsJson, body.author || "VimSolar", body.published ?? false
      ]
    );
    
    const res = await pool.query(`SELECT id, slug, title_vi as "titleVi", title_en as "titleEn", excerpt_vi as "excerptVi", excerpt_en as "excerptEn", content_vi as "contentVi", content_en as "contentEn", category, seo_title as "seoTitle", seo_description as "seoDescription", seo_image as "seoImage", tags, author, published, created_at as "createdAt", updated_at as "updatedAt" FROM vimsolar_blogs WHERE id = $1`, [newId]);
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT: Update post
export async function PUT(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const check = await pool.query(`SELECT id FROM vimsolar_blogs WHERE id = $1`, [id]);
    if (check.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const tagsJson = JSON.stringify(updates.tags || []);
    
    await pool.query(
      `UPDATE vimsolar_blogs SET 
        slug = COALESCE($1, slug), title_vi = COALESCE($2, title_vi), title_en = COALESCE($3, title_en),
        excerpt_vi = COALESCE($4, excerpt_vi), excerpt_en = COALESCE($5, excerpt_en), content_vi = COALESCE($6, content_vi),
        content_en = COALESCE($7, content_en), category = COALESCE($8, category), seo_title = COALESCE($9, seo_title),
        seo_description = COALESCE($10, seo_description), seo_image = COALESCE($11, seo_image), tags = COALESCE($12, tags),
        author = COALESCE($13, author), published = COALESCE($14, published), updated_at = CURRENT_TIMESTAMP
      WHERE id = $15`,
      [
        updates.slug, updates.titleVi, updates.titleEn, updates.excerptVi, updates.excerptEn, updates.contentVi,
        updates.contentEn, updates.category, updates.seoTitle, updates.seoDescription, updates.seoImage,
        tagsJson, updates.author, updates.published, id
      ]
    );

    const res = await pool.query(`SELECT id, slug, title_vi as "titleVi", title_en as "titleEn", excerpt_vi as "excerptVi", excerpt_en as "excerptEn", content_vi as "contentVi", content_en as "contentEn", category, seo_title as "seoTitle", seo_description as "seoDescription", seo_image as "seoImage", tags, author, published, created_at as "createdAt", updated_at as "updatedAt" FROM vimsolar_blogs WHERE id = $1`, [id]);
    return NextResponse.json(res.rows[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Delete post
export async function DELETE(req: NextRequest) {
  try {
    await initDb();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    
    await pool.query(`DELETE FROM vimsolar_blogs WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
