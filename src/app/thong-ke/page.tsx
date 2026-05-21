"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Widgets from "@/components/Widgets";
import { LayoutDashboard, FileText, Settings, User, LogOut, CheckCircle2, Phone, MapPin, Building, Calendar, Info, ShieldAlert, Award, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface PartnerProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  business_name: string;
  city: string;
  commune: string | null;
  experience: string;
  address: string | null;
  registration_status: string;
}

interface ProjectLead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  notes: string | null;
  contract_value: number;
  created_at: string;
}

function ThongKeContent() {
  const { language } = useI18n();
  const isEn = language === "en";
  const router = useRouter();

  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [leads, setLeads] = useState<ProjectLead[]>([]);
  const [activeTab, setActiveTab] = useState<"pipeline" | "projects" | "profile">("pipeline");
  const [loading, setLoading] = useState(true);

  // Status update states
  const [selectedLead, setSelectedLead] = useState<ProjectLead | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("vimsolar-admin-session");
    if (!saved) {
      router.push("/doi-tac-lap-dat");
      return;
    }

    try {
      const u = JSON.parse(saved);
      if (u.role !== "partner" && u.role !== "admin" && u.role !== "staff") {
        router.push("/doi-tac-lap-dat");
        return;
      }
      fetchPartnerData(u.id);
    } catch {
      router.push("/doi-tac-lap-dat");
    }
  }, [router]);

  const fetchPartnerData = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/partner?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setPartner(data.partner);
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Error fetching partner data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vimsolar-admin-session");
    router.push("/doi-tac-lap-dat");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setUpdating(true);
    setUpdateMsg("");

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          status: updateStatus,
          notes: updateNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUpdateMsg(isEn ? "Updated successfully!" : "Cập nhật tiến độ thành công!");
      setSelectedLead(null);
      fetchPartnerData(partner!.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setUpdateMsg(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400 font-bold">{isEn ? "Redirecting..." : "Đang chuyển hướng..."}</p>
      </div>
    );
  }

  // Filter leads based on pipeline columns
  const pipelineSurvey = leads.filter(l => l.status === "pending" || l.status === "survey");
  const pipelineQuote = leads.filter(l => l.status === "survey" && l.contract_value > 0);
  const pipelineContract = leads.filter(l => l.status === "contract");
  const pipelineComplete = leads.filter(l => l.status === "completed");

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex-grow">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-white/10 rounded-3xl p-6 mb-8 gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full">
              🏢 {isEn ? "VimSolar Installer" : "Đại Lý Lắp Đặt VimSolar"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">{partner.business_name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isEn ? "Rep: " : "Người đại diện: "} <span className="text-white font-bold">{partner.name}</span> • 
              {isEn ? " Province: " : " Tỉnh hoạt động: "} <span className="text-amber-400 font-bold">{partner.city}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="bg-slate-950 border border-white/5 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase font-bold">{isEn ? "Portal Status" : "Trạng Thái Cổng"}</span>
                <span className={`text-xs font-black uppercase ${partner.registration_status === "approved" ? "text-emerald-400" : "text-amber-400"}`}>
                  {partner.registration_status === "approved" ? (isEn ? "Active" : "Đã kích hoạt") : (isEn ? "Pending Approval" : "Đang Xét Duyệt")}
                </span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> {isEn ? "Sign Out" : "Đăng Xuất"}
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-slate-900 border border-white/10 rounded-3xl p-4 space-y-2">
            <button 
              onClick={() => setActiveTab("pipeline")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "pipeline" ? "bg-amber-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <LayoutDashboard className="w-5 h-5" /> {isEn ? "Operations Pipeline" : "Bảng Vận Hành EPC"}
            </button>
            <button 
              onClick={() => setActiveTab("projects")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "projects" ? "bg-amber-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <FileText className="w-5 h-5" /> {isEn ? "Survey & Install Leads" : "Danh Sách Dự Án"}
            </button>
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === "profile" ? "bg-amber-500 text-slate-950" : "hover:bg-white/5 text-gray-400"}`}
            >
              <User className="w-5 h-5" /> {isEn ? "Agency Profile" : "Hồ Sơ Doanh Nghiệp"}
            </button>
          </aside>

          {/* Right Area */}
          <section className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="py-20 text-center text-gray-400 font-bold">
                  {isEn ? "Connecting to database..." : "Đang tải dữ liệu vận hành..."}
                </div>
              ) : (
                <>
                  
                  {/* TAB: PIPELINE */}
                  {activeTab === "pipeline" && (
                    <motion.div 
                      key="tab-pipeline"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {partner.registration_status !== "approved" && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 flex items-start gap-4">
                          <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-extrabold text-slate-100 text-sm">{isEn ? "Pending Operational Approval" : "Tài Khoản Đang Đợi Xét Duyệt"}</h4>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                              {isEn 
                                ? "Your registration is under verification. Some active leads and operations details are hidden. We will active your account soon."
                                : "Hồ sơ năng lực của quý doanh nghiệp đang được phòng phát triển thị trường VimSolar thẩm định. Một số tính năng nhận lead hoạt động tạm thời bị ẩn cho tới khi kích hoạt chính thức."}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* KanBan Operations Pipeline */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <div className="bg-slate-900 border border-white/5 rounded-3xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">{isEn ? "Survey" : "1. Khảo Sát"}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{pipelineSurvey.length}</span>
                          </div>
                          <div className="space-y-2">
                            {pipelineSurvey.map((l) => (
                              <div key={l.id} onClick={() => setSelectedLead(l)} className="p-3 bg-slate-950 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all cursor-pointer">
                                <h4 className="font-extrabold text-xs text-slate-200">{l.name}</h4>
                                <span className="text-[9px] text-gray-500 font-mono block mt-1">{new Date(l.created_at).toLocaleDateString("vi-VN")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-white/5 rounded-3xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-black text-blue-400 uppercase tracking-wider">{isEn ? "Quote" : "2. Báo Giá"}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{pipelineQuote.length}</span>
                          </div>
                          <div className="space-y-2">
                            {pipelineQuote.map((l) => (
                              <div key={l.id} onClick={() => setSelectedLead(l)} className="p-3 bg-slate-950 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer">
                                <h4 className="font-extrabold text-xs text-slate-200">{l.name}</h4>
                                <span className="text-[9px] text-emerald-400 font-bold block mt-1">{l.contract_value.toLocaleString("vi-VN")} đ</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-white/5 rounded-3xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">{isEn ? "Contract" : "3. Ký Hợp Đồng"}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{pipelineContract.length}</span>
                          </div>
                          <div className="space-y-2">
                            {pipelineContract.map((l) => (
                              <div key={l.id} onClick={() => setSelectedLead(l)} className="p-3 bg-slate-950 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer">
                                <h4 className="font-extrabold text-xs text-slate-200">{l.name}</h4>
                                <span className="text-[9px] text-gray-500 font-mono block mt-1">{new Date(l.created_at).toLocaleDateString("vi-VN")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-white/5 rounded-3xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">{isEn ? "Completed" : "4. Hoàn Thành"}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{pipelineComplete.length}</span>
                          </div>
                          <div className="space-y-2">
                            {pipelineComplete.map((l) => (
                              <div key={l.id} onClick={() => setSelectedLead(l)} className="p-3 bg-slate-950 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer">
                                <h4 className="font-extrabold text-xs text-slate-200">{l.name}</h4>
                                <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ Đã bàn giao</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB: PROJECT LIST */}
                  {activeTab === "projects" && (
                    <motion.div 
                      key="tab-projects"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-900 border border-white/10 rounded-3xl p-6"
                    >
                      <h3 className="text-lg font-black mb-4">{isEn ? "Active Projects Tracker" : "Danh Sách Dự Án Đang Lắp Đặt"}</h3>
                      
                      {leads.length === 0 ? (
                        <p className="text-xs text-gray-500 py-6 text-center">{isEn ? "No active projects available in your province." : "Hiện chưa có dự án phân phối tại khu vực hoạt động của quý đại lý."}</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead>
                              <tr className="border-b border-white/5 pb-2 text-gray-500 uppercase font-black">
                                <th className="py-2">{isEn ? "Client Name" : "Khách Hàng"}</th>
                                <th className="py-2">{isEn ? "Phone" : "Điện Thoại"}</th>
                                <th className="py-2">{isEn ? "Status" : "Tiến Độ"}</th>
                                <th className="py-2">{isEn ? "Current Notes" : "Ghi Chú Vận Hành"}</th>
                                <th className="py-2 text-right">{isEn ? "Actions" : "Hành Động"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {leads.map((l) => (
                                <tr key={l.id} className="hover:bg-white/5 transition-colors">
                                  <td className="py-3.5 font-bold">{l.name}</td>
                                  <td className="py-3.5 font-mono text-gray-400">{partner.registration_status === "approved" ? l.phone : l.phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}</td>
                                  <td className="py-3.5">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      l.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                      l.status === "contract" ? "bg-indigo-500/10 text-indigo-400" :
                                      l.status === "survey" ? "bg-blue-500/10 text-blue-400" :
                                      l.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                                      "bg-amber-500/10 text-amber-400"
                                    }`}>
                                      {l.status === "completed" ? (isEn ? "Handover" : "Bàn giao") :
                                       l.status === "contract" ? (isEn ? "Contract" : "Ký Hợp Đồng") :
                                       l.status === "survey" ? (isEn ? "Surveying" : "Khảo Sát") :
                                       l.status === "cancelled" ? (isEn ? "Cancelled" : "Hủy Báo Giá") :
                                       (isEn ? "Pending" : "Chờ Xử Lý")}
                                    </span>
                                  </td>
                                  <td className="py-3.5 text-gray-400 truncate max-w-[150px]">{l.notes || (isEn ? "None" : "Không có")}</td>
                                  <td className="py-3.5 text-right">
                                    <button 
                                      onClick={() => {
                                        setSelectedLead(l);
                                        setUpdateStatus(l.status);
                                        setUpdateNotes(l.notes || "");
                                      }}
                                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] transition-colors"
                                    >
                                      {isEn ? "Update Status" : "Cập Nhật"}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB: PROFILE */}
                  {activeTab === "profile" && (
                    <motion.div 
                      key="tab-profile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6"
                    >
                      <h3 className="text-xl font-black text-slate-100">{isEn ? "Authorized Agency Credentials" : "Hồ Sơ Năng Lực Ủy Quyền"}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block">{isEn ? "Business Name" : "Tên Tổ Chức"}</span>
                            <span className="text-base font-extrabold text-slate-200 mt-1 block">{partner.business_name}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block">{isEn ? "Technical Representative" : "Kỹ Sư Đại Diện"}</span>
                            <span className="text-base font-extrabold text-slate-200 mt-1 block">{partner.name}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block">{isEn ? "Primary Phone" : "Điện Thoại"}</span>
                            <span className="text-base font-extrabold text-slate-200 mt-1 block font-mono">{partner.phone}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block">{isEn ? "Operational Region (City/Province)" : "Khu Vực Phân Phối"}</span>
                            <span className="text-base font-extrabold text-slate-200 mt-1 block">{partner.city}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block">{isEn ? "Rooftop Solar Experience" : "Năng Lực Lắp Đặt"}</span>
                            <span className="text-base font-extrabold text-slate-200 mt-1 block">{partner.experience}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block">{isEn ? "Detailed Address" : "Địa Chỉ Chi Tiết"}</span>
                            <span className="text-base font-extrabold text-slate-200 mt-1 block">{partner.address || (isEn ? "Not set" : "Chưa cấu hình")}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </>
              )}
            </AnimatePresence>
          </section>

        </div>
      </main>

      {/* UPDATE STATUS MODAL */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-6 sm:p-8 relative z-10"
            >
              <h3 className="text-lg font-black text-slate-100 mb-2">{isEn ? "Update Project Status" : "Cập Nhật Tiến Độ Dự Án"}</h3>
              <p className="text-gray-400 text-xs mb-4">Khách hàng: <span className="text-white font-bold">{selectedLead.name}</span></p>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">{isEn ? "Status *" : "Trạng Thái Tiến Độ *"}</label>
                  <select 
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 text-white"
                    required
                  >
                    <option value="pending">{isEn ? "Pending" : "Chờ xử lý"}</option>
                    <option value="survey">{isEn ? "Surveying" : "Đang khảo sát kỹ thuật"}</option>
                    <option value="contract">{isEn ? "Contract Sign" : "Đã ký hợp đồng thi công"}</option>
                    <option value="completed">{isEn ? "Handover Completed" : "Đã thi công & nghiệm thu EVN"}</option>
                    <option value="cancelled">{isEn ? "Cancelled" : "Hủy báo giá"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">{isEn ? "Operational Notes" : "Ghi Chú Vận Hành / Kết Quả Khảo Sát"}</label>
                  <textarea 
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    placeholder={isEn ? "Structure: slate tiles, spacing 10m, inverter position..." : "Ví dụ: Mái ngói, hướng Nam, diện tích lắp đặt 40m2, khoảng cách 10m..."}
                    rows={4}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 text-white font-sans"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="w-1/3 bg-white/5 hover:bg-white/10 border border-white/10 font-bold py-3 rounded-xl text-xs transition-all"
                  >
                    {isEn ? "Cancel" : "Hủy"}
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    {updating ? (isEn ? "Updating..." : "Đang lưu...") : (isEn ? "Save Progress" : "Lưu Trạng Thái")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <Widgets />
    </div>
  );
}

export default function ThongKePage() {
  return (
    <I18nProvider>
      <ThongKeContent />
    </I18nProvider>
  );
}
