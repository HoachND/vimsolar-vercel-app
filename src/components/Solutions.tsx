"use client";

import { motion } from "framer-motion";
import { Home, Factory, Building, ShoppingBag } from "lucide-react";

const solutions = [
  {
    icon: Home,
    tag: "HỘ GIA ĐÌNH",
    title: "Solar Cho Gia Đình",
    desc: "Hệ Hybrid 5-15kWp, tích hợp pin lưu trữ. Dùng điện cả ban đêm, chống mất điện. Tiền điện 2-5 triệu/tháng về gần 0 đồng.",
    highlight: "Hoàn vốn 4-5 năm • Tiết kiệm 1.2 tỷ/25 năm",
    investment: "Từ 80 - 200 triệu",
    img: "/images/solar-house.jpg",
    featured: true,
  },
  {
    icon: Factory,
    tag: "DOANH NGHIỆP",
    title: "Solar Cho Nhà Xưởng",
    desc: "Hòa lưới 50-500+ kWp, ROI cực nhanh. Solar phát đúng giờ sản xuất, tỷ lệ tự tiêu thụ 100%. Đáp ứng ESG, tín chỉ carbon.",
    highlight: "Hoàn vốn 3.5-5 năm • Tiết kiệm 8.3 tỷ/10 năm",
    investment: "Từ 1 - 10+ tỷ",
    img: "/images/solar-factory.webp",
    featured: false,
  },
  {
    icon: Building,
    tag: "NHÀ TRỌ CHO THUÊ",
    title: "Solar Cho Nhà Trọ",
    desc: "ROI nhanh nhất! Chủ nhà mua điện bậc cao 3.460đ/kWh nhưng chỉ thu 3.600đ. Solar cắt phần đắt nhất, tăng lợi nhuận 10 triệu/tháng.",
    highlight: "Hoàn vốn 1.5-2.5 năm • Lãi thuần 10tr+/tháng",
    investment: "Từ 150 - 350 triệu",
    img: "/images/solar-rooftop.jpg",
    featured: false,
  },
  {
    icon: ShoppingBag,
    tag: "CỬA HÀNG • KHÁCH SẠN",
    title: "Solar Cho Kinh Doanh",
    desc: "Giá điện kinh doanh giờ cao điểm 5.422đ/kWh — gấp 2.7x giá sinh hoạt. Solar cắt đúng phần đắt nhất, ROI siêu nhanh.",
    highlight: "Hoàn vốn 1.5-2 năm • Tiết kiệm 48tr+/năm",
    investment: "Từ 60 - 150 triệu",
    img: "/images/solar-clean.png",
    featured: false,
  },
];

export default function Solutions() {
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
            Giải Pháp Tối Ưu
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
            Giải Pháp <span className="text-[#0C4A6E]">Điện Mặt Trời</span> VimSolar
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Tư vấn - Thiết kế - Thi công trọn gói. Phù hợp mọi nhu cầu từ hộ gia đình đến doanh nghiệp lớn.
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
                    💰 Đầu tư: <strong className="text-white">{s.investment}</strong>
                  </span>
                  <a
                    href="#get-quote"
                    className="text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors"
                  >
                    Tư vấn ngay →
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
