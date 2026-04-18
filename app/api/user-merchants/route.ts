import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  
  const userMerchants = db.prepare(`
    SELECT um.*, m.name as merchant_name, ml.name as level_name
    FROM user_merchants um
    LEFT JOIN merchants m ON um.merchant_id = m.id
    LEFT JOIN member_levels ml ON um.level_id = ml.id
    WHERE um.user_id = ?
  `).all(userId);
  
  return NextResponse.json(userMerchants);
}