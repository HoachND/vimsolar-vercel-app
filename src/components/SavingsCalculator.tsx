"use client";

import { motion } from "framer-motion";



const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-600", badge: "bg-amber-500" },
  emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-600", badge: "bg-emerald-500" },
  sky: { bg: "bg-sky-500/5", border: "border-sky-500/20", text: "text-sky-600", badge: "bg-sky-500" },
};

import { useI18n } from "@/context/I18nContext";

export default function SavingsCalculator() {
  const { t, language } = useI18n();
  const isEn = language === "en";

  const cases = [
    {
      label: isEn ? "Residential" : "Hộ Gia Đình",
      subtitle: isEn ? "Bill 2.3m VND/month" : "Tiền điện 2.3 triệu/tháng",
      icon: "🏠",
      config: "10 kWp + Hybrid 6kW + Pin 16kWh",
      investment: isEn ? "120 million" : "120 triệu",
      monthlySave: isEn ? "2.3 million" : "2.3 triệu",
      yearlySave: isEn ? "27.6 million" : "27.6 triệu",
      payback: isEn ? "~4.5 years" : "~4.5 năm",
      save10y: isEn ? "400+ million" : "400+ triệu",
      save25y: isEn ? "1.2 billion+" : "1.2 tỷ+",
      color: "amber",
    },
    {
      label: isEn ? "Ecopark Villa" : "Biệt Thự Ecopark",
      subtitle: isEn ? "Bill 5m VND/month" : "Tiền điện 5 triệu/tháng",
      icon: "🏡",
      config: "15 kWp + Hybrid 10kW + Pin 20kWh",
      investment: isEn ? "200 million" : "200 triệu",
      monthlySave: isEn ? "4.5 million" : "4.5 triệu",
      yearlySave: isEn ? "54 million" : "54 triệu",
      payback: isEn ? "~3.7 years" : "~3.7 năm",
      save10y: isEn ? "650+ million" : "650+ triệu",
      save25y: isEn ? "2 billion+" : "2 tỷ+",
      color: "emerald",
    },
    {
      label: isEn ? "Industrial Enterprise" : "Doanh Nghiệp KCN",
      subtitle: isEn ? "Bill 120m VND/month" : "Tiền điện 120 triệu/tháng",
      icon: "🏭",
      config: isEn ? "250 kWp Grid-tied" : "250 kWp hòa lưới bám tải",
      investment: isEn ? "2.5 billion" : "2.5 tỷ",
      monthlySave: isEn ? "48 million" : "48 triệu",
      yearlySave: isEn ? "576 million" : "576 triệu",
      payback: isEn ? "~4.3 years" : "~4.3 năm",
      save10y: isEn ? "8.3 billion" : "8.3 tỷ",
      save25y: isEn ? "26+ billion" : "26+ tỷ",
      color: "sky",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-amber-600 font-extrabold tracking-[4px] text-xs uppercase">
            {t("sav_badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
            {isEn ? "How Much " : "Bạn Tiết Kiệm "}
            <span className="text-amber-600">{isEn ? "Will You Save?" : "Bao Nhiêu?"}</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            {t("sav_desc")}
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((c, i) => {
            const colors = colorClasses[c.color];
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`rounded-3xl border-2 ${colors.border} ${colors.bg} p-8 relative overflow-hidden bento-hover`}
              >
                {/* Badge */}
                <div className={`${colors.badge} text-white text-xs font-black tracking-wider px-4 py-1.5 rounded-full inline-block mb-6 uppercase`}>
                  {c.label}
                </div>

                <p className="text-gray-500 text-sm mb-4">{c.subtitle}</p>

                {/* Icon */}
                <div className="text-5xl mb-4">{c.icon}</div>

                {/* Config */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">{isEn ? "Configuration" : "Cấu hình"}</p>
                  <p className="text-slate-900 font-bold">{c.config}</p>
                </div>

                {/* Investment */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">{isEn ? "Investment" : "Đầu tư"}</p>
                  <p className={`text-3xl font-black ${colors.text}`}>{c.investment}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{isEn ? "Save/month" : "Tiết kiệm/tháng"}</span>
                    <span className="font-bold text-slate-900">{c.monthlySave}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{isEn ? "Save/year" : "Tiết kiệm/năm"}</span>
                    <span className="font-bold text-slate-900">{c.yearlySave}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{isEn ? "Payback" : "Hoàn vốn"}</span>
                    <span className={`font-black ${colors.text}`}>{c.payback}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{isEn ? "Save 10 yrs" : "Tiết kiệm 10 năm"}</span>
                    <span className="font-black text-slate-900 text-lg">{c.save10y}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm">{isEn ? "Save 25 yrs" : "Tiết kiệm 25 năm"}</span>
                    <span className={`font-black ${colors.text} text-xl`}>{c.save25y}</span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#get-quote"
                  className={`block text-center mt-6 py-3 rounded-full ${colors.badge} text-white font-bold hover:opacity-90 transition-opacity`}
                >
                  {isEn ? "Calculate for me →" : "Tính toán cho tôi →"}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Warning banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-8 text-center"
        >
          <p className="text-lg text-slate-900">
            ⚠️ <strong>{isEn ? "New Policy (Dec 72/2025):" : "Cơ chế mới (NĐ 72/2025):"}</strong> {isEn ? "Electricity prices are adjusted" : "Giá điện được xét điều chỉnh"} <strong className="text-red-600">{isEn ? "EVERY 3 MONTHS" : "MỖI 3 THÁNG"}</strong>. 
            {isEn ? " EVN is still carrying a 44,000 billion VND loss to be allocated into prices." : " EVN còn đang cõng khoản lỗ 44.000 tỷ cần phân bổ vào giá điện."}
          </p>
          <p className="text-gray-500 mt-2">
            {isEn ? "Each month waiting = more money lost." : "Mỗi tháng chờ = mất thêm tiền."} <strong className="text-slate-900">{isEn ? "Install solar NOW = lock electricity cost at 0 VND/kWh for 25 years." : "Lắp solar NGAY = khóa chi phí điện ở 0 đồng/kWh trong 25 năm."}</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
