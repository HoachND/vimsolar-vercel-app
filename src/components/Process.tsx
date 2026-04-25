"use client";

import { motion } from "framer-motion";
import { Search, Ruler, FileText, Wrench, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Khảo Sát & Tư Vấn",
    desc: "Đội ngũ kỹ sư khảo sát mặt bằng miễn phí. Đánh giá mái nhà, hướng nắng, nhu cầu sử dụng điện. Tư vấn giải pháp tối ưu nhất.",
  },
  {
    num: "02",
    icon: Ruler,
    title: "Thiết Kế Kỹ Thuật",
    desc: "Lên phương án thiết kế chi tiết: bố trí tấm pin, dây chuyền điện, hệ thống giám sát. Mô phỏng sản lượng và tính toán ROI chính xác.",
  },
  {
    num: "03",
    icon: FileText,
    title: "Báo Giá & Hợp Đồng",
    desc: "Báo giá minh bạch, không phát sinh. Ký hợp đồng EPC trọn gói, cam kết tiến độ và chất lượng. Cung ứng thiết bị chính hãng.",
  },
  {
    num: "04",
    icon: Wrench,
    title: "Thi Công & Lắp Đặt",
    desc: "Đội thợ chuyên nghiệp thi công nhanh gọn 3-7 ngày. Tuân thủ quy trình an toàn điện, đấu nối hệ thống với điện lưới EVN.",
  },
  {
    num: "05",
    icon: ShieldCheck,
    title: "Nghiệm Thu & Bảo Hành",
    desc: "Kiểm tra vận hành toàn bộ hệ thống. Bàn giao giám sát online. Bảo hành sản phẩm 12-15 năm, hiệu suất 25-30 năm.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-amber-600 font-extrabold tracking-[4px] text-xs uppercase">
            Quy Trình Chuyên Nghiệp
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
            5 Bước Sở Hữu{" "}
            <span className="text-[#0C4A6E]">Điện Mặt Trời</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Quy trình EPC trọn gói — Từ khảo sát đến bàn giao chỉ từ 3-7 ngày. Bạn chỉ cần ngồi yên, VimSolar lo tất cả.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-[#0C4A6E] to-emerald-500 transform -translate-x-1/2"></div>

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
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-500 inline-block max-w-lg">
                    <div className={`flex items-center gap-4 mb-4 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                        <step.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Number circle */}
                <div className="hidden lg:flex w-16 h-16 rounded-full bg-[#0C4A6E] text-white font-black text-xl items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-sky-900/30 border-4 border-white">
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
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#0C4A6E] to-sky-700 text-white font-extrabold rounded-full hover:shadow-[0_0_30px_rgba(12,74,110,0.4)] transition-all transform hover:scale-105 text-lg"
          >
            Bắt Đầu Khảo Sát Miễn Phí →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
