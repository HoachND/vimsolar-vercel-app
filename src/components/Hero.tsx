"use client";

import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield } from "lucide-react";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C4A6E]/90 via-[#0f172a]/85 to-[#0C4A6E]/90"></div>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 sun-ray">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-transparent blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1.5 px-4 rounded-full bg-amber-500/15 text-amber-400 font-bold tracking-wider text-xs mb-6 border border-amber-500/30 uppercase">
              {t("hero_badge")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {t("hero_title_1")}<br className="hidden sm:block" />
              {t("hero_title_2")} <span className="gradient-text-solar">{t("hero_title_3")}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300/90 mb-8 max-w-xl leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: t("hero_desc") }} />
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#get-quote" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold rounded-full hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 text-center text-lg">
                {t("hero_cta")}
              </a>
              <a href="#solutions" className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/60 transition-all text-center">
                {t("hero_cta2")}
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center sm:text-left">
                <div className="text-3xl md:text-4xl font-black text-amber-400">90%</div>
                <div className="text-sm text-gray-400 mt-1">{t("hero_stat1")}</div>
              </div>
              <div className="text-center sm:text-left border-l border-white/10 pl-6">
                <div className="text-3xl md:text-4xl font-black text-amber-400">3-5</div>
                <div className="text-sm text-gray-400 mt-1">{t("hero_stat2")}</div>
              </div>
              <div className="text-center sm:text-left border-l border-white/10 pl-6">
                <div className="text-3xl md:text-4xl font-black text-amber-400">12+</div>
                <div className="text-sm text-gray-400 mt-1">{t("hero_stat3")}</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:flex flex-col gap-4">
            <div className="glass rounded-2xl p-6 bento-hover">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center"><Zap className="text-amber-400" size={28} /></div>
                <div><h3 className="text-white font-bold text-lg">{t("hero_card1_title")}</h3><p className="text-gray-400 text-sm">{t("hero_card1_desc")}</p></div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 bento-hover">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center"><TrendingUp className="text-emerald-400" size={28} /></div>
                <div><h3 className="text-white font-bold text-lg">{t("hero_card2_title")}</h3><p className="text-gray-400 text-sm">{t("hero_card2_desc")}</p></div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 bento-hover">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-sky-500/20 flex items-center justify-center"><Shield className="text-sky-400" size={28} /></div>
                <div><h3 className="text-white font-bold text-lg">{t("hero_card3_title")}</h3><p className="text-gray-400 text-sm">{t("hero_card3_desc")}</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
}
