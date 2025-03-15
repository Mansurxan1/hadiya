// Тестовый скрипт для симуляции обработки платежа
const fs = require('fs');
const path = require('path');
const { sendPaymentNotification } = require('./app/lib/payment/notification');

async function testPaymentNotification() {
  try {
    // Получаем данные заказа
    const orderId = '1741966078005';
    const orderFilePath = path.join(process.cwd(), 'data', 'orders', `${orderId}.json`);
    
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
    
    // Отправляем уведомление о платеже
    console.log('Отправка уведомления о платеже...');
    await sendPaymentNotification(updatedOrderData);
    console.log('Уведомление о платеже отправлено!');
    
    return updatedOrderData;
  } catch (error) {
    console.error('Ошибка при тестировании уведомления о платеже:', error);
  }
}

// Вызываем функцию тестирования
testPaymentNotification().then((result) => {
  console.log('Тест завершен успешно!');
}); 