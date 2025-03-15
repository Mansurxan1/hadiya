import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body as { message?: string }; // Body'dan keladigan ma'lumotlar uchun tip

    if (!message) {
      return NextResponse.json(
        { error: "Отсутствует сообщение" },
        { status: 400 }
      );
    }

    // Отправляем сообщение в Telegram
    await sendTelegramMessage(message);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Ошибка при отправке уведомления в Telegram:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

async function sendTelegramMessage(message: string): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || "-1001234567890"; // Замените на ID вашего чата

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Ошибка отправки в Telegram:", data);
    }
  } catch (error: unknown) {
    console.error("Ошибка при отправке сообщения в Telegram:", error);
  }
}