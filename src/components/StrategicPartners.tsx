"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/context/I18nContext";
import { Handshake, Star, ShieldCheck, HeartHandshake } from "lucide-react";

export default function StrategicPartners() {
  const { language } = useI18n();
  const isEn = language === "en";

  const strategicPartners = [
    {
      name: "Horus Power",
      role: isEn ? "Co-founding Supply Chain Partner" : "Đối tác cung ứng đồng sáng lập",
      desc: isEn
        ? "Horus Power, strategically linked to Hoa Phat Group's ecosystem, provides stable supply of Tier-1 PV modules and advanced inverters."
        : "Đối tác liên kết thuộc hệ sinh thái Hòa Phát, đảm bảo nguồn cung ứng thép tiền chế, tấm pin LESSO Solar và giải pháp kỹ thuật.",
      icon: <Star className="text-amber-500 w-6 h-6" />,
    },
    {
      name: "LESSO GROUP (2128.HK)",
      role: isEn ? "Strategic PV Module Manufacturer" : "Nhà sản xuất tấm pin chiến lược",
      desc: isEn
        ? "One of the largest industrial conglomerates listed in Hong Kong, specializing in super-durable PV modules with 30-year performance warranties."
        : "Tập đoàn công nghiệp khổng lồ niêm yết sàn chứng khoán Hong Kong, dẫn đầu về công nghệ pin N-type TOPCon 210R bền bỉ vượt trội.",
      icon: <ShieldCheck className="text-amber-500 w-6 h-6" />,
    },
    {
      name: "VIMGROUP & VimAI",
      role: isEn ? "Financial & AI Solution Incubator" : "Đơn vị bảo trợ & Giải pháp AI",
      desc: isEn
        ? "VIMGROUP provides capital guarantees and B2B ESCO 0đ investment funds, while VimAI optimizes operational excellence and CRM."
        : "VIMGROUP bảo trợ nguồn lực tài chính, quỹ đầu tư B2B ESCO 0đ, trong khi VimAI tối ưu hóa vận hành, quản trị dự án thông minh.",
      icon: <HeartHandshake className="text-amber-500 w-6 h-6" />,
    },
  ];

  return (
    <section id="strategic-partners" className="py-20 bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-amber-600 font-extrabold tracking-widest text-xs uppercase flex items-center justify-center gap-2">
            <Handshake size={14} />
            {isEn ? "STRATEGIC PARTNERS" : "ĐỐI TÁC CHIẾN LƯỢC"}
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mt-2">
            {isEn ? "Our Global Strategic Alliance" : "Liên Minh Chiến Lược Toàn Cầu"}
          </h3>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            {isEn
              ? "VimSolar forms strong partnerships with industry giants to deliver undisputed quality, unbeatable direct factory pricing, and absolute system longevity."
              : "VimSolar liên kết chặt chẽ với những tập đoàn năng lượng và công nghệ hàng đầu, mang lại giá gốc tối ưu cùng chất lượng bền bỉ tuyệt đối."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {strategicPartners.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-amber-300 group"
            >
              <div>
                <div className="bg-amber-500/10 p-3 rounded-2xl w-fit mb-6 group-hover:scale-115 transition-transform">
                  {partner.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 group-hover:text-amber-600 transition-colors">{partner.name}</h4>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mt-1">{partner.role}</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-4 leading-relaxed">{partner.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
