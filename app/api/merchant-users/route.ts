import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET(request: NextRequest) {
  const merchantId = request.nextUrl.searchParams.get('merchantId');
  if (!merchantId) {
    return NextResponse.json({ error: 'merchantId is required' }, { status: 400 });
  }
  
  const users = db.prepare(`
    SELECT um.*, u.name as user_name, ml.name as level_name
    FROM user_merchants um
    LEFT JOIN users u ON um.user_id = u.id
    LEFT JOIN member_levels ml ON um.level_id = ml.id
    WHERE um.merchant_id = ?
  `).all(merchantId);
  
  return NextResponse.json(users);
}