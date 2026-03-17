// frontend/app/page.jsx
import Link from 'next/link';
import { Store, Smartphone, Percent, ArrowRight, CheckCircle, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-extrabold text-xl tracking-tight text-gray-900">MicroSaaS Local</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Create Shop
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
              Take your local shop online in <span className="text-blue-600">60 seconds.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
              Create a digital catalog, share your unique link, and receive formatted orders directly on your WhatsApp. No apps for customers to download. No commissions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                Start Selling for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                View Demo Shop
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Built for modern local businesses</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-blue-100">
                <Smartphone className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp Orders</h3>
              <p className="text-gray-600 leading-relaxed">
                Customers browse your link and check out. You receive a perfectly formatted WhatsApp message with their name, address, and order details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-green-100">
                <Percent className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Commissions</h3>
              <p className="text-gray-600 leading-relaxed">
                Stop paying 30% to delivery aggregators. You manage your own delivery or pickup, and you keep 100% of your profits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-purple-100">
                <ShoppingBag className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simple Catalog</h3>
              <p className="text-gray-600 leading-relaxed">
                Add products, update prices, and mark items out of stock in seconds from a clean, mobile-friendly dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Simple Steps) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-10">Start taking orders today</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mb-4 border border-gray-700">1</div>
                <h4 className="font-bold text-lg mb-2">Register</h4>
                <p className="text-gray-400 text-sm">Sign up with your shop name and WhatsApp number.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mb-4 border border-gray-700">2</div>
                <h4 className="font-bold text-lg mb-2">Add Items</h4>
                <p className="text-gray-400 text-sm">List your products and set your minimum order value.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mb-4 border border-gray-700">3</div>
                <h4 className="font-bold text-lg mb-2">Share Link</h4>
                <p className="text-gray-400 text-sm">Send your unique store link to customers on WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}