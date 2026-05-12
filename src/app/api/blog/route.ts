import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json");

export interface BlogPost {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  contentVi: string;
  contentEn: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  tags: string[];
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

function readPosts(): BlogPost[] {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writePosts(posts: BlogPost[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

// GET: List all posts (public) or all posts (admin)
export async function GET(req: NextRequest) {
  const posts = readPosts();
  const isAdmin = req.nextUrl.searchParams.get("admin") === "true";
  const filtered = isAdmin ? posts : posts.filter((p) => p.published);
  return NextResponse.json(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

// POST: Create new post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const posts = readPosts();
  const slug = body.slug || body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newPost: BlogPost = {
    id: Date.now().toString(),
    slug,
    titleVi: body.titleVi || "",
    titleEn: body.titleEn || "",
    excerptVi: body.excerptVi || "",
    excerptEn: body.excerptEn || "",
    contentVi: body.contentVi || "",
    contentEn: body.contentEn || "",
    category: body.category || "general",
    seoTitle: body.seoTitle || body.titleEn || body.titleVi,
    seoDescription: body.seoDescription || body.excerptEn || body.excerptVi,
    seoImage: body.seoImage || "",
    tags: body.tags || [],
    author: body.author || "VimSolar",
    published: body.published ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  writePosts(posts);
  return NextResponse.json(newPost, { status: 201 });
}

// PUT: Update post
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString() };
  writePosts(posts);
  return NextResponse.json(posts[idx]);
}

// DELETE: Delete post
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const posts = readPosts().filter((p) => p.id !== id);
  writePosts(posts);
  return NextResponse.json({ success: true });
}
