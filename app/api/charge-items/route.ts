import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET(request: NextRequest) {
  const merchantId = request.nextUrl.searchParams.get('merchantId');
  if (!merchantId) {
    return NextResponse.json({ error: 'merchantId is required' }, { status: 400 });
  }
  const items = db.prepare('SELECT * FROM charge_items WHERE merchant_id = ?').all(merchantId);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const { merchant_id, name, price, type } = await request.json();
  const result = db.prepare('INSERT INTO charge_items (merchant_id, name, price, type) VALUES (?, ?, ?, ?)').run(merchant_id, name, price, type);
  return NextResponse.json({ id: result.lastInsertRowid, merchant_id, name, price, type });
}