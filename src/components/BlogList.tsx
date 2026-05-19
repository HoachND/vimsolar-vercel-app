"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Image from "next/image";
import { BlogPost } from "@/lib/types";

import { useSearchParams } from "next/navigation";

export default function BlogList() {
  const { language, t } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const isEn = language === "en";

  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedTag = searchParams.get("tag");

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  // Filter posts based on category or tag
  const filteredPosts = posts.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedTag) {
      const tagsList = typeof post.tags === "string" 
        ? post.tags.split(",").map(t => t.trim().toLowerCase()) 
        : Array.isArray(post.tags) 
          ? post.tags.map(t => t.trim().toLowerCase()) 
          : [];
      if (!tagsList.includes(selectedTag.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
            {isEn ? "Solar " : "Tin Tức "}
            <span className="text-amber-600">{isEn ? "Insights" : "Năng Lượng"}</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {isEn 
              ? "Stay updated with the latest trends, technologies, and policies in solar energy."
              : "Cập nhật những xu hướng, công nghệ và chính sách mới nhất về năng lượng mặt trời."}
          </p>
        </motion.div>

        {/* Filter Indicator */}
        {(selectedCategory || selectedTag) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between max-w-xl mx-auto shadow-sm"
          >
            <span className="text-amber-800 text-sm font-semibold flex items-center gap-1.5">
              <span>{isEn ? "Filtered by: " : "Đang lọc theo: "}</span>
              <span className="bg-amber-100/80 px-2.5 py-0.5 rounded-full font-bold">
                {selectedCategory || `#${selectedTag}`}
              </span>
            </span>
            <a 
              href="/blog" 
              className="text-xs font-bold text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all"
            >
              {isEn ? "Clear Filter" : "Xóa bộ lọc"}
            </a>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
              >
                <a href={`/blog/${post.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.seoImage || "/images/banner-vimsolar.png"}
                      alt={isEn ? post.titleEn : post.titleVi}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span>{new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {isEn ? post.titleEn : post.titleVi}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                      {isEn ? post.excerptEn : post.excerptVi}
                    </p>
                    <span className="text-amber-600 font-bold text-sm flex items-center gap-2">
                      {isEn ? "Read More" : "Đọc thêm"} 
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
