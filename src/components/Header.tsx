import Link from 'next/link';
import { Coffee } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-coffee-500" />
          <span className="text-2xl font-bold text-coffee-900">My Cafe</span>
        </Link>
        
        <nav className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-coffee-500">Home</Link>
          <Link href="/menu" className="text-gray-600 hover:text-coffee-500">Menu</Link>
          <Link href="/about" className="text-gray-600 hover:text-coffee-500">About</Link>
        </nav>
      </div>
    </header>
  );
}
