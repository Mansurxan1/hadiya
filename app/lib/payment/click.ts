/**
 * Click API Client
 * 
 * Клиент для работы с API платежной системы Click
 */

import crypto from 'crypto';
import fetch from 'node-fetch';

export interface ClickAPIConfig {
  serviceId: string;
  merchantId: string;
  secretKey: string;
  merchantUserId: string;
  apiUrl?: string;
}

export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  returnUrl: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  merchantId: string;
  serviceId: string;
  transId: string | null;
}

export interface CreatePaymentResponse {
  payment_url: string;
  payment?: {
    id: string;
    amount: number;
    status: string;
    created_time: string;
  }
}

export interface CheckStatusParams {
  orderId?: string;
  transactionId?: string;
}

export interface StatusResponse {
  status: string;
  status_description: string;
  payment_id?: string;
  order_id?: string;
  amount?: number;
  created_time?: string;
  paid_time?: string;
}

export interface FiscalItemCommissionInfo {
  TIN?: string;  
  PINFL?: string;
}

export interface FiscalItem {
  Name: string;           // Название товара/услуги (обязательно)
  Barcode?: string;       // Штрих-код
  Labels?: string[];      // Массив кодов маркировки (макс. 300 элементов)
  SPIC: string;           // Код СПИК (обязательно)
  Units?: number;         // Код единицы измерения
  PackageCode: string;    // Код упаковки (обязательно)
  GoodPrice?: number;     // Цена за единицу товара/услуги
  Price: number;          // Общая сумма товара, включая количество и исключая скидки (в тийинах) (обязательно)
  Amount: number;         // Количество (обязательно)
  VAT: number;            // Сумма НДС (в тийинах) (обязательно)
  VATPercent: number;     // Процент НДС (обязательно)
  Discount?: number;      // Скидка
  Other?: number;         // Другие скидки
  CommissionInfo: FiscalItemCommissionInfo; // Информация о комиссионном чеке (обязательно)
}

export interface FiscalizeItemsParams {
  service_id: string;
  payment_id: string;
  items: FiscalItem[];
  received_ecash?: number;
  received_cash?: number;
  received_card?: number;
}

export interface RegisterQRCodeParams {
  service_id: string;
  payment_id: string;
  qrcode: string;
}

export interface FiscalResponse {
  error_code: number;
  error_note: string;
}

export interface FiscalDataResponse {
  paymentId: string;
  qrCodeURL: string;
}

// Класс клиента API Click
export class ClickAPIClient {
  private config: ClickAPIConfig;
  private apiUrl: string;

  constructor(config: ClickAPIConfig) {
    this.config = config;
    this.apiUrl = config.apiUrl || 'https://api.click.uz/v2/merchant';
  }

  /**
   * Создает платеж через API Click
   */
  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResponse> {
    const signTime = Date.now();
    
    // Создаем подпись для запроса
    const signString = `${this.config.serviceId}${params.orderId}${signTime}${this.config.secretKey}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');
    
    // Формируем URL для оплаты через форму Click
    const clickUrl = `https://my.click.uz/services/pay?service_id=${params.serviceId}&merchant_id=${params.merchantId}&amount=${params.amount}&transaction_param=${params.orderId}&return_url=${encodeURIComponent(params.returnUrl)}&sign_time=${signTime}&sign_string=${sign}`;
    
    // В демонстрационных целях возвращаем URL сразу
    // В реальном приложении здесь был бы запрос к API Click
    return {
      payment_url: clickUrl,
      payment: {
        id: `test_${Date.now()}`,
        amount: params.amount,
        status: 'WAITING',
        created_time: new Date().toISOString()
      }
    };
  }

  /**
   * Проверяет статус платежа по ID заказа или ID транзакции
   */
  async checkStatus(params: CheckStatusParams): Promise<StatusResponse> {
    // Реализация запроса к API Click для проверки статуса платежа
    try {
      let endpoint = '';
      let requestBody = {};
      
      if (params.orderId) {
        endpoint = `${this.apiUrl}/check/order`;
        requestBody = {
          service_id: this.config.serviceId,
          merchant_id: this.config.merchantId,
          order_id: params.orderId
        };
      } else if (params.transactionId) {
        endpoint = `${this.apiUrl}/check/transaction`;
        requestBody = {
          service_id: this.config.serviceId,
          merchant_id: this.config.merchantId,
          transaction_id: params.transactionId
        };
      } else {
        throw new Error('Необходимо указать orderId или transactionId');
      }
      
      // В демонстрационных целях просто возвращаем тестовый ответ
      // В реальном приложении здесь был бы запрос к API Click
      return {
        status: 'WAITING', // или 'PAID', 'CANCELLED' и т.д.
        status_description: 'Ожидание оплаты',
        payment_id: `test_${Date.now()}`,
        order_id: params.orderId,
        amount: 1000
      };
    } catch (error) {
      console.error('Ошибка при проверке статуса платежа:', error);
      throw error;
    }
  }

  /**
   * Создает подпись для авторизации запросов к API Click
   */
  private createAuthHeader(merchantUserId: string, secretKey: string): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signString = `${timestamp}${secretKey}`;
    const sign = crypto.createHash('sha1').update(signString).digest('hex');
    
    return `${merchantUserId}:${sign}:${timestamp}`;
  }

  /**
   * Фискализация товаров и услуг
   * 
   * POST /v2/merchant/payment/ofd_data/submit_items
   */
  async fiscalizeItems(params: FiscalizeItemsParams): Promise<FiscalResponse> {
    try {
      const endpoint = `${this.apiUrl}/payment/ofd_data/submit_items`;
      const authHeader = this.createAuthHeader(
        this.config.merchantUserId,
        this.config.secretKey
      );
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Auth': authHeader
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при фискализации товаров: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as FiscalResponse;
    } catch (error) {
      console.error('Ошибка при фискализации товаров:', error);
      throw error;
    }
  }

  /**
   * Регистрация уже фискализированного чека
   * 
   * POST /v2/merchant/payment/ofd_data/submit_qrcode
   */
  async registerQRCode(params: RegisterQRCodeParams): Promise<FiscalResponse> {
    try {
      const endpoint = `${this.apiUrl}/payment/ofd_data/submit_qrcode`;
      const authHeader = this.createAuthHeader(
        this.config.merchantUserId,
        this.config.secretKey
      );
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Auth': authHeader
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при регистрации QR-кода: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as FiscalResponse;
    } catch (error) {
      console.error('Ошибка при регистрации QR-кода:', error);
      throw error;
    }
  }

  /**
   * Получение фискальных данных (URL QR-кода)
   * 
   * GET /v2/merchant/payment/ofd_data/:service_id/:payment_id
   */
  async getFiscalData(serviceId: string, paymentId: string): Promise<FiscalDataResponse> {
    try {
      const endpoint = `${this.apiUrl}/payment/ofd_data/${serviceId}/${paymentId}`;
      const authHeader = this.createAuthHeader(
        this.config.merchantUserId,
        this.config.secretKey
      );
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Auth': authHeader
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при получении фискальных данных: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as FiscalDataResponse;
    } catch (error) {
      console.error('Ошибка при получении фискальных данных:', error);
      throw error;
    }
  }
}

/**
 * Создает клиент Click API с настройками из окружения
 */
export function createAppAPIClient(): ClickAPIClient {
  const serviceId = process.env.CLICK_SERVICE_ID;
  const merchantId = process.env.CLICK_MERCHANT_ID;
  const merchantUserId = process.env.CLICK_MERCHANT_USER_ID;
  const secretKey = process.env.CLICK_SECRET_KEY;
  
  if (!serviceId || !merchantId || !merchantUserId || !secretKey) {
    throw new Error('Отсутствуют необходимые переменные окружения для Click API');
  }
  
  return new ClickAPIClient({
    serviceId,
    merchantId,
    merchantUserId,
    secretKey
  });
} 