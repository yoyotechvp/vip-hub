'use client';
import { useState, useEffect } from 'react';

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<number | null>(null);
  const [chargeItems, setChargeItems] = useState<any[]>([]);
  const [memberLevels, setMemberLevels] = useState<any[]>([]);
  const [rechargeRules, setRechargeRules] = useState<any[]>([]);
  const [newMerchant, setNewMerchant] = useState('');
  const [newItem, setNewItem] = useState({ name: '', price: 0, type: 'per_time' });
  const [newLevel, setNewLevel] = useState({ name: '', 权益: '' });
  const [newRule, setNewRule] = useState({ amount: 0, bonus_points: 0 });

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    if (selectedMerchant) {
      fetchChargeItems();
      fetchMemberLevels();
      fetchRechargeRules();
    }
  }, [selectedMerchant]);

  const fetchMerchants = async () => {
    const res = await fetch('/api/merchants');
    const data = await res.json();
    setMerchants(data);
  };

  const fetchChargeItems = async () => {
    const res = await fetch(`/api/charge-items?merchantId=${selectedMerchant}`);
    const data = await res.json();
    setChargeItems(data);
  };

  const fetchMemberLevels = async () => {
    const res = await fetch(`/api/member-levels?merchantId=${selectedMerchant}`);
    const data = await res.json();
    setMemberLevels(data);
  };

  const fetchRechargeRules = async () => {
    const res = await fetch(`/api/recharge-rules?merchantId=${selectedMerchant}`);
    const data = await res.json();
    setRechargeRules(data);
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

  const handleAddChargeItem = async () => {
    if (!selectedMerchant || !newItem.name || newItem.price <= 0) return;
    await fetch('/api/charge-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, merchant_id: selectedMerchant })
    });
    setNewItem({ name: '', price: 0, type: 'per_time' });
    fetchChargeItems();
  };

  const handleAddMemberLevel = async () => {
    if (!selectedMerchant || !newLevel.name) return;
    await fetch('/api/member-levels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLevel, merchant_id: selectedMerchant })
    });
    setNewLevel({ name: '', 权益: '' });
    fetchMemberLevels();
  };

  const handleAddRechargeRule = async () => {
    if (!selectedMerchant || newRule.amount <= 0 || newRule.bonus_points < 0) return;
    await fetch('/api/recharge-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRule, merchant_id: selectedMerchant })
    });
    setNewRule({ amount: 0, bonus_points: 0 });
    fetchRechargeRules();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">商家管理</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">商家管理</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="商家名称"
            value={newMerchant}
            onChange={(e) => setNewMerchant(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddMerchant}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            添加商家
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              className={`p-4 border rounded-md cursor-pointer ${selectedMerchant === merchant.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onClick={() => setSelectedMerchant(merchant.id)}
            >
              <h3 className="font-semibold">{merchant.name}</h3>
              <p className="text-sm text-gray-600">ID: {merchant.id}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedMerchant && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">扣费项目管理</h2>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="项目名称"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="价格"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                className="w-24 p-2 border border-gray-300 rounded-md"
              />
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="per_time">按次</option>
                <option value="package">套餐</option>
              </select>
              <button
                onClick={handleAddChargeItem}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                添加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">名称</th>
                    <th className="px-4 py-2 text-left">价格</th>
                    <th className="px-4 py-2 text-left">类型</th>
                  </tr>
                </thead>
                <tbody>
                  {chargeItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">¥{item.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{item.type === 'per_time' ? '按次' : '套餐'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">会员等级管理</h2>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="等级名称"
                value={newLevel.name}
                onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="权益"
                value={newLevel.权益}
                onChange={(e) => setNewLevel({ ...newLevel, 权益: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleAddMemberLevel}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                添加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">名称</th>
                    <th className="px-4 py-2 text-left">权益</th>
                  </tr>
                </thead>
                <tbody>
                  {memberLevels.map((level) => (
                    <tr key={level.id} className="border-t">
                      <td className="px-4 py-2">{level.name}</td>
                      <td className="px-4 py-2">{level.权益}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">充值规则管理</h2>
            <div className="flex space-x-2 mb-4">
              <input
                type="number"
                placeholder="充值金额"
                value={newRule.amount}
                onChange={(e) => setNewRule({ ...newRule, amount: parseFloat(e.target.value) })}
                className="w-32 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="赠送积分"
                value={newRule.bonus_points}
                onChange={(e) => setNewRule({ ...newRule, bonus_points: parseInt(e.target.value) })}
                className="w-32 p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleAddRechargeRule}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                添加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">充值金额</th>
                    <th className="px-4 py-2 text-left">赠送积分</th>
                  </tr>
                </thead>
                <tbody>
                  {rechargeRules.map((rule) => (
                    <tr key={rule.id} className="border-t">
                      <td className="px-4 py-2">¥{rule.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{rule.bonus_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}