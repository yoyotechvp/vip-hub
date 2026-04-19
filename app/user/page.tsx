'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="container">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">用户管理</h1>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">用户列表</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <input
              type="text"
              placeholder="用户名称"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md input"
            />
            <button
              onClick={handleAddUser}
              className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition touchable"
            >
              添加用户
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.id}/merchants`}
                className="p-4 border rounded-md hover:border-green-500 hover:bg-green-50 transition touchable"
              >
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">ID: {user.id}</p>
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