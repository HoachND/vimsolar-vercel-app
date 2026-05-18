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
    { name: language === "vi" ? "Liên Hệ" : "Contact", href: "/#get-quote" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || isBlog ? "bg-[#082f49]/95 backdrop-blur-md shadow-xl py-1" : "bg-transparent py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-w-0">
          {/* Logo - constrained strictly to prevent overflow */}
          <div className="flex-shrink-0">
            <a href="/" className="hover:opacity-80 transition-opacity block">
              <Image
                src="/images/logo-vimsolar-nobg.png"
                alt="VimSolar"
                width={1200}
                height={400}
                className={`object-contain transition-all duration-300 w-[110px] sm:w-[150px] md:w-auto md:max-w-none ${
                  scrolled ? "h-8 sm:h-12 md:h-14" : "h-10 sm:h-16 md:h-20"
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

          {/* Mobile - flex-1 and justify-end ensures it takes remaining space without pushing off-screen */}
          <div className="flex lg:hidden items-center justify-end gap-1.5 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={toggleLanguage}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/10 text-amber-400 hover:bg-white/30 transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={16} />
            </button>
            <a
              href="tel:0974516670"
              className="flex-shrink-0 flex items-center gap-1 bg-amber-500 text-slate-900 font-bold px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-sm whitespace-nowrap"
            >
              <Phone size={12} fill="currentColor" />
              <span>{t("nav_call")}</span>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md bg-white/20 border border-white/10 text-white hover:bg-white/30 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
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
