'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function MemberLevelsPage() {
  const params = useParams();
  const merchantId = params.id as string;
  const [memberLevels, setMemberLevels] = useState<any[]>([]);
  const [newLevel, setNewLevel] = useState({ name: '', 权益: '' });

  useEffect(() => {
    if (merchantId) {
      fetchMemberLevels();
    }
  }, [merchantId]);

  const fetchMemberLevels = async () => {
    if (!merchantId) return;
    const res = await fetch(`/api/member-levels?merchantId=${merchantId}`);
    const data = await res.json();
    setMemberLevels(data);
  };

  const handleAddMemberLevel = async () => {
    if (!merchantId || !newLevel.name) return;
    await fetch('/api/member-levels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLevel, merchant_id: merchantId })
    });
    setNewLevel({ name: '', 权益: '' });
    fetchMemberLevels();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">会员等级管理</h2>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <input
          type="text"
          placeholder="等级名称"
          value={newLevel.name}
          onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
          className="flex-1 p-3 border border-gray-300 rounded-md input"
        />
        <input
          type="text"
          placeholder="权益"
          value={newLevel.权益}
          onChange={(e) => setNewLevel({ ...newLevel, 权益: e.target.value })}
          className="flex-1 p-3 border border-gray-300 rounded-md input"
        />
        <button
          onClick={handleAddMemberLevel}
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
              <th className="px-4 py-3 text-left">权益</th>
            </tr>
          </thead>
          <tbody>
            {memberLevels.map((level) => (
              <tr key={level.id} className="border-t">
                <td className="px-4 py-3">{level.name}</td>
                <td className="px-4 py-3">{level.权益}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}