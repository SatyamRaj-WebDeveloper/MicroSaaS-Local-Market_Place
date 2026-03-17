// frontend/app/shop/[slug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Store, ShoppingCart, Plus, Minus, Send, Loader2, MapPin, User } from 'lucide-react';

export default function PublicShopPage() {
  const params = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cart & Customer State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    if (params.slug) fetchShopData();
  }, [params.slug]);

  const fetchShopData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${params.slug}`);
      const data = await res.json();
      if (res.ok) {
        setShop(data.vendor);
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load shop', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existing = cart.find(item => item._id === productId);
    if (existing.qty === 1) {
      setCart(cart.filter(item => item._id !== productId));
    } else {
      setCart(cart.map(item => item._id === productId ? { ...item, qty: item.qty - 1 } : item));
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.qty), 0);
  
  const cartTotal = getCartTotal();
  const isEligibleForDelivery = cartTotal >= (shop?.minimumOrderValue || 0);
  const finalTotal = isEligibleForDelivery ? cartTotal + (shop?.deliveryFee || 0) : cartTotal;

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    
    if (!isEligibleForDelivery) {
      alert(`Minimum order value is ₹${shop.minimumOrderValue}. Please add more items.`);
      return;
    }

    let message = `*New Order for ${shop.shopName}* %0A%0A`;
    message += `*Customer:* ${customerName} %0A`;
    message += `*Address:* ${customerAddress} %0A%0A`;
    message += `*Items:* %0A`;
    
    cart.forEach(item => {
      message += `- ${item.name} (${item.qty} x ₹${item.price}) = ₹${item.qty * item.price} %0A`;
    });
    
    message += `%0A*Subtotal:* ₹${cartTotal} %0A`;
    message += `*Delivery Fee:* ₹${shop.deliveryFee || 0} %0A`;
    message += `*Final Total: ₹${finalTotal}* %0A%0A`;
    message += `Please confirm the order!`;

    // Remove any + or spaces from the vendor's WhatsApp number
    const formattedPhone = shop.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  if (!shop) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Shop not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* Left Column: Catalog */}
      <div className="flex-1 p-6 md:p-10 md:mr-[400px]">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <Store className="h-8 w-8 text-blue-600 mr-3" /> {shop.shopName}
          </h1>
          {!shop.isOpen && (
            <span className="inline-block mt-3 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Currently Closed</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const cartItem = cart.find(item => item._id === product._id);
            return (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-lg text-green-600">₹{product.price}</span>
                  
                  {cartItem ? (
                    <div className="flex items-center bg-blue-50 rounded-lg border border-blue-100">
                      <button onClick={() => removeFromCart(product._id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-l-lg transition-colors"><Minus className="h-4 w-4" /></button>
                      <span className="px-3 font-medium text-blue-900">{cartItem.qty}</span>
                      <button onClick={() => addToCart(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-r-lg transition-colors"><Plus className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={!shop.isOpen}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Floating Cart (Desktop) / Bottom Sheet (Mobile) */}
      <div className="w-full md:w-[400px] bg-white border-l border-gray-200 shadow-xl md:fixed md:right-0 md:top-0 md:h-screen flex flex-col z-40">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" /> Your Cart
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">₹{item.price} x {item.qty}</p>
                </div>
                <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{isEligibleForDelivery ? `₹${shop.deliveryFee}` : 'Not eligible'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{isEligibleForDelivery ? finalTotal : cartTotal}</span>
              </div>
            </div>

            {!isEligibleForDelivery && shop.minimumOrderValue > 0 && (
              <p className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded border border-red-100">
                Add ₹{shop.minimumOrderValue - cartTotal} more to your cart to be eligible for delivery.
              </p>
            )}

            <form onSubmit={handleWhatsAppCheckout} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input required type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input required type="text" placeholder="Delivery Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button 
                type="submit" 
                disabled={!isEligibleForDelivery || !shop.isOpen}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-lg font-bold flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                <Send className="h-5 w-5 mr-2" /> Order via WhatsApp
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}