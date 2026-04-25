import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VimSolar - Giải Pháp Điện Mặt Trời Áp Mái | VIMGROUP",
  description: "VimSolar by VIMGROUP - Chuyên tư vấn, thiết kế và lắp đặt hệ thống điện năng lượng mặt trời áp mái cho hộ gia đình và doanh nghiệp. Tiết kiệm đến 90% chi phí điện. Hoàn vốn từ 3-5 năm. Bảo hành 25 năm.",
  keywords: "điện mặt trời, solar, năng lượng mặt trời, VimSolar, VIMGROUP, lắp đặt điện mặt trời, solar áp mái, tiết kiệm điện, Hưng Yên, Ecopark",
  openGraph: {
    title: "VimSolar - Biến Mái Nhà Thành Tài Sản",
    description: "Giải pháp điện mặt trời EPC trọn gói cho doanh nghiệp và hộ gia đình. Tiết kiệm 90% chi phí điện.",
    type: "website",
    locale: "vi_VN",
    images: ["/images/banner-vimsolar.png"],
  },
  icons: {
    icon: "/images/logo-vimsolar.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
