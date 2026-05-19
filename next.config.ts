import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" } // Cho phép tải ảnh từ mọi domain (do nguồn ảnh tạo ra có thể linh hoạt từ nhiều dịch vụ)
    ],
  },
};

export default nextConfig;
