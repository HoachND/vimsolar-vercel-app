"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/context/I18nContext";
import { ShieldCheck } from "lucide-react";

export default function Partners() {
  const { language } = useI18n();
  const isEn = language === "en";

  const equipment = [
    {
      name: "LESSO Solar",
      role: isEn ? "N-type TOPCon 625W Bifacial" : "Tấm pin N-type TOPCon 625W Bifacial",
      detail: isEn ? "Listed HKSE (2128.HK) • 30yr warranty" : "Niêm yết HKSE (2128.HK) • BH 30 năm",
      logo: "☀️",
      color: "amber",
    },
    {
      name: "Deye",
      role: isEn ? "Hybrid Inverter #1 Vietnam" : "Biến tần Hybrid số 1 Việt Nam",
      detail: isEn ? "3kW – 110kW • Grid-tied & Hybrid" : "3kW – 110kW • Hòa lưới & Hybrid",
      logo: "⚡",
      color: "sky",
    },
    {
      name: "Luxpower",
      role: isEn ? "Premium Hybrid Inverter" : "Biến tần Hybrid cao cấp",
      detail: isEn ? "LXP 5K/6K MG • Ultra-durable" : "LXP 5K/6K MG • Siêu bền bỉ",
      logo: "🔌",
      color: "violet",
    },
    {
      name: "POWERBOX",
      role: isEn ? "LiFePO4 Battery Storage" : "Pin lưu trữ LiFePO4",
      detail: isEn ? "ES-BOX12 PRO MAX 16kWh • 8000 cycles" : "ES-BOX12 PRO MAX 16kWh • 8000 chu kỳ",
      logo: "🔋",
      color: "emerald",
    },
    {
      name: "Horus Power",
      role: isEn ? "Authorized Distributor" : "Nhà phân phối ủy quyền",
      detail: isEn ? "Official partner • Hoa Phat ecosystem" : "Đối tác chính thức • Hệ sinh thái Hòa Phát",
      logo: "🏛️",
      color: "orange",
    },
    {
      name: "Pylontech",
      role: isEn ? "Lithium Battery Storage" : "Pin lưu trữ Lithium cao cấp",
      detail: isEn ? "US3000C / Force L1 • 6000 cycles" : "US3000C / Force L1 • 6000 chu kỳ",
      logo: "🔋",
      color: "teal",
    },
  ];

  const certifications = [
    "ISO 9001", "IEC 61215", "IEC 61730", "TÜV Rheinland", "CE", "MCS",
  ];

  return (
    <section id="partners" className="py-20 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-extrabold tracking-widest text-xs uppercase">
            {isEn ? "AUTHORIZED EQUIPMENT" : "THIẾT BỊ CHÍNH HÃNG"}
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mt-2">
            {isEn ? "Tier-1 Certified Premium Brands" : "Thương Hiệu Tier-1 Ủy Quyền Chính Hãng"}
          </h3>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            {isEn
              ? "VimSolar exclusively uses certified Tier-1 equipment from globally recognized manufacturers, imported directly through authorized distributor Horus Power."
              : "VimSolar chỉ sử dụng thiết bị chính hãng Tier-1 từ các nhà sản xuất uy tín toàn cầu, nhập trực tiếp qua nhà phân phối ủy quyền Horus Power."}
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-12">
          {equipment.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:border-amber-200 transition-all duration-300 group"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">{item.logo}</span>
              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{item.name}</h4>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-normal">{item.role}</p>
              <p className="text-[9px] sm:text-[10px] text-amber-600/70 mt-1.5 font-medium leading-tight">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isEn ? "Certifications" : "Chứng nhận quốc tế"}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {certifications.map((cert) => (
                <span key={cert} className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-bold border border-emerald-100">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
