import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "solar.vimgroup@gmail.com",
    pass: process.env.EMAIL_PASS || "dgypcanlnvuvnfdf",
  },
});

export const sendWelcomeEmail = async (toEmail: string, name: string, accessCode: string) => {
  const mailOptions = {
    from: '"VimSolar Ecosystem" <solar.vimgroup@gmail.com>',
    to: toEmail,
    subject: "Mã truy cập Hệ thống tính toán ROI - VimSolar",
    html: `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto; background-color: #f8fafc; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">VIMSOLAR ECOSYSTEM</h1>
            <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Giải pháp Năng lượng mặt trời thông minh</p>
          </div>
          
          <h2 style="color: #0f172a; font-size: 20px;">Xin chào ${name},</h2>
          
          <p style="color: #334155; line-height: 1.6; font-size: 16px;">
            Cảm ơn bạn đã quan tâm và đăng ký sử dụng <strong>Công cụ tính toán hiệu quả đầu tư (ROI Tool)</strong> của VimSolar.
          </p>
          
          <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #92400e; font-size: 14px; margin-top: 0; margin-bottom: 10px; font-weight: bold; text-transform: uppercase;">Mã truy cập của bạn</p>
            <div style="font-size: 32px; font-weight: 900; color: #d97706; letter-spacing: 4px; font-family: monospace;">${accessCode}</div>
          </div>
          
          <p style="color: #334155; line-height: 1.6; font-size: 16px;">
            <strong>Hướng dẫn sử dụng:</strong><br/>
            1. Truy cập vào website: <a href="https://solar.vimgroup.vn" style="color: #f59e0b; text-decoration: none; font-weight: bold;">solar.vimgroup.vn</a><br/>
            2. Mở hộp thoại <strong>ROI Tool</strong><br/>
            3. Nhập mã truy cập <strong>${accessCode}</strong> vào ô xác thực để bắt đầu tính toán.
          </p>

          <p style="color: #64748b; font-size: 14px; margin-top: 30px; font-style: italic;">
            Mã truy cập này được cấp riêng cho bạn và có thời hạn sử dụng lâu dài. Vui lòng không chia sẻ mã này.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          
          <div style="text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;"><strong>VimSolar - Công ty Cổ phần VIMGROUP</strong></p>
            <p style="margin: 5px 0 0;">Hotline: 086 5959 888 | Email: contact@vimgroup.vn</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};
