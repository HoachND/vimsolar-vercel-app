import { Metadata } from "next";
import { pool, initDb } from "@/lib/db";
import { I18nProvider } from "@/context/I18nContext";
import BlogDetailContent from "@/components/BlogDetailContent";
import { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPost(slug: string): Promise<BlogPost | undefined> {
  try {
    await initDb();
    const res = await pool.query(
      `SELECT id, slug, title_vi as "titleVi", title_en as "titleEn", excerpt_vi as "excerptVi", excerpt_en as "excerptEn", content_vi as "contentVi", content_en as "contentEn", category, seo_title as "seoTitle", seo_description as "seoDescription", seo_image as "seoImage", tags, author, published, created_at as "createdAt", updated_at as "updatedAt" FROM vimsolar_blogs WHERE slug = $1`,
      [slug]
    );
    return res.rows[0] || undefined;
  } catch (err: any) {
    return {
      id: "error",
      slug: slug,
      titleVi: "Error fetching post",
      contentVi: "Error: " + err.message + " | Slug: " + slug,
      excerptVi: "",
      seoImage: "",
      published: true
    } as any;
  }
}

async function getRelatedPosts(category: string, currentId: string): Promise<BlogPost[]> {
  try {
    await initDb();
    // Fetch up to 3 posts in the same category, excluding the current post
    const res = await pool.query(
      `SELECT id, slug, title_vi as "titleVi", title_en as "titleEn", excerpt_vi as "excerptVi", excerpt_en as "excerptEn", category, seo_image as "seoImage", author, created_at as "createdAt" 
       FROM vimsolar_blogs 
       WHERE published = true AND id != $1 AND category = $2 
       ORDER BY created_at DESC 
       LIMIT 3`,
      [currentId, category]
    );
    
    let related = res.rows;
    
    // If fewer than 3 related posts are found, fill up with the latest published posts
    if (related.length < 3) {
      const excludeIds = [currentId, ...related.map(r => r.id)];
      const limit = 3 - related.length;
      
      const placeholders = excludeIds.map((_, i) => `$${i + 1}`).join(", ");
      const fillRes = await pool.query(
        `SELECT id, slug, title_vi as "titleVi", title_en as "titleEn", excerpt_vi as "excerptVi", excerpt_en as "excerptEn", category, seo_image as "seoImage", author, created_at as "createdAt" 
         FROM vimsolar_blogs 
         WHERE published = true AND id NOT IN (${placeholders}) 
         ORDER BY created_at DESC 
         LIMIT $${excludeIds.length + 1}`,
        [...excludeIds, limit]
      );
      
      related = [...related, ...fillRes.rows];
    }
    
    return related;
  } catch (err) {
    console.error("Error fetching related posts", err);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.seoTitle || post.titleVi,
    description: post.seoDescription || post.excerptVi,
    openGraph: {
      title: post.seoTitle || post.titleVi,
      description: post.seoDescription || post.excerptVi,
      images: [post.seoImage || "/images/banner-vimsolar.png"],
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.titleVi,
      description: post.seoDescription || post.excerptVi,
      images: [post.seoImage || "/images/banner-vimsolar.png"],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) return <div className="pt-32 text-center text-red-500">Post not found for slug: {resolvedParams.slug}</div>;

  const relatedPosts = await getRelatedPosts(post.category, post.id);

  return (
    <I18nProvider>
      <BlogDetailContent post={post} relatedPosts={relatedPosts} />
      
      {/* Schema Markup for Google - Expert level SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.titleVi,
            "image": post.seoImage || "/images/banner-vimsolar.png",
            "author": {
              "@type": "Organization",
              "name": "VimSolar"
            },
            "publisher": {
              "@type": "Organization",
              "name": "VimSolar",
              "logo": {
                "@type": "ImageObject",
                "url": "https://solar.vimgroup.vn/images/logo-vimsolar-nobg.png"
              }
            },
            "datePublished": post.createdAt,
            "description": post.seoDescription || post.excerptVi
          })
        }}
      />
    </I18nProvider>
  );
}
