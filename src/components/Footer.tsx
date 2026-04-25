"use client";

import { MapPin, Phone, Mail, Factory } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1a] text-gray-400 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 - Brand */}
          <div className="space-y-5 lg:col-span-1">
            <img
              src="/images/logo-vimsolar.png"
              alt="VimSolar"
              className="h-16 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed">
              <strong className="text-white">VimSolar by VIMGROUP</strong> — Giải pháp EPC điện năng lượng mặt trời 
              áp mái trọn gói. Biến mái nhà thành tài sản sinh lời.
            </p>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-white">Chuyên Mục</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Trang chủ", href: "#home" },
                { name: "Giải pháp Solar", href: "#solutions" },
                { name: "Lợi ích", href: "#benefits" },
                { name: "Dự án", href: "#projects" },
                { name: "Quy trình", href: "#process" },
                { name: "Nhận báo giá", href: "#get-quote" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Contact */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-white">Liên Hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="block text-white text-xs mb-1">Văn phòng</strong>
                  <span>B88, Phố Trúc, KĐT Ecopark, Phụng Công, Hưng Yên</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Factory className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="block text-white text-xs mb-1">Nhà máy</strong>
                  <span>KCN Phố Nối A, Văn Lâm, Hưng Yên</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-amber-500 flex-shrink-0" size={18} />
                <a href="tel:0974516670" className="hover:text-amber-400 transition-colors">
                  0974 516 670
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-amber-500 flex-shrink-0" size={18} />
                <a href="mailto:solar.vimgroup@gmail.com" className="hover:text-amber-400 transition-colors">
                  solar.vimgroup@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 - Map */}
          <div className="h-[250px] rounded-xl overflow-hidden shadow-lg border border-slate-700 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.633596706927!2d105.9329718!3d20.9471373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af268f705e4b%3A0xe54191d84e2a6d7f!2sEcopark!5e0!3m2!1svi!2s!4v1713859000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500 absolute inset-0"
            ></iframe>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 text-center text-xs text-gray-600 space-y-2">
          <p>© {new Date().getFullYear()} VimSolar by VIMGROUP. All rights reserved.</p>
          <a
            href="http://vimai.vimgroup.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-300"
          >
            Sáng tạo bởi VimAI — Thương hiệu công nghệ VIMGROUP
          </a>
        </div>
      </div>
    </footer>
  );
}
