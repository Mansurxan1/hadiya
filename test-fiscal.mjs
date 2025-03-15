// Тестовый скрипт для симуляции фискализации платежа
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testFiscalNotification() {
  try {
    // Получаем данные заказа
    const orderId = '1741966078005';
    const orderFilePath = path.join(__dirname, 'data', 'orders', `${orderId}.json`);
    
    if (!fs.existsSync(orderFilePath)) {
      console.error(`Файл с данными заказа не найден: ${orderFilePath}`);
      return;
    }
    
    const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
    
    // Убедимся, что заказ оплачен
    if (orderData.status !== 'PAID') {
      console.error('Заказ должен быть в статусе PAID для фискализации');
      return;
    }
    
    // Данные фискализации
    const fiscalData = {
      paymentId: orderData.orderId,
      qrCodeURL: 'https://api.click.uz/ofd/qr/ABC123DEF456',
      items: [
        {
          name: orderData.tourName,
          price: parseInt(orderData.price),
          quantity: 1
        }
      ],
      receivedCard: parseInt(orderData.price)
    };
    
    // Отправляем уведомление о фискализации напрямую через Telegram API
    console.log('Отправка уведомления о фискализации...');
    
    // Формируем информацию о товарах
    let itemsInfo = '';
    if (fiscalData.items && fiscalData.items.length > 0) {
      itemsInfo = '\n📋 Товары/услуги:\n';
      fiscalData.items.forEach(item => {
        itemsInfo += `- ${item.name}: ${item.price} сум x ${item.quantity} = ${item.price * item.quantity} сум\n`;
      });
    }
    
    // Формируем сообщение
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
    
    // Отправляем сообщение в Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
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
      console.log('Уведомление о фискализации отправлено!');
    } else {
      console.error('Ошибка при отправке уведомления:', result);
    }
    
    return { orderData, fiscalData };
  } catch (error) {
    console.error('Ошибка при тестировании уведомления о фискализации:', error);
  }
}

// Вызываем функцию тестирования
await testFiscalNotification();
console.log('Тест завершен!'); 