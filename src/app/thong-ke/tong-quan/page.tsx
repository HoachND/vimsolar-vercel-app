"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

export default function TongQuanThongKePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("vimsolar-admin-session");
    if (!saved) {
      router.push("/doi-tac-lap-dat");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  const stats = [
    { title: "Tổng hợp đồng", value: "12", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Đang thi công", value: "3", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Đã hoàn thành", value: "8", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Khách hàng mới", value: "24", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan thống kê</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} dark:bg-opacity-10 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{stat.title}</p>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm min-h-[300px] transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">Hoạt động gần đây</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Hợp đồng HĐ-2026-001 đã được ký</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">10 phút trước</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Chờ xác nhận khảo sát dự án SunPro 5kWp</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Hoàn tất thanh toán đợt 1 hợp đồng HĐ-2026-003</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 giờ trước</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm min-h-[300px] transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">Tiến độ thi công</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium dark:text-gray-200">Dự án Nguyễn Văn A - 10kWp</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">75%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium dark:text-gray-200">Dự án Trần Thị B - 5kWp</span>
                <span className="text-amber-500 dark:text-amber-400 font-bold">30%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
