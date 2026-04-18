import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET(request: NextRequest) {
  const merchantId = request.nextUrl.searchParams.get('merchantId');
  if (!merchantId) {
    return NextResponse.json({ error: 'merchantId is required' }, { status: 400 });
  }
  const rules = db.prepare('SELECT * FROM recharge_rules WHERE merchant_id = ?').all(merchantId);
  return NextResponse.json(rules);
}

export async function POST(request: NextRequest) {
  const { merchant_id, amount, bonus_points } = await request.json();
  const result = db.prepare('INSERT INTO recharge_rules (merchant_id, amount, bonus_points) VALUES (?, ?, ?)').run(merchant_id, amount, bonus_points);
  return NextResponse.json({ id: result.lastInsertRowid, merchant_id, amount, bonus_points });
}