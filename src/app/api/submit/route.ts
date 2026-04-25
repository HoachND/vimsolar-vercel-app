import { NextResponse } from 'next/server';

const BOT_TOKEN = '8724327895:AAG4lf55tebnB0RhCqxwoTa_-rG4T8QXutQ';
const CHAT_ID = '-5179603882';

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
📌 Nguồn: Form Báo Giá - vimsolar.vercel.app
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

    // GỬI ĐẾN GOOGLE APPS SCRIPT (Ghi Sheet + Email chào mừng)
    // ⚠️ SẾP: Thay URL bên dưới bằng URL Web App sau khi triển khai GAS
    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEdnk__IV7PAx4X8LoCB6lfkil0u1q7Zsa9RborC4zSBeKAKwLyNiilFV4A_GPNAg/exec";

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...data,
          source: "Form Báo Giá - vimsolar.vercel.app"
        }),
      });
    } catch (gasError) {
      console.error('GAS Error (non-blocking):', gasError);
    }

    return NextResponse.json({ success: true, message: "Gửi thông tin thành công." });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Lỗi khi gửi thông tin:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
