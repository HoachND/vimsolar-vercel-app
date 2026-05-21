"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
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
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 w-full z-20 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700">
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo-vimsolar-nobg.png" 
            alt="VimSolar" 
            width={120} 
            height={40} 
            className="h-8 w-auto object-contain brightness-0 invert filter-none" 
            style={{ filter: "brightness(0) sepia(1) hue-rotate(200deg) saturate(500%)" }} 
            // The above filter attempts to make the logo blue-ish to match DAT Solar style, 
            // but ideally we should use a proper colored logo.
          />
        </Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="text-gray-400 hover:text-[#0070f3] relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 sm:pl-6">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Đối Tác"}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role === "partner" ? "Partner" : "Admin"}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0070f3]/10 text-[#0070f3] flex items-center justify-center">
            <User size={16} />
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2" title="Đăng xuất">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
