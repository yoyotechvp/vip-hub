import Database from 'better-sqlite3';

const db = new Database('vip-hub.db');

// 初始化数据库
export function initDB() {
  // 商家表
  db.exec(`
    CREATE TABLE IF NOT EXISTS merchants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 扣费项目表
  db.exec(`
    CREATE TABLE IF NOT EXISTS charge_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      merchant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      type TEXT NOT NULL, -- 'per_time' or 'package'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (merchant_id) REFERENCES merchants(id)
    );
  `);

  // 会员等级表
  db.exec(`
    CREATE TABLE IF NOT EXISTS member_levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      merchant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
     权益 TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (merchant_id) REFERENCES merchants(id)
    );
  `);

  // 充值规则表
  db.exec(`
    CREATE TABLE IF NOT EXISTS recharge_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      merchant_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      bonus_points INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (merchant_id) REFERENCES merchants(id)
    );
  `);

  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 用户-商家关系表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_merchants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      merchant_id INTEGER NOT NULL,
      balance REAL DEFAULT 0,
      points INTEGER DEFAULT 0,
      level_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (merchant_id) REFERENCES merchants(id),
      FOREIGN KEY (level_id) REFERENCES member_levels(id),
      UNIQUE(user_id, merchant_id)
    );
  `);

  // 交易记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      merchant_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'recharge' or 'charge'
      amount REAL NOT NULL,
      points INTEGER DEFAULT 0,
      item_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (merchant_id) REFERENCES merchants(id),
      FOREIGN KEY (item_id) REFERENCES charge_items(id)
    );
  `);
}

export default db;