// frontend/app/dashboard/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UploadCloud, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Files state
  const [shopImage, setShopImage] = useState(null);
  const [idImage, setIdImage] = useState(null);

  useEffect(() => {
    if (session?.accessToken) fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/me`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!shopImage || !idImage) {
      setMessage({ type: 'error', text: 'Please select both images.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('shopFrontImage', shopImage);
    formData.append('idProofImage', idImage);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
          // Note: Do NOT set Content-Type to application/json. 
          // Browser automatically sets multipart/form-data with boundaries when using FormData.
        },
        body: formData
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Documents uploaded successfully! Pending admin approval.' });
        fetchProfile(); // Refresh to show the uploaded images
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', text: errorData.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error during upload.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business verification and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Verification Status</h2>
          {profile?.isVerified ? (
            <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-1.5" /> Verified
            </span>
          ) : (
            <span className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
              <ShieldAlert className="h-4 w-4 mr-1.5" /> Action Required
            </span>
          )}
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`mb-6 p-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shop Front Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <label className="block text-sm font-medium text-gray-900 mb-1">Shop Front Photo</label>
                <p className="text-xs text-gray-500 mb-4">Must clearly show the shop signboard.</p>
                <input type="file" accept="image/*" onChange={(e) => setShopImage(e.target.files[0])} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {profile?.shopFrontImage && !shopImage && (
                  <p className="mt-3 text-sm text-green-600 font-medium">✓ Current image uploaded</p>
                )}
              </div>

              {/* ID Proof Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <label className="block text-sm font-medium text-gray-900 mb-1">Owner ID Proof</label>
                <p className="text-xs text-gray-500 mb-4">Aadhaar, PAN, or Driving License.</p>
                <input type="file" accept="image/*" onChange={(e) => setIdImage(e.target.files[0])} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {profile?.idProofImage && !idImage && (
                  <p className="mt-3 text-sm text-green-600 font-medium">✓ Current document uploaded</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={uploading || profile?.isVerified} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors disabled:opacity-50">
                {uploading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                {profile?.isVerified ? 'Shop Verified' : 'Submit Documents'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}