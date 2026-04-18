import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET() {
  const users = db.prepare('SELECT * FROM users').all();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(name);
  return NextResponse.json({ id: result.lastInsertRowid, name });
}