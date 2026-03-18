// frontend/app/dashboard/page.jsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Package, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  const { data: session } = useSession();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Manage your digital storefront and incoming orders.</p>
      </div>

      {/* Verification Warning Banner (Phase 1 Logic) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm flex items-start justify-between">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Your shop is currently hidden from customers</h3>
            <p className="mt-1 text-sm text-amber-700">
              Please upload your shop front photo and ID proof so we can verify and publish your catalog.
            </p>
          </div>
        </div>
        <Link href="/dashboard/settings" 
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Verify Now
        </Link>
      </div>

      {/* Quick Stats (Static for MVP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-blue-600 mb-4">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-green-600 mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Link Clicks (This Week)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Ready to build your catalog?</h2>
        <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
          Start adding your inventory so customers can see what you have in stock as soon as you are verified.
        </p>
        <Link href="/dashboard/product"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Add Your First Product <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      
    </div>
  );
}