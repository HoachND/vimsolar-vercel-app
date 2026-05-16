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
    subject: `Mã truy cập ROI Tool: ${accessCode} - VimSolar Ecosystem`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="color: #f59e0b; font-weight: 900; font-size: 28px; letter-spacing: -1px;">VIMSOLAR</div>
            <div style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Premium Solar Solutions</div>
          </div>
          
          <h2 style="color: #0f172a; font-size: 22px; text-align: center; margin-bottom: 24px;">Xin chào ${name} 👋,</h2>
          
          <p style="color: #334155; line-height: 1.6; font-size: 16px; text-align: center;">
            Cảm ơn bạn đã đăng ký sử dụng <strong>Công cụ tính toán hiệu quả đầu tư (ROI Tool)</strong> của VimSolar.
          </p>
          
          <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px dashed #f59e0b; border-radius: 16px; padding: 30px; text-align: center; margin: 32px 0;">
            <p style="color: #92400e; font-size: 13px; margin-top: 0; margin-bottom: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Mã truy cập độc quyền của bạn</p>
            <div style="font-size: 48px; font-weight: 900; color: #d97706; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 4px rgba(217, 119, 6, 0.1);">${accessCode}</div>
          </div>
          
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
            <h3 style="color: #0f172a; font-size: 15px; margin-top: 0;">🚀 Hướng dẫn kích hoạt:</h3>
            <ol style="color: #475569; font-size: 14px; padding-left: 20px; line-height: 1.8;">
              <li>Truy cập: <a href="https://solar.vimgroup.vn/tu-van" style="color: #f59e0b; font-weight: bold; text-decoration: none;">solar.vimgroup.vn/tu-van</a></li>
              <li>Chọn mục <strong>"Nhập mã truy cập"</strong></li>
              <li>Nhập mã <strong>${accessCode}</strong> để bắt đầu.</li>
            </ol>
          </div>

          <p style="color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.6;">
            Mã này giúp bạn bỏ qua các bước đăng ký trong tương lai. <br/>Vui lòng lưu giữ mã này để thuận tiện tra cứu.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          
          <div style="text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0; font-weight: bold; color: #475569;">VimSolar by VIMGROUP</p>
            <p style="margin: 4px 0;">Hotline: 0974 516 670 | Website: vimgroup.vn</p>
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
