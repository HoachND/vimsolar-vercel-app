import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";

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

// GET: List all posts (public) or all posts (admin)
export async function GET(req: NextRequest) {
  const posts = readData<BlogPost[]>("blog-posts.json");
  const isAdmin = req.nextUrl.searchParams.get("admin") === "true";
  const filtered = isAdmin ? posts : posts.filter((p) => p.published);
  return NextResponse.json(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

// POST: Create new post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const posts = readData<BlogPost[]>("blog-posts.json");
  const slug = body.slug || body.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || body.titleVi?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
  writeData("blog-posts.json", posts);
  return NextResponse.json(newPost, { status: 201 });
}

// PUT: Update post
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const posts = readData<BlogPost[]>("blog-posts.json");
  const idx = posts.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString() };
  writeData("blog-posts.json", posts);
  return NextResponse.json(posts[idx]);
}

// DELETE: Delete post
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const posts = readData<BlogPost[]>("blog-posts.json").filter((p) => p.id !== id);
  writeData("blog-posts.json", posts);
  return NextResponse.json({ success: true });
}
