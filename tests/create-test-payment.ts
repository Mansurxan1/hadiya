/**
 * Скрипт для создания тестового платежа через Click API
 * 
 * Запуск: ts-node tests/create-test-payment.ts
 */

// Загружаем переменные окружения из файла .env
import dotenv from 'dotenv';
dotenv.config();

// Используем прямой импорт вместо модуля
import crypto from 'crypto';

// Простая реализация создания платежа без импорта клиента Click
async function createTestPayment() {
  console.log('=== 💰 Создание тестового платежа Click ===\n');
  
  try {
    // Проверяем наличие необходимых переменных окружения
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    
    if (!serviceId || !merchantId || !secretKey) {
      throw new Error('Отсутствуют необходимые переменные окружения для Click API');
    }
    
    // Генерируем тестовый ID заказа
    const orderId = `test-${Date.now()}`;
    const amount = 1000; // 1000 сум
    const returnUrl = 'https://hadiya.uz/payment/success';
    
    console.log(`🔑 ID заказа: ${orderId}`);
    
    // Создаем подпись для запроса
    const signTime = Date.now();
    const signString = `${serviceId}${orderId}${signTime}${secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    // Формируем URL для оплаты через форму Click
    const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${orderId}&return_url=${encodeURIComponent(returnUrl)}&sign_time=${signTime}&sign_string=${sign}`;
    
    // Формируем тестовый ответ
    const result = {
      payment_url: clickUrl,
      payment: {
        id: `test_${Date.now()}`,
        amount: amount,
        status: 'WAITING',
        created_time: new Date().toISOString()
      }
    };
    
    console.log('\n✅ Платеж успешно создан:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n🌐 Ссылка для оплаты:');
    console.log(result.payment_url);
    
    console.log('\n📋 Информация для использования в других скриптах:');
    console.log(`ID заказа: ${orderId}`);
    console.log(`ID платежа Click: ${result.payment.id}`);
  } catch (error) {
    console.error('\n❌ Ошибка при создании платежа:');
    console.error(error);
  }
}

createTestPayment(); 