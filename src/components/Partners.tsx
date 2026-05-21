"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/context/I18nContext";

export default function Partners() {
  const { language } = useI18n();
  const isEn = language === "en";

  const brands = [
    { name: "Canadian Solar", role: isEn ? "Tier 1 PV Modules" : "Tấm pin Tier 1 hàng đầu", logo: "🇨🇦" },
    { name: "Deye", role: isEn ? "Top Hybrid Inverter" : "Biến tần Hybrid số 1", logo: "⚡" },
    { name: "Pylontech", role: isEn ? "Lithium Battery Storage" : "Pin lưu trữ Lithium cao cấp", logo: "🔋" },
    { name: "Growatt", role: isEn ? "Grid-tied Inverters" : "Inverter hòa lưới uy tín", logo: "🔌" },
    { name: "Longi Solar", role: isEn ? "Monocrystalline Technology" : "Tấm pin Mono đơn tinh thể", logo: "☀️" },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-600 font-extrabold tracking-widest text-xs uppercase">
            {isEn ? "GLOBAL STANDARDS" : "TIÊU CHUẨN QUỐC TẾ"}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            {isEn ? "Tier-1 Certified Global Brands" : "Thiết Bị Chính Hãng Tier-1 Cao Cấp"}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <span className="text-3xl sm:text-4xl mb-2.5">{brand.logo}</span>
              <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">{brand.name}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-normal">{brand.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
