"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, LogIn, UserPlus, AlertCircle, CheckCircle, Key, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ROIConsultant from "./ROIConsultant";

type GateMode = "choice" | "register" | "login" | "code";

export default function ROIAccessGate() {
  const [hasAccess, setHasAccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [mode, setMode] = useState<GateMode>("choice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [accessCode, setAccessCode] = useState("");

  // Registration form
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");

  // Login form
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Code form
  const [codeInput, setCodeInput] = useState("");

  useEffect(() => {
    // Check if already has access in localStorage
    const saved = localStorage.getItem("vimsolar-roi-access");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.expiry && new Date(parsed.expiry) > new Date()) {
          setHasAccess(true);
          setUserName(parsed.name);
        }
      } catch {}
    }
  }, []);

  const saveAccess = (name: string) => {
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem("vimsolar-roi-access", JSON.stringify({ name, expiry }));
    setHasAccess(true);
    setUserName(name);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    const phoneClean = regPhone.replace(/\D/g, "");
    if (phoneClean.length !== 10) {
      setError("Số điện thoại phải đúng 10 số!");
      setLoading(false);
      return;
    }
    if (!regEmail.includes("@")) {
      setError("Email phải có ký tự @!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roi-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: regName,
          phone: phoneClean,
          email: regEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra!");
        setLoading(false);
        return;
      }
      setAccessCode(data.accessCode);
      setSuccessMsg(data.message);
      saveAccess(regName);
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/roi-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          username: loginUser,
          password: loginPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sai thông tin đăng nhập!");
        setLoading(false);
        return;
      }
      saveAccess(data.name);
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  const handleCodeVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/roi-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          accessCode: codeInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Mã truy cập không hợp lệ!");
        setLoading(false);
        return;
      }
      saveAccess(data.name);
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("vimsolar-roi-access");
    setHasAccess(false);
    setUserName("");
    setMode("choice");
  };

  // If has access, show ROI tool
  if (hasAccess) {
    return (
      <div>
        {/* Access bar */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield size={14} />
              <span>Xin chào, <strong>{userName}</strong> — Bạn đang truy cập ROI Tool</span>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 text-xs transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
        <ROIConsultant />
      </div>
    );
  }

  // Gate UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/">
            <div className="relative w-[180px] h-[50px] mx-auto mb-4">
              <Image src="/images/logo-vimsolar-nobg.png" alt="VimSolar" fill className="object-contain" priority />
            </div>
          </a>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
            <Shield className="text-amber-400" size={14} />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">ROI Tool — Restricted Access</span>
          </div>
        </div>

        {/* Success state after registration */}
        <AnimatePresence mode="wait">
          {successMsg && accessCode ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Đăng Ký Thành Công!</h2>
              <p className="text-slate-400 text-sm mb-6">{successMsg}</p>
              
              <div className="bg-slate-800 border border-amber-500/30 rounded-2xl p-6 mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Mã Truy Cập Của Bạn</p>
                <p className="text-3xl font-black text-amber-400 tracking-[8px]">{accessCode}</p>
                <p className="text-xs text-slate-500 mt-2">Hãy lưu lại mã này để truy cập lần sau</p>
              </div>

              <p className="text-emerald-400 text-sm font-bold">✅ Đang chuyển đến ROI Tool...</p>
            </motion.div>
          ) : (
            <motion.div
              key="gate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              {mode === "choice" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-black text-white mb-2">Truy Cập ROI Tool</h1>
                    <p className="text-slate-400 text-sm">
                      Công cụ tính toán hiệu quả đầu tư chỉ dành cho khách hàng và nhân viên VimSolar
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setMode("register")}
                      className="w-full p-4 rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                        <UserPlus className="text-amber-400" size={22} />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold">Đăng Ký Mới</p>
                        <p className="text-slate-400 text-xs">Khách hàng quan tâm điện mặt trời</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setMode("code")}
                      className="w-full p-4 rounded-2xl border-2 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
                        <Key className="text-sky-400" size={22} />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold">Nhập Mã Truy Cập</p>
                        <p className="text-slate-400 text-xs">Đã có mã từ lần đăng ký trước</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setMode("login")}
                      className="w-full p-4 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/15 transition-colors">
                        <LogIn className="text-slate-300" size={22} />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold">Nhân Viên Đăng Nhập</p>
                        <p className="text-slate-400 text-xs">Staff / Admin VimSolar</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-5">
                  <button type="button" onClick={() => { setMode("choice"); setError(""); }} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> Quay lại
                  </button>
                  <h2 className="text-xl font-black text-white">Đăng Ký Truy Cập</h2>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và Tên *</label>
                    <input required type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số Điện Thoại * <span className="text-amber-400">(đúng 10 số)</span></label>
                    <input required type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="09xxxxxxxx" maxLength={11} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email * <span className="text-amber-400">(phải có @)</span></label>
                    <input required type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="example@gmail.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all" />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50">
                    {loading ? "Đang xử lý..." : "⚡ ĐĂNG KÝ NGAY"}
                  </button>
                  <p className="text-center text-slate-500 text-xs">🔒 Thông tin được bảo mật. Dữ liệu dùng để gửi tư vấn solar.</p>
                </form>
              )}

              {mode === "code" && (
                <form onSubmit={handleCodeVerify} className="space-y-5">
                  <button type="button" onClick={() => { setMode("choice"); setError(""); }} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> Quay lại
                  </button>
                  <h2 className="text-xl font-black text-white">Nhập Mã Truy Cập</h2>
                  <p className="text-slate-400 text-sm">Nhập mã 6 ký tự bạn nhận được khi đăng ký</p>
                  
                  <input required type="text" value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase())} placeholder="XXXXXX" maxLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-2xl font-black tracking-[8px] placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-all uppercase" />

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all disabled:opacity-50">
                    {loading ? "Đang xác minh..." : "🔑 XÁC MINH MÃ"}
                  </button>
                </form>
              )}

              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <button type="button" onClick={() => { setMode("choice"); setError(""); }} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> Quay lại
                  </button>
                  <h2 className="text-xl font-black text-white">Nhân Viên Đăng Nhập</h2>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tên đăng nhập / Email</label>
                    <input required type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="username hoặc email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                    <input required type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all" />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(100,116,139,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Đang đăng nhập..." : "🔐 ĐĂNG NHẬP"}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a href="/" className="text-slate-500 hover:text-amber-400 text-sm transition-colors">
            ← Quay lại trang chủ VimSolar
          </a>
        </div>
      </motion.div>
    </div>
  );
}
