'use client';
import { useState, useEffect } from 'react';

export default function RechargePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [allMerchants, setAllMerchants] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<number | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchAllMerchants();
  }, []);

  const fetchAllMerchants = async () => {
    const res = await fetch('/api/merchants/all');
    const data = await res.json();
    setAllMerchants(data);
  };

  const handleRecharge = async () => {
    if (!userId || !selectedMerchant || rechargeAmount <= 0) return;
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, merchant_id: selectedMerchant, type: 'recharge', amount: rechargeAmount })
    });
    setRechargeAmount(0);
    setShowSuccessModal(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">充值</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">选择商家</label>
          <select
            value={selectedMerchant || ''}
            onChange={(e) => setSelectedMerchant(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md input"
          >
            <option value="">选择商家</option>
            {allMerchants.map((merchant) => (
              <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">充值金额</label>
          <input
            type="number"
            placeholder="充值金额"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-md input"
          />
        </div>
        
        <button
          onClick={handleRecharge}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition touchable"
          disabled={!selectedMerchant || rechargeAmount <= 0}
        >
          充值
        </button>
      </div>

      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">充值成功</h3>
            <p className="mb-4">充值操作已完成</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition touchable"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}