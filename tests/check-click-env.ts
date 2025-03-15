/**
 * Скрипт для проверки настроек окружения для работы с Click
 * 
 * Запуск: ts-node tests/check-click-env.ts
 */

// Загружаем переменные окружения из файла .env
import dotenv from 'dotenv';
dotenv.config();

// Необходимые переменные окружения для интеграции с Click
const requiredEnvVars = [
  'CLICK_SERVICE_ID',
  'CLICK_MERCHANT_ID',
  'CLICK_MERCHANT_USER_ID',
  'CLICK_SECRET_KEY'
];

// Дополнительные переменные окружения для расширенной функциональности
const optionalEnvVars = [
  'CLICK_SPIC_CODE',
  'CLICK_PACKAGE_CODE',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID'
];

// Проверка переменных окружения
function checkEnvironment() {
  console.log('=== 🔍 Проверка настроек окружения для Click ===\n');
  
  // Проверка обязательных переменных
  console.log('📋 Обязательные переменные окружения:');
  let allRequiredVarsPresent = true;
  
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    const isPresent = !!value;
    
    console.log(`${isPresent ? '✅' : '❌'} ${envVar}: ${isPresent ? 'Установлена' : 'Не установлена'}`);
    
    if (!isPresent) {
      allRequiredVarsPresent = false;
    }
  }
  
  // Проверка дополнительных переменных
  console.log('\n📋 Дополнительные переменные окружения:');
  let allOptionalVarsPresent = true;
  
  for (const envVar of optionalEnvVars) {
    const value = process.env[envVar];
    const isPresent = !!value;
    
    console.log(`${isPresent ? '✅' : '⚠️'} ${envVar}: ${isPresent ? 'Установлена' : 'Не установлена'}`);
    
    if (!isPresent) {
      allOptionalVarsPresent = false;
    }
  }
  
  // Вывод итогового результата
  console.log('\n=== 📊 Результат проверки ===');
  
  if (allRequiredVarsPresent) {
    console.log('✅ Все обязательные переменные окружения установлены.');
    
    if (!allOptionalVarsPresent) {
      console.log('⚠️ Некоторые дополнительные переменные окружения не установлены. Это может ограничить функциональность.');
    } else {
      console.log('✅ Все дополнительные переменные окружения тоже установлены.');
    }
    
    console.log('\n🟢 Система готова к работе с Click.');
  } else {
    console.log('❌ Некоторые обязательные переменные окружения не установлены.');
    console.log('\n🔴 Система НЕ готова к работе с Click. Пожалуйста, установите все обязательные переменные окружения.');
  }
  
  console.log('\n=== ℹ️ Как установить переменные окружения ===');
  console.log('1. Создайте файл .env в корне проекта');
  console.log('2. Добавьте следующие строки (замените значения на ваши):');
  console.log(`
CLICK_SERVICE_ID=your_service_id
CLICK_MERCHANT_ID=your_merchant_id
CLICK_MERCHANT_USER_ID=your_merchant_user_id
CLICK_SECRET_KEY=your_secret_key
CLICK_SPIC_CODE=your_spic_code
CLICK_PACKAGE_CODE=your_package_code
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
  `);
  console.log('3. Перезапустите сервер для применения настроек');
}

// Запуск скрипта
checkEnvironment(); 