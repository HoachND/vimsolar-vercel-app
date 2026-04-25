"use client";
import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";
import { Banknote, Leaf, BatteryCharging, TrendingUp, Building2, Sun } from "lucide-react";


const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/20" },
  green: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
};

export default function Benefits() {
  const { t, language } = useI18n();
  const isEn = language === "en";

  const benefits = [
    { icon: Banknote, titleKey: "ben_1_t", descKey: "ben_1_d", color: "amber", stat: isEn ? "~400 million" : "~400 triệu", statKey: "ben_1_s" },
    { icon: TrendingUp, titleKey: "ben_2_t", descKey: "ben_2_d", color: "emerald", stat: "1.5-5", statKey: "ben_2_s" },
    { icon: BatteryCharging, titleKey: "ben_3_t", descKey: "ben_3_d", color: "sky", stat: "24/7", statKey: "ben_3_s" },
    { icon: Leaf, titleKey: "ben_4_t", descKey: "ben_4_d", color: "green", stat: isEn ? "7.2 tons" : "7.2 tấn", statKey: "ben_4_s" },
    { icon: Building2, titleKey: "ben_5_t", descKey: "ben_5_d", color: "violet", stat: "$900+", statKey: "ben_5_s" },
    { icon: Sun, titleKey: "ben_6_t", descKey: "ben_6_d", color: "orange", stat: "30", statKey: "ben_6_s" },
  ];
  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="text-amber-600 font-extrabold tracking-[4px] text-xs uppercase">{t("ben_badge")}</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">{t("ben_title")}</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">{t("ben_desc")}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const c = colorMap[b.color];
            return (
              <motion.div key={b.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-amber-200 bento-hover shadow-sm hover:shadow-xl">
                <div className={`w-14 h-14 rounded-xl ${c.bg} flex items-center justify-center mb-5`}><b.icon className={c.text} size={28} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(b.titleKey)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{t(b.descKey)}</p>
                <div className={`rounded-xl ${c.bg} border ${c.border} p-4`}>
                  <div className={`text-2xl font-black ${c.text}`}>{b.stat}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(b.statKey)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-16">
          <p className="text-gray-500 mb-4 text-lg">{t("ben_cta_text")}</p>
          <a href="#get-quote" className="inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold rounded-full hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 text-lg">{t("ben_cta")}</a>
        </motion.div>
      </div>
    </section>
  );
}
