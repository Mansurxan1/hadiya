/**
 * API маршрут для фискализации платежей Click
 * 
 * Этот маршрут может быть вызван после успешного платежа для фискализации чека
 */

import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { getOrderInfo } from '../route';
import { sendFiscalNotification } from '@/app/lib/payment/notification';

// Типы для фискализации
interface FiscalItemCommissionInfo {
  TIN?: string;  // ИНН
  PINFL?: string; // ПИНФЛ
}

interface FiscalItem {
  Name: string;
  Barcode?: string;
  Labels?: string[];
  SPIC: string;
  Units?: number;
  PackageCode: string;
  GoodPrice?: number;
  Price: number;
  Amount: number;
  VAT: number;
  VATPercent: number;
  Discount?: number;
  Other?: number;
  CommissionInfo: FiscalItemCommissionInfo;
}

interface FiscalizeRequest {
  paymentId: string;
  serviceId?: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    barcode?: string;
  }[];
  receivedCard?: number;
  receivedCash?: number;
  receivedEcash?: number;
}

interface FiscalizeResponse {
  success: boolean;
  error?: string;
  qrCodeURL?: string;
}

/**
 * Создает подпись для авторизации запроса к API Click
 */
function createAuthHeader(merchantUserId: string, secretKey: string): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signString = `${timestamp}${secretKey}`;
  const sign = crypto.createHash('sha1').update(signString).digest('hex');
  
  return `${merchantUserId}:${sign}:${timestamp}`;
}

/**
 * Фискализация товаров/услуг платежа
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем параметры запроса
    const requestData: FiscalizeRequest = await request.json();
    const { paymentId, items, receivedCard, receivedCash, receivedEcash } = requestData;
    
    console.log('Получен запрос на фискализацию платежа:', requestData);
    
    // Проверяем наличие обязательных параметров
    if (!paymentId || !items || items.length === 0) {
      console.error('Отсутствуют обязательные параметры');
      return NextResponse.json(
        { success: false, error: 'Отсутствуют обязательные параметры' },
        { status: 400 }
      );
    }
    
    // Получаем необходимые данные из переменных окружения
    const serviceId = requestData.serviceId || process.env.CLICK_SERVICE_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    const spicCode = process.env.CLICK_SPIC_CODE;
    const packageCode = process.env.CLICK_PACKAGE_CODE;
    
    // Проверяем наличие необходимых переменных окружения
    if (!serviceId || !merchantUserId || !secretKey || !spicCode || !packageCode) {
      console.error('Отсутствуют необходимые переменные окружения');
      return NextResponse.json(
        { success: false, error: 'Ошибка конфигурации сервера. Обратитесь к администратору.' },
        { status: 500 }
      );
    }
    
    // Преобразуем элементы в формат для фискализации
    const fiscalItems: FiscalItem[] = items.map(item => ({
      Name: item.name,
      Barcode: item.barcode,
      SPIC: spicCode,
      PackageCode: packageCode,
      Price: item.price * 100, // конвертируем в тийины
      Amount: item.quantity,
      VAT: 0, // Без НДС
      VATPercent: 0,
      CommissionInfo: {
        TIN: '123456789' // Здесь нужен реальный ИНН
      }
    }));
    
    // Формируем параметры запроса фискализации
    const fiscalParams = {
      service_id: serviceId,
      payment_id: paymentId,
      items: fiscalItems,
      received_card: receivedCard ? receivedCard * 100 : undefined,
      received_cash: receivedCash ? receivedCash * 100 : undefined,
      received_ecash: receivedEcash ? receivedEcash * 100 : undefined
    };
    
    // Создаем авторизационный заголовок
    const authHeader = createAuthHeader(merchantUserId, secretKey);
    
    // Отправляем запрос на фискализацию
    console.log('Отправка запроса на фискализацию:', JSON.stringify(fiscalParams, null, 2));
    
    const fiscalResponse = await fetch('https://api.click.uz/v2/merchant/payment/ofd_data/submit_items', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      },
      body: JSON.stringify(fiscalParams)
    });
    
    if (!fiscalResponse.ok) {
      const errorText = await fiscalResponse.text();
      console.error('Ошибка при фискализации платежа:', fiscalResponse.status, errorText);
      return NextResponse.json(
        { success: false, error: `Ошибка при фискализации платежа: ${fiscalResponse.status}` },
        { status: 500 }
      );
    }
    
    const fiscalResult = await fiscalResponse.json();
    
    console.log('Ответ API фискализации:', fiscalResult);
    
    if (fiscalResult.error_code !== 0) {
      console.error('Ошибка при фискализации платежа:', fiscalResult.error_note);
      return NextResponse.json(
        { success: false, error: `Ошибка при фискализации платежа: ${fiscalResult.error_note}` },
        { status: 400 }
      );
    }
    
    // Получаем URL QR-кода чека
    const fiscalDataResponse = await fetch(`https://api.click.uz/v2/merchant/payment/ofd_data/${serviceId}/${paymentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      }
    });
    
    if (!fiscalDataResponse.ok) {
      console.warn('Не удалось получить URL QR-кода чека:', fiscalDataResponse.status);
      // Возвращаем успешный результат фискализации, даже если не удалось получить QR-код
      return NextResponse.json({ success: true });
    }
    
    const fiscalData = await fiscalDataResponse.json();
    
    console.log('Получены фискальные данные:', fiscalData);
    
    // Получаем информацию о заказе, если orderId был использован в качестве paymentId
    try {
      const orderData = await getOrderInfo(paymentId);
      
      if (orderData) {
        // Отправляем уведомление о фискализации в Telegram
        await sendFiscalNotification(orderData, {
          paymentId,
          qrCodeURL: fiscalData.qrCodeURL,
          items: items
        });
      }
    } catch (notificationError) {
      console.error('Ошибка при отправке уведомления о фискализации:', notificationError);
      // Не прерываем процесс, если уведомление не отправилось
    }
    
    // Возвращаем успешный результат с URL QR-кода
    return NextResponse.json({
      success: true,
      qrCodeURL: fiscalData.qrCodeURL
    });
  } catch (error: unknown) {
    console.error('Ошибка при фискализации платежа:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * Получение фискальных данных платежа
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем ID платежа из параметров запроса
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    
    if (!paymentId) {
      console.error('Не указан ID платежа');
      return NextResponse.json(
        { success: false, error: 'Не указан ID платежа' },
        { status: 400 }
      );
    }
    
    // Получаем необходимые данные из переменных окружения
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    
    // Проверяем наличие необходимых переменных окружения
    if (!serviceId || !merchantUserId || !secretKey) {
      console.error('Отсутствуют необходимые переменные окружения');
      return NextResponse.json(
        { success: false, error: 'Ошибка конфигурации сервера. Обратитесь к администратору.' },
        { status: 500 }
      );
    }
    
    // Создаем авторизационный заголовок
    const authHeader = createAuthHeader(merchantUserId, secretKey);
    
    // Получаем фискальные данные
    const fiscalDataResponse = await fetch(`https://api.click.uz/v2/merchant/payment/ofd_data/${serviceId}/${paymentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      }
    });
    
    if (!fiscalDataResponse.ok) {
      const errorText = await fiscalDataResponse.text();
      console.error('Ошибка при получении фискальных данных:', fiscalDataResponse.status, errorText);
      return NextResponse.json(
        { success: false, error: `Ошибка при получении фискальных данных: ${fiscalDataResponse.status}` },
        { status: 500 }
      );
    }
    
    const fiscalData = await fiscalDataResponse.json();
    
    console.log('Получены фискальные данные:', fiscalData);
    
    // Возвращаем данные с URL QR-кода
    return NextResponse.json({
      success: true,
      paymentId: fiscalData.paymentId,
      qrCodeURL: fiscalData.qrCodeURL
    });
  } catch (error: unknown) {
    console.error('Ошибка при получении фискальных данных:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 