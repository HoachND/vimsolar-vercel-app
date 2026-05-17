"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function Widgets() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 md:gap-3">
      {/* Phone */}
      <a
        href="tel:0974516670"
        className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex justify-center items-center text-emerald-600 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform pulse-ring"
        title="Gọi ngay"
      >
        <Phone fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0974516670"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex justify-center items-center text-blue-500 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform"
        title="Chat Zalo"
      >
        <span className="font-extrabold text-xs md:text-sm tracking-tighter">Zalo</span>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/vimsolar"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform"
        title="Chat Messenger"
      >
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] flex items-center justify-center text-white">
          <MessageCircle className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="currentColor" />
        </div>
      </a>
    </div>
  );
}
