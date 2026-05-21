"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/I18nContext";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function Faq() {
  const { language } = useI18n();
  const isEn = language === "en";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
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
    {
      q: isEn ? "What are the maintenance costs?" : "Chi phí bảo trì và vận hành hàng năm là bao nhiêu?",
      a: isEn
        ? "Extremely low. Typically around $40 (1M VND) per year for a 10kWp system, mostly for professional cleaning 1-2 times a year. The system comes with a 24/7 monitoring app."
        : "Rất ít. Khoảng 1 triệu đồng/năm cho hệ 10kWp, chủ yếu dùng để vệ sinh tấm pin 1-2 lần/năm. Hệ thống có ứng dụng giám sát online 24/7 trên điện thoại.",
    },
    {
      q: isEn ? "Will installing solar panels cause roof leaks?" : "Lắp đặt tấm pin có gây dột mái nhà không?",
      a: isEn
        ? "Not with VimSolar. Our experienced EPC engineering team uses professional Ramset/Sika waterproofing technology to seal every penetration, backed by a strict anti-leak warranty."
        : "Hoàn toàn không. Đội ngũ kỹ sư EPC giàu kinh nghiệm của VimSolar sử dụng keo chuyên dụng Ramset và chống thấm Sika để bịt kín mọi điểm khoan, cam kết chống dột theo chính sách bảo hành.",
    },
    {
      q: isEn ? "Should I install a system with battery storage (Hybrid)?" : "Tôi nên chọn hệ thống hòa lưới thông thường hay có lưu trữ (Hybrid)?",
      a: isEn
        ? "Hybrid systems are highly recommended. While they cost slightly more, they allow you to utilize solar power at night and ensure uninterrupted power supply during grid outages."
        : "Chúng tôi khuyến nghị hệ Hybrid. Dù chi phí cao hơn khoảng 20-30 triệu, hệ Hybrid giúp bạn sử dụng điện mặt trời vào ban đêm và chống mất điện đột ngột.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-amber-400 font-extrabold tracking-widest text-xs uppercase flex items-center justify-center gap-2">
            <HelpCircle size={14} />
            {isEn ? "FAQ" : "CÂU HỎI THƯỜNG GẶP"}
          </p>
          <h3 className="text-3xl sm:text-4xl font-black mt-2">
            {isEn ? "Frequently Asked Questions" : "Giải Đáp Mọi Thắc Mắc"}
          </h3>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            {isEn
              ? "All your questions about technology, finance, warranties, and logistics, answered transparently."
              : "Những câu hỏi phổ biến nhất về kỹ thuật, thủ tục, tài chính và bảo hành được tổng hợp chi tiết."}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-800 rounded-2xl bg-slate-950/60 backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-amber-500/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-amber-400 flex-shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-slate-900 text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
