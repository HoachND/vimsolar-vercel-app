"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Award, Users, Wrench } from "lucide-react";

import { useI18n } from "@/context/I18nContext";

export default function About() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image + Badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/ceo-thuy.png"
                alt="Ms. Triệu Thị Thuý - Giám đốc VimSolar"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0C4A6E] to-transparent p-8">
                <h3 className="text-white font-bold text-xl">Ms. Trieu Thi Thuy</h3>
                <p className="text-amber-400 font-semibold">{t("about_ceo")}</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-slate-900 rounded-2xl p-5 shadow-xl hidden md:block">
              <Award className="mx-auto mb-2" size={32} />
              <div className="text-center">
                <strong className="block text-2xl font-black">EPC</strong>
                <span className="text-xs font-bold">{isEn ? "Turnkey" : "Trọn Gói"}</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-amber-600 font-extrabold tracking-[4px] text-xs uppercase">
              {t("about_badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-6 text-slate-900">
              {isEn ? "Trusted " : "Đơn Vị Thi Công "}
              <span className="text-[#0C4A6E]">{isEn ? "Solar" : "Điện Mặt Trời"}</span>{" "}
              <span className="text-amber-600">{isEn ? "Installer" : "Uy Tín"}</span>
            </h2>
            <p 
              className="text-gray-600 leading-relaxed mb-8 text-lg" 
              dangerouslySetInnerHTML={{ 
                __html: isEn 
                  ? "<strong>VimSolar</strong> is a subsidiary of <strong>VIMGROUP</strong> Investment JSC — specializing in consulting, designing and constructing turnkey EPC rooftop solar energy systems. We are committed to delivering the most optimal solutions at reasonable costs." 
                  : "<strong>VimSolar</strong> thuộc Công ty Cổ phần Đầu tư <strong>VIMGROUP</strong> — chuyên tư vấn, thiết kế và thi công hệ thống điện năng lượng mặt trời áp mái EPC trọn gói. Chúng tôi cam kết mang đến giải pháp tối ưu nhất với chi phí hợp lý." 
              }} 
            />

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                isEn ? "High efficiency N-type TOPCon panels — Bifacial light absorption" : "Tấm pin N-type TOPCon hiệu suất cao — Bifacial hấp thụ ánh sáng cả 2 mặt",
                isEn ? "Smart Hybrid Inverter — Integrated AI energy management" : "Biến tần Hybrid thông minh — Tích hợp quản lý năng lượng AI",
                isEn ? "Lithium Iron Phosphate (LiFePO4) storage — Safe, durable" : "Pin lưu trữ Lithium Iron Phosphate (LiFePO4) an toàn, bền bỉ",
                isEn ? "12-15 years product warranty, 25-30 years performance" : "Bảo hành sản phẩm 12-15 năm, hiệu suất 25-30 năm",
                isEn ? "Professional engineers, fast installation" : "Đội ngũ kỹ sư chuyên nghiệp, thi công nhanh gọn",
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700 font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-slate-50 rounded-xl p-4">
                <Users className="text-[#0C4A6E] mx-auto mb-2" size={24} />
                <div className="text-2xl font-black text-slate-900">100+</div>
                <div className="text-xs text-gray-500">{isEn ? "Projects" : "Công trình"}</div>
              </div>
              <div className="text-center bg-slate-50 rounded-xl p-4">
                <Wrench className="text-[#0C4A6E] mx-auto mb-2" size={24} />
                <div className="text-2xl font-black text-slate-900">5MW+</div>
                <div className="text-xs text-gray-500">{isEn ? "Capacity" : "Công suất lắp đặt"}</div>
              </div>
              <div className="text-center bg-slate-50 rounded-xl p-4">
                <Award className="text-[#0C4A6E] mx-auto mb-2" size={24} />
                <div className="text-2xl font-black text-slate-900">99%</div>
                <div className="text-xs text-gray-500">{isEn ? "Happy Clients" : "Khách hài lòng"}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
