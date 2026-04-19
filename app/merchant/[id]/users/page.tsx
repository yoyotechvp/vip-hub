'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function UsersPage() {
  const params = useParams();
  const merchantId = params.id as string;
  const [merchantUsers, setMerchantUsers] = useState<any[]>([]);
  const [chargeItems, setChargeItems] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [showChargeModal, setShowChargeModal] = useState(false);

  useEffect(() => {
    fetchMerchantUsers();
    fetchChargeItems();
  }, [merchantId]);

  const fetchMerchantUsers = async () => {
    const res = await fetch(`/api/merchant-users?merchantId=${merchantId}`);
    const data = await res.json();
    setMerchantUsers(data);
  };

  const fetchChargeItems = async () => {
    const res = await fetch(`/api/charge-items?merchantId=${merchantId}`);
    const data = await res.json();
    setChargeItems(data);
  };

  const handleCharge = async () => {
    if (!merchantId || !selectedUser || !selectedItem || chargeAmount <= 0) return;
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: selectedUser, merchant_id: merchantId, type: 'charge', amount: chargeAmount, item_id: selectedItem })
    });
    setChargeAmount(0);
    setSelectedItem(null);
    setSelectedUser(null);
    setShowChargeModal(false);
    fetchMerchantUsers();
  };

  const openChargeModal = (userId: number) => {
    setSelectedUser(userId);
    setShowChargeModal(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">用户管理</h2>
      
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">用户名称</th>
              <th className="px-4 py-3 text-left">余额</th>
              <th className="px-4 py-3 text-left">积分</th>
              <th className="px-4 py-3 text-left">等级</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {merchantUsers.map((user) => (
              <tr key={user.user_id} className="border-t">
                <td className="px-4 py-3">{user.user_name}</td>
                <td className="px-4 py-3">¥{user.balance.toFixed(2)}</td>
                <td className="px-4 py-3">{user.points}</td>
                <td className="px-4 py-3">{user.level_name || '普通'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openChargeModal(user.user_id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition touchable"
                  >
                    扣费
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 扣费模态框 */}
      {showChargeModal && (
        <div className="modal-overlay" onClick={() => setShowChargeModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">用户扣费</h3>
            <div className="space-y-4">
              <select
                value={selectedItem || ''}
                onChange={(e) => setSelectedItem(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md input"
              >
                <option value="">选择扣费项目</option>
                {chargeItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} - ¥{item.price.toFixed(2)}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="扣费金额"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-md input"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowChargeModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition touchable"
                >
                  取消
                </button>
                <button
                  onClick={handleCharge}
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition touchable"
                  disabled={!selectedItem || chargeAmount <= 0}
                >
                  确认扣费
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}