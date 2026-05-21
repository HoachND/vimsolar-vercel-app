"use client";
export default function GenericPage({ title }: { title?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-gray-500">
      <h2 className="text-xl font-bold mb-2">{title || "Đang phát triển"}</h2>
      <p className="text-sm">Tính năng này đang được VimSolar hoàn thiện và sẽ sớm ra mắt.</p>
    </div>
  );
}
