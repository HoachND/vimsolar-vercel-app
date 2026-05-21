"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Factory, CheckCircle, Loader2, AlertCircle, Globe } from "lucide-react";

const FacebookIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 22} height={size || 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
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
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { phone?: string; email?: string } = {};

    // Phone: must be exactly 10 digits
    const phoneClean = formData.phone.replace(/\D/g, "");
    if (phoneClean.length !== 10) {
      newErrors.phone = isEn
        ? "Phone number must be exactly 10 digits!"
        : "Số điện thoại phải đúng 10 số!";
    }

    // Email: must contain @
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = isEn
        ? "Email must contain @ character!"
        : "Email phải có ký tự @!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
        setErrors({});
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
    <section id="get-quote" className="py-24 solar-gradient-bg relative overflow-hidden transition-colors duration-500">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>

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
              <span className="text-amber-600 dark:text-amber-400 font-extrabold tracking-[4px] text-xs uppercase">
                {t("form_badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 text-slate-900 dark:text-white">
                {isEn ? "Get Detailed " : "Nhận Báo Giá "}
                <span className="gradient-text-solar">{isEn ? "Quote" : "Chi Tiết"}</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-400 mt-4 text-lg leading-relaxed">
                {t("form_desc")}
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-amber-600 dark:text-amber-400" size={22} />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-lg">{t("form_hotline")}</strong>
                  <a href="tel:0974516670" className="text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    0974 516 670
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-sky-600 dark:text-sky-400" size={22} />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-lg">{t("form_office")}</strong>
                  <span className="text-slate-600 dark:text-gray-400">B88, Phố Trúc, KĐT Ecopark, {isEn ? "Phung Cong, Hung Yen" : "xã Phụng Công, Hưng Yên"}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Factory className="text-emerald-600 dark:text-emerald-400" size={22} />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-lg">{t("form_factory")}</strong>
                  <span className="text-slate-600 dark:text-gray-400">KCN Phố Nối A, {isEn ? "Van Lam, Hung Yen" : "Văn Lâm, Hưng Yên"}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-violet-600 dark:text-violet-400" size={22} />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-lg">Email</strong>
                  <a href="mailto:solar.vimgroup@gmail.com" className="text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    solar.vimgroup@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FacebookIcon className="text-blue-600 dark:text-blue-400" size={22} />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-lg">Facebook</strong>
                  <a href="https://www.facebook.com/vimsolar" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    fb.com/vimsolar
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="text-slate-600 dark:text-slate-400" size={22} />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-lg">Website</strong>
                  <a href="https://www.vimgroup.vn/" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    vimgroup.vn
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
            className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t("form_success_title")}</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
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
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {t("form_name")}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={isEn ? "Ex: John Doe" : "Ví dụ: Nguyễn Văn A"}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {t("form_phone")} <span className="text-amber-500 dark:text-amber-400">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="09xxxxxxxx"
                    className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none transition-all ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                    }`}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    maxLength={11}
                  />
                  {errors.phone && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {t("form_email")} <span className="text-amber-500 dark:text-amber-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="example@gmail.com"
                    className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                    }`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {t("form_type")}
                  </label>
                  <select
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option value="Hộ gia đình" className="bg-white dark:bg-slate-900">{t("form_opt1")}</option>
                    <option value="Doanh nghiệp / Nhà xưởng" className="bg-white dark:bg-slate-900">{t("form_opt2")}</option>
                    <option value="Nhà trọ cho thuê" className="bg-white dark:bg-slate-900">{t("form_opt3")}</option>
                    <option value="Cửa hàng / Khách sạn" className="bg-white dark:bg-slate-900">{t("form_opt4")}</option>
                    <option value="Khác" className="bg-white dark:bg-slate-900">{t("form_opt5")}</option>
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
                <p className="text-center text-slate-500 dark:text-gray-500 text-xs">
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
