"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function AdminHeader() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vimsolar-admin-session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vimsolar-admin-session");
    router.push("/doi-tac-lap-dat");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 fixed top-0 w-full z-20 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo-vimsolar-nobg.png" 
            alt="VimSolar" 
            width={120} 
            height={40} 
            className={`h-8 w-auto object-contain transition-all ${!isDark ? 'brightness-0 invert filter-none' : ''}`}
            style={!isDark ? { filter: "brightness(0) sepia(1) hue-rotate(200deg) saturate(500%)" } : {}}
          />
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={toggleTheme}
          className="text-gray-400 hover:text-amber-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
          title={isDark ? "Chế độ sáng" : "Chế độ tối"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="text-gray-400 hover:text-[#0070f3] dark:hover:text-blue-400 relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 dark:border-slate-700 pl-3 sm:pl-6">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.name || "Đối Tác"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role === "partner" ? "Partner" : "Admin"}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0070f3]/10 text-[#0070f3] dark:text-blue-400 flex items-center justify-center">
            <User size={16} />
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-1 sm:ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800" title="Đăng xuất">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
