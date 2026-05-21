"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { I18nProvider, useI18n } from "@/context/I18nContext";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Widgets from "@/components/Widgets";
import { Users, DollarSign, Share2, TrendingUp, CheckCircle, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

function AmbassadorLandingContent() {
  const { language } = useI18n();
  const isEn = language === "en";
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vimsolar-admin-session");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === "member" || u.role === "admin" || u.role === "staff") {
          setIsLoggedIn(true);
        }
      } catch (e) {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister) {
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        setError(isEn ? "Phone number must be exactly 10 digits!" : "Số điện thoại phải bao gồm đúng 10 chữ số!");
        setLoading(false);
        return;
      }
      if (!formData.email.includes("@")) {
        setError(isEn ? "Invalid email (missing @)!" : "Email không hợp lệ (thiếu @)!");
        setLoading(false);
        return;
      }
    }

    try {
      if (isRegister) {
        // Vẫn giữ lại fetch tới /api/auth để handle đăng ký mới và gửi email / webhook
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "register-ambassador", ...formData }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed!");

        setSuccess(true);
        setTimeout(() => {
          setIsRegister(false);
          setSuccess(false);
        }, 3000);
      } else {
        // Sử dụng NextAuth cho đăng nhập
        const res = await signIn("credentials", {
          redirect: false,
          username: formData.username.trim(),
          password: formData.password,
        });

        if (res?.error) {
          throw new Error(res.error);
        }

        router.push("/daisu");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      setError(isEn ? "Invalid email!" : "Vui lòng nhập email hợp lệ!");
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
      await signIn("google", { callbackUrl: "/daisu" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xác thực Google!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const commissionTiers = [
    {
      range: "80,000,000 - 150,000,000 đ",
      rate: "2.0%",
      commission: "1,600,000 - 3,000,000 đ",
      note: isEn ? "Small residential systems" : "Hệ hộ gia đình nhỏ"
    },
    {
      range: "150,000,000 - 300,000,000 đ",
      rate: "2.0%",
      commission: "3,000,000 - 6,000,000 đ",
      note: isEn ? "Medium-large residential" : "Biệt thự & Hộ gia đình lớn"
    },
    {
      range: "300,000,000 - 500,000,000 đ",
      rate: "2.0%",
      commission: "6,000,000 - 10,000,000 đ",
      note: isEn ? "Commercial rooftop / Penthouse" : "Nhà xưởng nhỏ & Penthouse"
    },
    {
      range: "> 500,000,000 đ",
      rate: "2.0%",
      commission: "> 10,000,000 đ",
      note: isEn ? "Industrial factories" : "Hợp đồng nhà máy lớn"
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Selling Ambassador Program */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider">
                🌱 {isEn ? "VimSolar Green Ambassador" : "Đại Sứ Xanh VimSolar"}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {isEn ? "Share Green Energy" : "Chia Sẻ Năng Lượng Xanh"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400">
                  {isEn ? "Earn 2% Commission" : "Nhận 2% Hoa Hồng"}
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                {isEn 
                  ? "Join the ESG movement by recommending premium solar solutions. Introduce referred clients, track active pipelines on your portal, and earn high commissions."
                  : "Đồng hành cùng chiến dịch phủ xanh mái nhà Việt Nam. Chỉ cần giới thiệu khách hàng có nhu cầu lắp đặt, theo dõi tiến độ khảo sát tự động và nhận hoa hồng lên tới hàng chục triệu đồng."}
              </p>

              {/* Commission Stats */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="text-2xl font-black text-emerald-400">2.0%</span>
                  <p className="text-xs text-gray-400 mt-1">{isEn ? "Contract Value" : "Giá trị hợp đồng"}</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="text-2xl font-black text-teal-400">0 đ</span>
                  <p className="text-xs text-gray-400 mt-1">{isEn ? "Registration Fee" : "Phí tham gia"}</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="text-2xl font-black text-amber-400">24/7</span>
                  <p className="text-xs text-gray-400 mt-1">{isEn ? "Payout Tracking" : "Đối soát tự động"}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Register / Login Form OR Logged In State */}
            <div className="lg:col-span-5">
              {isLoggedIn ? (
                <div className="bg-[#0070f3] rounded-3xl p-8 sm:p-10 shadow-2xl relative text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight uppercase">
                    BẮT ĐẦU GIA TĂNG THU NHẬP NGAY HÔM NAY
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base font-medium mb-8">
                    Không ràng buộc doanh số - Không mất phí tham gia
                  </p>
                  
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tài khoản đã tồn tại</h3>
                    <p className="text-gray-500 text-sm mb-8">
                      Bạn hiện đang là Đại sứ Xanh của VimSolar.
                    </p>
                    <button 
                      onClick={() => router.push("/daisu")}
                      className="w-full bg-[#ff7b00] hover:bg-[#e66a00] text-white font-bold py-3.5 rounded-full transition-colors text-sm uppercase"
                    >
                      TRUY CẬP HỆ THỐNG
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  
                  {/* Tab selector */}
                  <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6">
                    <button 
                      onClick={() => { setIsRegister(true); setError(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isRegister ? "bg-emerald-500 text-slate-950" : "text-gray-400 hover:text-white"}`}
                    >
                      <UserPlus className="w-4 h-4" /> {isEn ? "Register" : "Đăng Ký"}
                    </button>
                    <button 
                      onClick={() => { setIsRegister(false); setError(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${!isRegister ? "bg-emerald-500 text-slate-950" : "text-gray-400 hover:text-white"}`}
                    >
                      <LogIn className="w-4 h-4" /> {isEn ? "Login" : "Đăng Nhập"}
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 font-semibold">
                      ⚠️ {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-xl mb-4 font-semibold text-center">
                      🎉 Đăng ký thành công! Đang chuyển sang Đăng Nhập...
                    </div>
                  )}

                  {isForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      {resetSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-xl mb-4 font-semibold text-center">
                          ✅ Đã gửi hướng dẫn khôi phục mật khẩu vào email của bạn!
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Your Email" : "Email của bạn"}</label>
                        <input 
                          type="email" 
                          value={resetEmail} 
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="name@gmail.com"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                      >
                        {loading ? "Đang xử lý..." : "Gửi Yêu Cầu"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(false); setError(""); }}
                        className="w-full font-bold py-3 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Quay lại đăng nhập
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleAuth} className="space-y-4">
                    {isRegister && (
                      <>
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Full Name *" : "Họ và Tên *"}</label>
                          <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder={isEn ? "Nguyen Van A" : "Ví dụ: Nguyễn Văn A"}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Phone *" : "Số điện thoại *"}</label>
                            <input 
                              type="tel" 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleChange}
                              placeholder="09xx xxx xxx"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Email *" : "Email *"}</label>
                            <input 
                              type="email" 
                              name="email" 
                              value={formData.email} 
                              onChange={handleChange}
                              placeholder="name@email.com"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">{isEn ? "Username *" : "Tên đăng nhập *"}</label>
                      <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}
                        placeholder="username123"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isEn ? "Password *" : "Mật khẩu *"}</label>
                        {!isRegister && (
                          <button type="button" onClick={() => { setIsForgotPassword(true); setError(""); }} className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                            {isEn ? "Forgot password?" : "Quên mật khẩu?"}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-emerald-500 text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <Lock className="w-4 h-4" /> : <Lock className="w-4 h-4 opacity-50" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? (isEn ? "Processing..." : "Đang xử lý...") : (isRegister ? (isEn ? "Register Free Now" : "Đăng Ký Miễn Phí Ngay") : (isEn ? "Access Ambassador Portal" : "Vào Trang Quản Trị Đại Sứ"))}
                      <ArrowRight className="w-4 h-4" />
                    </button>

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
                      {isRegister ? "Đăng ký với Google" : "Đăng nhập với Google"}
                    </button>
                  </form>
                  )}

                  <p className="text-[10px] text-gray-500 text-center mt-4">
                    🛡️ {isEn ? "Your account is secure. 10% PIT is automatically withheld." : "Bảo mật thông tin 100%. Tự động giảm trừ thuế TNCN 10% theo quy định."}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Commission Rates Table */}
      <section className="py-20 bg-slate-900/30 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              {isEn ? "Lucrative Commission Structure" : "Bảng Chi Nhận Hoa Hồng Đại Sứ Xanh"}
            </h2>
            <p className="text-gray-400 mt-3 text-sm sm:text-base">
              {isEn
                ? "Every successful contract referred yields a flat 2.0% commission payout. Check standard payouts below."
                : "Tính toán mức thu nhập hấp dẫn khi chia sẻ cơ hội phủ xanh mái nhà Việt Nam cùng VimSolar."}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950 text-xs uppercase tracking-wider text-emerald-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-black">{isEn ? "Contract Value Range (Pre-VAT)" : "Giá Trị Hợp Đồng (Trước VAT)"}</th>
                  <th className="px-6 py-4 font-black">{isEn ? "Commission Rate" : "Tỷ Lệ Hoa Hồng"}</th>
                  <th className="px-6 py-4 font-black">{isEn ? "Earned Amount (Gross)" : "Số Tiền Nhận Được"}</th>
                  <th className="px-6 py-4 font-black">{isEn ? "Example Tier" : "Phù Hợp Với Hệ"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commissionTiers.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-extrabold">{t.range}</td>
                    <td className="px-6 py-4 font-extrabold text-emerald-400">{t.rate}</td>
                    <td className="px-6 py-4 font-black text-slate-100">{t.commission}</td>
                    <td className="px-6 py-4 text-gray-400">{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sharing steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              {isEn ? "How to Start Earning" : "3 Bước Đơn Giản Nhận Hoa Hồng"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: isEn ? "1. Generate Link" : "1. Lấy Link Chia Sẻ",
                desc: isEn ? "Log in to your ambassador portal, copy active campaign links containing your ref code." : "Đăng nhập cổng đại sứ, copy link chiến dịch tiếp thị chứa mã định danh duy nhất của bạn.",
                icon: <Share2 className="w-8 h-8 text-emerald-400" />
              },
              {
                title: isEn ? "2. Refer Customers" : "2. Giới Thiệu Khách",
                desc: isEn ? "Share on Facebook/Zalo, or fill client's details directly in your pipeline portal." : "Gửi link cho người có nhu cầu, hoặc chủ động nhập thông tin khách hàng trực tiếp trên hệ thống.",
                icon: <Users className="w-8 h-8 text-emerald-400" />
              },
              {
                title: isEn ? "3. Receive Transfer" : "3. Nhận Tiền Tài Khoản",
                desc: isEn ? "Once contract is signed and installed, money is transferred automatically to your bank." : "VimSolar liên hệ tư vấn lắp đặt. Hợp đồng ký kết thành công, hoa hồng tự động giải ngân về tài khoản.",
                icon: <DollarSign className="w-8 h-8 text-emerald-400" />
              }
            ].map((s, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-8 rounded-3xl text-center flex flex-col items-center hover:border-emerald-500/30 transition-all duration-300">
                <div className="p-4 bg-emerald-500/10 rounded-2xl mb-4">
                  {s.icon}
                </div>
                <h3 className="font-extrabold text-xl text-slate-100 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
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

export default function AmbassadorLandingPage() {
  return (
    <I18nProvider>
      <AmbassadorLandingContent />
    </I18nProvider>
  );
}
