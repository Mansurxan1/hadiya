import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDER_ID = '1741966660219';

async function simulateFiscalization() {
  try {
    console.log('=== ЭТАП 2: СИМУЛЯЦИЯ ФИСКАЛИЗАЦИИ ===');
    
    const orderFilePath = path.join(__dirname, 'data', 'orders', `${ORDER_ID}.json`);
    
    if (!fs.existsSync(orderFilePath)) {
      console.error(`Файл с данными заказа не найден: ${orderFilePath}`);
      return;
    }
    
    const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
    console.log('Данные заказа для фискализации:', orderData);
    
    // Проверяем, что заказ в статусе PAID
    if (orderData.status !== 'PAID') {
      console.error('Заказ должен быть в статусе PAID для фискализации');
      return;
    }
    
    // Формируем данные фискализации
    const fiscalData = {
      paymentId: orderData.orderId,
      qrCodeURL: 'https://api.click.uz/ofd/qr/XYZ987DEF654',
      items: [
        {
          name: orderData.tourName,
          price: parseInt(orderData.price),
          quantity: 1
        }
      ],
      receivedCard: parseInt(orderData.price)
    };
    
    console.log('Данные фискализации:', fiscalData);
    
    // Отправляем уведомление о фискализации
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
      console.log('Уведомление о фискализации отправлено!');
      
      // Обновляем статус заказа после фискализации
      const updatedOrderData = {
        ...orderData,
        status: 'FISCALIZED', // Обновляем статус после фискализации
        fiscalizedAt: new Date().toISOString(), // Время фискализации
        fiscalQRCode: fiscalData.qrCodeURL // Ссылка на QR-код чека
      };
      
      // Сохраняем обновленные данные заказа
      fs.writeFileSync(orderFilePath, JSON.stringify(updatedOrderData, null, 2));
      console.log('Информация о заказе обновлена после фискализации:', updatedOrderData);
      
      return { orderData: updatedOrderData, fiscalData };
    } else {
      console.error('Ошибка при отправке уведомления о фискализации:', result);
      return null;
    }
  } catch (error) {
    console.error('Ошибка при симуляции фискализации:', error);
    throw error;
  }
}

// Вызываем функцию тестирования
try {
  const result = await simulateFiscalization();
  if (result) {
    console.log('Симуляция фискализации заказа успешно завершена!');
  }
} catch (error) {
  console.error('Ошибка при выполнении теста фискализации:', error);
} 