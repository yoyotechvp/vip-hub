import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET(request: NextRequest) {
  const merchantId = request.nextUrl.searchParams.get('merchantId');
  if (!merchantId) {
    return NextResponse.json({ error: 'merchantId is required' }, { status: 400 });
  }
  const levels = db.prepare('SELECT * FROM member_levels WHERE merchant_id = ?').all(merchantId);
  return NextResponse.json(levels);
}

export async function POST(request: NextRequest) {
  const { merchant_id, name, 权益 } = await request.json();
  const result = db.prepare('INSERT INTO member_levels (merchant_id, name, 权益) VALUES (?, ?, ?)').run(merchant_id, name, 权益);
  return NextResponse.json({ id: result.lastInsertRowid, merchant_id, name, 权益 });
}