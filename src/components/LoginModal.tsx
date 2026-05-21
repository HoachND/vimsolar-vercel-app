"use client";
import { useState } from "react";
import { X, User, Lock, Eye, EyeOff, LogIn, Loader2, Shield, Users, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginRole = "admin" | "partner" | "ambassador";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [role, setRole] = useState<LoginRole>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const roles: { key: LoginRole; label: string; labelEn: string; icon: React.ReactNode; color: string; bg: string }[] = [
    { key: "admin", label: "Admin / Staff", labelEn: "Admin / Staff", icon: <Shield size={18} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-200 hover:border-blue-400" },
    { key: "partner", label: "Đối Tác Lắp Đặt", labelEn: "Partner", icon: <Wrench size={18} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-200 hover:border-amber-400" },
    { key: "ambassador", label: "Đại Sứ Xanh", labelEn: "Ambassador", icon: <Users size={18} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200 hover:border-emerald-400" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: username.trim(),
        password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      // NextAuth automatically creates a session cookie.
      // We don't need localStorage anymore for the session.
      // However, to maintain the UI logic for role-based redirects,
      // we check the role chosen in the UI or fetch the session.
      // For simplicity, we just redirect based on the role state
      // since the NextAuth session will reflect the correct role if successful.
      
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "partner") {
        router.push("/thong-ke/tong-quan");
      } else if (role === "ambassador") {
        router.push("/daisu");
      }

      onClose();
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
      setError("Vui lòng nhập email hợp lệ!");
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      document.cookie = `googleAuthRole=${role}; path=/; max-age=300`;
      await signIn("google", { callbackUrl: "/" });
      
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xác thực Google!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activeRole = roles.find((r) => r.key === role)!;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LogIn size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Đăng Nhập VimSolar</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chọn loại tài khoản và đăng nhập hệ thống</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); setError(""); }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  role === r.key
                    ? `${r.bg} border-current ${r.color} shadow-sm scale-[1.02]`
                    : "bg-gray-50 dark:bg-slate-800 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                {r.icon}
                <span className="text-[10px] sm:text-xs font-bold leading-tight">{r.label}</span>
              </button>
            ))}
          </div>

          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold p-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}
              {resetSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold p-3 rounded-xl">
                  ✅ Đã gửi hướng dẫn khôi phục mật khẩu vào email của bạn!
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Email của bạn
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-black py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Gửi Yêu Cầu"}
              </button>
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(""); }}
                className="w-full font-bold py-3 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Quay lại đăng nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold p-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Tên đăng nhập / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username hoặc email@..."
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mật khẩu
                  </label>
                  <button type="button" onClick={() => { setIsForgotPassword(true); setError(""); }} className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-black py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                  role === "admin"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40"
                    : role === "partner"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-amber-500/20 hover:shadow-amber-500/40"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40"
                }`}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Đang xác thực...</>
                ) : (
                  <><LogIn size={16} /> Đăng Nhập {activeRole.label}</>
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-400">HOẶC</span>
                <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Đăng nhập với Google
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className="mt-5 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <a href="/daisu" className="hover:text-emerald-500 transition-colors font-medium">
                Đăng ký Đại Sứ Xanh →
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a href="/doi-tac-lap-dat" className="hover:text-amber-500 transition-colors font-medium">
                Đăng ký Đối Tác →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
