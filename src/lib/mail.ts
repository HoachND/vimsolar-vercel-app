import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || 'solar.vimgroup@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || ''; // Should be App Password

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, name: string, roleLabel: string) => {
  if (!SMTP_PASS) {
    console.warn("SMTP_PASS not found in .env, skipping email sending to", email);
    return;
  }
  
  const mailOptions = {
    from: `"VimSolar" <${SMTP_USER}>`,
    to: email,
    subject: `Chào mừng ${name} đến với hệ thống VimSolar!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-w-2xl; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10B981;">Chào mừng bạn đến với mạng lưới VimSolar!</h2>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký trở thành <strong>${roleLabel}</strong> của VimSolar. Tài khoản của bạn đã được khởi tạo thành công.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Thông tin tài khoản:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Email/Username:</strong> ${email}</li>
            <li><strong>Loại tài khoản:</strong> ${roleLabel}</li>
          </ul>
        </div>

        <p>Vui lòng đăng nhập vào cổng thông tin để cập nhật hồ sơ và bắt đầu trải nghiệm các tính năng của chúng tôi.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://solar.vimgroup.vn" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Truy cập ngay</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">
          Đây là email tự động từ hệ thống VimSolar. Vui lòng không trả lời email này.<br>
          CÔNG TY CỔ PHẦN TẬP ĐOÀN VIMGROUP<br>
          KCN Phố Nối A, Văn Lâm, Hưng Yên.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAIL] Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`[MAIL] Failed to send email to ${email}`, error);
  }
};

export const sendPasswordResetEmail = async (email: string, newPasswordOrLink: string) => {
  if (!SMTP_PASS) {
    console.warn("SMTP_PASS not found, skipping reset email to", email);
    return;
  }
  
  const mailOptions = {
    from: `"VimSolar" <${SMTP_USER}>`,
    to: email,
    subject: `Khôi phục mật khẩu tài khoản VimSolar`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">Yêu cầu khôi phục mật khẩu</h2>
        <p>Hệ thống vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;">Mật khẩu tạm thời của bạn là: <strong style="font-size: 18px; color: #1e40af;">${newPasswordOrLink}</strong></p>
        </div>

        <p>Vui lòng đăng nhập bằng mật khẩu tạm thời này và thay đổi mật khẩu ngay lập tức tại mục quản lý hồ sơ.</p>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">
          VimSolar Support Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAIL] Reset password email sent to ${email}`);
  } catch (error) {
    console.error(`[MAIL] Failed to send reset email to ${email}`, error);
  }
};
