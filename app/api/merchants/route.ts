import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET() {
  const merchants = db.prepare('SELECT * FROM merchants').all();
  return NextResponse.json(merchants);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  const result = db.prepare('INSERT INTO merchants (name) VALUES (?)').run(name);
  return NextResponse.json({ id: result.lastInsertRowid, name });
}