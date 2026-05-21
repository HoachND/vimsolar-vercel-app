"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Widgets from "@/components/Widgets";
import { LayoutDashboard, Share2, HelpCircle, User, CreditCard, ChevronRight, Copy, CheckCircle2, DollarSign, Users, MousePointer, Wallet, LogOut, ArrowUpRight, ShieldAlert, Award, FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface AffiliateUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  ref_code: string;
  balance: number;
  bank_name: string | null;
  bank_account: string | null;
  bank_holder: string | null;
}

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  contract_value: number;
  commission_amount: number;
  created_at: string;
}

interface EarningLog {
  id: number;
  amount: number;
  status: string;
  reason: string;
  created_at: string;
}

function DaisuPortalContent() {
  const { language } = useI18n();
  const isEn = language === "en";
  const router = useRouter();

  const [user, setUser] = useState<AffiliateUser | null>(null);
  const [activeTab, setActiveTab] = useState<"tutorial" | "campaign" | "stats" | "bank" | "submit-lead" | "salekit">("stats");
  const [copied, setCopied] = useState<string | null>(null);

  // Bank form state
  const [bankForm, setBankForm] = useState({
    bankName: "",
    bankAccount: "",
    bankHolder: ""
  });
  
  // Payout state
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMsg, setPayoutMsg] = useState({ text: "", type: "" });

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "Điện mặt trời Hộ gia đình",
    systemSize: "5 - 10 kWp",
    address: "",
    notes: ""
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSubmitMsg, setLeadSubmitMsg] = useState({ text: "", type: "" });

  // Data states
  const [stats, setStats] = useState({
    clicks: 0,
    leadsCount: 0,
    balance: 0,
    totalEarned: 0,
    totalPaid: 0,
    pendingEarned: 0
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [earnings, setEarnings] = useState<EarningLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [bankMsg, setBankMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const saved = localStorage.getItem("vimsolar-admin-session");
    if (!saved) {
      router.push("/dai-su-xanh-dat");
      return;
    }
    
    try {
      const u = JSON.parse(saved);
      if (u.role !== "member" && u.role !== "admin" && u.role !== "staff") {
        router.push("/dai-su-xanh-dat");
        return;
      }
      setUser(u);
      setBankForm({
        bankName: u.bank_name || "",
        bankAccount: u.bank_account || "",
        bankHolder: u.bank_holder || ""
      });
      fetchAffiliateData(u.id);
    } catch {
      router.push("/dai-su-xanh-dat");
    }
  }, [router]);

  const fetchAffiliateData = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/affiliate?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLeads(data.leads);
        setEarnings(data.earnings);
        if (data.user) {
          setUser(data.user);
          // Sync localStorage user details
          localStorage.setItem("vimsolar-admin-session", JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.error("Error fetching affiliate data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vimsolar-admin-session");
    router.push("/dai-su-xanh-dat");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBank(true);
    setBankMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-affiliate-bank",
          userId: user?.id,
          ...bankForm
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi lưu tài khoản");
      
      setUser(data.user);
      localStorage.setItem("vimsolar-admin-session", JSON.stringify(data.user));
      setBankMsg({ text: isEn ? "Bank details updated successfully!" : "Cập nhật tài khoản ngân hàng thành công!", type: "success" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setBankMsg({ text: msg, type: "error" });
    } finally {
      setSubmittingBank(false);
    }
  };

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutMsg({ text: "", type: "" });
    const amountNum = parseFloat(payoutAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setPayoutMsg({ text: isEn ? "Invalid amount!" : "Số tiền không hợp lệ!", type: "error" });
      return;
    }

    if (amountNum > stats.balance) {
      setPayoutMsg({ text: isEn ? "Insufficient balance!" : "Số dư khả dụng không đủ!", type: "error" });
      return;
    }

    if (!user?.bank_account || !user?.bank_name) {
      setPayoutMsg({ text: isEn ? "Please update bank account first!" : "Vui lòng cập nhật thông tin ngân hàng trước!", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request-payout",
          userId: user?.id,
          amount: amountNum
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPayoutMsg({ text: isEn ? "Payout request logged successfully!" : "Gửi yêu cầu rút tiền thành công! Vui lòng đợi xét duyệt.", type: "success" });
      setPayoutAmount("");
      fetchAffiliateData(user.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setPayoutMsg({ text: msg, type: "error" });
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);
    setLeadSubmitMsg({ text: "", type: "" });

    // Validate phone number: exactly 10 digits
    if (!/^[0-9]{10}$/.test(leadForm.phone)) {
      setLeadSubmitMsg({ text: isEn ? "Phone number must be exactly 10 digits!" : "Số điện thoại phải bao gồm đúng 10 chữ số!", type: "error" });
      setSubmittingLead(false);
      return;
    }

    // Validate email if present
    if (leadForm.email && !leadForm.email.includes("@")) {
      setLeadSubmitMsg({ text: isEn ? "Email is invalid (must contain @)!" : "Email không hợp lệ (phải có ký tự @)!", type: "error" });
      setSubmittingLead(false);
      return;
    }

    try {
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit-lead-manual",
          referrerId: user?.id,
          ...leadForm
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thông tin thất bại!");

      setLeadSubmitMsg({ text: isEn ? "Lead submitted successfully!" : "Gửi thông tin khách hàng thành công! Đội ngũ kĩ sư đã được thông báo.", type: "success" });
      setLeadForm({
        name: "",
        phone: "",
        email: "",
        projectType: "Điện mặt trời Hộ gia đình",
        systemSize: "5 - 10 kWp",
        address: "",
        notes: ""
      });
      if (user) {
        fetchAffiliateData(user.id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setLeadSubmitMsg({ text: msg, type: "error" });
    } finally {
      setSubmittingLead(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400 font-bold">{isEn ? "Redirecting..." : "Đang chuyển hướng..."}</p>
      </div>
    );
  }

  const referralUrl = typeof window !== "undefined" ? `${window.location.origin}/?ref=${user.ref_code}` : `https://solar.vimgroup.vn/?ref=${user.ref_code}`;
  const landingReferralUrl = typeof window !== "undefined" ? `${window.location.origin}/dai-su-xanh-dat?ref=${user.ref_code}` : `https://solar.vimgroup.vn/dai-su-xanh-dat?ref=${user.ref_code}`;

  // Calculate dynamic tier promotion
  const completedContracts = leads.filter(l => l.status === "completed").length;
  let currentTier = "Bronze";
  let currentTierName = isEn ? "Bronze Ambassador" : "Đại Sứ Đồng";
  let currentCommRate = "2.0%";
  let nextTierName = isEn ? "Silver Ambassador" : "Đại Sứ Bạc";
  let nextTierComm = "2.2%";
  let contractsNeeded = 1 - completedContracts;
  let progressPercent = (completedContracts / 1) * 100;
  let tierColorClass = "from-amber-700 via-amber-600 to-amber-800 text-amber-100";

  if (completedContracts >= 5) {
    currentTier = "Diamond";
    currentTierName = isEn ? "Diamond Ambassador" : "Đại Sứ Kim Cương";
    currentCommRate = "3.0%";
    nextTierName = "";
    nextTierComm = "";
    contractsNeeded = 0;
    progressPercent = 100;
    tierColorClass = "from-cyan-500 via-blue-500 to-indigo-600 text-cyan-500";
  } else if (completedContracts >= 3) {
    currentTier = "Gold";
    currentTierName = isEn ? "Gold Ambassador" : "Đại Sứ Vàng";
    currentCommRate = "2.5%";
    nextTierName = isEn ? "Diamond Ambassador" : "Đại Sứ Kim Cương";
    nextTierComm = "3.0%";
    contractsNeeded = 5 - completedContracts;
    progressPercent = ((completedContracts - 3) / 2) * 100;
    tierColorClass = "from-yellow-400 via-amber-500 to-yellow-600 text-yellow-400";
  } else if (completedContracts >= 1) {
    currentTier = "Silver";
    currentTierName = isEn ? "Silver Ambassador" : "Đại Sứ Bạc";
    currentCommRate = "2.2%";
    nextTierName = isEn ? "Gold Ambassador" : "Đại Sứ Vàng";
    nextTierComm = "2.5%";
    contractsNeeded = 3 - completedContracts;
    progressPercent = ((completedContracts - 1) / 2) * 100;
    tierColorClass = "from-slate-300 via-slate-100 to-slate-400 text-slate-100";
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex-grow">
        
        {/* Header Profile Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-white/10 rounded-3xl p-6 mb-8 gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
              {isEn ? "VimSolar Ambassador" : "Đại sứ Xanh VimSolar"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">{user.name}</h1>
            <p className="text-gray-400 text-sm mt-1">Username: <span className="text-white font-mono">{user.username}</span> • Email: <span className="text-white font-mono">{user.email}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="bg-slate-950 border border-white/5 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase font-bold">{isEn ? "Referral Code" : "Mã Đại Sứ"}</span>
                <code className="text-emerald-400 font-mono font-black text-sm">{user.ref_code}</code>
              </div>
              <button 
                onClick={() => handleCopy(user.ref_code, "ref_code")}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                {copied === "ref_code" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> {isEn ? "Sign Out" : "Đăng Xuất"}
            </button>
          </div>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-slate-900 border border-white/10 rounded-3xl p-4 space-y-2">
            <button 
              onClick={() => setActiveTab("stats")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "stats" ? "bg-emerald-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <LayoutDashboard className="w-5 h-5" /> {isEn ? "Overview Stats" : "Thống Kê Tổng Quan"}
            </button>
            <button 
              onClick={() => setActiveTab("submit-lead")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "submit-lead" ? "bg-emerald-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <Users className="w-5 h-5" /> {isEn ? "Introduce Client" : "Giới Thiệu Khách Hàng"}
            </button>
            <button 
              onClick={() => setActiveTab("campaign")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "campaign" ? "bg-emerald-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <Share2 className="w-5 h-5" /> {isEn ? "Campaign Share" : "Chiến Dịch Tiếp Thị"}
            </button>
            <button 
              onClick={() => setActiveTab("salekit")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "salekit" ? "bg-emerald-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <FileText className="w-5 h-5" /> {isEn ? "Sales Kit & Training" : "Tài Liệu & Đào Tạo"}
            </button>
            <button 
              onClick={() => setActiveTab("tutorial")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "tutorial" ? "bg-emerald-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <HelpCircle className="w-5 h-5" /> {isEn ? "Get Started (Tutorial)" : "Bắt Đầu (Hướng Dẫn)"}
            </button>
            <button 
              onClick={() => setActiveTab("bank")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "bank" ? "bg-emerald-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <CreditCard className="w-5 h-5" /> {isEn ? "Payout & Bank" : "Rút Tiền & Ngân Hàng"}
            </button>
          </aside>

          {/* Right Dashboard Area */}
          <section className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="py-20 text-center text-gray-400 font-bold">
                  {isEn ? "Syncing data from Neon database..." : "Đang đồng bộ dữ liệu hệ thống..."}
                </div>
              ) : (
                <>
                  
                  {/* TAB: STATS OVERVIEW */}
                  {activeTab === "stats" && (
                    <motion.div 
                      key="tab-stats"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      {/* Cấp Bậc Đại Sứ Progress Card */}
                      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tierColorClass} flex items-center justify-center shadow-lg border border-white/20`}>
                            <Award className="w-8 h-8 text-white animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest">{isEn ? "Current Rank" : "Hạng Đại Sứ Hiện Tại"}</span>
                            <h4 className="text-xl font-black text-white">{currentTierName}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {isEn ? `Commission Rate: ` : `Tỉ lệ hoa hồng: `}
                              <span className="text-emerald-400 font-extrabold">{currentCommRate}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                          <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-400">
                              {isEn ? `${completedContracts} completed contracts` : `${completedContracts} hợp đồng bàn giao`}
                            </span>
                            <span className="text-emerald-400">
                              {currentTier === "Diamond" ? (isEn ? "Max Rank!" : "Cấp tối đa!") : `${isEn ? "Next Rank" : "Lên hạng"}: ${nextTierName} (${nextTierComm})`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-950/80 border border-white/5 rounded-full h-3 overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${
                                currentTier === "Bronze" ? "from-amber-600 to-amber-500" :
                                currentTier === "Silver" ? "from-slate-400 to-slate-200" :
                                currentTier === "Gold" ? "from-yellow-500 to-amber-400" :
                                "from-cyan-500 via-blue-500 to-emerald-400"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                            />
                          </div>
                          {currentTier !== "Diamond" && (
                            <p className="text-[10px] text-gray-500 mt-1.5 font-bold">
                              {isEn ? `💡 Complete ${contractsNeeded} more contract(s) to unlock higher commissions!` : `💡 Hoàn thành thêm ${contractsNeeded} hợp đồng nữa để nâng cấp hoa hồng lên ${nextTierComm}!`}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Grid Stats cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900 border border-white/10 p-5 rounded-3xl relative overflow-hidden">
                          <MousePointer className="absolute right-4 bottom-4 w-12 h-12 text-blue-500/10" />
                          <span className="text-xs text-gray-400 font-bold block">{isEn ? "Link Clicks" : "Số Lượt Click"}</span>
                          <span className="text-3xl font-black text-blue-400 mt-2 block">{stats.clicks}</span>
                          <p className="text-[10px] text-gray-500 mt-1">{isEn ? "Unique visitors tracked" : "Nhấp chuột định danh"}</p>
                        </div>
                        <div className="bg-slate-900 border border-white/10 p-5 rounded-3xl relative overflow-hidden">
                          <Users className="absolute right-4 bottom-4 w-12 h-12 text-teal-500/10" />
                          <span className="text-xs text-gray-400 font-bold block">{isEn ? "Referred Leads" : "Khách Hàng Đã Nhập"}</span>
                          <span className="text-3xl font-black text-teal-400 mt-2 block">{stats.leadsCount}</span>
                          <p className="text-[10px] text-gray-500 mt-1">{isEn ? "Total referral accounts" : "Khách gửi biểu mẫu"}</p>
                        </div>
                        <div className="bg-slate-900 border border-white/10 p-5 rounded-3xl relative overflow-hidden">
                          <Wallet className="absolute right-4 bottom-4 w-12 h-12 text-amber-500/10" />
                          <span className="text-xs text-gray-400 font-bold block">{isEn ? "Available Balance" : "Số Dư Khả Dụng"}</span>
                          <span className="text-3xl font-black text-amber-400 mt-2 block">{stats.balance.toLocaleString("vi-VN")} đ</span>
                          <p className="text-[10px] text-gray-500 mt-1">{isEn ? "Cleared payouts" : "Hoa hồng rút được ngay"}</p>
                        </div>
                        <div className="bg-slate-900 border border-white/10 p-5 rounded-3xl relative overflow-hidden">
                          <DollarSign className="absolute right-4 bottom-4 w-12 h-12 text-emerald-500/10" />
                          <span className="text-xs text-gray-400 font-bold block">{isEn ? "Total Approved" : "Tổng Hoa Hồng Duyệt"}</span>
                          <span className="text-3xl font-black text-emerald-400 mt-2 block">{stats.totalEarned.toLocaleString("vi-VN")} đ</span>
                          <p className="text-[10px] text-gray-500 mt-1">{isEn ? "Includes paid earnings" : "Mức thực nhận (trước TNCN)"}</p>
                        </div>
                      </div>

                      {/* Referred Customers table */}
                      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-lg font-black mb-4">{isEn ? "Referred Client Pipeline" : "Tiến Độ Dự Án Khách Giới Thiệu"}</h3>
                        
                        {leads.length === 0 ? (
                          <p className="text-sm text-gray-500 py-6 text-center">{isEn ? "No leads referred yet. Get started in Campaign Share!" : "Chưa có khách hàng được giới thiệu. Hãy lấy link ở mục Chiến Dịch để chia sẻ!"}</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                              <thead>
                                <tr className="border-b border-white/5 pb-2 text-gray-500 uppercase font-black tracking-wider">
                                  <th className="py-2">{isEn ? "Client Name" : "Khách Hàng"}</th>
                                  <th className="py-2">{isEn ? "Created Date" : "Ngày Giới Thiệu"}</th>
                                  <th className="py-2">{isEn ? "Status" : "Trạng Thái"}</th>
                                  <th className="py-2 text-right">{isEn ? "Contract Value" : "Giá Trị Hợp Đồng"}</th>
                                  <th className="py-2 text-right">{isEn ? "2% Commission" : "Hoa Hồng 2%"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {leads.map((l) => (
                                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3.5 font-bold">
                                      {l.name}
                                      <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{l.phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}</span>
                                    </td>
                                    <td className="py-3.5 text-gray-400 font-mono">{new Date(l.created_at).toLocaleDateString("vi-VN")}</td>
                                    <td className="py-3.5">
                                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        l.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                        l.status === "contract" ? "bg-indigo-500/10 text-indigo-400" :
                                        l.status === "survey" ? "bg-blue-500/10 text-blue-400" :
                                        l.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                                        "bg-amber-500/10 text-amber-400"
                                      }`}>
                                        {l.status === "completed" ? (isEn ? "Completed" : "Bàn Giao") :
                                         l.status === "contract" ? (isEn ? "Contract" : "Ký Hợp Đồng") :
                                         l.status === "survey" ? (isEn ? "Surveying" : "Khảo Sát") :
                                         l.status === "cancelled" ? (isEn ? "Cancelled" : "Hủy Báo Giá") :
                                         (isEn ? "Pending" : "Chờ Xử Lý")}
                                      </span>
                                    </td>
                                    <td className="py-3.5 text-right font-bold text-slate-100">{l.contract_value > 0 ? `${l.contract_value.toLocaleString("vi-VN")} đ` : "Chờ khảo sát"}</td>
                                    <td className="py-3.5 text-right font-black text-emerald-400">{l.commission_amount > 0 ? `${l.commission_amount.toLocaleString("vi-VN")} đ` : "Chờ thanh toán"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: SUBMIT LEAD (TỰ NHẬP KHÁCH HÀNG) */}
                  {activeTab === "submit-lead" && (
                    <motion.div 
                      key="tab-submit-lead"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-100">{isEn ? "Introduce New Client" : "Tự Nhập & Giới Thiệu Khách Hàng"}</h3>
                            <p className="text-gray-400 text-sm mt-1">{isEn ? "Manually submit potential customers. They will be directly linked to your referral code." : "Điền thông tin khách hàng tiềm năng. Hệ thống tự động ghi nhận hoa hồng theo mã đại sứ của bạn."}</p>
                          </div>
                        </div>

                        {leadSubmitMsg.text && (
                          <div className={`p-4 mb-6 text-sm font-semibold rounded-xl border ${leadSubmitMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                            {leadSubmitMsg.text}
                          </div>
                        )}

                        <form onSubmit={handleLeadSubmit} className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Client Name *" : "Họ và Tên Khách Hàng *"}</label>
                              <input 
                                type="text" 
                                value={leadForm.name} 
                                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                placeholder="Nguyễn Văn A"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Phone Number (10 digits) *" : "Số Điện Thoại (10 số) *"}</label>
                              <input 
                                type="tel" 
                                value={leadForm.phone} 
                                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                placeholder="09xxxxxxx"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Email Address" : "Địa Chỉ Email"}</label>
                              <input 
                                type="email" 
                                value={leadForm.email} 
                                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                placeholder="email@domain.com"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Installation Address" : "Địa Chỉ Lắp Đặt"}</label>
                              <input 
                                type="text" 
                                value={leadForm.address} 
                                onChange={(e) => setLeadForm({ ...leadForm, address: e.target.value })}
                                placeholder="Quận 7, TP. HCM"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Project Type" : "Loại Công Trình Lắp Đặt"}</label>
                              <select 
                                value={leadForm.projectType}
                                onChange={(e) => setLeadForm({ ...leadForm, projectType: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white appearance-none"
                              >
                                <option value="Điện mặt trời Hộ gia đình">Điện mặt trời Hộ gia đình (Biệt thự/Nhà phố)</option>
                                <option value="Điện mặt trời Bám tải B2B">Điện mặt trời Bám tải Doanh Nghiệp (Nhà xưởng)</option>
                                <option value="Hệ thống Bơm năng lượng">Hệ thống Bơm nước NLMT (Nông nghiệp)</option>
                                <option value="Hệ thống lưu trữ ESS">Hệ thống lưu trữ công nghiệp (ESS)</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Estimated System Size" : "Công Suất Dự Kiến"}</label>
                              <select 
                                value={leadForm.systemSize}
                                onChange={(e) => setLeadForm({ ...leadForm, systemSize: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white appearance-none"
                              >
                                <option value="Dưới 5 kWp">Dưới 5 kWp (Khoảng 60tr - 80tr)</option>
                                <option value="5 - 10 kWp">Từ 5 - 10 kWp (Khoảng 100tr - 200tr)</option>
                                <option value="10 - 50 kWp">Từ 10 - 50 kWp (Dự án nhỏ)</option>
                                <option value="Trên 50 kWp">Trên 50 kWp (Dự án doanh nghiệp)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Additional Notes" : "Ghi Chú Thêm Dành Cho Kỹ Sư"}</label>
                            <textarea 
                              value={leadForm.notes} 
                              onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                              placeholder={isEn ? "Client requirements, roof condition..." : "Khách hàng cần tư vấn khung giờ nào, nhà mái ngói hay mái tôn..."}
                              rows={3}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submittingLead}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                          >
                            {submittingLead ? (isEn ? "Submitting..." : "Đang Gửi Dữ Liệu...") : (isEn ? "Submit Client Lead" : "Xác Nhận Giới Thiệu Khách Hàng")} <ArrowUpRight className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: SALES KIT & TRAINING */}
                  {activeTab === "salekit" && (
                    <motion.div 
                      key="tab-salekit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8">
                        <h3 className="text-xl font-black text-slate-100 mb-2">{isEn ? "Sales Kit & Product Brochures" : "Kho Tài Liệu Kỹ Thuật & Đào Tạo Bán Hàng"}</h3>
                        <p className="text-gray-400 text-sm mb-8">{isEn ? "Download catalog and specs to confidently present VimSolar top-tier products to your clients." : "Tải xuống các tài liệu chuẩn (Specs, Brochure, Quy chế) để trình bày và tư vấn chuyên nghiệp nhất với khách hàng."}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Catalogue Pin LESSO N-Type</h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">PDF • 3.2 MB • Tier 1 Solar Panels</p>
                              </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="bg-slate-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Datasheet Deye Hybrid Inverter</h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">PDF • 1.8 MB • Sun-5/8/12K-SG04</p>
                              </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="bg-slate-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Specs Pin Lưu Trữ POWERBOX</h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">PDF • 2.5 MB • Pro Max 10.24kWh</p>
                              </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="bg-slate-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                <Award className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Sổ Tay Quy Chế Đại Sứ VimSolar</h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">PDF • 4.1 MB • Cập nhật 2026</p>
                              </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all mr-2">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB: CAMPAIGN SHARING */}
                  {activeTab === "campaign" && (
                    <motion.div 
                      key="tab-campaign"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-lg font-black mb-2">{isEn ? "Your Affiliate Referrals" : "Link Định Danh Đại Sứ Xanh"}</h3>
                        <p className="text-gray-400 text-sm mb-6">{isEn ? "Use these custom URLs to refer visitors. When they submit a form, they will automatically sync to your dashboard." : "Chia sẻ các đường dẫn đặc biệt dưới đây lên Facebook, Zalo, hoặc gửi trực tiếp cho bạn bè. Khách hàng nhấp chuột và gửi thông tin sẽ tự động ghi nhận dưới mã đại sứ của bạn."}</p>
                        
                        <div className="space-y-6">
                          <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl">
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Home Page Link" : "Đường dẫn trang chủ VimSolar"}</label>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-emerald-400 font-mono select-all truncate">{referralUrl}</code>
                              <button 
                                onClick={() => handleCopy(referralUrl, "link_home")}
                                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                              >
                                {copied === "link_home" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied === "link_home" ? (isEn ? "Copied" : "Đã Copy") : (isEn ? "Copy" : "Copy Link")}
                              </button>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl">
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1.5">{isEn ? "Ambassador Campaign Landing Page" : "Đường dẫn Landing Page Đại Sứ Xanh"}</label>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-emerald-400 font-mono select-all truncate">{landingReferralUrl}</code>
                              <button 
                                onClick={() => handleCopy(landingReferralUrl, "link_landing")}
                                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                              >
                                {copied === "link_landing" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied === "link_landing" ? (isEn ? "Copied" : "Đã Copy") : (isEn ? "Copy" : "Copy Link")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Marketing resources */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between group">
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full">Banner 1200x630</span>
                            <h4 className="text-base font-extrabold text-slate-100 mt-3">{isEn ? "Rooftop Solar For Houses" : "Báo giá điện mặt trời Hộ gia đình 2026"}</h4>
                            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{isEn ? "Clean lifestyle, ESG contribution, reduce up to 90% monthly bill. Tier-1 equipment warranty 30 years." : "Phong cách sống xanh, lắp đặt trọn gói thiết bị Tier-1 pin LESSO và inverter Deye, bảo hành hiệu suất 30 năm."}</p>
                          </div>
                          <button 
                            onClick={() => handleCopy(`Điện mặt trời hộ gia đình trọn gói VimSolar - Tiết kiệm 90% chi phí điện lưới, bảo hành 30 năm. Đăng ký nhận khảo sát 3D miễn phí: ${referralUrl}`, "banner_house")}
                            className="w-full mt-6 bg-white/5 border border-white/10 hover:border-emerald-500/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                          >
                            {copied === "banner_house" ? "✅ Đã copy mẫu bài viết" : "📋 Lấy mẫu bài viết & Link"}
                          </button>
                        </div>

                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between group">
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full">Banner 1200x630</span>
                            <h4 className="text-base font-extrabold text-slate-100 mt-3">{isEn ? "Factory EPC Net-Zero" : "Giải pháp ESG / Net-Zero cho doanh nghiệp"}</h4>
                            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{isEn ? "Unlock industrial rooftop savings, create green credits, comply with environmental export quotas." : "Biến mái nhà xưởng thành tài sản sinh lời, giảm áp lực giá điện sản xuất, đạt chuẩn xuất khẩu xanh châu Âu."}</p>
                          </div>
                          <button 
                            onClick={() => handleCopy(`Doanh nghiệp đạt chứng nhận ESG và tiết kiệm hàng trăm triệu tiền điện với hệ thống điện mặt trời áp mái VimSolar trọn gói EPC. Đăng ký tại: ${referralUrl}`, "banner_factory")}
                            className="w-full mt-6 bg-white/5 border border-white/10 hover:border-emerald-500/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                          >
                            {copied === "banner_factory" ? "✅ Đã copy mẫu bài viết" : "📋 Lấy mẫu bài viết & Link"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: TUTORIAL */}
                  {activeTab === "tutorial" && (
                    <motion.div 
                      key="tab-tutorial"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6"
                    >
                      <h3 className="text-xl font-black text-slate-100">{isEn ? "Ambassador Action Steps" : "Cẩm Nang Hành Trình Đại Sứ Xanh"}</h3>
                      
                      <div className="space-y-6 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-emerald-500/20">
                        <div className="flex gap-4 relative">
                          <span className="flex-shrink-0 w-7.5 h-7.5 bg-emerald-500 text-slate-950 font-black rounded-full text-xs flex items-center justify-center relative z-10">1</span>
                          <div>
                            <h4 className="font-extrabold text-slate-100 text-sm">{isEn ? "Log in & Select Campaigns" : "Nhận Mã Đại Sứ & Tạo Link"}</h4>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{isEn ? "Access Clicks/Leads summary cards on your dashboard and grab your unique identity URL ref." : "Mỗi Đại sứ có một mã định danh duy nhất (Ví dụ của bạn: VSXXXX). Khi khách hàng truy cập qua link của bạn, trình duyệt sẽ lưu cookie theo dõi trong 30 ngày."}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 relative">
                          <span className="flex-shrink-0 w-7.5 h-7.5 bg-emerald-500 text-slate-950 font-black rounded-full text-xs flex items-center justify-center relative z-10">2</span>
                          <div>
                            <h4 className="font-extrabold text-slate-100 text-sm">{isEn ? "Introduce Referred Customers" : "Giới Thiệu Đa Kênh (Affiliate)"}</h4>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{isEn ? "Send link to property owners, villa communities, or post ESG articles inside building group chats." : "Đăng bài viết chia sẻ về giải pháp năng lượng sạch kèm link đại sứ của bạn lên Facebook cá nhân, các hội nhóm cư dân biệt thự Ecopark, Ocean Park, hoặc Zalo để tìm kiếm khách hàng tiềm năng."}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 relative">
                          <span className="flex-shrink-0 w-7.5 h-7.5 bg-emerald-500 text-slate-950 font-black rounded-full text-xs flex items-center justify-center relative z-10">3</span>
                          <div>
                            <h4 className="font-extrabold text-slate-100 text-sm">{isEn ? "Conduct Survey & Audit Payouts" : "VimSolar Tư Vấn & Thi Công Trọn Gói"}</h4>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{isEn ? "Engineers conduct 3D designs, coordinate contracts, and payout 2% commission upon grid activation." : "Đội ngũ kỹ sư VimSolar sẽ liên hệ khách hàng ngay lập tức để tư vấn thiết kế 3D, khảo sát kết cấu kỹ thuật và ký kết hợp đồng thi công. Trạng thái dự án sẽ tự động cập nhật ngay trên Cổng Đại Sứ của bạn."}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 relative">
                          <span className="flex-shrink-0 w-7.5 h-7.5 bg-emerald-500 text-slate-950 font-black rounded-full text-xs flex items-center justify-center relative z-10">4</span>
                          <div>
                            <h4 className="font-extrabold text-slate-100 text-sm">{isEn ? "Withdraw Commissions to Bank Account" : "Hoa Hồng Đối Soát & Giải Ngân"}</h4>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{isEn ? "Update your bank profile, click 'Request Payout' and get cash transfers directly to your bank account." : "Khi hợp đồng hoàn thành lắp đặt điện lưới và nghiệm thu EVN, hoa hồng 2% sẽ cộng vào Số Dư Khả Dụng. Bạn có thể yêu cầu rút tiền về ngân hàng của mình bất kỳ lúc nào."}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: BANK & PAYOUT */}
                  {activeTab === "bank" && (
                    <motion.div 
                      key="tab-bank"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bank account updates */}
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
                          <h3 className="text-lg font-black text-slate-100">{isEn ? "Bank Account Details" : "Tài Khoản Nhận Hoa Hồng"}</h3>
                          <p className="text-gray-400 text-xs">{isEn ? "Provide your bank details to facilitate direct wire transfers. Make sure name aligns with owner profile." : "Vui lòng cung cấp chính xác thông tin tài khoản ngân hàng chính chủ của bạn để hệ thống thực hiện chuyển khoản tự động."}</p>

                          {bankMsg.text && (
                            <div className={`p-3 text-xs font-semibold rounded-xl border ${bankMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                              {bankMsg.text}
                            </div>
                          )}

                          <form onSubmit={handleBankSubmit} className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1">{isEn ? "Bank Name *" : "Tên Ngân Hàng *"}</label>
                              <input 
                                type="text" 
                                value={bankForm.bankName} 
                                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                                placeholder="e.g. Vietcombank, Techcombank..."
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1">{isEn ? "Account Number *" : "Số Tài Khoản *"}</label>
                              <input 
                                type="text" 
                                value={bankForm.bankAccount} 
                                onChange={(e) => setBankForm({ ...bankForm, bankAccount: e.target.value })}
                                placeholder="1902xxxxxxxxx"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-bold uppercase block mb-1">{isEn ? "Account Holder Name *" : "Họ Tên Chủ Tài Khoản *"}</label>
                              <input 
                                type="text" 
                                value={bankForm.bankHolder} 
                                onChange={(e) => setBankForm({ ...bankForm, bankHolder: e.target.value.toUpperCase() })}
                                placeholder="NGUYEN VAN A"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white font-bold uppercase"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={submittingBank}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-sm transition-all"
                            >
                              {submittingBank ? (isEn ? "Saving..." : "Đang lưu...") : (isEn ? "Save Bank Profile" : "Cập Nhật Tài Khoản")}
                            </button>
                          </form>
                        </div>

                        {/* Payout requests */}
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <h3 className="text-lg font-black text-slate-100">{isEn ? "Request Commission Withdrawal" : "Yêu Cầu Rút Tiền"}</h3>
                            <p className="text-gray-400 text-xs">{isEn ? "Withdraw your active available balance directly to your wire account." : "Chuyển đổi số dư tích lũy khả dụng về tài khoản ngân hàng đã thiết lập."}</p>

                            <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-gray-500 block uppercase font-bold">{isEn ? "Available Balance" : "Số Dư Khả Dụng"}</span>
                                <span className="text-2xl font-black text-amber-400">{stats.balance.toLocaleString("vi-VN")} đ</span>
                              </div>
                              <Wallet className="w-10 h-10 text-amber-400/20" />
                            </div>

                            {payoutMsg.text && (
                              <div className={`p-3 text-xs font-semibold rounded-xl border ${payoutMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                                {payoutMsg.text}
                              </div>
                            )}

                            <form onSubmit={handlePayoutRequest} className="space-y-4">
                              <div>
                                <label className="text-xs text-gray-500 font-bold uppercase block mb-1">{isEn ? "Withdrawal Amount (đ) *" : "Số Tiền Muốn Rút (đ) *"}</label>
                                <input 
                                  type="number" 
                                  value={payoutAmount} 
                                  onChange={(e) => setPayoutAmount(e.target.value)}
                                  placeholder={isEn ? "e.g. 2000000" : "Ví dụ: 2000000"}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono"
                                  required
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                              >
                                {isEn ? "Request Payout" : "Yêu Cầu Giải Ngân"} <ArrowUpRight className="w-4 h-4" />
                              </button>
                            </form>
                          </div>

                          {/* Audit warning info */}
                          <div className="mt-6 flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-400 leading-relaxed">{isEn ? "Note: Withdrawals must conform with PIT tax regulations (10% automatically deducted for single amounts over 2M). Funds are cleared in 24 hours." : "Lưu ý: Mức rút tối thiểu là 200,000đ. Các khoản thanh toán trên 2,000,000đ sẽ tự động trích nộp 10% thuế Thu Nhập Cá Nhân (TNCN) theo quy định của Pháp luật."}</p>
                          </div>
                        </div>
                      </div>

                      {/* Transactions History Table */}
                      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-lg font-black mb-4">{isEn ? "Payout Transactions" : "Lịch Sử Giao Dịch Rút Tiền"}</h3>
                        
                        {earnings.filter((e) => e.amount < 0).length === 0 ? (
                          <p className="text-sm text-gray-500 py-6 text-center">{isEn ? "No withdrawal requests yet." : "Chưa có yêu cầu rút tiền nào."}</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                              <thead>
                                <tr className="border-b border-white/5 pb-2 text-gray-500 uppercase font-black tracking-wider">
                                  <th className="py-2">{isEn ? "Transaction ID" : "Mã GD"}</th>
                                  <th className="py-2">{isEn ? "Date" : "Thời Gian"}</th>
                                  <th className="py-2 text-right">{isEn ? "Amount" : "Số Tiền Trừ"}</th>
                                  <th className="py-2">{isEn ? "Bank Info" : "Thông Tin Nhận"}</th>
                                  <th className="py-2">{isEn ? "Status" : "Trạng Thái"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {earnings.filter((e) => e.amount < 0).map((e) => (
                                  <tr key={e.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3.5 font-bold font-mono">#{e.id.toString().padStart(5, '0')}</td>
                                    <td className="py-3.5 text-gray-400 font-mono">{new Date(e.created_at).toLocaleString("vi-VN")}</td>
                                    <td className="py-3.5 text-right font-black text-amber-400">{Math.abs(e.amount).toLocaleString("vi-VN")} đ</td>
                                    <td className="py-3.5">
                                      {user.bank_name && user.bank_account ? (
                                        <>
                                          <span className="block font-bold">{user.bank_name}</span>
                                          <span className="block text-[10px] text-gray-500">{user.bank_account} - {user.bank_holder}</span>
                                        </>
                                      ) : (
                                        <span className="text-gray-500">-</span>
                                      )}
                                    </td>
                                    <td className="py-3.5">
                                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        e.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                                        e.status === "rejected" ? "bg-red-500/10 text-red-400" :
                                        "bg-amber-500/10 text-amber-400"
                                      }`}>
                                        {e.status === "paid" ? (isEn ? "Success" : "Thành Công") :
                                         e.status === "rejected" ? (isEn ? "Rejected" : "Từ Chối") :
                                         (isEn ? "Pending" : "Chờ Duyệt")}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                </>
              )}
            </AnimatePresence>
          </section>

        </div>
      </main>

      <Footer />
      <Widgets />
    </div>
  );
}

export default function DaisuPortal() {
  return (
    <I18nProvider>
      <DaisuPortalContent />
    </I18nProvider>
  );
}
