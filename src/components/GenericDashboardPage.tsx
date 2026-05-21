"use client";
import { Wrench } from "lucide-react";

export default function GenericPage({ title }: { title?: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
        <Wrench className="w-8 h-8 text-[#0070f3] dark:text-blue-400" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title || "Đang phát triển"}</h2>
      <p className="text-sm">Tính năng này đang được VimSolar hoàn thiện và sẽ sớm ra mắt.</p>
    </div>
  );
}
