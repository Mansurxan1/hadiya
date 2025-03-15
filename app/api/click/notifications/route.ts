/**
 * API маршрут для обработки уведомлений от Click
 * 
 * Этот маршрут обрабатывает уведомления о платежах и других событиях от Click
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleClickNotification } from '../route';

export async function POST(request: NextRequest) {
  return handleClickNotification(request);
} 