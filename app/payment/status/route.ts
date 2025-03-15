import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { getOrderInfo } from '../../api/click/route';
import { OrderData } from '../../api/click/notify/route';

interface CheckStatusRequest {
  orderId?: string;
  transactionId?: string;
}

function getPaymentStatusDescription(status: string): string {
  switch(status) {
    case '0':
      return 'В ожидании оплаты';
    case '1':
      return 'Оплачено';
    case '-1':
      return 'Отменено';
    case '-2':
      return 'Возврат средств';
    default:
      return 'Неизвестный статус';
  }
}

async function checkTransactionStatus(transactionId: string): Promise<any> {
  try {
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;
    
    if (!serviceId || !merchantId || !merchantUserId || !secretKey) {
      throw new Error('Отсутствуют необходимые переменные окружения');
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    
    const digest = crypto.createHash('sha1').update(`${timestamp}${secretKey}`).digest('hex');
    
    const authHeader = `${merchantUserId}:${digest}:${timestamp}`;
    
    const response = await fetch(`https://api.click.uz/v2/merchant/payment/status/${serviceId}/${transactionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': authHeader
      }
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data: responseData
      };
    }
    
    return {
      success: false,
      error: responseData.error_note || 'Ошибка при проверке статуса платежа'
    };
  } catch (error: any) {
    console.error('Ошибка при проверке статуса платежа через API:', error);
    return {
      success: false,
      error: error.message || 'Неизвестная ошибка при проверке статуса платежа'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CheckStatusRequest;
    const { orderId, transactionId } = body;
    
    if (!orderId && !transactionId) {
      return NextResponse.json({
        success: false,
        error: 'Необходим ID заказа или ID транзакции'
      }, { status: 400 });
    }
    
    if (orderId) {
      const orderInfo = await getOrderInfo(orderId) as OrderData | null;
      
      if (!orderInfo) {
        return NextResponse.json({
          success: false,
          error: 'Заказ не найден'
        }, { status: 404 });
      }
      
      if (orderInfo.clickTransId) {
        return NextResponse.json({
          success: true,
          order: {
            orderId: orderInfo.orderId,
            transactionId: orderInfo.clickTransId,
            status: 'PAID',
            statusDescription: 'Оплачено',
            paidAt: orderInfo.paidAt,
            tourName: orderInfo.tourName,
            price: orderInfo.price,
            customer: {
              name: orderInfo.userName,
              phone: orderInfo.userPhone
            }
          }
        });
      } else {
        return NextResponse.json({
          success: true,
          order: {
            orderId: orderInfo.orderId,
            status: 'WAITING',
            statusDescription: 'В ожидании оплаты',
            tourName: orderInfo.tourName,
            price: orderInfo.price,
            customer: {
              name: orderInfo.userName,
              phone: orderInfo.userPhone
            }
          }
        });
      }
    }
    
    if (transactionId) {
      const result = await checkTransactionStatus(transactionId);
      
      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error || 'Ошибка при проверке статуса транзакции'
        }, { status: 500 });
      }
      
      const clickResponse = result.data;
      let status = 'UNKNOWN';
      let statusDescription = 'Неизвестный статус';
      
      if (clickResponse.payment_status === 2) {
        status = 'PAID';
        statusDescription = 'Оплачено';
      } else if (clickResponse.payment_status < 0) {
        status = 'FAILED';
        statusDescription = 'Ошибка оплаты';
      } else if (clickResponse.payment_status === 1) {
        status = 'PROCESSING';
        statusDescription = 'В обработке';
      } else if (clickResponse.payment_status === 0) {
        status = 'WAITING';
        statusDescription = 'В ожидании оплаты';
      }
      
      return NextResponse.json({
        success: true,
        transaction: {
          transactionId: transactionId,
          merchantTransId: clickResponse.merchant_trans_id,
          status: status,
          statusDescription: statusDescription,
          amount: clickResponse.amount,
          paymentStatus: clickResponse.payment_status,
          createdTime: clickResponse.create_time,
          payTime: clickResponse.pay_time
        }
      });
    }
    
  } catch (error: any) {
    console.error('Ошибка при проверке статуса платежа:', error);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
      details: error.message
    }, { status: 500 });
  }
} 