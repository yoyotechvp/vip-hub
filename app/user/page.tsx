import { useState, useEffect } from 'react';

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userMerchants, setUserMerchants] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [newUser, setNewUser] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [chargeItems, setChargeItems] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserMerchants();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser && selectedMerchant) {
      fetchTransactions();
      fetchChargeItems();
    }
  }, [selectedUser, selectedMerchant]);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchUserMerchants = async () => {
    const res = await fetch(`/api/user-merchants?userId=${selectedUser}`);
    const data = await res.json();
    setUserMerchants(data);
  };

  const fetchTransactions = async () => {
    const res = await fetch(`/api/transactions?userId=${selectedUser}&merchantId=${selectedMerchant}`);
    const data = await res.json();
    setTransactions(data);
  };

  const fetchChargeItems = async () => {
    const res = await fetch(`/api/charge-items?merchantId=${selectedMerchant}`);
    const data = await res.json();
    setChargeItems(data);
  };

  const handleAddUser = async () => {
    if (!newUser) return;
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUser })
    });
    setNewUser('');
    fetchUsers();
  };

  const handleRecharge = async () => {
    if (!selectedUser || !selectedMerchant || rechargeAmount <= 0) return;
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: selectedUser, merchant_id: selectedMerchant, type: 'recharge', amount: rechargeAmount })
    });
    setRechargeAmount(0);
    fetchUserMerchants();
    fetchTransactions();
  };

  const handleCharge = async () => {
    if (!selectedUser || !selectedMerchant || !selectedItem || chargeAmount <= 0) return;
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: selectedUser, merchant_id: selectedMerchant, type: 'charge', amount: chargeAmount, item_id: selectedItem })
    });
    setChargeAmount(0);
    setSelectedItem(null);
    fetchUserMerchants();
    fetchTransactions();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">用户管理</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="用户名称"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            添加用户
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 border rounded-md cursor-pointer ${selectedUser === user.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              onClick={() => setSelectedUser(user.id)}
            >
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">ID: {user.id}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">商家列表</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userMerchants.map((um) => (
                <div
                  key={um.merchant_id}
                  className={`p-4 border rounded-md cursor-pointer ${selectedMerchant === um.merchant_id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                  onClick={() => setSelectedMerchant(um.merchant_id)}
                >
                  <h3 className="font-semibold">{um.merchant_name}</h3>
                  <p className="text-sm">余额: ¥{um.balance.toFixed(2)}</p>
                  <p className="text-sm">积分: {um.points}</p>
                  <p className="text-sm">等级: {um.level_name || '普通'}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedMerchant && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">充值</h2>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="充值金额"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(parseFloat(e.target.value))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleRecharge}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                  >
                    充值
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">扣费</h2>
                <div className="flex space-x-2 mb-4">
                  <select
                    value={selectedItem || ''}
                    onChange={(e) => setSelectedItem(parseInt(e.target.value))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
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
                    onChange={(e) => setChargeAmount(parseFloat(e.target.value))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleCharge}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                  >
                    扣费
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">交易记录</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">类型</th>
                        <th className="px-4 py-2 text-left">金额</th>
                        <th className="px-4 py-2 text-left">积分</th>
                        <th className="px-4 py-2 text-left">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-t">
                          <td className="px-4 py-2">{tx.type === 'recharge' ? '充值' : '扣费'}</td>
                          <td className="px-4 py-2">¥{tx.amount.toFixed(2)}</td>
                          <td className="px-4 py-2">{tx.points || 0}</td>
                          <td className="px-4 py-2">{new Date(tx.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}