import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET() {
  const merchants = db.prepare('SELECT * FROM merchants').all();
  return NextResponse.json(merchants);
}