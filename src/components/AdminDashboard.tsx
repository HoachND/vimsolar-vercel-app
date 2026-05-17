"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText, Plus, LogOut, Moon, Sun, Save, Trash2, ChevronLeft, Globe, Search, Eye, EyeOff, Code, Terminal, Key, Users, UserPlus, Music, Shield, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { BlogPost } from "@/lib/types";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "member";
  createdAt: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<"blog" | "api" | "staff" | "music" | "profile">("blog");
  
  // Blog State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Staff State
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: "", password: "", name: "", email: "", phone: "", role: "staff" });
  const [showStaffPass, setShowStaffPass] = useState(false);

  // Music State
  const [playlist, setPlaylist] = useState<{ title: string; url: string }[]>([]);
  // Automation State
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const blogPayload = `{
  "titleVi": "Top 5 xu hướng lắp đặt điện mặt trời 2026",
  "titleEn": "Top 5 solar installation trends in 2026",
  "contentVi": "<h1>Nội dung bài viết chuẩn HTML ở đây...</h1>",
  "contentEn": "<h1>HTML Content here...</h1>",
  "excerptVi": "Tóm tắt ngắn tiếng Việt",
  "excerptEn": "English short description",
  "seoTitle": "Top 5 xu hướng lắp đặt điện mặt trời 2026",
  "seoDescription": "Tìm hiểu chi tiết 5 xu hướng lắp đặt điện năng lượng mặt trời mới nhất...",
  "category": "Solar",
  "published": true
}`;
  // Profile/Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState({ text: "", type: "" });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    // Attempt to load session from local storage (simple demo)
    const saved = localStorage.getItem("vimsolar-admin-session");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === "blog") fetchPosts();
      if (activeTab === "staff" && user.role === "admin") fetchStaff();
      if (activeTab === "music") fetchMusic();
    }
  }, [user, activeTab]);

  // Auth Functions
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username: loginUser, password: loginPass })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error);
        return;
      }
      setUser(data.user);
      localStorage.setItem("vimsolar-admin-session", JSON.stringify(data.user));
    } catch {
      setLoginError("Lỗi kết nối server!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("vimsolar-admin-session");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", userId: user?.id, currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) {
        setPassMsg({ text: data.error, type: "error" });
        return;
      }
      setPassMsg({ text: "Đổi mật khẩu thành công!", type: "success" });
      setCurrentPass("");
      setNewPass("");
    } catch {
      setPassMsg({ text: "Lỗi kết nối!", type: "error" });
    }
  };

  // Blog Functions
  const fetchPosts = async () => {
    const res = await fetch("/api/blog?admin=true");
    const data = await res.json();
    setPosts(data);
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const method = editingPost.id ? "PUT" : "POST";
    const res = await fetch("/api/blog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPost),
    });

    if (res.ok) {
      setIsEditorOpen(false);
      fetchPosts();
      alert("Đã lưu bài viết thành công!");
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Sếp chắc chắn muốn xóa bài này chứ?")) return;
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    fetchPosts();
  };

  // Staff Functions
  const fetchStaff = async () => {
    if (user?.role !== "admin") return;
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list-users", adminId: user.id })
      });
      const data = await res.json();
      if (res.ok) setStaffList(data);
    } catch {}
  };

  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add-staff", adminId: user?.id, ...newStaff })
      });
      const data = await res.json();
      if (res.ok) {
        setIsStaffModalOpen(false);
        setNewStaff({ username: "", password: "", name: "", email: "", phone: "", role: "staff" });
        fetchStaff();
        alert("Đã thêm thành viên!");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Lỗi kết nối!");
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa thành viên này?")) return;
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-staff", adminId: user?.id, userId: id })
    });
    fetchStaff();
  };

  // Music Functions
  const fetchMusic = async () => {
    const res = await fetch("/api/music");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      setPlaylist(data);
    } else {
      setPlaylist([{ title: "", url: "" }]);
    }
  };

  const saveMusic = async () => {
    const validPlaylist = playlist.filter(p => p.url.trim() !== "");
    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlist: validPlaylist })
      });
      if (res.ok) alert("Đã lưu playlist nhạc!");
    } catch {
      alert("Lỗi lưu nhạc!");
    }
  };


  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="relative w-[200px] h-[60px] mx-auto mb-6">
              <Image src="/images/logo-vimsolar-nobg.png" alt="Logo" fill className="object-contain" />
            </div>
            <h1 className="text-white font-black text-2xl mb-2">Workspace Admin</h1>
            <p className="text-slate-400 mb-8 text-sm">Hệ thống quản trị nội bộ VimSolar</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Tên đăng nhập hoặc Email"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors pr-12"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {loginError && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-lg">
                  <AlertCircle size={14} /> {loginError}
                </div>
              )}

              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
                Đăng nhập
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>
      {/* Navbar */}
      <nav className={`fixed w-full z-40 border-b ${isDark ? "bg-slate-900/80 border-white/5" : "bg-white/80 border-gray-200"} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-[120px] h-[40px]">
              <Image src="/images/logo-vimsolar-nobg.png" alt="Logo" fill className={`object-contain ${!isDark ? "invert" : ""}`} />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-amber-500 font-black text-sm uppercase tracking-widest">Dashboard</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-bold capitalize">{user.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">Chào, {user.name}</span>
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="/" className="text-xs font-bold px-4 py-2 rounded-full border border-current hover:bg-current hover:text-white transition-all flex items-center gap-2">
              <ChevronLeft size={14} /> Ra website
            </a>
            <button onClick={handleLogout} className="text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-colors"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button onClick={() => setActiveTab("blog")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "blog" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "hover:bg-white/5 text-slate-400"}`}>
            <LayoutDashboard size={20} /> Quản lý Blog
          </button>
          <button onClick={() => setActiveTab("api")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "api" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "hover:bg-white/5 text-slate-400"}`}>
            <Terminal size={20} /> API & Tự động hóa
          </button>
          {user.role === "admin" && (
            <button onClick={() => setActiveTab("staff")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "staff" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "hover:bg-white/5 text-slate-400"}`}>
              <Users size={20} /> Quản lý Nhân sự
            </button>
          )}
          <button onClick={() => setActiveTab("music")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "music" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "hover:bg-white/5 text-slate-400"}`}>
            <Music size={20} /> Nhạc Background
          </button>
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "profile" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "hover:bg-white/5 text-slate-400"}`}>
            <Shield size={20} /> Đổi mật khẩu
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* TAB: BLOG */}
          {activeTab === "blog" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-black">Bài Viết</h1>
                  <p className="text-slate-400 text-sm mt-1">Quản lý nội dung và SEO cho website</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingPost({ 
                      id: "", slug: "", titleVi: "", titleEn: "", excerptVi: "", excerptEn: "", 
                      contentVi: "", contentEn: "", category: "Solar", 
                      seoTitle: "", seoDescription: "", seoImage: "", 
                      tags: "", author: user.name, published: true, createdAt: "", updatedAt: "" 
                    });
                    setIsEditorOpen(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20"
                >
                  <Plus size={20} /> Viết Bài Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-slate-900 border-white/5 hover:border-amber-500/30" : "bg-white border-gray-100 hover:shadow-xl"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPost(post); setIsEditorOpen(true); }} className="text-blue-400 hover:text-blue-300">Sửa</button>
                        <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.titleVi}</h3>
                    <p className={`text-xs mb-4 line-clamp-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{post.excerptVi}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                      <span className={post.published ? "text-emerald-500" : "text-amber-500"}>{post.published ? "● Đã đăng" : "○ Bản nháp"}</span>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* TAB: API & AUTOMATION */}
          {activeTab === "api" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <div className="mb-8">
                <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Terminal className="text-emerald-500" /> API & Webhook Tự Động Hóa</h1>
                <p className="text-slate-400 text-sm">
                  Tài liệu hướng dẫn kết nối n8n, Make, Zapier để tự động đăng bài viết lên VimSolar.
                </p>
              </div>

              <div className="space-y-8">
                {/* Connection Info */}
                <div className={`p-6 rounded-3xl border-l-4 border-emerald-500 ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200 shadow-lg"}`}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🔗 Thông Tin Kết Nối Chung</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase opacity-60 mb-1 block">Endpoint URL (Method: POST)</label>
                      <div className="flex items-center gap-2">
                        <code className={`flex-1 p-3 rounded-xl text-sm border font-mono text-emerald-500 ${isDark ? "bg-slate-950 border-white/10" : "bg-gray-50 border-gray-200"}`}>
                          https://solar.vimgroup.vn/api/blog
                        </code>
                        <button onClick={() => handleCopy("https://solar.vimgroup.vn/api/blog", "url")} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all text-sm">
                          {copied === "url" ? "✅ Đã copy" : "📋 Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Payload */}
                <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200 shadow-lg"}`}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📝 Đăng Bài Viết (Blog)</h2>
                  <p className="text-sm mb-4 text-slate-400">
                    Gửi payload JSON sau để tạo bài viết mới. Các trường <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-500">titleVi</code> và <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-500">contentVi</code> là bắt buộc.
                  </p>
                  <div className="relative group">
                    <pre className={`p-4 rounded-xl text-sm border overflow-x-auto font-mono text-amber-400 ${isDark ? "bg-slate-950 border-white/10" : "bg-gray-900 border-gray-800"}`}>
                      {blogPayload}
                    </pre>
                    <button onClick={() => handleCopy(blogPayload, "blog")} className="absolute top-3 right-3 px-3 py-1.5 bg-amber-500 text-slate-900 rounded-lg font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied === "blog" ? "✅ Đã copy" : "📋 Copy JSON"}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200 shadow-lg"}`}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">⚙️ Hướng dẫn cài đặt trên n8n / Make</h2>
                  <ol className="list-decimal list-inside space-y-3 text-sm text-slate-400">
                    <li>Tạo một node <strong>HTTP Request</strong>.</li>
                    <li>Method: <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-500">POST</code></li>
                    <li>URL: Điền Endpoint URL ở trên.</li>
                    <li>Headers: <code>Content-Type: application/json</code></li>
                    <li>Body: Bật <strong>Send JSON</strong> và paste JSON payload vào phần Body. Các giá trị trong JSON có thể dùng AI để xuất ra động (dynamic).</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: STAFF */}
          {activeTab === "staff" && user.role === "admin" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-black">Nhân Sự</h1>
                  <p className="text-slate-400 text-sm mt-1">Quản lý phân quyền tài khoản</p>
                </div>
                <button 
                  onClick={() => setIsStaffModalOpen(true)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-sky-600/20"
                >
                  <UserPlus size={20} /> Thêm Staff
                </button>
              </div>

              <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Nhân viên</th>
                      <th className="px-6 py-4">Tài khoản</th>
                      <th className="px-6 py-4">Vai trò</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {staffList.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold">{s.name}</div>
                          <div className="text-slate-500 text-xs">{s.email || "No email"}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">{s.username}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${s.role === "admin" ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-500"}`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {s.role !== "admin" && (
                            <button onClick={() => deleteStaff(s.id)} className="text-red-400 hover:text-red-300 p-2">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB: MUSIC */}
          {activeTab === "music" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h1 className="text-3xl font-black mb-2">Nhạc Website</h1>
              <p className="text-slate-400 text-sm mb-8">Quản lý danh sách phát nhạc nền (Hỗ trợ link YouTube hoặc MP3)</p>
              
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
                {playlist.map((song, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        placeholder="Tên bài hát" 
                        value={song.title} 
                        onChange={(e) => {
                          const newPl = [...playlist];
                          newPl[i].title = e.target.value;
                          setPlaylist(newPl);
                        }}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 focus:border-amber-500 outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Link YouTube (vd: https://youtube.com/watch?v=...)" 
                        value={song.url} 
                        onChange={(e) => {
                          const newPl = [...playlist];
                          newPl[i].url = e.target.value;
                          setPlaylist(newPl);
                        }}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 focus:border-amber-500 outline-none text-xs"
                      />
                    </div>
                    <button onClick={() => setPlaylist(playlist.filter((_, idx) => idx !== i))} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button onClick={() => setPlaylist([...playlist, { title: "", url: "" }])} className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold flex items-center gap-2 text-sm">
                    <Plus size={16} /> Thêm bài
                  </button>
                  <button onClick={saveMusic} className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2 text-sm shadow-lg shadow-amber-600/20">
                    <Save size={16} /> Lưu Playlist
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PROFILE/PASSWORD */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
              <h1 className="text-3xl font-black mb-2">Đổi Mật Khẩu</h1>
              <p className="text-slate-400 text-sm mb-8">Bảo mật tài khoản của bạn</p>

              <form onSubmit={handleChangePassword} className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input type={showCurrentPass ? "text" : "password"} required value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none pr-10" />
                    <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Mật khẩu mới</label>
                  <div className="relative">
                    <input type={showNewPass ? "text" : "password"} required value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none pr-10" />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {passMsg.text && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passMsg.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {passMsg.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle size={16}/>} {passMsg.text}
                  </div>
                )}

                <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-600/20">
                  Cập Nhật Mật Khẩu
                </button>
              </form>
            </motion.div>
          )}

        </div>
      </main>

      {/* Editor Modal for Blog */}
      <AnimatePresence>
        {isEditorOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border shadow-2xl flex flex-col ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"}`}
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                <h2 className="text-xl font-black flex items-center gap-2"><FileText /> {editingPost.id ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới"}</h2>
                <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white">Đóng</button>
              </div>
              
              <form onSubmit={savePost} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-amber-500 font-bold flex items-center gap-2"><Globe size={16} /> Nội Dung Tiếng Việt</h3>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Tiêu đề bài viết (Vi)</label>
                      <input type="text" value={editingPost.titleVi} onChange={(e) => setEditingPost({...editingPost, titleVi: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500" required />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Mô tả ngắn (Vi)</label>
                      <textarea value={editingPost.excerptVi} onChange={(e) => setEditingPost({...editingPost, excerptVi: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 h-20 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Nội dung chi tiết (HTML - Vi)</label>
                      <textarea value={editingPost.contentVi} onChange={(e) => setEditingPost({...editingPost, contentVi: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 h-60 font-mono text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sky-500 font-bold flex items-center gap-2"><Globe size={16} /> Nội Dung Tiếng Anh</h3>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Title (En)</label>
                      <input type="text" value={editingPost.titleEn} onChange={(e) => setEditingPost({...editingPost, titleEn: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Excerpt (En)</label>
                      <textarea value={editingPost.excerptEn} onChange={(e) => setEditingPost({...editingPost, excerptEn: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 h-20 focus:outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Content (HTML - En)</label>
                      <textarea value={editingPost.contentEn} onChange={(e) => setEditingPost({...editingPost, contentEn: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 h-60 font-mono text-sm focus:outline-none focus:border-sky-500" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* SEO Section */}
                <div className="bg-amber-600/5 border border-amber-600/20 p-6 rounded-2xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-600 p-2 rounded-lg"><Search size={20} className="text-white" /></div>
                    <h3 className="text-white font-black text-xl">Cấu Hình SEO</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-amber-500 block mb-1 uppercase font-black tracking-widest">SEO Title *</label>
                      <input type="text" value={editingPost.seoTitle} onChange={(e) => setEditingPost({...editingPost, seoTitle: e.target.value})} className="w-full bg-slate-900 border border-amber-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600" required />
                    </div>
                    <div>
                      <label className="text-xs text-amber-500 block mb-1 uppercase font-black tracking-widest">SEO Description *</label>
                      <textarea value={editingPost.seoDescription} onChange={(e) => setEditingPost({...editingPost, seoDescription: e.target.value})} className="w-full bg-slate-900 border border-amber-600/30 rounded-xl px-4 py-3 text-white h-24 focus:outline-none focus:border-amber-500 placeholder:text-slate-600" required />
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Slug URL</label>
                    <input type="text" value={editingPost.slug} onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">URL Ảnh Bìa (Cover Image)</label>
                    <input type="text" placeholder="/images/blog/blog1.png" value={editingPost.seoImage} onChange={(e) => setEditingPost({...editingPost, seoImage: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 uppercase font-bold">Chuyên mục</label>
                    <select value={editingPost.category} onChange={(e) => setEditingPost({...editingPost, category: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm">
                      <option value="Solar">Solar</option>
                      <option value="Automation">Automation</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" checked={editingPost.published} onChange={(e) => setEditingPost({...editingPost, published: e.target.checked})} className="w-5 h-5 accent-amber-600" />
                    <label className="text-sm font-bold">Xuất bản bài viết</label>
                  </div>
                </div>

                <div className="pt-8 flex justify-end gap-4">
                  <button type="button" onClick={() => setIsEditorOpen(false)} className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold">Hủy</button>
                  <button type="submit" className="px-12 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black shadow-xl shadow-amber-600/30 flex items-center gap-2">
                    <Save size={20} /> LƯU BÀI VIẾT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Staff Modal */}
      <AnimatePresence>
        {isStaffModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsStaffModalOpen(false)} />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
             >
               <h2 className="text-xl font-black mb-6 flex items-center gap-2"><UserPlus/> Thêm Nhân Sự</h2>
               <form onSubmit={addStaff} className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1">Tài khoản đăng nhập</label>
                   <input required type="text" value={newStaff.username} onChange={e => setNewStaff({...newStaff, username: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1">Tên hiển thị</label>
                   <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1">Mật khẩu (mặc định: vimsolar123)</label>
                   <div className="relative">
                     <input type={showStaffPass ? "text" : "password"} value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} placeholder="vimsolar123" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-amber-500 pr-10" />
                     <button type="button" onClick={() => setShowStaffPass(!showStaffPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                       {showStaffPass ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                   </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsStaffModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-bold">Hủy</button>
                   <button type="submit" className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold">Thêm Staff</button>
                 </div>
               </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}
