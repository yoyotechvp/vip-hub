'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TransactionsPage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allMerchants, setAllMerchants] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<number | null>(null);

  useEffect(() => {
    const merchantId = searchParams.get('merchantId');
    if (merchantId) {
      setSelectedMerchant(parseInt(merchantId));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAllMerchants();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId, selectedMerchant]);

  const fetchAllMerchants = async () => {
    const res = await fetch('/api/merchants/all');
    const data = await res.json();
    setAllMerchants(data);
  };

  const fetchTransactions = async () => {
    const merchantId = selectedMerchant ? `&merchantId=${selectedMerchant}` : '';
    const res = await fetch(`/api/transactions?userId=${userId}${merchantId}`);
    const data = await res.json();
    setTransactions(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">交易记录</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">选择商家</label>
        <select
          value={selectedMerchant || ''}
          onChange={(e) => setSelectedMerchant(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full p-3 border border-gray-300 rounded-md input"
        >
          <option value="">全部商家</option>
          {allMerchants.map((merchant) => (
            <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">类型</th>
              <th className="px-4 py-3 text-left">金额</th>
              <th className="px-4 py-3 text-left">积分</th>
              <th className="px-4 py-3 text-left">时间</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'recharge' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tx.type === 'recharge' ? '充值' : '扣费'}
                  </span>
                </td>
                <td className="px-4 py-3">¥{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{tx.points || 0}</td>
                <td className="px-4 py-3">{new Date(tx.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}