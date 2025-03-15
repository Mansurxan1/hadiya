// Тестовый скрипт для симуляции обработки платежа
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPaymentNotification() {
  try {
    // Получаем данные заказа
    const orderId = '1741966078005';
    const orderFilePath = path.join(__dirname, 'data', 'orders', `${orderId}.json`);
    
    if (!fs.existsSync(orderFilePath)) {
      console.error(`Файл с данными заказа не найден: ${orderFilePath}`);
      return;
    }
    
    const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
    
    // Обновляем данные заказа как будто оплата прошла успешно
    const updatedOrderData = {
      ...orderData,
      clickTransId: '123456789', // ID транзакции Click
      status: 'PAID', // Статус оплаты
      paidAt: new Date().toISOString() // Время оплаты
    };
    
    // Сохраняем обновленные данные заказа
    fs.writeFileSync(orderFilePath, JSON.stringify(updatedOrderData, null, 2));
    console.log('Информация о заказе обновлена:', updatedOrderData);
    
    // Отправляем уведомление о платеже напрямую через Telegram API
    console.log('Отправка уведомления о платеже...');
    
    // Формируем сообщение
    const message = `
💰 Платеж получен #${updatedOrderData.orderId}
🏙️ Тур: ${updatedOrderData.tourName || 'Не указано'} (ID: ${updatedOrderData.tourId || 'Не указано'})
💵 Сумма: ${updatedOrderData.price || 'Не указано'} сум
👤 Клиент: ${updatedOrderData.userName || 'Не указано'}
📱 Телефон: ${updatedOrderData.userPhone || 'Не указано'}
🆔 ID транзакции Click: ${updatedOrderData.clickTransId || 'Не указано'}
✅ Статус: ${updatedOrderData.status}
⏱️ Дата оплаты: ${new Date(updatedOrderData.paidAt || '').toLocaleString('ru-RU')}
    `;
    
    // Отправляем сообщение в Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8154199213:AAGf7rETgpEp27XQMwvfb1Ef7jslvkTthFY';
    const chatId = process.env.TELEGRAM_CHAT_ID || '5283151626';
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('Уведомление о платеже отправлено!');
    } else {
      console.error('Ошибка при отправке уведомления:', result);
    }
    
    return updatedOrderData;
  } catch (error) {
    console.error('Ошибка при тестировании уведомления о платеже:', error);
  }
}

// Вызываем функцию тестирования
await testPaymentNotification();
console.log('Тест завершен!'); 