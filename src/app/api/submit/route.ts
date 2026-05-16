import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8724327895:AAG4lf55tebnB0RhCqxwoTa_-rG4T8QXutQ';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003947452569';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, phone, email, projectType } = data;

    const message = `☀️ KHÁCH HÀNG MỚI - VIMSOLAR!
━━━━━━━━━━━━━━━━━━
👤 Tên KH: ${name}
📞 SĐT: ${phone}
📧 Email: ${email || 'Không có'}
🏢 Loại công trình: ${projectType || 'Không rõ'}
📌 Nguồn: Form Báo Giá - VimSolar Landing Page
━━━━━━━━━━━━━━━━━━
⚡ Gọi ngay để tư vấn!`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error('Telegram API responded with ' + response.status);
    }

    // GỬI ĐẾN GOOGLE APPS SCRIPT DỰ ÁN (VimSolar Sheet + Email chào mừng)
    const PROJECT_GAS_URL = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbyEdnk__IV7PAx4X8LoCB6lfkil0u1q7Zsa9RborC4zSBeKAKwLyNiilFV4A_GPNAg/exec";

    // GỬI ĐẾN GOOGLE APPS SCRIPT TỔNG (0.0.TOTAL DATA CUSTOMER_VIMGROUP_2026)
    // Theo yêu cầu của Sếp Hoạch: Lưu đồng thời vào 2 file
    const GLOBAL_GAS_URL = "https://script.google.com/macros/s/AKfycbzVK3sPVnbDfcRxk8n_5vi-gRU2X_1GTXVHuU8kcrk6Kfk3wkpqKRDJACtb3msUFRm6/exec"; // TOTAL DATA VIMGROUP 2026
    const GLOBAL_SHEET_ID = "1LAtBjiRbwTxt7qu9XSYwzbVMNYBvC6guq-Zv_Yp3Cf0";

    try {
      // Chạy cả 2 fetch đồng thời để tối ưu tốc độ
      await Promise.all([
        // Gửi cho dự án
        fetch(PROJECT_GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ ...data, source: "vimsolar.vercel.app" }),
        }),
        // Gửi cho Database Tổng VIMGROUP
        fetch(GLOBAL_GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ 
            ...data, 
            source: "solar.vimgroup.vn (contact-form)",
            targetSheetId: GLOBAL_SHEET_ID 
          }),
        })
      ]);
    } catch (gasError) {
      console.error('GAS Synchronization Error (non-blocking):', gasError);
    }

    return NextResponse.json({ success: true, message: "Gửi thông tin thành công và đã lưu đồng bộ." });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Lỗi khi gửi thông tin:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
