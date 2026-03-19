// frontend/app/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldCheck, XCircle, CheckCircle, Loader2, Store, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.role === 'admin') {
      fetchPendingVendors();
    } else {
      setLoading(false); // Stop loading if they aren't an admin
    }
  }, [session]);

  const fetchPendingVendors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vendors/pending`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingVendors(data);
      }
    } catch (error) {
      console.error('Failed to fetch pending vendors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this shop?`)) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vendors/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      
      if (res.ok) {
        setPendingVendors(pendingVendors.filter(v => v._id !== id));
      }
    } catch (error) {
      console.error(`Failed to ${action} vendor`, error);
    }
  };

  // 1. Show loader while checking session
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  // 2. SECURITY CHECK: Boot them out if they are not an admin
  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  // 3. Render the actual admin dashboard for authorized users
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <ShieldCheck className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-gray-600">Review and approve pending shop registrations.</p>
          </div>
        </div>

        {pendingVendors.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-2">There are no pending vendor verifications at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingVendors.map((vendor) => (
              <div key={vendor._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                
                {/* Info Section */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                  <div className="flex items-center mb-4">
                    <Store className="h-5 w-5 text-gray-400 mr-2" />
                    <h2 className="text-lg font-bold text-gray-900">{vendor.shopName}</h2>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Owner:</strong> {vendor.ownerName}</p>
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>WhatsApp:</strong> {vendor.whatsappNumber}</p>
                    <p><strong>Slug:</strong> /{vendor.shopSlug}</p>
                  </div>
                </div>

                {/* Images Section */}
                <div className="p-6 md:w-2/3 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center"><ImageIcon className="h-4 w-4 mr-1.5" /> Shop Front</h4>
                      <a href={vendor.shopFrontImage} target="_blank" rel="noreferrer" className="block">
                        <img src={vendor.shopFrontImage} alt="Shop Front" className="w-full h-40 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center"><ImageIcon className="h-4 w-4 mr-1.5" /> ID Proof</h4>
                      <a href={vendor.idProofImage} target="_blank" rel="noreferrer" className="block">
                        <img src={vendor.idProofImage} alt="ID Proof" className="w-full h-40 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button onClick={() => handleAction(vendor._id, 'reject')} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg flex items-center transition-colors">
                      <XCircle className="h-4 w-4 mr-2" /> Reject & Clear
                    </button>
                    <button onClick={() => handleAction(vendor._id, 'approve')} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 font-medium rounded-lg flex items-center transition-colors shadow-sm">
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}