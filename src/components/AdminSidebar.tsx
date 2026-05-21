"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Activity, Phone, FileText, Briefcase, 
  CreditCard, Package, Truck, Wrench, CheckCircle, 
  Gift, Star 
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        { name: "Thống kê", href: "/thong-ke/tong-quan", icon: Home },
        { name: "Hoạt động", href: "/thong-ke/hoat-dong", icon: Activity },
      ]
    },
    {
      title: "Vận hành",
      items: [
        { name: "Tư vấn/ Khảo sát", href: "/thong-ke/tu-van", icon: Phone },
        { name: "Báo giá/ Thông tin HĐ", href: "/thong-ke/bao-gia", icon: FileText },
        { name: "Hợp đồng", href: "/thong-ke/hop-dong", icon: Briefcase },
        { name: "Thanh toán", href: "/thong-ke/thanh-toan", icon: CreditCard },
        { name: "Đơn hàng", href: "/thong-ke/don-hang", icon: Package },
        { name: "Vận chuyển", href: "/thong-ke/van-chuyen", icon: Truck },
        { name: "Thi công", href: "/thong-ke/thi-cong", icon: Wrench },
        { name: "Nghiệm thu và bàn giao", href: "/thong-ke/nghiem-thu", icon: CheckCircle },
        { name: "Ưu đãi và hoàn phí", href: "/thong-ke/uu-dai", icon: Gift },
        { name: "Đánh giá", href: "/thong-ke/danh-gia", icon: Star },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 h-screen overflow-y-auto flex-shrink-0 flex flex-col fixed left-0 top-0 pt-16 z-10 hidden md:flex transition-colors duration-300">
      <div className="py-4">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 text-xs font-bold text-[#0070f3] dark:text-blue-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                        isActive 
                          ? "bg-[#0070f3]/10 dark:bg-blue-500/10 text-[#0070f3] dark:text-blue-400 font-semibold border-r-4 border-[#0070f3] dark:border-blue-400" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-[#0070f3] dark:text-blue-400" : "text-gray-400 dark:text-gray-500"} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400 text-center">
        VimSolar Partner Portal v2.0
      </div>
    </aside>
  );
}
