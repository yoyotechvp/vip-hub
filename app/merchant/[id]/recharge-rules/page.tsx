'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function RechargeRulesPage() {
  const params = useParams();
  const merchantId = params.id as string;
  const [rechargeRules, setRechargeRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({ amount: 0, bonus_points: 0 });

  useEffect(() => {
    fetchRechargeRules();
  }, [merchantId]);

  const fetchRechargeRules = async () => {
    const res = await fetch(`/api/recharge-rules?merchantId=${merchantId}`);
    const data = await res.json();
    setRechargeRules(data);
  };

  const handleAddRechargeRule = async () => {
    if (!merchantId || newRule.amount <= 0 || newRule.bonus_points < 0) return;
    await fetch('/api/recharge-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRule, merchant_id: merchantId })
    });
    setNewRule({ amount: 0, bonus_points: 0 });
    fetchRechargeRules();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">充值规则管理</h2>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <input
          type="number"
          placeholder="充值金额"
          value={newRule.amount}
          onChange={(e) => setNewRule({ ...newRule, amount: parseFloat(e.target.value) || 0 })}
          className="w-32 sm:w-40 p-3 border border-gray-300 rounded-md input"
        />
        <input
          type="number"
          placeholder="赠送积分"
          value={newRule.bonus_points}
          onChange={(e) => setNewRule({ ...newRule, bonus_points: parseInt(e.target.value) || 0 })}
          className="w-32 sm:w-40 p-3 border border-gray-300 rounded-md input"
        />
        <button
          onClick={handleAddRechargeRule}
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition touchable"
        >
          添加
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">充值金额</th>
              <th className="px-4 py-3 text-left">赠送积分</th>
            </tr>
          </thead>
          <tbody>
            {rechargeRules.map((rule) => (
              <tr key={rule.id} className="border-t">
                <td className="px-4 py-3">¥{rule.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{rule.bonus_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}