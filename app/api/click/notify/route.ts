import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { fiscalizeReceipt, getOrderInfo } from '../route';
import fs from 'fs';
import path from 'path';

const CLICK_ERROR_CODES = {
  0: 'Успешно',
  1: 'Ошибка в запросе от CLICK',
  2: 'Ошибка авторизации',
  3: 'Транзакция не найдена',
  4: 'Транзакция уже подтверждена',
  5: 'Транзакция уже отменена',
  6: 'Ошибка при выполнении операции',
  7: 'Системная ошибка',
  8: 'Неверная сумма',
  9: 'Неверный статус транзакции'
};

export interface OrderData {
  orderId: string;
  tourId: string;
  tourName: string;
  price: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  status: string;
  createdAt: string;
  clickTransId?: string; 
  paidAt?: string;     
}

interface PaymentData {
  orderId: string;
  clickTransId: string;
  amount: string;
  tourName?: string;
  userName?: string;
  userPhone?: string;
  status: string;
  error?: string;
  fiscalData?: any;
}

// Функция обновления информации о заказе
async function updateOrderInfo(orderData: OrderData): Promise<boolean> {
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
    
    console.log('Информация о заказе обновлена:', orderFilePath);
    return true;
  } catch (error: unknown) {
    console.error('Ошибка при обновлении информации о заказе:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Получено уведомление от Click:', body);
    
    const {
      click_trans_id,
      service_id,
      merchant_trans_id,
      merchant_prepare_id,
      amount,
      action,
      error,
      error_note,
      sign_time,
      sign_string
    } = body as {
      click_trans_id: string;
      service_id: string;
      merchant_trans_id: string;
      merchant_prepare_id?: string;
      amount: string;
      action: number;
      error: number;
      error_note?: string;
      sign_time: string;
      sign_string: string;
    };
    
    if (!click_trans_id || !service_id || !merchant_trans_id || !amount || action === undefined || !sign_time || !sign_string) {
      console.error('Отсутствуют обязательные параметры в уведомлении от Click:', body);
      return NextResponse.json({
        error: -1,
        error_note: 'Отсутствуют обязательные параметры'
      }, { status: 400 });
    }
    
    const secretKey = process.env.CLICK_SECRET_KEY;
    
    if (!secretKey) {
      console.error('Отсутствует секретный ключ в переменных окружения');
      return NextResponse.json({
        error: -1,
        error_note: 'Ошибка конфигурации сервера'
      }, { status: 500 });
    }
    
    // Проверка подписи запроса
    const signString = `${click_trans_id}${service_id}${merchant_trans_id}${merchant_prepare_id || ''}${amount}${action}${sign_time}${secretKey}`;
    const expectedSign = crypto.createHash('md5').update(signString).digest('hex');
    
    if (sign_string !== expectedSign) {
      console.error('Неверная подпись запроса:', {
        received: sign_string,
        expected: expectedSign
      });
      return NextResponse.json({
        error: 2, // Код ошибки авторизации по протоколу Click
        error_note: 'Неверная подпись запроса'
      }, { status: 400 });
    }
    
    // Подготовка (prepare) заказа
    if (action === 0) {
      const orderInfo: OrderData | null = await getOrderInfo(merchant_trans_id);
      
      if (!orderInfo) {
        console.error('Заказ не найден:', merchant_trans_id);
        return NextResponse.json({
          error: 3, // Транзакция не найдена
          error_note: 'Заказ не найден'
        }, { status: 404 });
      }
      
      // Проверка суммы заказа
      const orderAmount = parseFloat(orderInfo.price);
      const clickAmount = parseFloat(amount);
      
      if (Math.abs(orderAmount - clickAmount) > 1) { // Допускаем погрешность в 1 сум
        console.error('Неверная сумма платежа:', {
          orderAmount,
          clickAmount
        });
        return NextResponse.json({
          error: 8, // Неверная сумма
          error_note: 'Неверная сумма платежа'
        }, { status: 400 });
      }
      
      console.log('Проверка заказа:', merchant_trans_id, orderInfo);
      
      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: merchant_trans_id,
        error: 0,
        error_note: 'Success'
      });
    } 
    // Подтверждение (complete) заказа
    else if (action === 1) {
      console.log('Подтверждение платежа:', merchant_trans_id);
      
      const orderInfo: OrderData | null = await getOrderInfo(merchant_trans_id);
      
      if (!orderInfo) {
        console.error('Заказ не найден:', merchant_trans_id);
        return NextResponse.json({
          error: 3, // Транзакция не найдена
          error_note: 'Заказ не найден'
        }, { status: 404 });
      }
      
      // Проверка, не была ли уже подтверждена транзакция
      if (orderInfo.status === 'Оплачен' && orderInfo.clickTransId) {
        console.log('Транзакция уже подтверждена:', merchant_trans_id);
        return NextResponse.json({
          error: 4, // Транзакция уже подтверждена
          error_note: 'Транзакция уже подтверждена'
        });
      }
      
      // Обновляем информацию о заказе
      orderInfo.status = 'Оплачен';
      orderInfo.paidAt = new Date().toISOString();
      orderInfo.clickTransId = click_trans_id;
      
      // Сохраняем обновленную информацию
      await updateOrderInfo(orderInfo);
      
      try {
        await sendTelegramNotification({
          orderId: merchant_trans_id,
          clickTransId: click_trans_id,
          amount,
          tourName: orderInfo.tourName,
          userName: orderInfo.userName,
          userPhone: orderInfo.userPhone,
          status: 'Оплачен'
        });
      } catch (telegramError) {
        console.error('Ошибка при отправке уведомления в Telegram:', telegramError);
        // Не прерываем процесс, если уведомление не отправилось
      }
      
      try {
        const fiscalResult = await fiscalizeReceipt({
          orderId: merchant_trans_id,
          tourName: orderInfo.tourName,
          price: amount,
          userName: orderInfo.userName,
          userPhone: orderInfo.userPhone
        });
        
        if (!fiscalResult.success) {
          console.error('Ошибка при фискализации чека:', fiscalResult.error);
          try {
            await sendTelegramNotification({
              orderId: merchant_trans_id,
              clickTransId: click_trans_id,
              amount,
              tourName: orderInfo.tourName,
              userName: orderInfo.userName,
              userPhone: orderInfo.userPhone,
              status: 'Ошибка фискализации',
              error: fiscalResult.error
            });
          } catch (error) {
            console.error('Ошибка при отправке уведомления о фискализации:', error);
          }
        } else {
          console.log('Чек успешно фискализирован:', fiscalResult.fiscalData);
          try {
            await sendTelegramNotification({
              orderId: merchant_trans_id,
              clickTransId: click_trans_id,
              amount,
              tourName: orderInfo.tourName,
              userName: orderInfo.userName,
              userPhone: orderInfo.userPhone,
              status: 'Фискализирован',
              fiscalData: fiscalResult.fiscalData
            });
          } catch (error) {
            console.error('Ошибка при отправке уведомления о фискализации:', error);
          }
        }
      } catch (fiscalError) {
        console.error('Ошибка при выполнении фискализации:', fiscalError);
      }
      
      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: merchant_trans_id,
        error: 0,
        error_note: 'Success'
      });
    } else {
      console.error('Неизвестный тип действия:', action);
      return NextResponse.json({
        error: 1, // Ошибка в запросе от CLICK
        error_note: 'Неизвестный тип действия'
      }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Ошибка при обработке уведомления от Click:', error);
    return NextResponse.json({
      error: 7, // Системная ошибка
      error_note: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}

async function sendTelegramNotification(paymentData: PaymentData): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '5283151626';
    
    let message = `
💰 Платеж #${paymentData.orderId}
🔢 Click ID: ${paymentData.clickTransId}
💵 Сумма: ${paymentData.amount} сум
`;

    if (paymentData.tourName) {
      message += `🏙️ Тур: ${paymentData.tourName}\n`;
    }
    
    if (paymentData.userName) {
      message += `👤 Клиент: ${paymentData.userName}\n`;
    }
    
    if (paymentData.userPhone) {
      message += `📱 Телефон: ${paymentData.userPhone}\n`;
    }
    
    message += `🔄 Статус: ${paymentData.status}
⏱️ Дата: ${new Date().toLocaleString('ru-RU')}
    `;
    
    if (paymentData.error) {
      message += `\n❌ Ошибка: ${paymentData.error}`;
    }
    
    if (paymentData.fiscalData) {
      message += `\n✅ Фискальный чек: ${paymentData.fiscalData.receipt_id || 'Создан'}`;
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
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
    
    const data = await response.json();
    if (!data.ok) {
      console.error('Ошибка отправки в Telegram:', data);
    }
  } catch (error: unknown) {
    console.error('Ошибка при отправке уведомления в Telegram:', error);
  }
}