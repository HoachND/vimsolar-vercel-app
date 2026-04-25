"use client";

import { motion } from "framer-motion";
import { Home, Factory, Building, ShoppingBag } from "lucide-react";



import { useI18n } from "@/context/I18nContext";

export default function Solutions() {
  const { t, language } = useI18n();
  const isEn = language === "en";

  const solutions = [
    {
      icon: Home,
      tag: isEn ? "RESIDENTIAL" : "HỘ GIA ĐÌNH",
      title: isEn ? "Solar For Homes" : "Solar Cho Gia Đình",
      desc: isEn ? "5-15kWp Hybrid system, integrated battery. Use power at night, prevent blackouts. Reduce bills to near zero." : "Hệ Hybrid 5-15kWp, tích hợp pin lưu trữ. Dùng điện cả ban đêm, chống mất điện. Tiền điện 2-5 triệu/tháng về gần 0 đồng.",
      highlight: isEn ? "ROI 4-5 years • Save 1.2 billion/25 yrs" : "Hoàn vốn 4-5 năm • Tiết kiệm 1.2 tỷ/25 năm",
      investment: isEn ? "From 80 - 200 million" : "Từ 80 - 200 triệu",
      img: "/images/solar-house.jpg",
      featured: true,
    },
    {
      icon: Factory,
      tag: isEn ? "ENTERPRISE" : "DOANH NGHIỆP",
      title: isEn ? "Solar For Factories" : "Solar Cho Nhà Xưởng",
      desc: isEn ? "50-500+ kWp Grid-tied, ultra-fast ROI. Power during production hours, 100% self-consumption. Meet ESG, carbon credits." : "Hòa lưới 50-500+ kWp, ROI cực nhanh. Solar phát đúng giờ sản xuất, tỷ lệ tự tiêu thụ 100%. Đáp ứng ESG, tín chỉ carbon.",
      highlight: isEn ? "ROI 3.5-5 years • Save 8.3 billion/10 yrs" : "Hoàn vốn 3.5-5 năm • Tiết kiệm 8.3 tỷ/10 năm",
      investment: isEn ? "From 1 - 10+ billion" : "Từ 1 - 10+ tỷ",
      img: "/images/solar-factory.webp",
      featured: false,
    },
    {
      icon: Building,
      tag: isEn ? "RENTAL PROPERTY" : "NHÀ TRỌ CHO THUÊ",
      title: isEn ? "Solar For Rentals" : "Solar Cho Nhà Trọ",
      desc: isEn ? "Fastest ROI! Buy high tier at 3,460đ/kWh but collect 3,600đ. Solar cuts the most expensive part, boosting profit 10m/month." : "ROI nhanh nhất! Chủ nhà mua điện bậc cao 3.460đ/kWh nhưng chỉ thu 3.600đ. Solar cắt phần đắt nhất, tăng lợi nhuận 10 triệu/tháng.",
      highlight: isEn ? "ROI 1.5-2.5 years • Net profit 10m+/month" : "Hoàn vốn 1.5-2.5 năm • Lãi thuần 10tr+/tháng",
      investment: isEn ? "From 150 - 350 million" : "Từ 150 - 350 triệu",
      img: "/images/solar-rooftop.jpg",
      featured: false,
    },
    {
      icon: ShoppingBag,
      tag: isEn ? "SHOP • HOTEL" : "CỬA HÀNG • KHÁCH SẠN",
      title: isEn ? "Solar For Business" : "Solar Cho Kinh Doanh",
      desc: isEn ? "Business peak price 5,422đ/kWh — 2.7x residential price. Solar cuts exactly the most expensive part, super fast ROI." : "Giá điện kinh doanh giờ cao điểm 5.422đ/kWh — gấp 2.7x giá sinh hoạt. Solar cắt đúng phần đắt nhất, ROI siêu nhanh.",
      highlight: isEn ? "ROI 1.5-2 years • Save 48m+/year" : "Hoàn vốn 1.5-2 năm • Tiết kiệm 48tr+/năm",
      investment: isEn ? "From 60 - 150 million" : "Từ 60 - 150 triệu",
      img: "/images/solar-clean.png",
      featured: false,
    },
  ];

  return (
    <section id="solutions" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-amber-600 font-extrabold tracking-[4px] text-xs uppercase">
            {t("sol_badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
            {isEn ? "VimSolar " : "Giải Pháp "}
            <span className="text-[#0C4A6E]">{isEn ? "Solar Solutions" : "Điện Mặt Trời"}</span>
            {isEn ? "" : " VimSolar"}
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            {t("sol_desc")}
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl bento-hover ${
                s.featured ? "md:row-span-2" : ""
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${s.img}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent"></div>
              </div>

              {/* Content */}
              <div className={`relative z-10 p-8 flex flex-col justify-end ${
                s.featured ? "min-h-[500px]" : "min-h-[300px]"
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <s.icon className="text-amber-400" size={20} />
                  </div>
                  <span className="text-amber-400 font-bold text-xs tracking-widest">{s.tag}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-lg">{s.desc}</p>

                {/* Highlight box */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <p className="text-amber-400 font-bold text-sm">{s.highlight}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">
                    💰 {t("sol_invest")} <strong className="text-white">{s.investment}</strong>
                  </span>
                  <a
                    href="#get-quote"
                    className="text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors"
                  >
                    {t("sol_consult")}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
