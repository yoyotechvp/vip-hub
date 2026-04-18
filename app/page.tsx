import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">会员代管系统</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/merchant" className="bg-blue-500 text-white py-3 px-6 rounded-md text-center hover:bg-blue-600 transition">
            商家入口
          </Link>
          <Link href="/user" className="bg-green-500 text-white py-3 px-6 rounded-md text-center hover:bg-green-600 transition">
            用户入口
          </Link>
        </div>
      </div>
    </div>
  );
}