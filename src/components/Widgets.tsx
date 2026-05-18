"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function Widgets() {
  return (
    <div className="fixed bottom-5 right-6 sm:bottom-6 sm:right-8 md:bottom-6 md:right-8 z-[60] flex flex-col gap-2.5 md:gap-3">
      {/* Phone */}
      <a
        href="tel:0974516670"
        className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full flex justify-center items-center text-emerald-600 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform pulse-ring"
        title="Gọi ngay"
        aria-label="Gọi ngay"
      >
        <Phone fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0974516670"
        target="_blank"
        rel="noreferrer"
        className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full flex justify-center items-center text-blue-500 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform"
        title="Chat Zalo"
        aria-label="Chat Zalo"
      >
        <span className="font-extrabold text-[10px] sm:text-xs md:text-sm tracking-tighter leading-none">Zalo</span>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/vimsolar"
        target="_blank"
        rel="noreferrer"
        className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform"
        title="Chat Messenger"
        aria-label="Chat Messenger"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] flex items-center justify-center text-white">
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" fill="currentColor" />
        </div>
      </a>
    </div>
  );
}

