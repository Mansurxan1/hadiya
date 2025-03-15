/**
 * Скрипт для ручной симуляции уведомлений от Click
 * 
 * Запуск: ts-node tests/simulate-click-notify.ts <orderId>
 * 
 * Пример: ts-node tests/simulate-click-notify.ts test-1741964994536
 */

// Загружаем переменные окружения из файла .env
import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import crypto from 'crypto';

// Типы данных для ответов API
interface ClickNotifyResponse {
  error: number;
  error_note?: string;
  click_trans_id?: string;
  merchant_trans_id?: string;
  merchant_prepare_id?: string;
  merchant_confirm_id?: string;
}

interface StatusResponse {
  success: boolean;
  error?: string;
  order?: {
    status: string;
    [key: string]: any;
  };
}

// Проверяем, передан ли ID заказа
const orderId = process.argv[2];
if (!orderId) {
  console.error('❌ Ошибка: Не указан ID заказа');
  console.log('Использование: ts-node tests/simulate-click-notify.ts <orderId>');
  process.exit(1);
}

// Конфигурация
const config = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  click: {
    serviceId: process.env.CLICK_SERVICE_ID || 'test_service_id',
    merchantId: process.env.CLICK_MERCHANT_ID || 'test_merchant_id',
    merchantUserId: process.env.CLICK_MERCHANT_USER_ID || 'test_merchant_user_id',
    secretKey: process.env.CLICK_SECRET_KEY || 'test_secret_key'
  },
  testAmount: '10000'
};

/**
 * Симуляция Prepare запроса от Click
 */
async function simulatePrepareRequest() {
  console.log('🔍 Симуляция Prepare запроса от Click...');
  
  try {
    // Генерируем данные запроса
    const clickTransId = Date.now().toString();
    const signTime = Math.floor(Date.now() / 1000).toString();
    const amount = config.testAmount;
    
    // Создаем подпись запроса согласно протоколу Click
    const signString = `${clickTransId}${config.click.serviceId}${orderId}${amount}0${signTime}${config.click.secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    // Формируем тело запроса
    const requestBody = {
      click_trans_id: clickTransId,
      service_id: config.click.serviceId,
      merchant_trans_id: orderId,
      amount: amount,
      action: 0, // Prepare
      error: 0,
      sign_time: signTime,
      sign_string: sign
    };
    
    console.log('📤 Отправка Prepare запроса с данными:', JSON.stringify(requestBody, null, 2));
    
    // Отправляем запрос
    const response = await fetch(`${config.baseUrl}/api/click/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json() as ClickNotifyResponse;
    
    console.log('📥 Ответ на Prepare запрос:', JSON.stringify(data, null, 2));
    
    if (data.error === 0) {
      console.log('✅ Prepare запрос успешно обработан');
      return { success: true, clickTransId: clickTransId };
    } else {
      console.error('❌ Ошибка при обработке Prepare запроса:', data.error_note || 'Неизвестная ошибка');
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Ошибка при выполнении Prepare запроса:', error);
    return { success: false };
  }
}

/**
 * Симуляция Complete запроса от Click
 */
async function simulateCompleteRequest(clickTransId: string) {
  console.log('\n🔍 Симуляция Complete запроса от Click...');
  
  try {
    // Генерируем данные запроса
    const signTime = Math.floor(Date.now() / 1000).toString();
    const amount = config.testAmount;
    
    // Создаем подпись запроса согласно протоколу Click
    const signString = `${clickTransId}${config.click.serviceId}${orderId}${amount}1${signTime}${config.click.secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    // Формируем тело запроса
    const requestBody = {
      click_trans_id: clickTransId,
      service_id: config.click.serviceId,
      merchant_trans_id: orderId,
      amount: amount,
      action: 1, // Complete
      error: 0,
      sign_time: signTime,
      sign_string: sign
    };
    
    console.log('📤 Отправка Complete запроса с данными:', JSON.stringify(requestBody, null, 2));
    
    // Отправляем запрос
    const response = await fetch(`${config.baseUrl}/api/click/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json() as ClickNotifyResponse;
    
    console.log('📥 Ответ на Complete запрос:', JSON.stringify(data, null, 2));
    
    if (data.error === 0) {
      console.log('✅ Complete запрос успешно обработан');
      return { success: true };
    } else {
      console.error('❌ Ошибка при обработке Complete запроса:', data.error_note || 'Неизвестная ошибка');
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Ошибка при выполнении Complete запроса:', error);
    return { success: false };
  }
}

/**
 * Проверка статуса заказа после обработки
 */
async function checkOrderStatus() {
  console.log('\n🔍 Проверка статуса заказа...');
  
  try {
    // Отправляем запрос на проверку статуса
    const response = await fetch(`${config.baseUrl}/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId
      }),
    });
    
    const data = await response.json() as StatusResponse;
    
    console.log('📥 Ответ API статуса заказа:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      if (data.order && data.order.status === 'PAID') {
        console.log('✅ Заказ успешно оплачен');
      } else {
        console.log(`ℹ️ Статус заказа: ${data.order?.status || 'Неизвестно'}`);
      }
    } else {
      console.error('❌ Ошибка при проверке статуса заказа:', data.error);
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке статуса заказа:', error);
  }
}

// Запуск сценария тестирования
async function runSimulation() {
  console.log('=== 🚀 Запуск симуляции уведомлений Click ===');
  console.log(`📝 ID заказа: ${orderId}`);
  
  // Шаг 1: Prepare
  const prepareResult = await simulatePrepareRequest();
  if (!prepareResult.success) {
    console.error('❌ Симуляция прервана из-за ошибки на этапе Prepare');
    return;
  }
  
  // Шаг 2: Complete
  const completeResult = await simulateCompleteRequest(prepareResult.clickTransId!);
  if (!completeResult.success) {
    console.error('❌ Симуляция прервана из-за ошибки на этапе Complete');
    return;
  }
  
  // Шаг 3: Проверка статуса
  console.log('\n⏳ Ожидание обновления статуса заказа (2 секунды)...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  await checkOrderStatus();
  
  console.log('\n=== 🎉 Симуляция уведомлений Click завершена ===');
}

// Запуск скрипта
runSimulation().catch(console.error); 