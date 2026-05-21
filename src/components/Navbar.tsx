"use client";

import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Globe, Sun, Moon, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";

export default function Navbar() {
  const { t, language, setLanguage } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const isBlog = pathname.startsWith("/blog");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => setLanguage(language === "vi" ? "en" : "vi");

  const navLinks = [
    { name: t("nav_home"), href: "/#home" },
    { name: t("nav_solutions"), href: "/#solutions" },
    { name: t("nav_benefits"), href: "/#benefits" },
    { name: t("nav_projects"), href: "/#projects" },
    { name: language === "vi" ? "Đối Tác" : "Partners", href: "/#partner-program" },
    { name: language === "vi" ? "Tính ROI" : "ROI Calc", href: "/tu-van" },
    { name: "Blog", href: "/blog" },
    { name: language === "vi" ? "Liên Hệ" : "Contact", href: "/#get-quote" },
  ];

  return (
    <>
      <nav className={`fixed w-full inset-x-0 z-50 transition-all duration-300 ${
        scrolled || isBlog 
          ? "bg-[#082f49]/95 dark:bg-[#082f49]/95 backdrop-blur-md shadow-xl py-1" 
          : isDark 
            ? "bg-transparent py-2" 
            : "bg-white/90 backdrop-blur-md shadow-sm py-2"
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-w-0">
            {/* Logo */}
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
                <a key={link.href} href={link.href} className={`hover:text-amber-400 transition-colors font-medium text-sm tracking-wide ${
                  scrolled || isDark ? "text-white/80" : "text-slate-700"
                }`}>
                  {link.name}
                </a>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                  scrolled || isDark 
                    ? "bg-white/10 hover:bg-white/20 text-amber-400" 
                    : "bg-slate-100 hover:bg-slate-200 text-amber-600"
                }`}
                aria-label="Toggle theme"
                title={isDark ? "Chế độ sáng" : "Chế độ tối"}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Language Toggle */}
              <button onClick={toggleLanguage} className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                scrolled || isDark 
                  ? "text-amber-400 hover:text-amber-300 bg-amber-500/10" 
                  : "text-amber-600 hover:text-amber-700 bg-amber-50 border border-amber-200"
              }`}>
                <Globe size={16} />
                <span className="font-bold text-sm">{language.toUpperCase()}</span>
              </button>

              {/* Login Button */}
              <button
                onClick={() => setLoginOpen(true)}
                className="bg-[#0070f3] text-white font-bold px-6 py-2.5 rounded-full hover:bg-blue-600 transition-colors shadow-md text-sm flex items-center gap-2"
              >
                <LogIn size={14} />
                {language === "vi" ? "Đăng nhập" : "Login"}
              </button>

              <a href="tel:0974516670" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-5 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105">
                <Phone size={16} fill="currentColor" />
                <span>0974 516 670</span>
              </a>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0 pr-1">
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-colors shadow-sm ${
                  scrolled || isDark 
                    ? "bg-white/20 border-white/10 text-amber-400 hover:bg-white/30" 
                    : "bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <button
                onClick={toggleLanguage}
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-colors shadow-sm ${
                  scrolled || isDark 
                    ? "bg-white/20 border-white/10 text-amber-400 hover:bg-white/30" 
                    : "bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200"
                }`}
                aria-label="Toggle language"
              >
                <Globe size={16} />
              </button>
              <a
                href="tel:0974516670"
                className="flex-shrink-0 flex items-center gap-1.5 bg-amber-500 text-slate-900 font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap shadow-sm"
              >
                <Phone size={12} fill="currentColor" />
                <span>{t("nav_call")}</span>
              </a>
              <button
                onClick={() => setLoginOpen(true)}
                className="flex-shrink-0 flex items-center justify-center bg-[#0070f3] text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm hover:bg-blue-600 transition-colors"
              >
                {language === "vi" ? "Đăng nhập" : "Login"}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-md border transition-colors shadow-sm ${
                  scrolled || isDark 
                    ? "bg-white/20 border-white/10 text-white hover:bg-white/30" 
                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className={`lg:hidden backdrop-blur-lg border-t ${
            isDark ? "bg-[#0C4A6E]/98 border-amber-500/20" : "bg-white/98 border-slate-200"
          }`}>
            <div className="px-4 pt-4 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                  isDark ? "text-white/90 hover:text-amber-400 hover:bg-white/5" : "text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                }`}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
