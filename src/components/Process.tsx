"use client";

import { motion } from "framer-motion";
import { Search, Ruler, FileText, Wrench, ShieldCheck } from "lucide-react";



import { useI18n } from "@/context/I18nContext";

export default function Process() {
  const { t, language } = useI18n();
  const isEn = language === "en";

  const steps = [
    {
      num: "01",
      icon: Search,
      title: isEn ? "Survey & Consultation" : "Khảo Sát & Tư Vấn",
      desc: isEn ? "Free site survey by our engineers. Evaluate roof, sun direction, and electricity needs. Optimal solution consulting." : "Đội ngũ kỹ sư khảo sát mặt bằng miễn phí. Đánh giá mái nhà, hướng nắng, nhu cầu sử dụng điện. Tư vấn giải pháp tối ưu nhất.",
    },
    {
      num: "02",
      icon: Ruler,
      title: isEn ? "Technical Design" : "Thiết Kế Kỹ Thuật",
      desc: isEn ? "Detailed design planning: panel layout, wiring, monitoring system. Yield simulation and exact ROI calculation." : "Lên phương án thiết kế chi tiết: bố trí tấm pin, dây chuyền điện, hệ thống giám sát. Mô phỏng sản lượng và tính toán ROI chính xác.",
    },
    {
      num: "03",
      icon: FileText,
      title: isEn ? "Quote & Contract" : "Báo Giá & Hợp Đồng",
      desc: isEn ? "Transparent quotation, no hidden fees. Sign turnkey EPC contract, commit to schedule and quality. Supply genuine equipment." : "Báo giá minh bạch, không phát sinh. Ký hợp đồng EPC trọn gói, cam kết tiến độ và chất lượng. Cung ứng thiết bị chính hãng.",
    },
    {
      num: "04",
      icon: Wrench,
      title: isEn ? "Construction & Installation" : "Thi Công & Lắp Đặt",
      desc: isEn ? "Professional team installs quickly in 3-7 days. Comply with electrical safety procedures, connect to EVN grid." : "Đội thợ chuyên nghiệp thi công nhanh gọn 3-7 ngày. Tuân thủ quy trình an toàn điện, đấu nối hệ thống với điện lưới EVN.",
    },
    {
      num: "05",
      icon: ShieldCheck,
      title: isEn ? "Acceptance & Warranty" : "Nghiệm Thu & Bảo Hành",
      desc: isEn ? "Full system operation test. Handover online monitoring. Product warranty 12-15 years, performance 25-30 years." : "Kiểm tra vận hành toàn bộ hệ thống. Bàn giao giám sát online. Bảo hành sản phẩm 12-15 năm, hiệu suất 25-30 năm.",
    },
  ];

  return (
    <section id="process" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-amber-600 dark:text-amber-500 font-extrabold tracking-[4px] text-xs uppercase">
            {t("proc_badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900 dark:text-white">
            {isEn ? "5 Steps to Own " : "5 Bước Sở Hữu "}
            <span className="text-[#0C4A6E] dark:text-amber-400">{isEn ? "Solar Power" : "Điện Mặt Trời"}</span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            {t("proc_desc")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-[#0C4A6E] dark:via-sky-600 to-emerald-500 transform -translate-x-1/2"></div>

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`lg:flex items-center gap-8 lg:mb-16 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Card */}
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-none hover:border-amber-200 dark:hover:border-amber-500/50 transition-all duration-500 inline-block max-w-lg">
                    <div className={`flex items-center gap-4 mb-4 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                        <step.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Number circle */}
                <div className="hidden lg:flex w-16 h-16 rounded-full bg-[#0C4A6E] dark:bg-slate-800 text-white dark:text-amber-400 font-black text-xl items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-sky-900/30 border-4 border-white dark:border-slate-700">
                  {step.num}
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden lg:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="#get-quote"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#0C4A6E] to-sky-700 dark:from-sky-600 dark:to-sky-800 text-white font-extrabold rounded-full hover:shadow-[0_0_30px_rgba(12,74,110,0.4)] dark:hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all transform hover:scale-105 text-lg"
          >
            {t("proc_cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
