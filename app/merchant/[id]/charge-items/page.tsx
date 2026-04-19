'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ChargeItemsPage() {
  const params = useParams();
  const merchantId = params.id as string;
  const [chargeItems, setChargeItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: 0, type: 'per_time' });

  useEffect(() => {
    fetchChargeItems();
  }, [merchantId]);

  const fetchChargeItems = async () => {
    const res = await fetch(`/api/charge-items?merchantId=${merchantId}`);
    const data = await res.json();
    setChargeItems(data);
  };

  const handleAddChargeItem = async () => {
    if (!merchantId || !newItem.name || newItem.price <= 0) return;
    await fetch('/api/charge-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, merchant_id: merchantId })
    });
    setNewItem({ name: '', price: 0, type: 'per_time' });
    fetchChargeItems();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">扣费项目管理</h2>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <input
          type="text"
          placeholder="项目名称"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="flex-1 p-3 border border-gray-300 rounded-md input"
        />
        <input
          type="number"
          placeholder="价格"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
          className="w-24 sm:w-32 p-3 border border-gray-300 rounded-md input"
        />
        <select
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          className="p-3 border border-gray-300 rounded-md"
        >
          <option value="per_time">按次</option>
          <option value="package">套餐</option>
        </select>
        <button
          onClick={handleAddChargeItem}
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition touchable"
        >
          添加
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">名称</th>
              <th className="px-4 py-3 text-left">价格</th>
              <th className="px-4 py-3 text-left">类型</th>
            </tr>
          </thead>
          <tbody>
            {chargeItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">¥{item.price.toFixed(2)}</td>
                <td className="px-4 py-3">{item.type === 'per_time' ? '按次' : '套餐'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}