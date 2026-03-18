// frontend/app/dashboard/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Trash2, Loader2, PackageX, Power, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [isVerified, setIsVerified] = useState(false); // NEW: Track verification status
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    if (session?.accessToken) fetchPageData();
  }, [session]);

  // NEW: Fetch both products AND the vendor profile at the same time
  const fetchPageData = async () => {
    try {
      // 1. Fetch Products
      const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/my-products`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      
      // 2. Fetch Profile (to check verification)
      const profRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/me`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      
      if (profRes.ok) {
        const profData = await profRes.json();
        setIsVerified(profData.isVerified); // Set the verification flag
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ ...newProduct, price: Number(newProduct.price) })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewProduct({ name: '', description: '', price: '' });
        fetchPageData(); // Refresh everything
      }
    } catch (error) {
      console.error('Failed to add product', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      if (res.ok) setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
      
      if (res.ok) {
        setProducts(products.map(p => 
          p._id === id ? { ...p, isAvailable: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (isLoading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* NEW: Warning Banner if not verified */}
      {!isVerified && (
        <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start sm:items-center flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-start sm:items-center">
            <ShieldAlert className="h-5 w-5 text-amber-600 mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong className="font-semibold">Action Required:</strong> You must verify your shop documents before adding products.
            </p>
          </div>
          <Link href="/dashboard/settings" className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Verify Now
          </Link>
        </div>
      )}

      {/* Responsive Header section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Catalog</h1>
          <p className="text-gray-600 mt-1">Manage your inventory and pricing.</p>
        </div>
        
        {/* UPDATED: Disabled state styling */}
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!isVerified}
          className={`w-full sm:w-auto flex justify-center items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
            isVerified 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
          }`}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center bg-white rounded-xl border border-gray-200 py-16">
          <PackageX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
          <p className="text-gray-500 mt-1">Get started by adding your first item to the catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className={`bg-white rounded-xl border ${product.isAvailable ? 'border-gray-200 shadow-sm' : 'border-dashed border-gray-300 opacity-75'} p-5 relative transition-all`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">₹{product.price}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">{product.description || "No description provided."}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button onClick={() => handleToggleStatus(product._id, product.isAvailable)} className={`flex items-center text-sm font-medium ${product.isAvailable ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}>
                  <Power className="h-4 w-4 mr-1.5" /> {product.isAvailable ? 'Mark Out of Stock' : 'Mark in Stock'}
                </button>
                <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal remains exactly the same */}
      {isModalOpen && isVerified && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          {/* ... modal content ... */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="e.g. Amul Taaza Milk 500ml" className="w-full border-gray-300 text-black  rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 border px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input required type="number" name="price" min="1" value={newProduct.price} onChange={handleInputChange} placeholder="50" className="w-full border-gray-300 rounded-lg text-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 border px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea name="description" value={newProduct.description} onChange={handleInputChange} rows="3" className="w-full border-gray-300 rounded-lg focus:ring-blue-500 text-black focus:border-blue-500 sm:text-sm py-2 border px-3" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center">
                  {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />} Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}