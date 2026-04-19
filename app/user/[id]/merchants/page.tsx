'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MerchantsPage() {
  const params = useParams();
  const userId = params.id as string;
  const [userMerchants, setUserMerchants] = useState<any[]>([]);

  useEffect(() => {
    fetchUserMerchants();
  }, [userId]);

  const fetchUserMerchants = async () => {
    const res = await fetch(`/api/user-merchants?userId=${userId}`);
    const data = await res.json();
    setUserMerchants(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">商家列表</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {userMerchants.map((um) => (
          <Link
            key={um.merchant_id}
            href={userId ? `/user/${userId}/transactions?merchantId=${um.merchant_id}` : '#'}
            className="p-4 border rounded-md hover:border-green-500 hover:bg-green-50 transition touchable"
            onClick={(e) => !userId && e.preventDefault()}
          >
            <h3 className="font-semibold text-lg">{um.merchant_name}</h3>
            <p className="text-sm">余额: ¥{um.balance.toFixed(2)}</p>
            <p className="text-sm">积分: {um.points}</p>
            <p className="text-sm">等级: {um.level_name || '普通'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}