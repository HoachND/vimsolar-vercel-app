"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Factory, CheckCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "Hộ gia đình",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", phone: "", email: "", projectType: "Hộ gia đình" });
        // Dynamic confetti import
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#F59E0B", "#0C4A6E", "#10B981"],
        });
        setTimeout(() => setSuccess(false), 8000);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <section id="get-quote" className="py-24 solar-gradient-bg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-amber-400 font-extrabold tracking-[4px] text-xs uppercase">
                Liên Hệ Tư Vấn
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 text-white">
                Nhận Báo Giá{" "}
                <span className="gradient-text-solar">Chi Tiết</span>
              </h2>
              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                Để lại thông tin, đội ngũ kỹ sư VimSolar sẽ liên hệ khảo sát miễn phí 
                và báo giá trọn gói phù hợp nhất với nhu cầu của bạn.
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-amber-400" size={22} />
                </div>
                <div>
                  <strong className="block text-white text-lg">Hotline 24/7</strong>
                  <a href="tel:0974516670" className="text-gray-400 hover:text-amber-400 transition-colors">
                    0974 516 670
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-sky-400" size={22} />
                </div>
                <div>
                  <strong className="block text-white text-lg">Văn phòng đại diện</strong>
                  <span className="text-gray-400">B88, Phố Trúc, KĐT Ecopark, xã Phụng Công, Hưng Yên</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Factory className="text-emerald-400" size={22} />
                </div>
                <div>
                  <strong className="block text-white text-lg">Nhà máy</strong>
                  <span className="text-gray-400">KCN Phố Nối A, Văn Lâm, Hưng Yên</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-violet-400" size={22} />
                </div>
                <div>
                  <strong className="block text-white text-lg">Email</strong>
                  <a href="mailto:solar.vimgroup@gmail.com" className="text-gray-400 hover:text-amber-400 transition-colors">
                    solar.vimgroup@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Gửi Yêu Cầu Thành Công!</h3>
                <p className="text-gray-400 leading-relaxed">
                  Cảm ơn quý khách đã tin tưởng VimSolar. Kỹ sư của chúng tôi sẽ liên hệ 
                  tư vấn trong vòng 24h qua Zalo/SĐT.
                </p>
                <a
                  href="https://m.me/vimsolar"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  💬 Chat Messenger Ngay
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Số Điện Thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="09xxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Loại Công Trình
                  </label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-amber-500 transition-all"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option value="Hộ gia đình" className="bg-slate-900">Hộ Gia Đình</option>
                    <option value="Doanh nghiệp / Nhà xưởng" className="bg-slate-900">Doanh Nghiệp / Nhà Xưởng</option>
                    <option value="Nhà trọ cho thuê" className="bg-slate-900">Nhà Trọ Cho Thuê</option>
                    <option value="Cửa hàng / Khách sạn" className="bg-slate-900">Cửa Hàng / Khách Sạn</option>
                    <option value="Khác" className="bg-slate-900">Khác</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      ĐANG GỬI...
                    </>
                  ) : (
                    "NHẬN BÁO GIÁ MIỄN PHÍ ☀️"
                  )}
                </button>
                <p className="text-center text-gray-500 text-xs">
                  🔒 Thông tin của bạn được bảo mật tuyệt đối
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
