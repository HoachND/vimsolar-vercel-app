// ============================================================
// GOOGLE APPS SCRIPT - VIMSOLAR LEAD AUTOMATION
// Email: solar.vimgroup@gmail.com
// ============================================================
// HƯỚNG DẪN CÀI ĐẶT:
// 1. Mở Google Sheet "Data Customer_vimsolar.vercel.app" bằng email solar.vimgroup@gmail.com
//    Link: https://docs.google.com/spreadsheets/d/1qHj3Jee25PRetL2JKww4XJgUIJ5BatPOHARKiJBTdek/edit
// 2. Vào Tiện ích mở rộng → Apps Script
// 3. Xoá code mặc định, dán TOÀN BỘ code này vào
// 4. Bấm Lưu (Ctrl+S)
// 5. Bấm Triển khai → Tùy chọn triển khai mới → Chọn loại: Ứng dụng web (Web App)
//    - Mô tả: "VimSolar Lead Capture v1"
//    - Thực thi dưới quyền: Tôi (solar.vimgroup@gmail.com)
//    - Ai có quyền truy cập: Bất kỳ ai (Anyone)
// 6. Bấm Triển khai → Copy URL Web App
// 7. Dán URL vào file route.ts (biến GOOGLE_APPS_SCRIPT_URL)
// ============================================================

// Tên Sheet chứa data (phải khớp tên tab bên dưới)
var SHEET_NAME = "Leads_VimSolar";

// Thông tin Messenger để chèn vào Email
var MESSENGER_URL = "https://m.me/vimsolar";

// Thông tin Hotline
var HOTLINE = "0974 516 670";

function doGet(e) { return processRequest(e); }

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById("1qHj3Jee25PRetL2JKww4XJgUIJ5BatPOHARKiJBTdek");
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Thời gian', 'Họ tên', 'Số điện thoại', 'Email', 'Loại công trình', 'Nguồn']);
    }

    // Parse dữ liệu JSON từ NextJS
    var data = JSON.parse(e.postData.contents);
    var name = data.name || "Khách hàng";
    var phone = data.phone || "";
    var email = data.email || "";
    var projectType = data.projectType || "";
    var source = data.source || "Form Báo Giá - vimsolar.vercel.app";
    var language = data.language || "vi";

    // 1. GHI VÀO GOOGLE SHEET
    var timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    sheet.appendRow([timestamp, name, phone, email, projectType, source]);

    // 2. GỬI EMAIL CHÀO MỪNG KHÁCH HÀNG
    if (email && email.includes("@")) {
      sendWelcomeEmail(name, email, phone, projectType, language);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ "status": "success", "message": "Data saved & email sent" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ "status": "error", "message": err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function processRequest(e) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// HÀM GỬI EMAIL CHÀO MỪNG
// ============================================================
function sendWelcomeEmail(name, email, phone, projectType, language) {
  var isEn = language === "en";

  var subject = isEn
    ? "☀️ Thank you for contacting VimSolar - We will respond within 24h!"
    : "☀️ Cảm ơn bạn đã liên hệ VimSolar - Chúng tôi sẽ phản hồi trong 24h!";

  var htmlBody = '<!DOCTYPE html>' +
    '<html>' +
    '<head><meta charset="utf-8"></head>' +
    '<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:Arial,Helvetica,sans-serif;">' +

    // WRAPPER
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;">' +
    '<tr><td align="center" style="padding:30px 10px;">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">' +

    // HEADER
    '<tr><td style="background: linear-gradient(135deg, #0C4A6E 0%, #0f172a 100%); padding:35px 30px; text-align:center;">' +
    '<h1 style="color:#F59E0B; margin:0; font-size:32px; font-weight:800; letter-spacing:1px;">VimSolar</h1>' +
    '<p style="color:#94a3b8; margin:8px 0 0 0; font-size:14px; letter-spacing:3px;">' + (isEn ? 'ROOFTOP SOLAR SOLUTIONS' : 'GIẢI PHÁP ĐIỆN MẶT TRỜI ÁP MÁI') + '</p>' +
    '<p style="color:#64748b; margin:4px 0 0 0; font-size:12px;">' + (isEn ? 'A brand of VIMGROUP Investment JSC' : 'Trực thuộc Công ty Cổ phần Đầu tư VIMGROUP') + '</p>' +
    '</td></tr>' +

    // GREETING
    '<tr><td style="padding:35px 35px 10px 35px;">' +
    '<h2 style="color:#1e293b; margin:0 0 15px 0; font-size:22px;">' + (isEn ? 'Hello' : 'Xin chào') + ' <span style="color:#D97706;">' + name + '</span> 👋</h2>' +
    '<p style="color:#475569; line-height:1.8; margin:0; font-size:15px;">' +
    (isEn
      ? 'Thank you for your interest in the <strong>rooftop solar solutions</strong> from <strong style="color:#D97706;">VimSolar</strong>.'
      : 'Cảm ơn bạn đã tin tưởng và quan tâm đến giải pháp <strong>điện mặt trời áp mái</strong> của <strong style="color:#D97706;">VimSolar</strong>.') +
    '</p>' +
    '</td></tr>' +

    // THÔNG TIN ĐĂNG KÝ
    '<tr><td style="padding:15px 35px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border-radius:12px; border:1px solid #fde68a;">' +
    '<tr><td style="padding:20px 25px;">' +
    '<h3 style="color:#92400e; margin:0 0 12px 0; font-size:16px;">' + (isEn ? '📋 Your Registration Info:' : '📋 Thông tin đăng ký của bạn:') + '</h3>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td style="padding:6px 0; color:#78350f; font-size:14px; width:140px;">' + (isEn ? '👤 Full Name:' : '👤 Họ và tên:') + '</td><td style="padding:6px 0; color:#1e293b; font-size:14px; font-weight:bold;">' + name + '</td></tr>' +
    '<tr><td style="padding:6px 0; color:#78350f; font-size:14px;">' + (isEn ? '📞 Phone Number:' : '📞 Số điện thoại:') + '</td><td style="padding:6px 0; color:#1e293b; font-size:14px; font-weight:bold;">' + phone + '</td></tr>' +
    '<tr><td style="padding:6px 0; color:#78350f; font-size:14px;">' + (isEn ? '🏢 Project Type:' : '🏢 Loại công trình:') + '</td><td style="padding:6px 0; color:#D97706; font-size:14px; font-weight:bold;">' + (projectType || (isEn ? 'Unknown' : 'Chưa xác định')) + '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</td></tr>' +

    // BƯỚC TIẾP THEO
    '<tr><td style="padding:15px 35px;">' +
    '<div style="background: linear-gradient(135deg, #0C4A6E 0%, #0f172a 100%); border-radius:12px; padding:25px 25px;">' +
    '<h3 style="color:#F59E0B; margin:0 0 12px 0; font-size:16px;">' + (isEn ? '⚡ Next Steps:' : '⚡ Bước tiếp theo:') + '</h3>' +
    '<p style="color:#e2e8f0; margin:0; line-height:1.7; font-size:14px;">' +
    (isEn
      ? '✅ A VimSolar <strong>engineer</strong> will contact you via <strong>Zalo / Phone</strong> within <strong style="color:#F59E0B;">24h</strong>.<br>' +
      '✅ You will receive a <strong>detailed quote</strong> with a suitable technical plan.<br>' +
      '✅ <strong>FREE</strong> site survey — no hidden costs.'
      : '✅ <strong>Kỹ sư</strong> VimSolar sẽ liên hệ trực tiếp qua <strong>Zalo / SĐT</strong> trong vòng <strong style="color:#F59E0B;">24h</strong>.<br>' +
      '✅ Bạn sẽ nhận được <strong>bản báo giá chi tiết</strong> kèm phương án kỹ thuật phù hợp.<br>' +
      '✅ Khảo sát hiện trường <strong>MIỄN PHÍ</strong> — không phát sinh chi phí.') +
    '</p>' +
    '</div>' +
    '</td></tr>' +

    // NÚT MESSENGER
    '<tr><td style="padding:25px 35px; text-align:center;">' +
    '<p style="color:#64748b; font-size:14px; margin:0 0 15px 0;">' + (isEn ? '💬 For the <strong>fastest</strong> support, chat directly:' : '💬 Để được hỗ trợ <strong>nhanh nhất</strong>, chat trực tiếp:') + '</p>' +
    '<a href="' + MESSENGER_URL + '" target="_blank" style="display:inline-block; background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%); color:#ffffff; text-decoration:none; padding:15px 40px; border-radius:50px; font-weight:bold; font-size:16px; box-shadow:0 4px 15px rgba(0,132,255,0.4);">' +
    (isEn ? '💬 CHAT VIA MESSENGER' : '💬 CHAT QUA MESSENGER') +
    '</a>' +
    '<p style="color:#94a3b8; font-size:12px; margin:12px 0 0 0;">' + (isEn ? 'Or call Hotline: ' : 'Hoặc gọi Hotline: ') + '<strong style="color:#D97706;">' + HOTLINE + '</strong></p>' +
    '</td></tr>' +

    // TẠI SAO CHỌN VIMSOLAR
    '<tr><td style="padding:10px 35px 25px 35px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">' +
    '<tr><td style="padding:20px 25px;">' +
    '<h3 style="color:#1e293b; margin:0 0 15px 0; font-size:15px; text-align:center;">' + (isEn ? '☀️ Why choose VimSolar?' : '☀️ Tại sao chọn VimSolar?') + '</h3>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    (isEn
      ? '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ High-efficiency N-type <strong>TOPCon</strong> panels, Bifacial</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ Smart <strong>Hybrid</strong> Inverter with AI integration</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ <strong>LiFePO4</strong> safe & durable storage battery for 10+ years</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ <strong>25-year</strong> performance warranty, 5-year installation</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ <strong>FREE</strong> survey, <strong>transparent</strong> quote</td></tr>'
      : '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ Tấm pin N-type <strong>TOPCon</strong> hiệu suất cao, Bifacial</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ Biến tần <strong>Hybrid</strong> thông minh, tích hợp AI</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ Pin lưu trữ <strong>LiFePO4</strong> an toàn, bền bỉ 10 năm+</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ Bảo hành <strong>25 năm</strong> hiệu suất, thi công 5 năm</td></tr>' +
      '<tr><td style="padding:4px 0; color:#475569; font-size:13px;">✔️ Khảo sát <strong>MIỄN PHÍ</strong>, báo giá <strong>minh bạch</strong></td></tr>'
    ) +
    '</table>' +
    '</td></tr></table>' +
    '</td></tr>' +

    // FOOTER
    '<tr><td style="background-color:#0C4A6E; padding:25px 35px; text-align:center;">' +
    '<p style="color:#F59E0B; font-size:16px; font-weight:bold; margin:0 0 5px 0;">VimSolar - VIMGROUP</p>' +
    '<p style="color:#94a3b8; font-size:12px; margin:0 0 3px 0;">📍 B88 ' + (isEn ? 'Pho Truc, Ecopark, Phung Cong, Hung Yen' : 'Phố Trúc, KĐT Ecopark, Phụng Công, Hưng Yên') + '</p>' +
    '<p style="color:#94a3b8; font-size:12px; margin:0 0 3px 0;">📞 Hotline: ' + HOTLINE + '</p>' +
    '<p style="color:#94a3b8; font-size:12px; margin:0 0 10px 0;">📧 solar.vimgroup@gmail.com</p>' +
    '<p style="color:#64748b; font-size:11px; margin:0;">© 2026 VimSolar by VIMGROUP. All rights reserved.</p>' +
    '</td></tr>' +

    '</table>' +
    '</td></tr></table>' +
    '</body></html>';

  // Gửi email từ tài khoản solar.vimgroup@gmail.com
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: isEn ? "VimSolar - Solar Solutions" : "VimSolar - Giải Pháp Điện Mặt Trời"
  });
}

// ============================================================
// HÀM TEST (chạy thử trong Apps Script editor)
// ============================================================
function testSendEmail() {
  sendWelcomeEmail("Sếp Hoạch", "test@gmail.com", "0974516670", "Hộ gia đình", "vi");
  Logger.log("Email test đã gửi thành công!");
}
