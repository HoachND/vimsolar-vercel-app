"use client";
import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Image from "next/image";
import { BlogPost } from "@/lib/types";
import { ChevronLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogDetailContent({ post, relatedPosts }: { post: BlogPost; relatedPosts?: BlogPost[] }) {
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
            <a 
              href={`/blog?category=${encodeURIComponent(post.category)}`} 
              className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
            >
              {post.category}
            </a>
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
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* HTML Content */}
          <div 
            className="prose prose-lg max-w-none prose-slate prose-amber prose-headings:font-black prose-a:text-amber-600"
            dangerouslySetInnerHTML={{ __html: isEn ? post.contentEn : post.contentVi }}
          />

          {/* Tags Section */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h4 className="text-sm font-bold text-slate-800 mb-3">{isEn ? "Tags:" : "Từ khóa:"}</h4>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const rawTags = post.tags as any;
                const tagArr: string[] = typeof rawTags === "string"
                  ? rawTags.split(",").filter(Boolean)
                  : Array.isArray(rawTags)
                    ? rawTags.map((t: any) => String(t))
                    : [];
                return tagArr;
              })().map(tag => (
                <a 
                  key={tag} 
                  href={`/blog?tag=${encodeURIComponent(tag.trim())}`} 
                  className="flex items-center gap-1 text-xs bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all duration-300"
                >
                  <Tag size={12} /> {tag.trim()}
                </a>
              ))}
            </div>
          </div>

          {/* Blog FAQ Section */}
          <div className="mt-20 pt-12 border-t border-gray-100">
            <h3 className="text-2xl font-black text-slate-900 mb-8">
              {isEn ? "Frequently Asked Questions" : "Câu hỏi thường gặp"}
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: isEn ? "What is the optimal solar system capacity to install?" : "Công suất tối ưu nên lắp đặt là bao nhiêu?",
                  a: isEn
                    ? "We calculate this based on your daytime consumption and rooftop area. The higher your daytime electricity usage, the more efficient the system's ROI."
                    : "Chúng tôi tính toán dựa trên nhu cầu tiêu thụ điện ban ngày và diện tích mái. Tỷ lệ điện ban ngày dùng càng nhiều thì hiệu quả hoàn vốn hệ thống càng cao.",
                },
                {
                  q: isEn ? "How long does the solar panel output last?" : "Hiệu suất và tuổi thọ tấm pin kéo dài bao lâu?",
                  a: isEn
                    ? "LESSO Solar panels guarantee that after 10 years, output remains above 92%, and above 87.4% after 30 years. Annual degradation is less than 0.4%."
                    : "Tấm pin LESSO Solar cam kết bảo hành hiệu suất: sau 10 năm công suất còn trên 92%, và sau 30 năm còn trên 87.4%. Mức suy giảm hàng năm cực thấp (<0.4%).",
                },
                {
                  q: isEn ? "Is the system safe during heavy storms and lightning?" : "Hệ thống có an toàn khi xảy ra mưa bão và sét đánh không?",
                  a: isEn
                    ? "Yes. The system includes Surge Protective Devices (SPD) and DC leakage protection. The premium anodized aluminum frame withstands Category 12 storms, and the tempered glass resists 25mm hailstones."
                    : "Có. Hệ thống tích hợp thiết bị chống sét lan truyền (SPD) và chống rò điện DC. Khung nhôm anod cao cấp chịu được bão cấp 12+, kính cường lực chịu lực va đập của mưa đá 25mm.",
                },
              ].map((faq, index) => (
                <details 
                  key={index}
                  className="group border border-gray-100 rounded-2xl bg-slate-50 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-amber-300 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 font-extrabold text-slate-800 text-sm sm:text-base">
                    <span>{faq.q}</span>
                    <span className="transition duration-300 group-open:-rotate-180 text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-200/60 pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8">
                {isEn ? "Related Articles" : "Bài viết liên quan"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <a 
                    key={rPost.id} 
                    href={`/blog/${rPost.slug}`}
                    className="group block"
                  >
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-md">
                      <Image
                        src={rPost.seoImage || "/images/banner-vimsolar.png"}
                        alt={isEn ? rPost.titleEn : rPost.titleVi}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-base leading-snug">
                      {isEn ? rPost.titleEn : rPost.titleVi}
                    </h4>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
