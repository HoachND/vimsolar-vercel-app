"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/I18nContext";
import { Users, Shield, Award, Sparkles, PhoneCall, CheckCircle } from "lucide-react";

export default function PartnerProgram() {
  const { language } = useI18n();
  const isEn = language === "en";
  const [activeTab, setActiveTab] = useState<"installer" | "ambassador">("installer");

  const installerBenefits = [
    {
      title: isEn ? "High Margin Discount" : "Chiết Khấu Đại Lý Cao",
      desc: isEn
        ? "Access LESSO panels at direct distributor prices (~3,100 đ/W), allowing high retail margins."
        : "Nhập pin LESSO chính hãng giá gốc nhà phân phối (~3.100 đ/W), biên lợi nhuận bán ra hấp dẫn.",
    },
    {
      title: isEn ? "Technical & AI Support" : "Hỗ Trợ Kỹ Thuật & AI",
      desc: isEn
        ? "VimSolar and Horus experts assist with preliminary design, dynamic 3D layouts, and ROI simulations."
        : "Đội ngũ chuyên gia và AI hỗ trợ lên thiết kế sơ bộ 3D, bản vẽ lắp đặt và tính toán ROI siêu tốc.",
    },
    {
      title: isEn ? "Marketing & Lead Gen" : "Hỗ Trợ Tìm Kiếm Khách Hàng",
      desc: isEn
        ? "We share verified, localized commercial & residential leads directly to our partner network."
        : "Chúng tôi chia sẻ lead khách hàng có nhu cầu thực tế theo từng khu vực địa lý cho đối tác.",
    },
  ];

  const ambassadorSteps = [
    {
      step: "01",
      title: isEn ? "Register Simply" : "Đăng Ký Đơn Giản",
      desc: isEn ? "No sign-up fee, no capital or experience required." : "Không mất phí, không yêu cầu bỏ vốn hay kinh nghiệm.",
    },
    {
      step: "02",
      title: isEn ? "Share & Introduce" : "Chia Sẻ & Giới Thiệu",
      desc: isEn ? "Share blog posts, social media updates or refer direct leads." : "Chia sẻ các bài viết của VimSolar hoặc giới thiệu người quen có nhu cầu.",
    },
    {
      step: "03",
      title: isEn ? "Earn Passive Income" : "Nhận Hoa Hồng Hấp Dẫn",
      desc: isEn ? "Get paid 2% of the contract value immediately after signing." : "Nhận ngay 2% giá trị hợp đồng ngay khi ký kết thành công.",
    },
  ];

  const commissions = [
    { value: "80.000.000đ", reward: "1.600.000đ" },
    { value: "200.000.000đ", reward: "4.000.000đ" },
    { value: "300.000.000đ", reward: "6.000.000đ" },
    { value: "500.000.000đ", reward: "10.000.000đ" },
  ];

  return (
    <section id="partner-program" className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden relative">
      {/* Decorative Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-amber-400 font-extrabold tracking-widest text-xs uppercase flex items-center justify-center gap-2">
            <Users size={14} />
            {isEn ? "PARTNER PROGRAMS" : "ĐỐI TÁC ĐỒNG HÀNH"}
          </p>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2">
            {isEn ? "Grow Together with VimSolar" : "Đồng Hành Phát Triển Cùng VimSolar"}
          </h3>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            {isEn
              ? "Join hands with VimSolar to deploy clean energy across Vietnam. We offer lucrative programs for active installers and social advocates."
              : "Bắt tay hợp tác cùng VimSolar lan tỏa năng lượng xanh, kiến tạo giá trị và gia tăng thu nhập thụ động bền vững."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-950 p-1.5 rounded-full border border-slate-700 flex gap-2">
            <button
              onClick={() => setActiveTab("installer")}
              className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === "installer"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isEn ? "Become an Installer Partner" : "Đối tác lắp đặt"}
            </button>
            <button
              onClick={() => setActiveTab("ambassador")}
              className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === "ambassador"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isEn ? "Become a Green Ambassador" : "Đại sứ xanh"}
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "installer" ? (
              <motion.div
                key="installer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Info Column */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-extrabold uppercase">
                    <Shield size={12} />
                    {isEn ? "Professional Installer Network" : "Mạng lưới đối tác thi công chuyên nghiệp"}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                    {isEn
                      ? "Empowering Local Installers with Superior Pricing & Engineering Support"
                      : "Trở Thành Đối Tác Lắp Đặt VimSolar — Tối Ưu Lợi Nhuận, Trọn Gói Kỹ Thuật"}
                  </h4>
                  <p className="text-slate-400 text-sm sm:text-base">
                    {isEn
                      ? "We provide certified premium equipment direct from Horus Power (Hoa Phat ecosystem) alongside state-of-the-art technical backup, allowing local installers to focus entirely on perfect execution."
                      : "Chúng tôi cung cấp thiết bị chính hãng giá tốt nhất cùng bệ phóng kỹ thuật toàn diện, giúp các đội thi công địa phương tự tin đấu thầu, lắp đặt và tối ưu hóa lợi nhuận."}
                  </p>

                  <div className="space-y-4">
                    {installerBenefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                        <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <h5 className="font-extrabold text-sm sm:text-base text-slate-100">{benefit.title}</h5>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Column / Form CTA */}
                <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
                  <div className="absolute top-4 right-4 text-slate-800 text-6xl font-black">EPC</div>
                  <h4 className="text-xl sm:text-2xl font-black mb-4 flex items-center gap-2">
                    <Sparkles className="text-amber-500" />
                    {isEn ? "Request Partnership Policy" : "Nhận Chính Sách Chiết Khấu Bán Hàng"}
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm mb-6">
                    {isEn
                      ? "Submit your company or team details to receive direct factory pricing catalog & partnership policy within 2 hours."
                      : "Để lại thông tin để nhận bảng giá đại lý từ nhà phân phối và các cam kết hỗ trợ dự án từ VimSolar."}
                  </p>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">{isEn ? "Company/Team Name" : "Tên Công ty/Tổ đội"}</label>
                      <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none" placeholder={isEn ? "Your organization" : "Nhập tên đơn vị"} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">{isEn ? "Phone/Zalo" : "Số điện thoại / Zalo"}</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none" placeholder="0987..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">{isEn ? "Operating Area" : "Khu vực hoạt động"}</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none" placeholder={isEn ? "City/Province" : "Hà Nội, Hưng Yên..."} />
                      </div>
                    </div>
                    <button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2">
                      <PhoneCall size={18} />
                      {isEn ? "Contact Partner Support" : "Đăng Ký Hợp Tác Đại Lý"}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ambassador"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Info Column */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-extrabold uppercase">
                    <Award size={12} />
                    {isEn ? "Passive Income Program" : "Chương trình gia tăng thu nhập thụ động"}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                    {isEn
                      ? "Become a VimSolar Green Ambassador — Refer & Earn 2% Commission"
                      : "Trở Thành Đại Sứ Xanh VimSolar — Không Ràng Buộc Doanh Số, Hoa Hồng 2%"}
                  </h4>
                  <p className="text-slate-400 text-sm sm:text-base">
                    {isEn
                      ? "Zero investment, no experience, completely flexible. Simply connect businesses or homeowners who need clean solar energy to VimSolar, and get paid handsomely when contracts close."
                      : "Làm việc tự do, không cần bỏ vốn, không ép doanh số. Bạn chỉ cần chia sẻ kiến thức hữu ích hoặc kết nối các chủ hộ gia đình, chủ xưởng có nhu cầu tiết kiệm điện tới VimSolar."}
                  </p>

                  <div className="space-y-6">
                    {ambassadorSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="bg-amber-500 text-slate-950 font-black rounded-lg w-8 h-8 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-md shadow-amber-500/20">
                          {step.step}
                        </div>
                        <div>
                          <h5 className="font-extrabold text-sm sm:text-base text-slate-100">{step.title}</h5>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commission Table Column */}
                <div className="bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
                  <h4 className="text-lg sm:text-xl font-black mb-6 text-center text-white flex items-center justify-center gap-2">
                    <Sparkles className="text-amber-500" />
                    {isEn ? "Estimated Commission Table" : "Bảng Chính Sách Hoa Hồng Đại Sứ"}
                  </h4>

                  <div className="overflow-hidden border border-slate-800 rounded-xl mb-6">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400">
                        <tr>
                          <th className="px-4 py-3 font-extrabold">{isEn ? "Solar Project Value" : "Giá Trị Hợp Đồng"}</th>
                          <th className="px-4 py-3 font-extrabold text-amber-400">{isEn ? "Commission (2%)" : "Hoa Hồng Thực Nhận"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {commissions.map((comm, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-300">{comm.value}</td>
                            <td className="px-4 py-3 font-extrabold text-amber-400">{comm.reward}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed italic text-center mb-6">
                    {isEn
                      ? "*Note: Earnings are processed instantly and transparently within 24 hours of successful contract payment clearance."
                      : "*Chú ý: Hoa hồng được đối soát và thanh toán nhanh chóng trong vòng 24 giờ sau khi khách hàng hoàn tất thanh toán đợt 1."}
                  </p>

                  <a
                    href="tel:0974516670"
                    className="w-full block bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-4 rounded-xl text-center hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
                  >
                    {isEn ? "Call Ambassador Support" : "Liên Hệ Trực Tiếp Để Đăng Ký"}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
