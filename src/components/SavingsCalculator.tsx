"use client";

import { motion } from "framer-motion";

const cases = [
  {
    label: "Hộ Gia Đình",
    subtitle: "Tiền điện 2.3 triệu/tháng",
    icon: "🏠",
    config: "10 kWp + Hybrid 6kW + Pin 16kWh",
    investment: "120 triệu",
    monthlySave: "2.3 triệu",
    yearlySave: "27.6 triệu",
    payback: "~4.5 năm",
    save10y: "400+ triệu",
    save25y: "1.2 tỷ+",
    color: "amber",
  },
  {
    label: "Biệt Thự Ecopark",
    subtitle: "Tiền điện 5 triệu/tháng",
    icon: "🏡",
    config: "15 kWp + Hybrid 10kW + Pin 20kWh",
    investment: "200 triệu",
    monthlySave: "4.5 triệu",
    yearlySave: "54 triệu",
    payback: "~3.7 năm",
    save10y: "650+ triệu",
    save25y: "2 tỷ+",
    color: "emerald",
  },
  {
    label: "Doanh Nghiệp KCN",
    subtitle: "Tiền điện 120 triệu/tháng",
    icon: "🏭",
    config: "250 kWp hòa lưới bám tải",
    investment: "2.5 tỷ",
    monthlySave: "48 triệu",
    yearlySave: "576 triệu",
    payback: "~4.3 năm",
    save10y: "8.3 tỷ",
    save25y: "26+ tỷ",
    color: "sky",
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-600", badge: "bg-amber-500" },
  emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-600", badge: "bg-emerald-500" },
  sky: { bg: "bg-sky-500/5", border: "border-sky-500/20", text: "text-sky-600", badge: "bg-sky-500" },
};

export default function SavingsCalculator() {
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
            Bảng Tính Thực Tế
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
            Bạn Tiết Kiệm <span className="text-amber-600">Bao Nhiêu?</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Số liệu thực tế dựa trên biểu giá điện EVN hiện hành (QĐ 1279/QĐ-BCT), 
            giá điện tăng 8%/năm. Tất cả đều có thể kiểm chứng.
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
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Cấu hình</p>
                  <p className="text-slate-900 font-bold">{c.config}</p>
                </div>

                {/* Investment */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Đầu tư</p>
                  <p className={`text-3xl font-black ${colors.text}`}>{c.investment}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Tiết kiệm/tháng</span>
                    <span className="font-bold text-slate-900">{c.monthlySave}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Tiết kiệm/năm</span>
                    <span className="font-bold text-slate-900">{c.yearlySave}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Hoàn vốn</span>
                    <span className={`font-black ${colors.text}`}>{c.payback}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Tiết kiệm 10 năm</span>
                    <span className="font-black text-slate-900 text-lg">{c.save10y}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm">Tiết kiệm 25 năm</span>
                    <span className={`font-black ${colors.text} text-xl`}>{c.save25y}</span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#get-quote"
                  className={`block text-center mt-6 py-3 rounded-full ${colors.badge} text-white font-bold hover:opacity-90 transition-opacity`}
                >
                  Tính toán cho tôi →
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
            ⚠️ <strong>Cơ chế mới (NĐ 72/2025):</strong> Giá điện được xét điều chỉnh <strong className="text-red-600">MỖI 3 THÁNG</strong>. 
            EVN còn đang cõng khoản lỗ 44.000 tỷ cần phân bổ vào giá điện.
          </p>
          <p className="text-gray-500 mt-2">
            Mỗi tháng chờ = mất thêm tiền. <strong className="text-slate-900">Lắp solar NGAY = khóa chi phí điện ở 0 đồng/kWh trong 25 năm.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
