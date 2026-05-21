"use client";
import { Landmark, ShieldCheck, Zap, HandCoins } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/context/I18nContext";

export default function EscoSolution() {
  const { language } = useI18n();
  const isEn = language === "en";

  const features = [
    {
      icon: <Landmark className="w-8 h-8 text-amber-500" />,
      title: isEn ? "Zero Capital Investment" : "Vốn đầu tư 0 đồng",
      desc: isEn 
        ? "Enterprises do not need to spend any upfront capital. VimSolar and our financial partners sponsor 100% of equipment and installation costs."
        : "Doanh nghiệp không cần bỏ bất kỳ chi phí nào. Quỹ đầu tư và VimSolar sẽ tài trợ 100% toàn bộ chi phí thiết bị và thi công.",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: isEn ? "15% - 25% Electricity Savings" : "Tiết kiệm 15% - 25% tiền điện",
      desc: isEn
        ? "Purchase the green electricity produced by the rooftop system at a price at least 15-25% cheaper than the EVN retail rate."
        : "Hàng tháng doanh nghiệp mua lại lượng điện tạo ra từ hệ thống áp mái với giá rẻ hơn tối thiểu 15-25% so với giá bán của EVN.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
      title: isEn ? "Zero Operational Risk" : "Không rủi ro vận hành",
      desc: isEn
        ? "VimSolar assumes all responsibilities for operation, regular maintenance, insurance, and warranty services at zero cost to you for 20 years."
        : "VimSolar chịu trách nhiệm bảo hành, bảo dưỡng định kỳ, bảo hiểm rủi ro thiên tai và vận hành hệ thống miễn phí trong suốt 20 năm.",
    },
    {
      icon: <HandCoins className="w-8 h-8 text-amber-500" />,
      title: isEn ? "Free Transfer After Term" : "Bàn giao 0đ sau hợp đồng",
      desc: isEn
        ? "After 15-20 years, the entire solar power system is transferred to your ownership for free, with guaranteed panel efficiency >80%."
        : "Sau 15 - 20 năm, hệ thống điện mặt trời được bàn giao lại cho doanh nghiệp sở hữu hoàn toàn 100% với hiệu suất tấm pin cam kết >80%.",
    },
  ];

  return (
    <section id="esco" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-500 font-extrabold tracking-widest text-xs uppercase">
            {isEn ? "B2B FINANCING SOLUTION" : "GIẢI PHÁP TÀI CHÍNH B2B"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-3">
            {isEn ? "ESCO Model: Zero Down Rooftop Solar" : "Mô Hình ESCO Điện Mặt Trời Nhà Xưởng 0 Đồng"}
          </h2>
          <p className="text-slate-400 mt-4 text-base md:text-lg">
            {isEn 
              ? "A breakthrough partnership that helps manufacturing businesses transition to green energy rapidly without affecting operating capital."
              : "Hợp tác đột phá giúp các doanh nghiệp sản xuất chuyển đổi xanh nhanh chóng mà không ảnh hưởng tới nguồn vốn lưu động."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 p-6 md:p-8 rounded-3xl hover:border-amber-500/50 transition-colors"
            >
              <div className="bg-amber-500/10 p-3.5 rounded-2xl w-fit mb-6">{feat.icon}</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
