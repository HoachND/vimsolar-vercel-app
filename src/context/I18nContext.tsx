"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const translations: Record<string, Record<string, string>> = {
  // Navbar
  nav_home: { vi: "Trang chủ", en: "Home" },
  nav_solutions: { vi: "Giải pháp", en: "Solutions" },
  nav_benefits: { vi: "Lợi ích", en: "Benefits" },
  nav_projects: { vi: "Dự án", en: "Projects" },
  nav_process: { vi: "Quy trình", en: "Process" },
  nav_quote: { vi: "Báo giá", en: "Get Quote" },
  nav_call: { vi: "Gọi ngay", en: "Call Now" },

  // Hero
  hero_badge: { vi: "⚡ Giải pháp năng lượng xanh 2026", en: "⚡ Green Energy Solutions 2026" },
  hero_title_1: { vi: "Biến Mái Nhà", en: "Turn Your Roof" },
  hero_title_2: { vi: "Thành", en: "Into An" },
  hero_title_3: { vi: "Tài Sản", en: "Asset" },
  hero_desc: { vi: "Giải pháp điện mặt trời áp mái trọn gói cho doanh nghiệp và hộ gia đình. Tiết kiệm đến 90% chi phí điện, hoàn vốn chỉ từ 3-5 năm.", en: "Complete rooftop solar solutions for businesses and households. Save up to 90% on electricity costs, ROI in just 3-5 years." },
  hero_cta: { vi: "Nhận Báo Giá Miễn Phí", en: "Get Free Quote" },
  hero_cta2: { vi: "Xem Giải Pháp", en: "View Solutions" },
  hero_stat1: { vi: "Tiết kiệm điện", en: "Electricity saved" },
  hero_stat2: { vi: "Năm hoàn vốn", en: "Year ROI" },
  hero_stat3: { vi: "Năm bảo hành", en: "Year warranty" },
  hero_card1_title: { vi: "Tiết Kiệm Chi Phí Điện", en: "Save Electricity Cost" },
  hero_card1_desc: { vi: "Giảm hóa đơn điện từ 40-90% ngay tháng đầu tiên", en: "Reduce electricity bills by 40-90% from the first month" },
  hero_card2_title: { vi: "ROI 332% Sau 10 Năm", en: "332% ROI After 10 Years" },
  hero_card2_desc: { vi: "Đầu tư 1 lần, hưởng lợi 25-30 năm liên tục", en: "Invest once, benefit for 25-30 years continuously" },
  hero_card3_title: { vi: "Bảo Hành 12 Năm", en: "12-Year Warranty" },
  hero_card3_desc: { vi: "Tấm pin LESSO N-type TOPCon 625W hiệu suất cao", en: "LESSO N-type TOPCon 625W high-efficiency panels" },

  // Solutions
  sol_badge: { vi: "Giải Pháp Tối Ưu", en: "Optimal Solutions" },
  sol_title: { vi: "Giải Pháp Điện Mặt Trời VimSolar", en: "VimSolar Solar Solutions" },
  sol_desc: { vi: "Tư vấn - Thiết kế - Thi công trọn gói. Phù hợp mọi nhu cầu từ hộ gia đình đến doanh nghiệp lớn.", en: "Consulting - Design - Turnkey construction. Suitable for all needs from households to large enterprises." },
  sol_consult: { vi: "Tư vấn ngay →", en: "Consult now →" },
  sol_invest: { vi: "Đầu tư:", en: "Investment:" },

  // Benefits
  ben_badge: { vi: "Tại Sao Nên Lắp Solar?", en: "Why Install Solar?" },
  ben_title: { vi: "Lợi Ích Vượt Trội", en: "Outstanding Benefits" },
  ben_desc: { vi: "Giá điện tăng 8-10%/năm, chính sách hỗ trợ tốt nhất, giá thiết bị thấp nhất lịch sử — đây là thời điểm vàng để lắp điện mặt trời.", en: "Electricity prices rise 8-10%/year, best support policies, lowest equipment prices in history — this is the golden time for solar." },
  ben_cta_text: { vi: "Giá điện chỉ có tăng, không giảm. Mỗi năm chờ = mỗi năm trả thêm 8-10%.", en: "Electricity prices only go up. Each year you wait = 8-10% more paid." },
  ben_cta: { vi: "Tính Toán Tiết Kiệm Ngay →", en: "Calculate Savings Now →" },
  ben_1_t: { vi: "Tiết Kiệm Tối Đa", en: "Maximum Savings" },
  ben_1_d: { vi: "Cắt giảm 40-90% hóa đơn điện hàng tháng. Hưởng lợi ích tài chính kéo dài hàng thập kỷ.", en: "Reduce monthly electricity bills by 40-90%. Enjoy decades of financial benefits." },
  ben_1_s: { vi: "tiết kiệm/25 năm", en: "savings/25 years" },
  ben_2_t: { vi: "Hoàn Vốn Siêu Tốc", en: "Lightning Fast ROI" },
  ben_2_d: { vi: "Với giá điện sinh hoạt và kinh doanh bậc thang, thời gian thu hồi vốn ngày càng rút ngắn.", en: "With tiered residential and commercial electricity prices, ROI time is getting shorter." },
  ben_2_s: { vi: "năm hoàn vốn", en: "years ROI" },
  ben_3_t: { vi: "An Ninh Năng Lượng", en: "Energy Security" },
  ben_3_d: { vi: "Không còn lo lắng tình trạng cắt điện luân phiên hay sự cố điện lưới ảnh hưởng tới sinh hoạt.", en: "No more worrying about rolling blackouts or grid failures affecting your daily life." },
  ben_3_s: { vi: "nguồn điện ổn định", en: "stable power supply" },
  ben_4_t: { vi: "Bảo Vệ Môi Trường", en: "Environmental Protection" },
  ben_4_d: { vi: "Đạt tiêu chuẩn xuất khẩu xanh, nhận chứng nhận ESG và giảm lượng lớn khí thải carbon.", en: "Meet green export standards, receive ESG certification, and reduce carbon emissions." },
  ben_4_s: { vi: "giảm phát thải/năm (10kWp)", en: "emissions reduced/yr (10kWp)" },
  ben_5_t: { vi: "Tín Chỉ Carbon", en: "Carbon Credits" },
  ben_5_d: { vi: "Tạo thêm nguồn thu nhập từ việc bán tín chỉ carbon hoặc tăng giá trị bất động sản thương mại.", en: "Generate additional income from selling carbon credits or increase property value." },
  ben_5_s: { vi: "doanh thu tiềm năng/năm", en: "potential revenue/year" },
  ben_6_t: { vi: "Đầu Tư An Toàn, Bền Bỉ", en: "Safe & Durable Investment" },
  ben_6_d: { vi: "Hệ thống hoạt động tự động hoàn toàn, chi phí bảo trì cực thấp, vòng đời sản phẩm lâu dài.", en: "Fully automated system, extremely low maintenance costs, and long product lifecycle." },
  ben_6_s: { vi: "năm tuổi thọ hệ thống", en: "years system lifespan" },

  // About
  about_badge: { vi: "Về VimSolar", en: "About VimSolar" },
  about_title: { vi: "Đơn Vị Thi Công Điện Mặt Trời Uy Tín", en: "Trusted Solar Installation Company" },
  about_desc: { vi: "VimSolar thuộc Công ty Cổ phần Đầu tư VIMGROUP — chuyên tư vấn, thiết kế và thi công hệ thống điện năng lượng mặt trời áp mái EPC trọn gói. Chúng tôi cam kết mang đến giải pháp tối ưu nhất với chi phí hợp lý.", en: "VimSolar, a subsidiary of VIMGROUP Investment JSC — specializing in consulting, designing and constructing turnkey EPC rooftop solar energy systems. We are committed to delivering the most optimal solutions at reasonable costs." },
  about_ceo: { vi: "Giám đốc VimSolar", en: "Director of VimSolar" },

  // Gallery
  gal_badge: { vi: "Dự Án Thực Tế", en: "Real Projects" },
  gal_title: { vi: "Công Trình Tiêu Biểu", en: "Featured Projects" },
  gal_desc: { vi: "Hàng trăm công trình đã hoàn thiện — Mỗi dự án là một minh chứng cho chất lượng VimSolar.", en: "Hundreds of completed projects — Each one is a testament to VimSolar quality." },
  gal_cat_all: { vi: "Tất cả", en: "All" },
  gal_cat_factory: { vi: "Nhà Xưởng - Nhà Máy", en: "Factory - Plant" },
  gal_cat_family: { vi: "Hộ Gia Đình", en: "Residential" },
  gal_cat_hotel: { vi: "Khách Sạn - Resort", en: "Hotel - Resort" },
  gal_cat_school: { vi: "Trường Học - Bệnh Viện", en: "School - Hospital" },
  gal_cat_mall: { vi: "Trung Tâm Thương Mại", en: "Shopping Center" },
  gal_cat_office: { vi: "Văn Phòng - Toà Nhà", en: "Office - Building" },
  gal_modal_power: { vi: "Công suất", en: "Capacity" },
  gal_modal_location: { vi: "Địa điểm", en: "Location" },
  gal_modal_type: { vi: "Loại hệ thống", en: "System Type" },
  gal_modal_cta: { vi: "Tư Vấn Hệ Thống Tương Tự", en: "Consult Similar System" },
  gal_modal_desc: { vi: "Bạn muốn sở hữu hệ thống tương tự? Liên hệ ngay để được tư vấn miễn phí.", en: "Want a similar system? Contact us for a free consultation." },

  // Savings
  sav_badge: { vi: "Bảng Tính Thực Tế", en: "Real Calculations" },
  sav_title: { vi: "Bạn Tiết Kiệm Bao Nhiêu?", en: "How Much Will You Save?" },
  sav_desc: { vi: "Số liệu thực tế dựa trên biểu giá điện EVN hiện hành, giá điện tăng 8%/năm.", en: "Real figures based on current EVN electricity tariffs, 8%/year price increase." },

  // Process
  proc_badge: { vi: "Quy Trình Chuyên Nghiệp", en: "Professional Process" },
  proc_title: { vi: "5 Bước Sở Hữu Điện Mặt Trời", en: "5 Steps to Own Solar Power" },
  proc_desc: { vi: "Quy trình EPC trọn gói — Từ khảo sát đến bàn giao chỉ từ 3-7 ngày.", en: "Turnkey EPC process — From survey to handover in just 3-7 days." },
  proc_cta: { vi: "Bắt Đầu Khảo Sát Miễn Phí →", en: "Start Free Survey →" },

  // Contact Form
  form_badge: { vi: "Liên Hệ Tư Vấn", en: "Contact Us" },
  form_title: { vi: "Nhận Báo Giá Chi Tiết", en: "Get Detailed Quote" },
  form_desc: { vi: "Để lại thông tin, đội ngũ kỹ sư VimSolar sẽ liên hệ khảo sát miễn phí và báo giá trọn gói.", en: "Leave your info, VimSolar engineers will contact you for a free survey and quote." },
  form_name: { vi: "Họ và Tên *", en: "Full Name *" },
  form_phone: { vi: "Số Điện Thoại *", en: "Phone Number *" },
  form_email: { vi: "Email", en: "Email" },
  form_type: { vi: "Loại Công Trình", en: "Project Type" },
  form_submit: { vi: "NHẬN BÁO GIÁ MIỄN PHÍ ☀️", en: "GET FREE QUOTE ☀️" },
  form_sending: { vi: "ĐANG GỬI...", en: "SENDING..." },
  form_success_title: { vi: "Gửi Yêu Cầu Thành Công!", en: "Request Sent Successfully!" },
  form_success_desc: { vi: "Cảm ơn quý khách đã tin tưởng VimSolar. Kỹ sư sẽ liên hệ trong 24h.", en: "Thank you for trusting VimSolar. Our engineers will contact you within 24h." },
  form_messenger: { vi: "💬 Chat Messenger Ngay", en: "💬 Chat on Messenger" },
  form_opt1: { vi: "Hộ Gia Đình", en: "Residential" },
  form_opt2: { vi: "Doanh Nghiệp / Nhà Xưởng", en: "Enterprise / Factory" },
  form_opt3: { vi: "Nhà Trọ Cho Thuê", en: "Rental Property" },
  form_opt4: { vi: "Cửa Hàng / Khách Sạn", en: "Shop / Hotel" },
  form_opt5: { vi: "Khác", en: "Other" },
  form_hotline: { vi: "Hotline 24/7", en: "Hotline 24/7" },
  form_office: { vi: "Văn phòng đại diện", en: "Representative Office" },
  form_factory: { vi: "Nhà máy", en: "Factory" },
  form_secure: { vi: "🔒 Thông tin của bạn được bảo mật tuyệt đối", en: "🔒 Your information is completely secured" },

  // Footer
  footer_desc: { vi: "VimSolar by VIMGROUP — Giải pháp EPC điện năng lượng mặt trời áp mái trọn gói. Biến mái nhà thành tài sản sinh lời.", en: "VimSolar by VIMGROUP — Turnkey EPC rooftop solar energy solutions. Turn your roof into a profitable asset." },
  footer_links: { vi: "Chuyên Mục", en: "Quick Links" },
  footer_contact: { vi: "Liên Hệ", en: "Contact" },
  footer_office: { vi: "Văn phòng", en: "Office" },
  footer_factory: { vi: "Nhà máy", en: "Factory" },
  footer_credit: { vi: "Sáng tạo bởi VimAI — Thương hiệu công nghệ VIMGROUP", en: "Created by VimAI — VIMGROUP technology brand" },
};

type I18nCtx = { t: (key: string) => string; language: string; setLanguage: (l: string) => void };
const I18nContext = createContext<I18nCtx>({ t: (k) => k, language: "vi", setLanguage: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("vi");
  const t = (key: string) => translations[key]?.[language] || key;
  return <I18nContext.Provider value={{ t, language, setLanguage }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
