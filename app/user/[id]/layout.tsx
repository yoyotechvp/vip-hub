'use client';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function UserLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const userId = params.id;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="container">
        {/* 面包屑导航 */}
        <div className="mb-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-blue-500">首页</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/user" className="text-gray-600 hover:text-blue-500">用户管理</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">用户详情</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">用户管理</h1>
            <p className="text-gray-600">用户ID: {userId}</p>
          </div>
          <Link
            href="/user"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition touchable"
          >
            返回列表
          </Link>
        </div>

        {/* 桌面端侧边导航 */}
        <div className="hidden md:flex mb-6">
          <div className="flex space-x-4">
            <Link
              href={userId ? `/user/${userId}/merchants` : '#'}
              className="px-4 py-2 rounded-md bg-green-500 text-white touchable"
              onClick={(e) => !userId && e.preventDefault()}
            >
              商家列表
            </Link>
            <Link
              href={userId ? `/user/${userId}/recharge` : '#'}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable"
              onClick={(e) => !userId && e.preventDefault()}
            >
              充值
            </Link>
            <Link
              href={userId ? `/user/${userId}/transactions` : '#'}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable"
              onClick={(e) => !userId && e.preventDefault()}
            >
              交易记录
            </Link>
          </div>
        </div>

        {/* 移动端标签导航 */}
        <div className="md:hidden flex overflow-x-auto mb-6 space-x-2 pb-2">
          <Link
            href={userId ? `/user/${userId}/merchants` : '#'}
            className="px-4 py-2 rounded-md bg-green-500 text-white touchable whitespace-nowrap"
            onClick={(e) => !userId && e.preventDefault()}
          >
            商家列表
          </Link>
          <Link
            href={userId ? `/user/${userId}/recharge` : '#'}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable whitespace-nowrap"
            onClick={(e) => !userId && e.preventDefault()}
          >
            充值
          </Link>
          <Link
            href={userId ? `/user/${userId}/transactions` : '#'}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable whitespace-nowrap"
            onClick={(e) => !userId && e.preventDefault()}
          >
            交易记录
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          {children}
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