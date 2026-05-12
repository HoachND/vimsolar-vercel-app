"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// EVN tiered pricing (VND/kWh, chưa VAT) - QĐ 1279
const EVN_TIERS = [
  { max: 50, price: 1984 },
  { max: 100, price: 2050 },
  { max: 200, price: 2380 },
  { max: 300, price: 2998 },
  { max: 400, price: 3350 },
  { max: Infinity, price: 3460 },
];

const BUSINESS_PRICE = 3171; // <6kV, giờ BT
const SOLAR_HOURS: Record<string, number> = { north: 3.2, central: 4.2, south: 4.5 };
const INVEST_HYBRID = 12_500_000; // VND/kWp
const INVEST_GRID = 8_500_000;
const DEGRADATION = 0.004; // 0.4%/year
const MAINTENANCE_RATE = 0.005;
const PRICE_INCREASE = 0.08; // 8%/year

type CustomerType = "residential" | "business" | "rental" | "factory";

function calcEVNBill(kwh: number): number {
  let remaining = kwh, total = 0, tierStart = 0;
  for (const tier of EVN_TIERS) {
    const tierKwh = Math.min(remaining, tier.max - tierStart);
    if (tierKwh <= 0) break;
    total += tierKwh * tier.price;
    remaining -= tierKwh;
    tierStart = tier.max;
  }
  return total * 1.08; // +VAT 8%
}

function formatVND(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " triệu";
  if (n >= 1e3) return Math.round(n / 1e3) + "k";
  return Math.round(n).toLocaleString("vi-VN");
}

function estimateKwh(bill: number): number {
  // Reverse calc from bill to kWh (approximate)
  let kwh = 0;
  while (calcEVNBill(kwh) < bill && kwh < 50000) kwh += 10;
  return kwh;
}

export default function ROIConsultant() {
  const [customerType, setCustomerType] = useState<CustomerType>("residential");
  const [monthlyBill, setMonthlyBill] = useState(3000000);
  const [billInput, setBillInput] = useState("3000000");
  const [region, setRegion] = useState("north");
  const [showResult, setShowResult] = useState(false);
  const [customKwp, setCustomKwp] = useState<number | null>(null);
  const [customPanels, setCustomPanels] = useState<number | null>(null);

  const calc = useMemo(() => {
    const isBiz = customerType === "business" || customerType === "factory";
    const isRental = customerType === "rental";
    const pricePerKwh = isBiz ? BUSINESS_PRICE * 1.08 : 0;
    const monthlyKwh = isBiz ? monthlyBill / pricePerKwh : estimateKwh(monthlyBill);
    const sunHours = SOLAR_HOURS[region];
    const dailyKwh = monthlyKwh / 30;
    const autoKwp = Math.ceil(dailyKwh / sunHours);
    const systemKwp = customKwp ?? autoKwp;
    const needBattery = !isBiz;
    const investPerKwp = needBattery ? INVEST_HYBRID : INVEST_GRID;
    const totalInvest = systemKwp * investPerKwp;
    const monthlyProduction = systemKwp * sunHours * 30;
    const solarCoverage = Math.min(monthlyProduction / monthlyKwh, 1);

    // For rental: revenue from tenants at 3600 VND/kWh
    const rentalRevenue = isRental ? monthlyProduction * 3600 : 0;
    const newBill = isBiz
      ? Math.max(0, monthlyKwh - monthlyProduction) * pricePerKwh
      : calcEVNBill(Math.max(0, monthlyKwh - monthlyProduction));
    const monthlySaving = isRental
      ? (monthlyBill - newBill) + rentalRevenue * 0.3
      : monthlyBill - newBill;

    // 25-year projection
    const yearly: number[] = [];
    let cumSaving = 0;
    let paybackYear = 0;
    for (let y = 1; y <= 25; y++) {
      const degradedProd = monthlyProduction * (1 - DEGRADATION * y);
      const inflatedPrice = monthlyBill * Math.pow(1 + PRICE_INCREASE, y);
      const saving = isRental
        ? inflatedPrice - calcEVNBill(Math.max(0, monthlyKwh - degradedProd)) + rentalRevenue * 0.3 * Math.pow(1 + PRICE_INCREASE, y)
        : inflatedPrice - (isBiz
          ? Math.max(0, monthlyKwh - degradedProd) * pricePerKwh * Math.pow(1 + PRICE_INCREASE, y)
          : calcEVNBill(Math.max(0, monthlyKwh - degradedProd)) * Math.pow(1 + PRICE_INCREASE, y) / calcEVNBill(Math.max(0, monthlyKwh - degradedProd)) * calcEVNBill(Math.max(0, monthlyKwh - degradedProd)));
      const annualSaving = monthlySaving * 12 * Math.pow(1 + PRICE_INCREASE, y - 1);
      const maintenance = totalInvest * MAINTENANCE_RATE;
      const netSaving = annualSaving - maintenance;
      cumSaving += netSaving;
      yearly.push(cumSaving - totalInvest);
      if (paybackYear === 0 && cumSaving >= totalInvest) paybackYear = y;
    }

    const co2Reduction = systemKwp * sunHours * 365 * 0.7 / 1000; // tons/year
    const save10y = yearly[9] || 0;
    const save25y = yearly[24] || 0;

    return {
      monthlyKwh: Math.round(monthlyKwh),
      systemKwp,
      needBattery,
      totalInvest,
      monthlyProduction: Math.round(monthlyProduction),
      solarCoverage,
      monthlySaving,
      newBill,
      paybackYear: paybackYear || Math.ceil(totalInvest / (monthlySaving * 12)),
      save10y,
      save25y,
      co2Reduction: Math.round(co2Reduction * 10) / 10,
      yearly,
      panels: customPanels ?? Math.ceil(systemKwp * 1000 / 625),
      autoKwp,
      sunHours,
      dailyKwh: Math.round(dailyKwh),
      isBiz,
      investPerKwp,
    };
  }, [customerType, monthlyBill, region, customKwp, customPanels]);

  const types: { key: CustomerType; icon: string; label: string; desc: string }[] = [
    { key: "residential", icon: "🏠", label: "Hộ Gia Đình", desc: "Tiền điện 1-10 triệu/tháng" },
    { key: "business", icon: "🏪", label: "Cửa Hàng / KD", desc: "Tiền điện 5-50 triệu/tháng" },
    { key: "rental", icon: "🏢", label: "Nhà Trọ", desc: "Cho thuê 10-50 phòng" },
    { key: "factory", icon: "🏭", label: "Nhà Xưởng", desc: "Tiền điện 50-500 triệu/tháng" },
  ];

  const regions = [
    { key: "north", label: "Miền Bắc", hours: "3-3.5h nắng/ngày" },
    { key: "central", label: "Miền Trung", hours: "4-4.5h nắng/ngày" },
    { key: "south", label: "Miền Nam", hours: "4.2-4.8h nắng/ngày" },
  ];

  const maxBill = customerType === "factory" ? 500_000_000 : customerType === "business" ? 50_000_000 : customerType === "rental" ? 30_000_000 : 15_000_000;
  const stepBill = customerType === "factory" ? 5_000_000 : 500_000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="relative w-[120px] h-[35px]">
              <Image 
                src="/images/logo-vimsolar-nobg.png" 
                alt="VimSolar" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 uppercase tracking-tighter">
              ROI Tool
            </span>
          </a>
          <a href="tel:0974516670" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-semibold">
            📞 0974 516 670
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Tính Toán <span className="gradient-text-solar">Hiệu Quả Đầu Tư</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Nhập thông tin chi phí điện hiện tại — Xem ngay bạn tiết kiệm được bao nhiêu khi lắp điện mặt trời VimSolar
          </p>
        </motion.div>

        {/* Step 1: Customer Type */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-black">1</span>
            Mô Hình Khách Hàng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {types.map((t) => (
              <button
                key={t.key}
                onClick={() => { const val = t.key === "factory" ? 120_000_000 : t.key === "business" ? 8_000_000 : t.key === "rental" ? 12_000_000 : 3_000_000; setCustomerType(t.key); setMonthlyBill(val); setBillInput(String(val)); setShowResult(false); setCustomKwp(null); setCustomPanels(null); }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  customerType === t.key
                    ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-3xl block mb-2">{t.icon}</span>
                <span className="text-white font-bold text-sm block">{t.label}</span>
                <span className="text-slate-400 text-xs">{t.desc}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Step 2: Region */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-black">2</span>
            Khu Vực Lắp Đặt
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {regions.map((r) => (
              <button
                key={r.key}
                onClick={() => { setRegion(r.key); setShowResult(false); }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                  region === r.key
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-white font-bold text-sm block">{r.label}</span>
                <span className="text-amber-400 text-xs">☀️ {r.hours}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Step 3: Monthly Bill */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-black">3</span>
            Tiền Điện Hàng Tháng
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-center mb-4">
              <span className="text-4xl md:text-5xl font-black gradient-text-solar">
                {formatVND(monthlyBill)}
              </span>
              <span className="text-slate-400 text-sm block mt-1">VNĐ / tháng</span>
            </div>
            <input
              type="range"
              min={500000}
              max={maxBill}
              step={stepBill}
              value={monthlyBill}
              onChange={(e) => { const v = Number(e.target.value); setMonthlyBill(v); setBillInput(String(v)); setShowResult(false); setCustomKwp(null); setCustomPanels(null); }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${((monthlyBill - 500000) / (maxBill - 500000)) * 100}%, #334155 ${((monthlyBill - 500000) / (maxBill - 500000)) * 100}%, #334155 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>500k</span>
              <span>{formatVND(maxBill)}</span>
            </div>
            {/* Manual Input */}
            <div className="mt-4 flex items-center gap-3 justify-center">
              <span className="text-slate-400 text-sm">Hoặc nhập trực tiếp:</span>
              <input
                type="text"
                inputMode="numeric"
                value={billInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setBillInput(raw);
                  const num = Number(raw);
                  if (num >= 500000 && num <= maxBill) {
                    setMonthlyBill(num);
                    setShowResult(false);
                    setCustomKwp(null);
                    setCustomPanels(null);
                  }
                }}
                onBlur={() => {
                  const num = Number(billInput);
                  const clamped = Math.max(500000, Math.min(maxBill, num || 500000));
                  setMonthlyBill(clamped);
                  setBillInput(String(clamped));
                }}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white font-bold text-center w-40 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="VNĐ"
              />
              <span className="text-slate-500 text-xs">VNĐ</span>
            </div>
          </div>
        </motion.section>

        {/* CTA Button */}
        {!showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
            <button
              onClick={() => setShowResult(true)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
            >
              ⚡ TÍNH TOÁN NGAY
            </button>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero Result Card */}
              <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border border-amber-500/30 rounded-3xl p-6 md:p-8 mb-6">
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                  <span className="text-amber-400 text-sm">⚡</span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider">GIẢI PHÁP NĂNG LƯỢNG XANH TOÀN CẦU</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
                    Tiết kiệm <span className="gradient-text-solar">{formatVND(calc.save25y)}</span> trong 25 năm
                </h3>
              </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Hệ thống", value: `${calc.systemKwp} kWp`, icon: "⚡" },
                    { label: "Hoàn vốn", value: `~${calc.paybackYear} năm`, icon: "🔄" },
                    { label: "Tiết kiệm/tháng", value: formatVND(calc.monthlySaving), icon: "💰" },
                    { label: "Giảm CO₂/năm", value: `${calc.co2Reduction} tấn`, icon: "🌿" },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                      <span className="text-2xl block mb-1">{m.icon}</span>
                      <span className="text-white font-black text-lg block">{m.value}</span>
                      <span className="text-slate-400 text-xs">{m.label}</span>
                    </div>
                  ))}
                </div>

              {/* Before vs After */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Before */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-4">❌ Hiện Tại (Không Solar)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Tiền điện/tháng</span><span className="text-white font-bold">{formatVND(monthlyBill)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Tiền điện/năm</span><span className="text-white font-bold">{formatVND(monthlyBill * 12)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Tiền điện 10 năm (tăng 8%/năm)</span><span className="text-red-400 font-black">{formatVND(monthlyBill * 12 * 14.49)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Tiền điện 25 năm</span><span className="text-red-400 font-black text-lg">{formatVND(monthlyBill * 12 * 73.1)}</span></div>
                  </div>
                </div>

                {/* After */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                  <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-4">✅ Sau Khi Lắp VimSolar</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Đầu tư 1 lần</span><span className="text-white font-bold">{formatVND(calc.totalInvest)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Tiền điện mới/tháng</span><span className="text-emerald-400 font-bold">{formatVND(calc.newBill)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">Tiết kiệm 10 năm</span><span className="text-emerald-400 font-black">{formatVND(calc.save10y + calc.totalInvest)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 text-sm">LỢI NHUẬN RÒNG 25 năm</span><span className="text-emerald-400 font-black text-lg">{formatVND(calc.save25y)}</span></div>
                  </div>
                </div>
              </div>

              {/* Formulas */}
              <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-6 mb-6">
                <h4 className="text-sky-400 font-bold text-sm uppercase tracking-wider mb-4">📐 Công Thức Tính Toán</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 mb-1">Tiêu thụ ước tính:</p>
                    <p className="text-white font-mono">{formatVND(monthlyBill)} ÷ giá EVN bậc thang = <strong className="text-sky-400">{calc.monthlyKwh.toLocaleString()} kWh/tháng</strong> → <strong>{calc.dailyKwh} kWh/ngày</strong></p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 mb-1">Công suất hệ thống cần:</p>
                    <p className="text-white font-mono">{calc.dailyKwh} kWh/ngày ÷ {calc.sunHours}h nắng = <strong className="text-sky-400">{calc.autoKwp} kWp</strong></p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 mb-1">Số tấm pin LESSO 625W:</p>
                    <p className="text-white font-mono">{calc.systemKwp} kWp × 1000 ÷ 625W = <strong className="text-sky-400">{Math.ceil(calc.systemKwp * 1000 / 625)} tấm</strong></p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 mb-1">Tổng đầu tư:</p>
                    <p className="text-white font-mono">{calc.systemKwp} kWp × {formatVND(calc.investPerKwp)}/kWp = <strong className="text-sky-400">{formatVND(calc.totalInvest)}</strong></p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 mb-1">Hoàn vốn:</p>
                    <p className="text-white font-mono">{formatVND(calc.totalInvest)} ÷ ({formatVND(calc.monthlySaving)}/tháng × 12) ≈ <strong className="text-sky-400">~{calc.paybackYear} năm</strong></p>
                  </div>
                </div>
              </div>

              {/* System Details - Editable */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">📋 Cấu Hình Hệ Thống Đề Xuất</h4>
                <p className="text-slate-500 text-xs mb-4">💡 Có thể chỉnh sửa nếu diện tích mái hạn chế</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Editable kWp */}
                  <div className="bg-white/5 rounded-xl p-3 border border-amber-500/20">
                    <span className="text-amber-400 text-xs block mb-1">Công suất (chỉnh được) ✏️</span>
                    <input type="number" min={1} max={1000} value={customKwp ?? calc.autoKwp} onChange={(e) => { const v = Number(e.target.value); if (v > 0) { setCustomKwp(v); setCustomPanels(Math.ceil(v * 1000 / 625)); }}} className="bg-transparent text-white font-bold text-sm w-full focus:outline-none border-b border-amber-500/30 pb-1" />
                    <span className="text-slate-500 text-xs">kWp (đề xuất: {calc.autoKwp})</span>
                  </div>
                  {/* Editable Panels */}
                  <div className="bg-white/5 rounded-xl p-3 border border-amber-500/20">
                    <span className="text-amber-400 text-xs block mb-1">Số tấm LESSO 625W ✏️</span>
                    <input type="number" min={1} max={2000} value={customPanels ?? Math.ceil(calc.systemKwp * 1000 / 625)} onChange={(e) => { const v = Number(e.target.value); if (v > 0) { setCustomPanels(v); setCustomKwp(Math.round(v * 625 / 1000)); }}} className="bg-transparent text-white font-bold text-sm w-full focus:outline-none border-b border-amber-500/30 pb-1" />
                    <span className="text-slate-500 text-xs">tấm</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <span className="text-slate-400 text-xs block mb-1">Loại hệ thống</span>
                    <span className="text-white font-bold text-sm">{calc.needBattery ? "Hybrid + Pin LT" : "Hòa lưới bám tải"}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <span className="text-slate-400 text-xs block mb-1">Sản lượng/tháng</span>
                    <span className="text-white font-bold text-sm">{calc.monthlyProduction.toLocaleString()} kWh</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <span className="text-slate-400 text-xs block mb-1">Tỷ lệ tự cấp</span>
                    <span className="text-white font-bold text-sm">{Math.round(calc.solarCoverage * 100)}%</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <span className="text-slate-400 text-xs block mb-1">Bảo trì/năm</span>
                    <span className="text-white font-bold text-sm">{formatVND(calc.totalInvest * MAINTENANCE_RATE)}</span>
                  </div>
                </div>
                {customKwp !== null && customKwp !== calc.autoKwp && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-amber-400 text-xs">⚠️ Đã chỉnh từ {calc.autoKwp} kWp → {customKwp} kWp</span>
                    <button onClick={() => { setCustomKwp(null); setCustomPanels(null); }} className="text-xs text-slate-400 underline hover:text-white">Đặt lại</button>
                  </div>
                )}
              </div>

              {/* Savings Chart */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">📈 Lợi Nhuận Tích Lũy 25 Năm</h4>
                <div className="flex items-end gap-1 h-48 md:h-64">
                  {calc.yearly.map((val, i) => {
                    const maxVal = Math.max(...calc.yearly.map(Math.abs));
                    const h = Math.abs(val) / maxVal * 100;
                    const isPositive = val >= 0;
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: i * 0.03 }}
                        className={`flex-1 rounded-t-sm relative group cursor-pointer ${
                          isPositive
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                            : "bg-gradient-to-t from-red-600 to-red-400"
                        }`}
                        style={{ minHeight: "4px" }}
                      >
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Năm {i + 1}: {formatVND(val)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Năm 1</span>
                  <span className="text-amber-400 font-bold">Hoàn vốn năm {calc.paybackYear}</span>
                  <span>Năm 25</span>
                </div>
              </div>

              {/* EVN Warning */}
              <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
                <p className="text-white text-sm">
                  ⚠️ <strong className="text-red-400">Cảnh báo:</strong> Giá điện EVN tăng <strong className="text-red-400">8-10%/năm</strong>, xét điều chỉnh <strong className="text-red-400">mỗi 3 tháng</strong> (NĐ 72/2025). EVN còn khoản lỗ <strong>44.000 tỷ</strong> cần phân bổ vào giá điện.
                </p>
                <p className="text-amber-400 text-sm mt-2 font-bold">
                  💡 Lắp solar NGAY = Khóa chi phí điện ở mức thấp nhất trong 25 năm.
                </p>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <a
                  href="tel:0974516670"
                  className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
                >
                  📞 GỌI TƯ VẤN NGAY: 0974 516 670
                </a>
                <p className="text-slate-500 text-xs">
                  Khảo sát miễn phí • Báo giá trong 24h • Thi công 3-7 ngày
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-3">
          <a href="/" className="inline-block text-amber-400 text-sm hover:underline font-medium">
            ← Quay lại trang chủ VimSolar
          </a>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} VimSolar by VIMGROUP. All rights reserved.</p>
          <p className="text-slate-600 text-xs">Sáng tạo bởi VimAI — Thương hiệu công nghệ VIMGROUP</p>
        </div>
      </footer>
    </div>
  );
}
