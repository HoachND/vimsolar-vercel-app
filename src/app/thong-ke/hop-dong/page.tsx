"use client";
import { useState } from "react";
import { Plus, Search, Filter, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function HopDongPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#0070f3]">Hợp đồng</h1>
          <button className="bg-[#0070f3] hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-1 transition-colors">
            <Plus size={16} /> Thêm mới
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Filter size={20} />
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3]"
            placeholder="Tìm kiếm theo mã HĐ, tên KH,..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="text-[#0070f3] text-sm flex items-center gap-1 hover:underline">
            <X size={14} /> Bỏ lọc
          </button>
          
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3]">
              <option value="">Trạng thái</option>
              <option value="Khởi tạo">Khởi tạo</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Hủy">Hủy</option>
              <option value="Đã ký">Đã ký</option>
              <option value="Khách hàng đã ký">Khách hàng đã ký</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3]">
              <option value="">Thương hiệu</option>
              <option value="SunPro">SunPro</option>
              <option value="LESSO">LESSO</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50">
            Nâng cao <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">STT</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Mã hợp đồng</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Tên khách hàng</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Gói lắp đặt</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Giá trị hợp đồng</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Đã thanh toán</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Công nợ còn lại</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#0070f3] uppercase tracking-wider">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Empty state representing datsolar_10.jpg */}
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          0 of 0
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
            <ChevronRight size={16} />
          </button>
          <div className="relative ml-2">
            <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 pl-2 pr-6 rounded text-sm focus:outline-none">
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
