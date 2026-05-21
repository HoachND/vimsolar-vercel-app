"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { I18nProvider, useI18n } from "@/context/I18nContext";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Widgets from "@/components/Widgets";
import { Shield, Briefcase, Award, CheckCircle2, ChevronRight, MapPin, Building, Phone, Mail, User, Info, Building2, LogIn, UserPlus, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const VIETNAM_PROVINCES = [
  "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương", "Đồng Nai", 
  "Long An", "Bà Rịa - Vũng Tàu", "Cần Thơ", "Hải Phòng", "Quảng Ninh", 
  "Bắc Ninh", "Hưng Yên", "Hải Dương", "Thanh Hóa", "Nghệ An", "Khánh Hòa"
];

function PartnerPageContent() {
  const { language } = useI18n();
  const isEn = language === "en";
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    commune: "",
    experience: "1-3 năm",
    address: "",
    username: "",
    password: ""
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.businessName || !formData.name || !formData.phone || !formData.email) {
        setError(isEn ? "Please fill in all representative & business fields!" : "Vui lòng điền đầy đủ thông tin doanh nghiệp và liên hệ!");
        return;
      }
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        setError(isEn ? "Phone number must be exactly 10 digits!" : "Số điện thoại phải bao gồm đúng 10 chữ số!");
        return;
      }
      if (!formData.email.includes("@")) {
        setError(isEn ? "Invalid email (missing @)!" : "Email không hợp lệ (thiếu @)!");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.username || !formData.password || !formData.city) {
      setError(isEn ? "Please fill in all remaining fields and set a username/password!" : "Vui lòng chọn Tỉnh/Thành phố và điền thông tin tài khoản đăng nhập!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register-partner",
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError(isEn ? "Please enter username and password!" : "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: formData.username.trim(),
        password: formData.password,
      });
      if (res?.error) throw new Error(res.error);
      router.push("/thong-ke/tong-quan");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối server!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      setError(isEn ? "Please enter a valid email!" : "Vui lòng nhập email hợp lệ!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot-password", email: resetEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tìm thấy email!");
      setResetSuccess(true);
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetSuccess(false);
        setResetEmail("");
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối server!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      document.cookie = "googleAuthRole=partner; path=/; max-age=300";
      await signIn("google", { callbackUrl: "/thong-ke/tong-quan" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xác thực Google!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      title: isEn ? "Authorized Top-Tier Brands" : "Thiết bị Top-Tier Chính Hãng",
      desc: isEn 
        ? "Access premium solar products (LESSO Solar, Deye, Luxpower, Pylontech) with 30-year warranty, supplied by Horus Power."
        : "Phân phối tấm pin LESSO Solar, Deye, Luxpower, Pylontech chính hãng, BH 30 năm nhập khẩu trực tiếp bởi Horus Power.",
      icon: <Award className="w-6 h-6 text-amber-500" />
    },
    {
      title: isEn ? "High Profit Margins" : "Chiết Khấu & Lợi Nhuận Cao",
      desc: isEn
        ? "Enjoy exclusive distributor price tiers, marketing subsidies, and quarterly volume bonuses."
        : "Nhận mức chiết khấu thương mại hấp dẫn, hỗ trợ công cụ bán hàng và thưởng doanh số định kỳ hàng quý.",
      icon: <Briefcase className="w-6 h-6 text-amber-500" />
    },
    {
      title: isEn ? "EPC Technical Support" : "Hỗ Trợ Kỹ Thuật Trọn Gói",
      desc: isEn
        ? "Free solar project design templates, structural calculations, and EVN grid-connection legal assistance."
        : "Đội ngũ kỹ sư VimAI hỗ trợ bản vẽ thiết kế 3D, tính toán kết cấu, và hồ sơ đấu nối điện lưới EVN hoàn toàn miễn phí.",
      icon: <Shield className="w-6 h-6 text-amber-500" />
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider">
                ⚡ {isEn ? "VimSolar Partner Network" : "Mạng lưới đối tác VimSolar"}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {isEn ? "Become Our Authorized" : "Trở Thành Đối Tác"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  {isEn ? "Installation Partner" : "Lắp Đặt Ủy Quyền"}
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                {isEn
                  ? "Leverage our massive Tier-1 supply chain, professional design services, and robust operational dashboard to scale your solar installation business."
                  : "Đồng hành cùng VimSolar để khai phá thị trường điện mặt trời. Nhận nguồn thiết bị Tier-1 chính hãng, hỗ trợ kỹ thuật chuyên sâu và hệ thống quản trị dự án thông minh."}
              </p>

              {/* Benefits Cards */}
              <div className="space-y-4 pt-4">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all duration-300">
                    <div className="flex-shrink-0 p-3 bg-amber-500/10 rounded-xl h-fit">
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-100 text-base">{b.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Registration Box */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <h2 className="text-2xl font-black text-slate-100 mb-2">
                  {isRegister 
                    ? (isEn ? "Partner Registration" : "Đăng Ký Đối Tác Lắp Đặt") 
                    : (isEn ? "Partner Login" : "Đăng Nhập Đối Tác")}
                </h2>
                {isRegister && (
                  <p className="text-gray-400 text-sm mb-4">
                    {isEn ? "Step " : "Bước "}{step}/2: {step === 1 ? (isEn ? "Business Details" : "Thông tin doanh nghiệp") : (isEn ? "Portal Setup & Address" : "Địa điểm & Tài khoản quản trị")}
                  </p>
                )}

                {/* Tab selector */}
                <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6">
                  <button 
                    onClick={() => { setIsRegister(true); setError(""); setIsForgotPassword(false); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isRegister ? "bg-amber-500 text-slate-950" : "text-gray-400 hover:text-white"}`}
                  >
                    <UserPlus className="w-4 h-4" /> {isEn ? "Register" : "Đăng Ký"}
                  </button>
                  <button 
                    onClick={() => { setIsRegister(false); setError(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${!isRegister ? "bg-amber-500 text-slate-950" : "text-gray-400 hover:text-white"}`}
                  >
                    <LogIn className="w-4 h-4" /> {isEn ? "Login" : "Đăng Nhập"}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 font-semibold">
                    ⚠️ {error}
                  </div>
                )}

                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-4"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-100">
                      {isEn ? "Registration Submitted!" : "Gửi Đăng Ký Thành Công!"}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {isEn 
                        ? "Thank you for applying. Our regional sales team will review your business credentials and contact you within 24 hours."
                        : "Cảm ơn quý đối tác đã nộp hồ sơ. Đội ngũ VimSolar sẽ thẩm định và liên hệ bàn giao tài khoản trong vòng 24h."}
                    </p>
                  </motion.div>
                ) : isRegister ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {step === 1 ? (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Business / Company Name *" : "Tên Doanh Nghiệp / Tổ Đội *"}</label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input 
                                type="text" 
                                name="businessName" 
                                value={formData.businessName} 
                                onChange={handleChange} 
                                placeholder={isEn ? "e.g. Solar Pro Co." : "Ví dụ: Công ty Cơ điện Mặt Trời Việt"}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Representative Name *" : "Người Đại Diện / Liên Hệ *"}</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder={isEn ? "Nguyen Van A" : "Ví dụ: Nguyễn Văn A"}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Phone Number *" : "Số Điện Thoại *"}</label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                  type="tel" 
                                  name="phone" 
                                  value={formData.phone} 
                                  onChange={handleChange} 
                                  placeholder="09xx xxx xxx"
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Email Address *" : "Địa Chỉ Email *"}</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                  type="email" 
                                  name="email" 
                                  value={formData.email} 
                                  onChange={handleChange} 
                                  placeholder="name@company.com"
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleNext}
                            className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                          >
                            {isEn ? "Next Step" : "Tiếp Theo"} <ChevronRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Operating Province *" : "Tỉnh hoạt động chính *"}</label>
                              <select 
                                name="city" 
                                value={formData.city} 
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 text-white"
                                required
                              >
                                <option value="">{isEn ? "-- Select --" : "-- Chọn tỉnh --"}</option>
                                {VIETNAM_PROVINCES.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Solar Experience" : "Kinh nghiệm lắp Solar"}</label>
                              <select 
                                name="experience" 
                                value={formData.experience} 
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 text-white"
                              >
                                <option value="Dưới 1 năm">{isEn ? "Under 1 year" : "Dưới 1 năm"}</option>
                                <option value="1-3 năm">{isEn ? "1-3 years" : "1-3 năm"}</option>
                                <option value="3-5 năm">{isEn ? "3-5 years" : "3-5 năm"}</option>
                                <option value="Trên 5 năm">{isEn ? "Over 5 years" : "Trên 5 năm"}</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Detailed Address" : "Địa chỉ chi tiết văn phòng / kho"}</label>
                            <input 
                              type="text" 
                              name="address" 
                              value={formData.address} 
                              onChange={handleChange} 
                              placeholder={isEn ? "123 Street Name, Ward..." : "Số 123 đường, phường..."}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                            />
                          </div>

                          <div className="border-t border-white/10 my-4 pt-4 space-y-4">
                            <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                              <Info className="w-4 h-4" /> {isEn ? "Create Portal Credentials" : "Tạo tài khoản Cổng Đối Tác"}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Username *" : "Tên đăng nhập *"}</label>
                                <input 
                                  type="text" 
                                  name="username" 
                                  value={formData.username} 
                                  onChange={handleChange} 
                                  placeholder="user123"
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Password *" : "Mật khẩu *"}</label>
                                <div className="relative">
                                  <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="w-1/3 bg-white/5 hover:bg-white/10 border border-white/10 font-bold py-3.5 rounded-xl text-sm transition-all"
                            >
                              {isEn ? "Back" : "Quay Lại"}
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                            >
                              {loading ? (isEn ? "Processing..." : "Đang xử lý...") : (isEn ? "Complete Registration" : "Hoàn Tất Đăng Ký")} <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="relative flex items-center py-2 mt-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-gray-500">HOẶC</span>
                            <div className="flex-grow border-t border-white/10"></div>
                          </div>

                          <button
                            type="button"
                            onClick={handleGoogleAuth}
                            disabled={loading}
                            className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Đăng ký / Đăng nhập với Google
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                ) : (
                  /* LOGIN FORM */
                  isForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      {resetSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-xl mb-4 font-semibold text-center">
                          ✅ {isEn ? "Password reset email sent!" : "Đã gửi hướng dẫn khôi phục mật khẩu vào email của bạn!"}
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Your Email" : "Email của bạn"}</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="email" 
                            value={resetEmail} 
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="name@gmail.com"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 text-white"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                      >
                        {loading ? (isEn ? "Processing..." : "Đang xử lý...") : (isEn ? "Send Request" : "Gửi Yêu Cầu")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(false); setError(""); }}
                        className="w-full font-bold py-3 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {isEn ? "Back to login" : "Quay lại đăng nhập"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Username / Email *" : "Tên đăng nhập / Email *"}</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange}
                            placeholder="username123"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isEn ? "Password *" : "Mật khẩu *"}</label>
                          <button type="button" onClick={() => { setIsForgotPassword(true); setError(""); }} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
                            {isEn ? "Forgot password?" : "Quên mật khẩu?"}
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-amber-500 text-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-4"
                      >
                        {loading ? (isEn ? "Authenticating..." : "Đang xác thực...") : (isEn ? "Access Partner Portal" : "Vào Cổng Đối Tác")}
                        <LogIn className="w-4 h-4" />
                      </button>

                      <div className="relative flex items-center py-2 mt-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-gray-500">{isEn ? "OR" : "HOẶC"}</span>
                        <div className="flex-grow border-t border-white/10"></div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {isEn ? "Sign in with Google" : "Đăng nhập với Google"}
                      </button>
                    </form>
                  )
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 border-t border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              {isEn ? "Operational Partner Workflow" : "Quy Trình Hợp Tác Lắp Đặt chuyên nghiệp"}
            </h2>
            <p className="text-gray-400 mt-3 text-sm sm:text-base">
              {isEn
                ? "Manage customer pipelines, fetch custom pricing quotes, and handle installation schedules directly inside your operational portal."
                : "Hệ thống quản lý tinh gọn giúp đối tác chủ động theo dõi báo giá, bản vẽ kỹ thuật và giải quyết hợp đồng bàn giao ngay trên di động."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-indigo-500/30 -translate-y-1/2 pointer-events-none" />
            
            {[
              {
                step: "01",
                title: isEn ? "Register & Login" : "Đăng Ký & Nhận Account",
                desc: isEn ? "Submit credentials and receive active access to the /thong-ke partner portal." : "Gửi thông tin doanh nghiệp, nhận tài khoản Cổng Đối Tác sau 24h thẩm định."
              },
              {
                step: "02",
                title: isEn ? "Claim Regional Leads" : "Nhận Lead Khách Hàng",
                desc: isEn ? "Access verified leads requested from VimSolar marketing in your active province." : "Hệ thống tự động phân phối Lead khách hàng lắp đặt trong Tỉnh hoạt động."
              },
              {
                step: "03",
                title: isEn ? "Get Customized Pricing" : "Báo Giá & Nhận Thiết Bị",
                desc: isEn ? "Get exclusive distributor prices and technical solar designs in 1 click." : "Nhận báo giá đại lý ưu đãi và đặt hàng thiết bị chính hãng từ Horus Power."
              },
              {
                step: "04",
                title: isEn ? "Confirm Install & Paid" : "Thi Công & Đối Soát",
                desc: isEn ? "Conduct technical installation and clear payouts once EVN meter is active." : "Hoàn tất thi công, kiểm tra chất lượng và nhận giải ngân chi phí EPC."
              }
            ].map((w, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-3xl relative hover:border-amber-500/30 transition-all duration-300 group">
                <span className="text-3xl font-black text-amber-500/20 group-hover:text-amber-500/50 transition-colors">{w.step}</span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">{w.title}</h3>
                <p className="text-gray-400 text-sm mt-1.5">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Widgets />
    </div>
  );
}

export default function PartnerPage() {
  return (
    <I18nProvider>
      <PartnerPageContent />
    </I18nProvider>
  );
}
