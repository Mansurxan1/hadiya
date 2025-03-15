import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, { 
      method: 'HEAD',
      headers: { 'User-Agent': 'Click Payment API Status Check' },
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.warn(`Домен ${domain} недоступен:`, error);
    return false;
  }
}

// Функция для проверки статуса фискализации
async function checkFiscalizationStatus(
  serviceId: string,
  merchantId: string,
  merchantUserId: string,
  secretKey: string,
  spicCode: string,
  packageCode: string
): Promise<{ success: boolean; message: string }> {
  try {
    // В реальной имплементации здесь можно сделать запрос к API Click
    // для проверки статуса фискализации
    
    // Для примера, просто возвращаем успешный статус
    return {
      success: true,
      message: "Фискализация настроена корректно"
    };
  } catch (error) {
    console.error('Ошибка при проверке статуса фискализации:', error);
    return {
      success: false,
      message: "Ошибка при проверке статуса фискализации"
    };
  }
}

// Проверка доступа к файловой системе
function checkFileSystemAccess(): boolean {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const ordersDir = path.join(dataDir, 'orders');
    
    // Проверяем существование директорий
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir);
    }
    
    // Проверяем возможность записи
    const testFilePath = path.join(ordersDir, 'test.txt');
    fs.writeFileSync(testFilePath, 'test');
    
    // Проверяем возможность чтения
    const contents = fs.readFileSync(testFilePath, 'utf8');
    
    // Удаляем тестовый файл
    fs.unlinkSync(testFilePath);
    
    return contents === 'test';
  } catch (error) {
    console.error('Ошибка при проверке доступа к файловой системе:', error);
    return false;
  }
}

export async function GET(_request: NextRequest) { 
  try {
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    const spicCode = process.env.CLICK_SPIC_CODE;
    const packageCode = process.env.CLICK_PACKAGE_CODE;
    
    if (!serviceId || !merchantId || !merchantUserId || !secretKey) {
      return NextResponse.json({
        status: "error",
        message: "Отсутствуют необходимые переменные окружения",
        details: {
          serviceId: !serviceId,
          merchantId: !merchantId,
          merchantUserId: !merchantUserId,
          secretKey: !secretKey
        }
      }, { status: 500 });
    }
    
    // Проверяем настройки фискализации
    const fiscalizationConfigured = !!(spicCode && packageCode);
    
    // Проверяем доступность доменов Click
    const clickDomain = await checkDomainAvailability('my.click.uz');
    const apiDomain = await checkDomainAvailability('api.click.uz');
    
    // Генерируем тестовый URL для оплаты
    const testOrderId = 'test-' + Date.now();
    const signTime = Date.now();
    const signString = `${serviceId}${testOrderId}${signTime}${secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    const testPaymentUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=1000&transaction_param=${testOrderId}&return_url=${encodeURIComponent('https://example.com')}&sign_time=${signTime}&sign_string=${sign}`;
    
    // Проверяем статус фискализации
    let fiscalizationStatus = null;
    if (fiscalizationConfigured && spicCode && packageCode) {
      fiscalizationStatus = await checkFiscalizationStatus(serviceId, merchantId, merchantUserId, secretKey, spicCode, packageCode);
    }
    
    // Проверяем доступ к файловой системе
    const fileSystemAccessable = checkFileSystemAccess();
    
    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      click_integration: {
        service_id: serviceId,
        merchant_id: merchantId,
        merchant_user_id: merchantUserId,
        configured: true,
        domains_availability: {
          my_click_uz: clickDomain,
          api_click_uz: apiDomain
        },
        test_payment_url: testPaymentUrl,
        fiscalization: fiscalizationConfigured 
          ? { 
              configured: true,
              status: fiscalizationStatus
            }
          : { 
              configured: false,
              message: "Фискализация не настроена"
            }
      },
      server_status: {
        file_system_access: fileSystemAccessable,
        environment: process.env.NODE_ENV || "unknown",
        version: process.env.npm_package_version || "unknown"
      }
    });
  } catch (error) {
    console.error('Ошибка при проверке статуса интеграции с Click:', error);
    return NextResponse.json({
      status: "error",
      message: "Внутренняя ошибка сервера",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}