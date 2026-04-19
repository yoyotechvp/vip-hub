'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [newMerchant, setNewMerchant] = useState('');

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    const res = await fetch('/api/merchants');
    const data = await res.json();
    setMerchants(data);
  };

  const handleAddMerchant = async () => {
    if (!newMerchant) return;
    await fetch('/api/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMerchant })
    });
    setNewMerchant('');
    fetchMerchants();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="container">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">商家管理</h1>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">商家列表</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <input
              type="text"
              placeholder="商家名称"
              value={newMerchant}
              onChange={(e) => setNewMerchant(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md input"
            />
            <button
              onClick={handleAddMerchant}
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition touchable"
            >
              添加商家
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {merchants.map((merchant) => (
              <Link
                key={merchant.id}
                href={`/merchant/${merchant.id}/charge-items`}
                className="p-4 border rounded-md hover:border-blue-500 hover:bg-blue-50 transition touchable"
              >
                <h3 className="font-semibold text-lg">{merchant.name}</h3>
                <p className="text-sm text-gray-600">ID: {merchant.id}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="mobile-nav md:hidden">
          <Link href="/" className="mobile-nav-item touchable">
            <div className="mobile-nav-icon">🏠</div>
            <div className="mobile-nav-label">首页</div>
          </Link>
          <Link href="/merchant" className="mobile-nav-item touchable">
            <div className="mobile-nav-icon">🏪</div>
            <div className="mobile-nav-label">商家</div>
          </Link>
          <Link href="/user" className="mobile-nav-item touchable">
            <div className="mobile-nav-icon">👤</div>
            <div className="mobile-nav-label">用户</div>
          </Link>
        </div>
      </div>
    </div>
  );
}