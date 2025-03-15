/**
 * Клиентские функции для работы с API фискализации чеков Click
 */

import { sendFiscalNotification } from './notification';

interface FiscalizeItem {
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
}

interface FiscalizePaymentParams {
  paymentId: string;
  serviceId?: string;
  items: FiscalizeItem[];
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
 * Фискализация платежа
 * 
 * @param params Параметры фискализации
 * @returns Результат фискализации
 */
export async function fiscalizePayment(params: FiscalizePaymentParams): Promise<FiscalizeResponse> {
  try {
    const response = await fetch('/api/click/fiscalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Ошибка при фискализации платежа:', data.error);
      return {
        success: false,
        error: data.error || 'Не удалось фискализировать платеж'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Ошибка при вызове API фискализации:', error);
    return {
      success: false,
      error: 'Ошибка сети при вызове API фискализации'
    };
  }
}

/**
 * Получение данных фискализации платежа
 * 
 * @param paymentId ID платежа
 * @returns Результат запроса данных фискализации
 */
export async function getFiscalData(paymentId: string): Promise<FiscalizeResponse> {
  try {
    const response = await fetch(`/api/click/fiscalize?paymentId=${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Ошибка при получении данных фискализации:', data.error);
      return {
        success: false,
        error: data.error || 'Не удалось получить данные фискализации'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Ошибка при вызове API получения данных фискализации:', error);
    return {
      success: false,
      error: 'Ошибка сети при вызове API получения данных фискализации'
    };
  }
}

/**
 * Пример использования функций фискализации:
 * 
 * // После успешного платежа
 * const result = await fiscalizePayment({
 *   paymentId: 'payment_123456789',
 *   items: [
 *     {
 *       name: 'Туристическая услуга',
 *       price: 1000,
 *       quantity: 1
 *     }
 *   ],
 *   receivedCard: 1000 // Сумма, оплаченная картой
 * });
 * 
 * if (result.success && result.qrCodeURL) {
 *   // Показать QR-код чека пользователю
 *   showQRCode(result.qrCodeURL);
 * }
 */ 