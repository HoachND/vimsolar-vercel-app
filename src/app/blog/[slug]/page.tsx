import { Metadata } from "next";
import { BlogPost } from "@/app/api/blog/route";
import fs from "fs";
import path from "path";
import { I18nProvider } from "@/context/I18nContext";
import BlogDetailContent from "@/components/BlogDetailContent";

const DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json");

function getPost(slug: string): BlogPost | undefined {
  if (!fs.existsSync(DATA_FILE)) return undefined;
  const posts: BlogPost[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  return posts.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: "Not Found" };

  // SỬ DỤNG FIELD SEO RIÊNG BIỆT NHƯ BẠN SẾP TƯ VẤN
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

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
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
