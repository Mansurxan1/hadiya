/**
 * Тесты интеграции с Click Payment System
 * 
 * Эти тесты проверяют полный цикл интеграции с платежной системой Click:
 * 1. Создание платежа
 * 2. Симуляция уведомлений от Click
 * 3. Проверка статуса платежа
 */

// Загружаем переменные окружения из файла .env
import dotenv from 'dotenv';
dotenv.config();

// Импортируем необходимые модули
import fetch from 'node-fetch';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Типы данных для ответов API
interface CreatePaymentResponse {
  success: boolean;
  redirectUrl?: string;
  orderId?: string;
  error?: string;
}

interface ClickNotifyResponse {
  error: number;
  error_note?: string;
  click_trans_id?: string;
  merchant_trans_id?: string;
  merchant_prepare_id?: string;
  merchant_confirm_id?: string;
}

interface StatusByOrderIdResponse {
  success: boolean;
  error?: string;
  order?: {
    orderId: string;
    transactionId?: string;
    status: string;
    statusDescription: string;
    paidAt?: string;
    tourName: string;
    price: string;
    customer: {
      name?: string;
      phone?: string;
    }
  };
}

interface StatusByTransactionIdResponse {
  success: boolean;
  error?: string;
  transaction?: {
    transactionId: string;
    merchantTransId: string;
    status: string;
    statusDescription: string;
    amount: string;
    paymentStatus: number;
    createdTime?: string;
    payTime?: string;
  };
}

// Конфигурация для тестов
const config = {
  // Базовый URL сервера, в зависимости от вашего окружения
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  
  // Тестовые данные заказа
  testOrder: {
    tourId: 'test-tour-1',
    tourName: 'Тестовый тур',
    price: '10000',
    userName: 'Тестовый пользователь',
    userPhone: '+998901234567'
  },
  
  // Тестовые реквизиты Click (для тестовой среды)
  click: {
    serviceId: process.env.CLICK_SERVICE_ID || 'test_service_id',
    merchantId: process.env.CLICK_MERCHANT_ID || 'test_merchant_id',
    merchantUserId: process.env.CLICK_MERCHANT_USER_ID || 'test_merchant_user_id',
    secretKey: process.env.CLICK_SECRET_KEY || 'test_secret_key'
  }
};

// Утилиты для тестов
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const readFile = promisify(fs.readFile);

// Сохраняем результаты тестов
let testResults: { [key: string]: any } = {};

/**
 * Тест 1: Создание платежа
 * 
 * Отправляет запрос на создание заказа и проверяет корректность ответа
 */
async function testCreatePayment() {
  console.log('\n🔍 Тест 1: Создание платежа');
  
  try {
    const response = await fetch(`${config.baseUrl}/api/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config.testOrder),
    });
    
    const data = await response.json() as CreatePaymentResponse;
    
    // Проверяем корректность ответа
    if (!data.success) {
      throw new Error(`Ошибка при создании платежа: ${data.error}`);
    }
    
    if (!data.redirectUrl || !data.redirectUrl.includes('click.uz/services/pay')) {
      throw new Error('Некорректный URL перенаправления');
    }
    
    if (!data.orderId) {
      throw new Error('Отсутствует ID заказа в ответе');
    }
    
    // Сохраняем orderId для использования в следующих тестах
    testResults.orderId = data.orderId;
    testResults.redirectUrl = data.redirectUrl;
    
    console.log('✅ Тест создания платежа пройден');
    console.log(`📝 ID заказа: ${data.orderId}`);
    console.log(`🔗 URL для оплаты: ${data.redirectUrl}`);
    
    return true;
  } catch (error) {
    console.error('❌ Тест создания платежа не пройден:', error);
    return false;
  }
}

/**
 * Тест 2: Симуляция Prepare запроса от Click
 * 
 * Симулирует prepare-запрос от Click и проверяет корректность ответа
 */
async function testPrepareRequest() {
  console.log('\n🔍 Тест 2: Симуляция Prepare запроса от Click');
  
  if (!testResults.orderId) {
    console.error('❌ Тест не может быть выполнен: отсутствует ID заказа');
    return false;
  }
  
  try {
    // Генерируем данные запроса
    const clickTransId = Date.now().toString();
    const signTime = Math.floor(Date.now() / 1000).toString();
    const amount = config.testOrder.price;
    
    // Создаем подпись запроса согласно протоколу Click
    const signString = `${clickTransId}${config.click.serviceId}${testResults.orderId}${amount}0${signTime}${config.click.secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    // Формируем тело запроса
    const requestBody = {
      click_trans_id: clickTransId,
      service_id: config.click.serviceId,
      merchant_trans_id: testResults.orderId,
      amount: amount,
      action: 0, // Prepare
      error: 0,
      sign_time: signTime,
      sign_string: sign
    };
    
    // Отправляем запрос
    const response = await fetch(`${config.baseUrl}/api/click/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json() as ClickNotifyResponse;
    
    // Проверяем корректность ответа
    if (data.error !== 0) {
      throw new Error(`Ошибка в ответе на prepare-запрос: ${data.error_note || 'Неизвестная ошибка'}`);
    }
    
    if (data.merchant_trans_id !== testResults.orderId) {
      throw new Error('ID заказа в ответе не соответствует отправленному');
    }
    
    // Сохраняем данные для следующих тестов
    testResults.clickTransId = clickTransId;
    
    console.log('✅ Тест Prepare запроса пройден');
    console.log(`📝 Click Trans ID: ${clickTransId}`);
    
    return true;
  } catch (error) {
    console.error('❌ Тест Prepare запроса не пройден:', error);
    return false;
  }
}

/**
 * Тест 3: Симуляция Complete запроса от Click
 * 
 * Симулирует complete-запрос от Click и проверяет корректность ответа
 */
async function testCompleteRequest() {
  console.log('\n🔍 Тест 3: Симуляция Complete запроса от Click');
  
  if (!testResults.orderId || !testResults.clickTransId) {
    console.error('❌ Тест не может быть выполнен: отсутствуют необходимые данные');
    return false;
  }
  
  try {
    // Генерируем данные запроса
    const signTime = Math.floor(Date.now() / 1000).toString();
    const amount = config.testOrder.price;
    
    // Создаем подпись запроса согласно протоколу Click
    const signString = `${testResults.clickTransId}${config.click.serviceId}${testResults.orderId}${amount}1${signTime}${config.click.secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    // Формируем тело запроса
    const requestBody = {
      click_trans_id: testResults.clickTransId,
      service_id: config.click.serviceId,
      merchant_trans_id: testResults.orderId,
      amount: amount,
      action: 1, // Complete
      error: 0,
      sign_time: signTime,
      sign_string: sign
    };
    
    // Отправляем запрос
    const response = await fetch(`${config.baseUrl}/api/click/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json() as ClickNotifyResponse;
    
    // Проверяем корректность ответа
    if (data.error !== 0) {
      throw new Error(`Ошибка в ответе на complete-запрос: ${data.error_note || 'Неизвестная ошибка'}`);
    }
    
    if (data.merchant_confirm_id !== testResults.orderId) {
      throw new Error('ID заказа в ответе не соответствует отправленному');
    }
    
    console.log('✅ Тест Complete запроса пройден');
    
    // Даем время на обработку заказа
    console.log('⏳ Ожидание обновления статуса заказа...');
    await sleep(2000);
    
    return true;
  } catch (error) {
    console.error('❌ Тест Complete запроса не пройден:', error);
    return false;
  }
}

/**
 * Тест 4: Проверка статуса по ID заказа
 * 
 * Проверяет статус заказа после оплаты
 */
async function testCheckStatusByOrderId() {
  console.log('\n🔍 Тест 4: Проверка статуса по ID заказа');
  
  if (!testResults.orderId) {
    console.error('❌ Тест не может быть выполнен: отсутствует ID заказа');
    return false;
  }
  
  try {
    // Отправляем запрос на проверку статуса
    const response = await fetch(`${config.baseUrl}/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: testResults.orderId
      }),
    });
    
    const data = await response.json() as StatusByOrderIdResponse;
    
    // Проверяем корректность ответа
    if (!data.success) {
      throw new Error(`Ошибка при проверке статуса: ${data.error}`);
    }
    
    if (!data.order) {
      throw new Error('Отсутствуют данные о заказе в ответе');
    }
    
    if (data.order.status !== 'PAID') {
      console.warn(`⚠️ Статус заказа: ${data.order.status}, ожидалось: PAID`);
    }
    
    console.log('✅ Тест проверки статуса по ID заказа пройден');
    console.log(`📝 Статус заказа: ${data.order.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ Тест проверки статуса по ID заказа не пройден:', error);
    return false;
  }
}

/**
 * Тест 5: Проверка статуса по ID транзакции
 * 
 * Проверяет статус платежа по ID транзакции Click
 */
async function testCheckStatusByTransactionId() {
  console.log('\n🔍 Тест 5: Проверка статуса по ID транзакции');
  
  if (!testResults.clickTransId) {
    console.error('❌ Тест не может быть выполнен: отсутствует ID транзакции');
    return false;
  }
  
  try {
    // Отправляем запрос на проверку статуса
    const response = await fetch(`${config.baseUrl}/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId: testResults.clickTransId
      }),
    });
    
    const data = await response.json() as StatusByTransactionIdResponse;
    
    // Проверяем корректность ответа
    if (!data.success) {
      throw new Error(`Ошибка при проверке статуса: ${data.error}`);
    }
    
    if (!data.transaction) {
      throw new Error('Отсутствуют данные о транзакции в ответе');
    }
    
    console.log('✅ Тест проверки статуса по ID транзакции пройден');
    console.log(`📝 Статус транзакции: ${data.transaction.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ Тест проверки статуса по ID транзакции не пройден:', error);
    // Это может быть нормально, если тестовая среда Click не поддерживает запросы статуса по API
    console.log('ℹ️ Возможно, API Click не доступно в тестовой среде');
    return false;
  }
}

/**
 * Тест 6: Проверка файла заказа
 * 
 * Проверяет, что файл заказа был обновлен с данными платежа
 */
async function testOrderFileUpdated() {
  console.log('\n🔍 Тест 6: Проверка файла заказа');
  
  if (!testResults.orderId) {
    console.error('❌ Тест не может быть выполнен: отсутствует ID заказа');
    return false;
  }
  
  try {
    // Путь к файлу заказа
    const orderFilePath = path.join(process.cwd(), 'data', 'orders', `${testResults.orderId}.json`);
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(orderFilePath)) {
      throw new Error(`Файл заказа не найден: ${orderFilePath}`);
    }
    
    // Читаем содержимое файла
    const orderData = JSON.parse(await readFile(orderFilePath, 'utf8'));
    
    // Проверяем обновленные поля
    if (!orderData.clickTransId) {
      throw new Error('Поле clickTransId отсутствует в файле заказа');
    }
    
    if (!orderData.paidAt) {
      throw new Error('Поле paidAt отсутствует в файле заказа');
    }
    
    if (orderData.status !== 'Оплачен') {
      console.warn(`⚠️ Статус заказа в файле: ${orderData.status}, ожидалось: Оплачен`);
    }
    
    console.log('✅ Тест проверки файла заказа пройден');
    console.log(`📝 Статус заказа в файле: ${orderData.status}`);
    console.log(`📝 ID транзакции в файле: ${orderData.clickTransId}`);
    
    return true;
  } catch (error) {
    console.error('❌ Тест проверки файла заказа не пройден:', error);
    return false;
  }
}

/**
 * Тест 7: Обработка ошибок - неверный ID заказа
 * 
 * Проверяет корректность обработки несуществующего ID заказа
 */
async function testInvalidOrderId() {
  console.log('\n🔍 Тест 7: Обработка ошибок - неверный ID заказа');
  
  try {
    // Генерируем несуществующий ID заказа
    const invalidOrderId = 'non-existent-' + Date.now();
    
    // Отправляем запрос на проверку статуса
    const response = await fetch(`${config.baseUrl}/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: invalidOrderId
      }),
    });
    
    const data = await response.json() as StatusByOrderIdResponse;
    
    // Проверяем корректность ответа
    if (data.success) {
      throw new Error('Ожидалась ошибка, но получен успешный ответ');
    }
    
    if (response.status !== 404) {
      console.warn(`⚠️ HTTP статус: ${response.status}, ожидалось: 404`);
    }
    
    console.log('✅ Тест обработки неверного ID заказа пройден');
    
    return true;
  } catch (error) {
    console.error('❌ Тест обработки неверного ID заказа не пройден:', error);
    return false;
  }
}

/**
 * Основная функция для запуска всех тестов
 */
async function runAllTests() {
  console.log('=== 🧪 Запуск тестов интеграции с Click ===');
  
  const tests = [
    { name: 'Создание платежа', fn: testCreatePayment },
    { name: 'Симуляция Prepare запроса', fn: testPrepareRequest },
    { name: 'Симуляция Complete запроса', fn: testCompleteRequest },
    { name: 'Проверка статуса по ID заказа', fn: testCheckStatusByOrderId },
    { name: 'Проверка статуса по ID транзакции', fn: testCheckStatusByTransactionId },
    { name: 'Проверка файла заказа', fn: testOrderFileUpdated },
    { name: 'Обработка неверного ID заказа', fn: testInvalidOrderId }
  ];
  
  const results = [];
  
  // Запускаем тесты последовательно
  for (const test of tests) {
    console.log(`\n=== Выполнение теста: ${test.name} ===`);
    const success = await test.fn();
    results.push({ name: test.name, success });
  }
  
  // Выводим итоговые результаты
  console.log('\n=== 📊 Результаты тестов ===');
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  
  console.log(`Пройдено тестов: ${passedTests}/${totalTests}`);
  
  for (const result of results) {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  }
  
  return passedTests === totalTests;
}

// Запуск тестов при выполнении файла напрямую
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export {
  runAllTests,
  testCreatePayment,
  testPrepareRequest,
  testCompleteRequest,
  testCheckStatusByOrderId,
  testCheckStatusByTransactionId,
  testOrderFileUpdated,
  testInvalidOrderId
}; 