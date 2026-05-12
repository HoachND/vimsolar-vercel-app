"use client";

import { useI18n } from "@/context/I18nContext";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const { t, language, setLanguage } = useI18n();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isBlog = pathname.startsWith("/blog");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => setLanguage(language === "vi" ? "en" : "vi");

  const navLinks = [
    { name: t("nav_home"), href: "#home" },
    { name: t("nav_solutions"), href: "#solutions" },
    { name: t("nav_benefits"), href: "#benefits" },
    { name: t("nav_projects"), href: "#projects" },
    { name: t("nav_process"), href: "#process" },
    { name: language === "vi" ? "Tính ROI" : "ROI Calc", href: "/tu-van" },
    { name: "Blog", href: "/blog" },
    { name: language === "vi" ? "Liên Hệ" : "Contact", href: "/#contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || isBlog ? "bg-[#082f49]/95 backdrop-blur-md shadow-xl py-1" : "bg-transparent py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo-vimsolar-nobg.png"
                alt="VimSolar"
                width={1200}
                height={400}
                className={`w-auto object-contain transition-all duration-300 ${
                  scrolled ? "h-12 md:h-14" : "h-16 md:h-20"
                }`}
                priority
              />
            </a>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide">
                {link.name}
              </a>
            ))}
            <button onClick={toggleLanguage} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full transition-all">
              <Globe size={16} />
              <span className="font-bold text-sm">{language.toUpperCase()}</span>
            </button>
            <a href="tel:0974516670" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-5 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105">
              <Phone size={16} fill="currentColor" />
              <span>0974 516 670</span>
            </a>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={toggleLanguage} className="text-amber-400"><Globe size={18} /></button>
            <a href="tel:0974516670" className="flex items-center gap-1 bg-amber-500 text-slate-900 font-bold px-3 py-2 rounded-full text-sm">
              <Phone size={14} fill="currentColor" /><span>{t("nav_call")}</span>
            </a>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#0C4A6E]/98 backdrop-blur-lg border-t border-amber-500/20">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-white/90 hover:text-amber-400 hover:bg-white/5 font-medium transition-all">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
