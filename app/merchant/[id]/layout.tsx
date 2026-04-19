'use client';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function MerchantLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const merchantId = params.id;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="container">
        {/* 面包屑导航 */}
        <div className="mb-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-blue-500">首页</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/merchant" className="text-gray-600 hover:text-blue-500">商家管理</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">商家详情</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">商家管理</h1>
            <p className="text-gray-600">商家ID: {merchantId}</p>
          </div>
          <Link
            href="/merchant"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition touchable"
          >
            返回列表
          </Link>
        </div>

        {/* 桌面端侧边导航 */}
        <div className="hidden md:flex mb-6">
          <div className="flex space-x-4">
            <Link
              href={merchantId ? `/merchant/${merchantId}/charge-items` : '#'}
              className="px-4 py-2 rounded-md bg-blue-500 text-white touchable"
              onClick={(e) => !merchantId && e.preventDefault()}
            >
              扣费项目
            </Link>
            <Link
              href={merchantId ? `/merchant/${merchantId}/member-levels` : '#'}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable"
              onClick={(e) => !merchantId && e.preventDefault()}
            >
              会员等级
            </Link>
            <Link
              href={merchantId ? `/merchant/${merchantId}/recharge-rules` : '#'}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable"
              onClick={(e) => !merchantId && e.preventDefault()}
            >
              充值规则
            </Link>
            <Link
              href={merchantId ? `/merchant/${merchantId}/users` : '#'}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable"
              onClick={(e) => !merchantId && e.preventDefault()}
            >
              用户管理
            </Link>
          </div>
        </div>

        {/* 移动端标签导航 */}
        <div className="md:hidden flex overflow-x-auto mb-6 space-x-2 pb-2">
          <Link
            href={merchantId ? `/merchant/${merchantId}/charge-items` : '#'}
            className="px-4 py-2 rounded-md bg-blue-500 text-white touchable whitespace-nowrap"
            onClick={(e) => !merchantId && e.preventDefault()}
          >
            扣费项目
          </Link>
          <Link
            href={merchantId ? `/merchant/${merchantId}/member-levels` : '#'}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable whitespace-nowrap"
            onClick={(e) => !merchantId && e.preventDefault()}
          >
            会员等级
          </Link>
          <Link
            href={merchantId ? `/merchant/${merchantId}/recharge-rules` : '#'}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable whitespace-nowrap"
            onClick={(e) => !merchantId && e.preventDefault()}
          >
            充值规则
          </Link>
          <Link
            href={merchantId ? `/merchant/${merchantId}/users` : '#'}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition touchable whitespace-nowrap"
            onClick={(e) => !merchantId && e.preventDefault()}
          >
            用户管理
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