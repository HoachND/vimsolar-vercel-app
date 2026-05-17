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
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
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

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return <div>Post not found</div>;

  return (
    <I18nProvider>
      <BlogDetailContent post={post} />
      
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
