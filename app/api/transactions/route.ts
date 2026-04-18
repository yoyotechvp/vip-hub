import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

initDB();

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const merchantId = request.nextUrl.searchParams.get('merchantId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  let query = 'SELECT * FROM transactions WHERE user_id = ?';
  const params: any[] = [userId];
  if (merchantId) {
    query += ' AND merchant_id = ?';
    params.push(merchantId);
  }
  query += ' ORDER BY created_at DESC';
  const transactions = db.prepare(query).all(...params);
  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const { user_id, merchant_id, type, amount, item_id } = await request.json();
  
  // 开始事务
  const tx = db.transaction(() => {
    // 检查用户-商家关系是否存在
    let userMerchant = db.prepare('SELECT * FROM user_merchants WHERE user_id = ? AND merchant_id = ?').get(user_id, merchant_id);
    if (!userMerchant) {
      // 创建新的用户-商家关系
      db.prepare('INSERT INTO user_merchants (user_id, merchant_id, balance, points) VALUES (?, ?, 0, 0)').run(user_id, merchant_id);
      userMerchant = { user_id, merchant_id, balance: 0, points: 0 };
    }
    
    if (type === 'recharge') {
      // 充值逻辑
      // 查找最接近的充值规则（金额小于等于充值金额的最大规则）
      const rule = db.prepare('SELECT * FROM recharge_rules WHERE merchant_id = ? AND amount <= ? ORDER BY amount DESC LIMIT 1').get(merchant_id, amount);
      const bonusPoints = rule ? Math.floor(amount / rule.amount) * rule.bonus_points : 0;
      
      // 更新余额和积分
      db.prepare('UPDATE user_merchants SET balance = balance + ?, points = points + ? WHERE user_id = ? AND merchant_id = ?').run(amount, bonusPoints, user_id, merchant_id);
      
      // 记录交易
      const result = db.prepare('INSERT INTO transactions (user_id, merchant_id, type, amount, points) VALUES (?, ?, ?, ?, ?)').run(user_id, merchant_id, type, amount, bonusPoints);
      return { id: result.lastInsertRowid, type, amount, points: bonusPoints };
    } else if (type === 'charge') {
      // 扣费逻辑
      if (userMerchant.balance < amount) {
        throw new Error('Insufficient balance');
      }
      
      // 更新余额
      db.prepare('UPDATE user_merchants SET balance = balance - ? WHERE user_id = ? AND merchant_id = ?').run(amount, user_id, merchant_id);
      
      // 记录交易
      const result = db.prepare('INSERT INTO transactions (user_id, merchant_id, type, amount, item_id) VALUES (?, ?, ?, ?, ?)').run(user_id, merchant_id, type, amount, item_id);
      return { id: result.lastInsertRowid, type, amount };
    } else {
      throw new Error('Invalid transaction type');
    }
  });
  
  try {
    const result = tx();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}