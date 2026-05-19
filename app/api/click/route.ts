import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';
import { sendOrderNotification, sendPaymentNotification } from '@/app/lib/payment/notification';

interface OrderData {
  orderId: string;
  tourId: string;
  tourName: string;
  price: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  status: string;
  createdAt: string;
}

interface PaymentData {
  orderId: string;
  tourName: string;
  price: string;
  userName?: string;
  userPhone?: string;
}

interface FiscalItemsData {
  serviceId: string;
  paymentId: string;
  tourName: string;
  price: string;
  spicCode: string;
  packageCode: string;
}

interface FiscalData {
  serviceId: string;
  paymentId: string;
  merchantId: string;
  merchantUserId: string;
  secretKey: string;
}

interface QRCodeData {
  serviceId: string;
  paymentId: string;
  qrcode: string;
  merchantId: string;
  merchantUserId: string;
  secretKey: string;
}

async function saveOrderInfo(orderData: OrderData): Promise<boolean> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const ordersDir = path.join(dataDir, 'orders');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir);
    }
    
    const orderFilePath = path.join(ordersDir, `${orderData.orderId}.json`);
    fs.writeFileSync(orderFilePath, JSON.stringify(orderData, null, 2));
    
    console.log('Информация о заказе сохранена:', orderFilePath);
    return true;
  } catch (error: unknown) {
    console.error('Ошибка при сохранении информации о заказе:', error);
    return false;
  }
}

export async function getOrderInfo(orderId: string): Promise<OrderData | null> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const ordersDir = path.join(dataDir, 'orders');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir);
    }
    
    const orderFilePath = path.join(ordersDir, `${orderId}.json`);
    
    if (!fs.existsSync(orderFilePath)) {
      console.error('Файл с данными заказа не найден:', orderFilePath);
      return null;
    }
    
    const orderData: OrderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
    return orderData;
  } catch (error: unknown) {
    console.error('Ошибка при получении информации о заказе:', error);
    return null;
  }
}

/**
 * Генерирует подпись для проверки запроса от Click
 */
function generateClickSignature(data: any, secretKey: string): string {
  // Создаем строку для подписи на основе данных уведомления
  const signString = `${data.click_trans_id}${data.service_id}${data.merchant_trans_id}${
    data.amount}${data.action}${data.sign_time}${secretKey}`;
  
  // Создаем подпись с использованием MD5
  return crypto.createHash('md5').update(signString).digest('hex');
}

/**
 * API маршрут для создания платежа через Click
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tourId, tourName, price, userId, userName, userPhone, lang } = body;
    const safeLang = ["uz", "ru", "en"].includes(lang) ? lang : "uz";

    console.log('Получен запрос на создание платежа:', body);

    if (!tourId || !tourName || !price) {
      console.error('Отсутствуют обязательные параметры:', { tourId, tourName, price });
      return NextResponse.json(
        { success: false, error: 'Отсутствуют обязательные параметры' },
        { status: 400 }
      );
    }

    // Получаем необходимые данные из переменных окружения
    const orderId = Date.now().toString();
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    const spicCode = process.env.CLICK_SPIC_CODE;
    const packageCode = process.env.CLICK_PACKAGE_CODE;
    
    // Проверяем наличие всех необходимых переменных окружения
    if (!serviceId || !merchantId || !merchantUserId || !secretKey) {
      console.error('Отсутствуют необходимые переменные окружения:', {
        serviceId: !serviceId,
        merchantId: !merchantId,
        merchantUserId: !merchantUserId,
        secretKey: !secretKey
      });
      return NextResponse.json(
        { success: false, error: 'Ошибка конфигурации сервера. Обратитесь к администратору.' },
        { status: 500 }
      );
    }

    // Предупреждаем, если отсутствуют данные для фискализации
    if (!spicCode || !packageCode) {
      console.warn('Отсутствуют переменные для фискализации чеков:', {
        spicCode: !spicCode,
        packageCode: !packageCode
      });
    }
    
    try {
      // Создание URL для оплаты через форму Click (Redirect)
      // Этот метод используется в большинстве случаев и не требует ввода данных карты на сайте
      
      // Форматируем цену, удаляя пробелы
      const formattedPrice = price.toString().replace(/\s+/g, '');
      
      // Создаем временную метку для запроса
      const signTime = Date.now();
      
      // Создаем подпись для формы оплаты (MD5 используется для REDIRECT метода)
      const signString = `${serviceId}${orderId}${signTime}${secretKey}`;
      const sign = crypto.createHash('md5').update(signString).digest('hex');
      
      // Определяем хост и протокол для URL возврата
      const host = request.headers.get('host') || 'www.hadiya-travel.uz';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const absoluteReturnUrl = `${protocol}://${host}/${safeLang}/payment/success`;
      
      // Сохраняем информацию о заказе
      const orderData: OrderData = {
        orderId,
        tourId,
        tourName,
        price: formattedPrice,
        userId: userId || 'Гость',
        userName: userName || 'Не указано',
        userPhone: userPhone || 'Не указано',
        status: "Click to'loviga yo'naltirildi", // Заказ отправлен на оплату через Click
        createdAt: new Date().toISOString()
      };
      
      // Сохраняем данные заказа в файл
      await saveOrderInfo(orderData);
        
      // Отправляем уведомление о новом заказе
      try {
        await sendOrderNotification(orderData);
      } catch (telegramError) {
        console.error('Ошибка при отправке уведомления в Telegram:', telegramError);
        // Не прерываем процесс, если уведомление не отправилось
      }
      
      // Формируем URL для перенаправления на платежную форму Click
      const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${formattedPrice}&transaction_param=${orderId}&return_url=${encodeURIComponent(absoluteReturnUrl)}&sign_time=${signTime}&sign_string=${sign}`;
      
      console.log('Click payment URL:', clickUrl);
      
      // Возвращаем данные для перенаправления на форму оплаты
      return NextResponse.json({ 
        success: true, 
        redirectUrl: clickUrl,
        orderId
      });
    } catch (processError) {
      console.error('Ошибка при формировании URL для платежа:', processError);
      return NextResponse.json(
        { success: false, error: 'Ошибка при формировании платежа. Пожалуйста, попробуйте позже.' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Ошибка при создании платежа:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * API маршрут для обработки уведомлений о платежах от Click
 */
export async function handleClickNotification(request: NextRequest) {
  const body = await request.json();
  console.log('Получено уведомление от Click:', body);

  try {
    // Проверяем, что это запрос от Click
    const expectedSignature = generateClickSignature(body, process.env.CLICK_SECRET_KEY || '');
    const receivedSignature = request.headers.get('click-signature');

    if (!receivedSignature || receivedSignature !== expectedSignature) {
      console.error('Неверная подпись Click');
      return NextResponse.json({ success: false, error: 'Неверная подпись' }, { status: 400 });
    }

    // Проверяем, что это уведомление о платеже
    if (!body.action || body.action !== 'payment') {
      console.warn('Получено уведомление не о платеже:', body.action);
      return NextResponse.json({ success: true });
    }

    const { click_trans_id, merchant_trans_id, status } = body;

    if (!click_trans_id || !merchant_trans_id) {
      console.error('Отсутствуют обязательные параметры в уведомлении');
      return NextResponse.json({ success: false, error: 'Отсутствуют обязательные параметры' }, { status: 400 });
    }

    // Получаем информацию о заказе
    const orderData = await getOrderInfo(merchant_trans_id);
    
    if (!orderData) {
      console.error(`Заказ с ID ${merchant_trans_id} не найден`);
      return NextResponse.json({ success: false, error: 'Заказ не найден' }, { status: 404 });
    }

    // Обновляем статус заказа в зависимости от статуса платежа
    // 2 - Успешный платеж
    // 1 - В ожидании
    // -1 - Отмененный платеж
    // -2 - Возвращенный платеж
    let newStatus = orderData.status;
    if (status === 2) {
      newStatus = 'PAID';
    } else if (status === -1 || status === -2) {
      newStatus = 'CANCELLED';
    }

    // Обновляем данные заказа
    const updatedOrderData = {
      ...orderData,
      clickTransId: click_trans_id,
      status: newStatus
    };

    // Сохраняем обновленную информацию о заказе
    await saveOrderInfo(updatedOrderData);

    // Если платеж успешен, отправляем уведомление
    if (status === 2) {
      try {
        // Обновляем данные заказа с clickTransId и временем оплаты
        const notificationOrderData = { 
          ...updatedOrderData, 
          paidAt: new Date().toISOString()
        };
        
        // Отправляем уведомление о платеже в Telegram
        await sendPaymentNotification(notificationOrderData);
      } catch (notificationError) {
        console.error('Ошибка при отправке уведомления о платеже:', notificationError);
        // Не прерываем процесс, если уведомление не отправилось
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке уведомления от Click:', error);
    return NextResponse.json({ success: false, error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

/**
 * Отправляет уведомление в Telegram о заказе
 * @deprecated Используйте функции из модуля notification.ts
 */
export async function sendTelegramNotification(orderData: any) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Не настроены параметры Telegram бота');
      return;
    }

    // Формируем сообщение
    const message = `🆕 Новый заказ!
🆔 Номер заказа: ${orderData.orderId}
🏛 Тур: ${orderData.tourName}
💰 Цена: ${orderData.price} сум
👤 Клиент: ${orderData.userName}
📞 Телефон: ${orderData.phone}
🔄 Статус: ${orderData.status}`;

    // Отправляем сообщение
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Ошибка при отправке уведомления в Telegram:', await response.text());
    }
  } catch (error) {
    console.error('Ошибка при отправке уведомления в Telegram:', error);
  }
}

export async function fiscalizeReceipt(paymentData: PaymentData): Promise<{ success: boolean; fiscalData?: any; error?: string }> {
  try {
    const { 
      orderId, 
      tourName, 
      price, 
      userName, 
      userPhone 
    } = paymentData;
    
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
    const serviceId = process.env.CLICK_SERVICE_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    const spicCode = process.env.CLICK_SPIC_CODE;
    const packageCode = process.env.CLICK_PACKAGE_CODE;
    
    if (!merchantId || !merchantUserId || !serviceId || !secretKey || !spicCode || !packageCode) {
      console.error('Отсутствуют необходимые переменные окружения для фискализации:', {
        merchantId: !merchantId,
        merchantUserId: !merchantUserId,
        serviceId: !serviceId,
        secretKey: !secretKey,
        spicCode: !spicCode,
        packageCode: !packageCode
      });
      return { success: false, error: 'Отсутствуют необходимые переменные окружения для фискализации' };
    }
    
    // Формирование данных для фискального чека согласно документации Click
    // Преобразуем цену из строки в число и умножаем на 100 (в тийинах)
    const priceInTiyin = Math.round(parseFloat(price.replace(/\s+/g, '')) * 100);
    const vatPercent = 15; // 15% НДС (стандартная ставка в Узбекистане)
    const vatAmount = Math.round(priceInTiyin * vatPercent / 100);
    
    // Создаем timestamp для заголовка Auth
    const timestamp = Math.floor(Date.now() / 1000); // UNIX timestamp в секундах
    
    // Создаем digest по алгоритму SHA1 согласно документации
    const digest = crypto.createHash('sha1').update(`${timestamp}${secretKey}`).digest('hex');
    
    // Формируем заголовок Auth согласно документации
    const authHeader = `${merchantUserId}:${digest}:${timestamp}`;
    
    // Запрос на создание фискального чека в OFD через API Click
    const fiscalData = {
      service_id: parseInt(serviceId),
      payment_id: orderId,
      items: [
        {
          Name: `${tourName} (1 шт)`, // Название услуги с указанием единиц измерения
          SPIC: spicCode,
          Units: 168, // Код единицы измерения (168 - услуга)
          PackageCode: packageCode,
          Price: priceInTiyin, // Цена в тийинах
          Amount: 1, // Количество
          VAT: vatAmount, // Сумма НДС в тийинах
          VATPercent: vatPercent, // Процент НДС
          CommissionInfo: {} // Обязательное поле, даже если пустое
        }
      ],
      received_ecash: 0, // Оплачено электронными деньгами
      received_cash: 0, // Оплачено наличными
      received_card: priceInTiyin // Оплачено картой (вся сумма в тийинах)
    };
    
    // Отправка запроса на фискализацию
    const response = await fetch('https://api.click.uz/v2/merchant/payment/ofd_data/submit_items', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      },
      body: JSON.stringify(fiscalData)
    });
    
    const responseData = await response.json();
    
    if (response.ok && responseData.error_code === 0) {
      // Если фискализация прошла успешно, получаем данные о QR-коде чека
      try {
        const qrCodeData = await getFiscalQRCode({
          serviceId,
          paymentId: orderId,
          merchantId,
          merchantUserId,
          secretKey
        });
        
        if (qrCodeData.success && qrCodeData.qrCodeURL) {
          // Регистрируем QR-код фискального чека
          await registerFiscalQRCode({
            serviceId,
            paymentId: orderId,
            qrcode: qrCodeData.qrCodeURL,
            merchantId,
            merchantUserId,
            secretKey
          });
          
          return { 
            success: true, 
            fiscalData: {
              ...responseData,
              qrCodeURL: qrCodeData.qrCodeURL
            }
          };
        }
      } catch (qrError) {
        console.error('Ошибка при получении QR-кода фискального чека:', qrError);
      }
      
      // Даже если не удалось получить QR-код, фискализация считается успешной
      return { 
        success: true, 
        fiscalData: responseData 
      };
    }
    
    return { 
      success: false, 
      error: responseData.error_note || 'Ошибка при фискализации чека',
      fiscalData: responseData
    };
  } catch (error: unknown) {
    console.error('Ошибка при фискализации чека:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Получение QR-кода фискального чека
async function getFiscalQRCode(data: FiscalData): Promise<{ success: boolean; paymentId?: string; qrCodeURL?: string; error?: string }> {
  try {
    const { serviceId, paymentId, merchantId, merchantUserId, secretKey } = data;
    
    // Создаем timestamp и digest для заголовка Auth
    const timestamp = Math.floor(Date.now() / 1000);
    const digest = crypto.createHash('sha1').update(`${timestamp}${secretKey}`).digest('hex');
    const authHeader = `${merchantUserId}:${digest}:${timestamp}`;
    
    const response = await fetch(`https://api.click.uz/v2/merchant/payment/ofd_data/${serviceId}/${paymentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      }
    });
    
    const responseData = await response.json();
    
    if (response.ok && responseData.qrCodeURL) {
      return { 
        success: true, 
        paymentId: responseData.paymentId,
        qrCodeURL: responseData.qrCodeURL
      };
    }
    
    return { 
      success: false, 
      error: responseData.error_note || 'Ошибка при получении QR-кода фискального чека'
    };
  } catch (error: unknown) {
    console.error('Ошибка при получении QR-кода фискального чека:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Регистрация QR-кода фискального чека
async function registerFiscalQRCode(data: QRCodeData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { serviceId, paymentId, qrcode, merchantId, merchantUserId, secretKey } = data;
    
    // Создаем timestamp и digest для заголовка Auth
    const timestamp = Math.floor(Date.now() / 1000);
    const digest = crypto.createHash('sha1').update(`${timestamp}${secretKey}`).digest('hex');
    const authHeader = `${merchantUserId}:${digest}:${timestamp}`;
    
    const requestData = {
      service_id: parseInt(serviceId),
      payment_id: paymentId,
      qrcode: qrcode
    };
    
    const response = await fetch('https://api.click.uz/v2/merchant/payment/ofd_data/submit_qrcode', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      },
      body: JSON.stringify(requestData)
    });
    
    const responseData = await response.json();
    
    if (response.ok && responseData.error_code === 0) {
      return { success: true, data: responseData };
    }
    
    return { 
      success: false, 
      error: responseData.error_note || 'Ошибка при регистрации QR-кода фискального чека'
    };
  } catch (error: unknown) {
    console.error('Ошибка при регистрации QR-кода фискального чека:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}