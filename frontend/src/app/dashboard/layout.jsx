// frontend/app/dashboard/layout.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store, LogOut, Package, Settings, Home, Loader2, Link as LinkIcon, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Automatically close the mobile menu when the user clicks a link
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/dashboard/product', icon: Package },
    { name: 'Settings & Verification', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-40 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Store className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-lg text-black">MicroSaaS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 focus:outline-none">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>


      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 max-md:hidden">
          <Store className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-lg tracking-tight text-black">MicroSaaS</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto mt-16 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <a href={`/shop/${session.user.shopSlug}`} target="_blank" rel="noreferrer"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <LinkIcon className="mr-3 h-5 w-5 text-gray-400" />
            View My Shop
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Dark Overlay (closes menu when clicking outside) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto w-full pt-16 md:pt-0">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}