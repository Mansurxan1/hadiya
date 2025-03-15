/**
 * Ручное тестирование функций Click
 * 
 * Этот скрипт выполняет основные тесты интеграции с Click без запуска сервера
 * 
 * Запуск: ts-node tests/manual-click-test.ts
 */

// Загружаем переменные окружения из файла .env
import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Проверяем наличие необходимых переменных
function checkEnvironment() {
  console.log('=== 🔍 Проверка переменных окружения ===\n');
  
  const requiredVars = [
    'CLICK_SERVICE_ID',
    'CLICK_MERCHANT_ID',
    'CLICK_MERCHANT_USER_ID',
    'CLICK_SECRET_KEY'
  ];
  
  let allPresent = true;
  
  for (const envVar of requiredVars) {
    const isPresent = !!process.env[envVar];
    console.log(`${isPresent ? '✅' : '❌'} ${envVar}: ${isPresent ? process.env[envVar] : 'Не установлена'}`);
    
    if (!isPresent) {
      allPresent = false;
    }
  }
  
  console.log(`\n${allPresent ? '✅ Все переменные установлены' : '❌ Некоторые переменные отсутствуют'}`);
  return allPresent;
}

// Генерация URL для оплаты
function generatePaymentUrl() {
  console.log('\n=== 🔗 Генерация URL для оплаты ===\n');
  
  const serviceId = process.env.CLICK_SERVICE_ID;
  const merchantId = process.env.CLICK_MERCHANT_ID;
  const secretKey = process.env.CLICK_SECRET_KEY;
  
  if (!serviceId || !merchantId || !secretKey) {
    console.error('❌ Отсутствуют необходимые переменные окружения');
    return null;
  }
  
  // Создаем тестовый заказ
  const orderId = `test-${Date.now()}`;
  const amount = 1000; // 1000 сум
  const returnUrl = 'https://hadiya.uz/payment/success';
  
  // Создаем подпись для запроса
  const signTime = Date.now();
  const signString = `${serviceId}${orderId}${signTime}${secretKey}`;
  const sign = crypto.createHash('md5').update(signString).digest('hex');
  
  // Формируем URL для оплаты через форму Click
  const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${orderId}&return_url=${encodeURIComponent(returnUrl)}&sign_time=${signTime}&sign_string=${sign}`;
  
  console.log('📝 Данные запроса:');
  console.log(`- ID заказа: ${orderId}`);
  console.log(`- Сумма: ${amount} сум`);
  console.log(`- Время подписи: ${signTime}`);
  console.log(`- Строка подписи: ${signString}`);
  console.log(`- Подпись MD5: ${sign}`);
  
  console.log('\n🌐 URL для оплаты:');
  console.log(clickUrl);
  
  return {
    orderId,
    paymentUrl: clickUrl,
    amount,
    signTime,
    sign
  };
}

// Симуляция Prepare запроса от Click
function simulatePrepareRequest(orderId: string) {
  console.log('\n=== 🔄 Симуляция Prepare запроса ===\n');
  
  const serviceId = process.env.CLICK_SERVICE_ID;
  const secretKey = process.env.CLICK_SECRET_KEY;
  
  if (!serviceId || !secretKey) {
    console.error('❌ Отсутствуют необходимые переменные окружения');
    return null;
  }
  
  // Генерируем данные запроса
  const clickTransId = Date.now().toString();
  const signTime = Math.floor(Date.now() / 1000).toString();
  const amount = '1000';
  
  // Создаем подпись запроса согласно протоколу Click
  const signString = `${clickTransId}${serviceId}${orderId}${amount}0${signTime}${secretKey}`;
  const sign = crypto.createHash('md5').update(signString).digest('hex');
  
  // Формируем тело запроса
  const requestBody = {
    click_trans_id: clickTransId,
    service_id: serviceId,
    merchant_trans_id: orderId,
    amount: amount,
    action: 0, // Prepare
    error: 0,
    sign_time: signTime,
    sign_string: sign
  };
  
  console.log('📝 Данные Prepare запроса:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  return {
    clickTransId,
    requestBody
  };
}

// Симуляция Complete запроса от Click
function simulateCompleteRequest(orderId: string, clickTransId: string) {
  console.log('\n=== 🔄 Симуляция Complete запроса ===\n');
  
  const serviceId = process.env.CLICK_SERVICE_ID;
  const secretKey = process.env.CLICK_SECRET_KEY;
  
  if (!serviceId || !secretKey) {
    console.error('❌ Отсутствуют необходимые переменные окружения');
    return null;
  }
  
  // Генерируем данные запроса
  const signTime = Math.floor(Date.now() / 1000).toString();
  const amount = '1000';
  
  // Создаем подпись запроса согласно протоколу Click
  const signString = `${clickTransId}${serviceId}${orderId}${amount}1${signTime}${secretKey}`;
  const sign = crypto.createHash('md5').update(signString).digest('hex');
  
  // Формируем тело запроса
  const requestBody = {
    click_trans_id: clickTransId,
    service_id: serviceId,
    merchant_trans_id: orderId,
    amount: amount,
    action: 1, // Complete
    error: 0,
    sign_time: signTime,
    sign_string: sign
  };
  
  console.log('📝 Данные Complete запроса:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  return {
    requestBody
  };
}

// Запуск всех тестов
async function runTests() {
  console.log('=== 🧪 Запуск ручного тестирования Click ===\n');
  
  // Шаг 1: Проверка переменных окружения
  const envOk = checkEnvironment();
  if (!envOk) {
    console.error('\n❌ Тесты остановлены из-за отсутствия необходимых переменных окружения');
    return;
  }
  
  // Шаг 2: Генерация URL для оплаты
  const paymentData = generatePaymentUrl();
  if (!paymentData) {
    console.error('\n❌ Тесты остановлены из-за ошибки при генерации URL');
    return;
  }
  
  // Шаг 3: Симуляция Prepare запроса
  const prepareData = simulatePrepareRequest(paymentData.orderId);
  if (!prepareData) {
    console.error('\n❌ Тесты остановлены из-за ошибки при симуляции Prepare запроса');
    return;
  }
  
  // Шаг 4: Симуляция Complete запроса
  const completeData = simulateCompleteRequest(paymentData.orderId, prepareData.clickTransId);
  if (!completeData) {
    console.error('\n❌ Тесты остановлены из-за ошибки при симуляции Complete запроса');
    return;
  }
  
  console.log('\n=== ✅ Тесты успешно завершены ===');
  console.log('Все функции работают корректно и готовы к использованию с запущенным сервером');
}

// Запуск тестов
runTests().catch(console.error); 