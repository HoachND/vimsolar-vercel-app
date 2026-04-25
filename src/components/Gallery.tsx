"use client";

import { useI18n } from "@/context/I18nContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X, Maximize2 } from "lucide-react";

const projectsData = [
  {
    id: 1, img: "/images/projects/thumbnails/VimSolar_Factory4.png",
    title: { vi: "Nhà Máy Sản Xuất — 250kWp", en: "Manufacturing Plant — 250kWp" },
    category: "factory",
    details: {
      power: "250 kWp", location: { vi: "KCN Phố Nối A, Hưng Yên", en: "Pho Noi A IZ, Hung Yen" },
      system: { vi: "Hòa lưới bám tải — On-grid", en: "Grid-tied On-grid System" }
    },
    gallery: ["/images/projects/VimSolar_Factory1.jpg", "/images/projects/VimSolar_Factory2.jpg", "/images/projects/VimSolar_Factory3.jpg"]
  },
  {
    id: 2, img: "/images/projects/thumbnails/VimSolar_Ho Gia Dinh.png",
    title: { vi: "Biệt Thự Ecopark — 15kWp Hybrid", en: "Ecopark Villa — 15kWp Hybrid" },
    category: "family",
    details: {
      power: "15 kWp", location: { vi: "KĐT Ecopark, Hưng Yên", en: "Ecopark, Hung Yen" },
      system: { vi: "Hybrid + Pin lưu trữ LiFePO4", en: "Hybrid + LiFePO4 Battery Storage" }
    },
    gallery: ["/images/projects/VimSolar_Family1.jpg", "/images/projects/VimSolar_Family2.jpg", "/images/projects/VimSolar_Family3.jpg"]
  },
  {
    id: 3, img: "/images/projects/thumbnails/VimSolar_Hotel2.png",
    title: { vi: "Khách Sạn 5 Sao — 100kWp", en: "5-Star Hotel — 100kWp" },
    category: "hotel",
    details: {
      power: "100 kWp", location: { vi: "Hà Nội", en: "Hanoi" },
      system: { vi: "Hòa lưới — Tối ưu chi phí điện", en: "Grid-tied — Cost Optimization" }
    },
    gallery: ["/images/projects/VimSolar_Hotel.jpg", "/images/projects/VimSolar_Family2.jpg", "/images/projects/VimSolar_Factory2.jpg"]
  },
  {
    id: 4, img: "/images/projects/thumbnails/VimSolar_School.png",
    title: { vi: "Trường Quốc Tế — 50kWp", en: "International School — 50kWp" },
    category: "school",
    details: {
      power: "50 kWp", location: { vi: "Hưng Yên", en: "Hung Yen" },
      system: { vi: "Hòa lưới bám tải", en: "Grid-tied System" }
    },
    gallery: ["/images/projects/VimSolar_Factory1.jpg", "/images/projects/VimSolar_Factory2.jpg", "/images/projects/VimSolar_Factory3.jpg"]
  },
  {
    id: 5, img: "/images/projects/thumbnails/VimSolar_Shopping Central.png",
    title: { vi: "Trung Tâm Thương Mại — 500kWp", en: "Shopping Mall — 500kWp" },
    category: "mall",
    details: {
      power: "500 kWp", location: { vi: "Hà Nội", en: "Hanoi" },
      system: { vi: "Hòa lưới bám tải", en: "Grid-tied System" }
    },
    gallery: ["/images/projects/VimSolar_Factory1.jpg", "/images/projects/VimSolar_Hotel.jpg", "/images/projects/VimSolar_Factory3.jpg"]
  },
  {
    id: 6, img: "/images/projects/thumbnails/VimSolar_Van Phong Toa Nha.png",
    title: { vi: "Tòa Nhà Văn Phòng — 80kWp", en: "Office Building — 80kWp" },
    category: "office",
    details: {
      power: "80 kWp", location: { vi: "Hưng Yên", en: "Hung Yen" },
      system: { vi: "Hòa lưới — Giảm tải giờ cao điểm", en: "Grid-tied — Peak Load Shaving" }
    },
    gallery: ["/images/projects/VimSolar_Factory2.jpg", "/images/projects/VimSolar_Hotel.jpg", "/images/projects/VimSolar_Factory1.jpg"]
  },
];

const categories = ["gal_cat_all", "gal_cat_factory", "gal_cat_family", "gal_cat_hotel", "gal_cat_school", "gal_cat_mall", "gal_cat_office"];
const catMap: Record<string, string> = { 
  gal_cat_all: "all", 
  gal_cat_factory: "factory", 
  gal_cat_family: "family", 
  gal_cat_hotel: "hotel", 
  gal_cat_school: "school", 
  gal_cat_mall: "mall", 
  gal_cat_office: "office" 
};

export default function Gallery() {
  const { t, language } = useI18n();
  type Project = typeof projectsData[0];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("gal_cat_all");

  const filtered = activeCategory === "gal_cat_all" ? projectsData : projectsData.filter(p => p.category === catMap[activeCategory]);

  return (
    <section id="projects" className="py-24 solar-gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-amber-400 font-extrabold tracking-[4px] text-xs uppercase">{t("gal_badge")}</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">{t("gal_title")}</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">{t("gal_desc")}</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((catKey) => (
            <button key={catKey} onClick={() => setActiveCategory(catKey)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === catKey ? "bg-amber-500 text-slate-900 border-amber-500 shadow-lg" : "bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/50 hover:text-amber-400"}`}>
              {t(catKey)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bento-hover h-[300px]" onClick={() => setSelectedProject(p)}>
              <Image src={p.img} alt={p.title[language as "vi"|"en"]} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><Maximize2 size={18} className="text-white" /></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block border-l-2 border-amber-400 pl-2 mb-2">{t(`gal_cat_${p.category}`)}</span>
                <h3 className="text-white font-bold text-lg">{p.title[language as "vi"|"en"]}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL - AI Homes Pattern */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]">
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"><X size={24} /></button>

              {/* Gallery scroll */}
              <div className="w-full md:w-2/3 h-[300px] md:h-auto relative bg-slate-100 overflow-y-auto">
                {selectedProject.gallery.map((imgUrl, i) => (
                  <div key={i} className="relative w-full aspect-[4/3] border-b-2 border-white">
                    <Image src={imgUrl} alt="Gallery" fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Info panel */}
              <div className="w-full md:w-1/3 p-8 flex flex-col bg-slate-50 border-l border-slate-200 overflow-y-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-100 border border-amber-200 text-amber-700 font-bold text-xs mb-4 uppercase w-max">
                  {t(`gal_cat_${selectedProject.category}`)}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-gray-200">
                  {selectedProject.title[language as "vi"|"en"]}
                </h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="block text-gray-500 uppercase text-xs tracking-wider mb-1">{t("gal_modal_power")}</strong>
                    <span className="text-slate-800 font-medium">{selectedProject.details.power}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-500 uppercase text-xs tracking-wider mb-1">{t("gal_modal_location")}</strong>
                    <span className="text-slate-800 font-medium">{selectedProject.details.location[language as "vi"|"en"]}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-500 uppercase text-xs tracking-wider mb-1">{t("gal_modal_type")}</strong>
                    <span className="text-slate-800 font-medium">{selectedProject.details.system[language as "vi"|"en"]}</span>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">{t("gal_modal_desc")}</p>
                  <a href="#get-quote" onClick={() => setSelectedProject(null)} className="block text-center w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg transition-all">
                    {t("gal_modal_cta")}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
