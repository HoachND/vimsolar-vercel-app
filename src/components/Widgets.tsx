"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function Widgets() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Phone */}
      <a
        href="tel:0974516670"
        className="relative w-14 h-14 bg-white rounded-full flex justify-center items-center text-emerald-600 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform pulse-ring"
        title="Gọi ngay"
      >
        <Phone fill="currentColor" size={22} className="animate-pulse" />
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0974516670"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-white rounded-full flex justify-center items-center text-blue-500 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform"
        title="Chat Zalo"
      >
        <span className="font-extrabold text-sm tracking-tighter">Zalo</span>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/vimsolar"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform"
        title="Chat Messenger"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] flex items-center justify-center text-white">
          <MessageCircle size={18} fill="currentColor" />
        </div>
      </a>
    </div>
  );
}
