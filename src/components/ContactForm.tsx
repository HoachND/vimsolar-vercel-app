"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Factory, CheckCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function ContactForm() {
  const { t, language } = useI18n();
  const isEn = language === "en";
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
        body: JSON.stringify({ ...formData, language }),
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
                {t("form_badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 text-white">
                {isEn ? "Get Detailed " : "Nhận Báo Giá "}
                <span className="gradient-text-solar">{isEn ? "Quote" : "Chi Tiết"}</span>
              </h2>
              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                {t("form_desc")}
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-amber-400" size={22} />
                </div>
                <div>
                  <strong className="block text-white text-lg">{t("form_hotline")}</strong>
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
                  <strong className="block text-white text-lg">{t("form_office")}</strong>
                  <span className="text-gray-400">B88, Phố Trúc, KĐT Ecopark, {isEn ? "Phung Cong, Hung Yen" : "xã Phụng Công, Hưng Yên"}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Factory className="text-emerald-400" size={22} />
                </div>
                <div>
                  <strong className="block text-white text-lg">{t("form_factory")}</strong>
                  <span className="text-gray-400">KCN Phố Nối A, {isEn ? "Van Lam, Hung Yen" : "Văn Lâm, Hưng Yên"}</span>
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
                <h3 className="text-2xl font-bold text-white mb-3">{t("form_success_title")}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {t("form_success_desc")}
                </p>
                <a
                  href="https://m.me/vimsolar"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  {t("form_messenger")}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {t("form_name")}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={isEn ? "Ex: John Doe" : "Ví dụ: Nguyễn Văn A"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {t("form_phone")}
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
                    {t("form_email")}
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
                    {t("form_type")}
                  </label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-amber-500 transition-all"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option value="Hộ gia đình" className="bg-slate-900">{t("form_opt1")}</option>
                    <option value="Doanh nghiệp / Nhà xưởng" className="bg-slate-900">{t("form_opt2")}</option>
                    <option value="Nhà trọ cho thuê" className="bg-slate-900">{t("form_opt3")}</option>
                    <option value="Cửa hàng / Khách sạn" className="bg-slate-900">{t("form_opt4")}</option>
                    <option value="Khác" className="bg-slate-900">{t("form_opt5")}</option>
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
                      {t("form_sending")}
                    </>
                  ) : (
                    t("form_submit")
                  )}
                </button>
                <p className="text-center text-gray-500 text-xs">
                  {t("form_secure")}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
