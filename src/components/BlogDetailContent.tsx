"use client";
import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Image from "next/image";
import { BlogPost } from "@/app/api/blog/route";
import { ChevronLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogDetailContent({ post }: { post: BlogPost }) {
  const { language } = useI18n();
  const isEn = language === "en";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4">
        <motion.a 
          href="/blog"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-amber-600 font-bold mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> {isEn ? "Back to Blog" : "Tất cả bài viết"}
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest">
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{post.category}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}</span>
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            {isEn ? post.titleEn : post.titleVi}
          </h1>

          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <Image
              src={post.seoImage || "/images/banner-vimsolar.png"}
              alt={isEn ? post.titleEn : post.titleVi}
              fill
              className="object-cover"
            />
          </div>

          {/* HTML Content */}
          <div 
            className="prose prose-lg max-w-none prose-slate prose-amber prose-headings:font-black prose-a:text-amber-600"
            dangerouslySetInnerHTML={{ __html: isEn ? post.contentEn : post.contentVi }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
