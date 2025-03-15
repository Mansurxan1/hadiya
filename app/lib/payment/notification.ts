/**
 * Функции для отправки уведомлений о платежах и фискализации
 */

/**
 * Интерфейс для данных заказа
 */
interface OrderData {
  orderId: string;
  tourId?: string;
  tourName?: string;
  price?: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  status: string;
  createdAt: string;
  clickTransId?: string;
  paidAt?: string;
}

/**
 * Интерфейс для данных фискализации
 */
interface FiscalData {
  paymentId: string;
  qrCodeURL: string;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  receivedCard?: number;
}

/**
 * Отправляет уведомление в Telegram о новом заказе
 * 
 * @param orderData Данные заказа
 * @returns Promise<void>
 */
export async function sendOrderNotification(orderData: OrderData): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '5283151626';
    
    if (!botToken) {
      console.error('Отсутствует токен Telegram бота');
      return;
    }
    
    const message = `
🆕 Новый заказ #${orderData.orderId}
🏙️ Тур: ${orderData.tourName || 'Не указано'} (ID: ${orderData.tourId || 'Не указано'})
💰 Сумма: ${orderData.price || 'Не указано'} сум
👤 Клиент: ${orderData.userName || 'Не указано'}
📱 Телефон: ${orderData.userPhone || 'Не указано'}
🔄 Статус: ${orderData.status}
⏱️ Дата: ${new Date().toLocaleString('ru-RU')}
    `;
    
    await sendTelegramMessage(botToken, chatId, message);
  } catch (error: unknown) {
    console.error('Ошибка при отправке уведомления о заказе в Telegram:', error);
  }
}

/**
 * Отправляет уведомление в Telegram о платеже
 * 
 * @param orderData Данные заказа
 * @returns Promise<void>
 */
export async function sendPaymentNotification(orderData: OrderData): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '5283151626';
    
    if (!botToken) {
      console.error('Отсутствует токен Telegram бота');
      return;
    }
    
    const message = `
💰 Платеж получен #${orderData.orderId}
🏙️ Тур: ${orderData.tourName || 'Не указано'} (ID: ${orderData.tourId || 'Не указано'})
💵 Сумма: ${orderData.price || 'Не указано'} сум
👤 Клиент: ${orderData.userName || 'Не указано'}
📱 Телефон: ${orderData.userPhone || 'Не указано'}
🆔 ID транзакции Click: ${orderData.clickTransId || 'Не указано'}
✅ Статус: ${orderData.status}
⏱️ Дата оплаты: ${new Date(orderData.paidAt || '').toLocaleString('ru-RU')}
    `;
    
    await sendTelegramMessage(botToken, chatId, message);
  } catch (error: unknown) {
    console.error('Ошибка при отправке уведомления о платеже в Telegram:', error);
  }
}

/**
 * Отправляет уведомление в Telegram о фискализации платежа
 * 
 * @param orderData Данные заказа
 * @param fiscalData Данные фискализации
 * @returns Promise<void>
 */
export async function sendFiscalNotification(orderData: OrderData, fiscalData: FiscalData): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '5283151626';
    
    if (!botToken) {
      console.error('Отсутствует токен Telegram бота');
      return;
    }
    
    // Формируем информацию о товарах, если есть
    let itemsInfo = '';
    if (fiscalData.items && fiscalData.items.length > 0) {
      itemsInfo = '\n📋 Товары/услуги:\n';
      fiscalData.items.forEach(item => {
        itemsInfo += `- ${item.name}: ${item.price} сум x ${item.quantity} = ${item.price * item.quantity} сум\n`;
      });
    }
    
    const message = `
🧾 Фискальный чек для заказа #${orderData.orderId}
🏙️ Тур: ${orderData.tourName || 'Не указано'} (ID: ${orderData.tourId || 'Не указано'})
💵 Сумма: ${orderData.price || 'Не указано'} сум
👤 Клиент: ${orderData.userName || 'Не указано'}
📱 Телефон: ${orderData.userPhone || 'Не указано'}
🆔 ID транзакции Click: ${orderData.clickTransId || 'Не указано'}${itemsInfo}
🔗 QR-код чека: ${fiscalData.qrCodeURL}
⏱️ Дата фискализации: ${new Date().toLocaleString('ru-RU')}
    `;
    
    await sendTelegramMessage(botToken, chatId, message);
  } catch (error: unknown) {
    console.error('Ошибка при отправке уведомления о фискализации в Telegram:', error);
  }
}

/**
 * Отправляет сообщение в Telegram
 * 
 * @param botToken Токен бота
 * @param chatId ID чата
 * @param message Текст сообщения
 * @returns Promise<boolean>
 */
async function sendTelegramMessage(botToken: string, chatId: string, message: string): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });
    
    const data = await response.json();
    if (!data.ok) {
      console.error('Ошибка отправки в Telegram:', data);
      return false;
    }
    
    return true;
  } catch (error: unknown) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    return false;
  }
} 