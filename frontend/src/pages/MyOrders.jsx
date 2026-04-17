import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Clock, ChevronRight, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import backend from '../api/backend';
import toINR from '../utils/currency';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await backend.get('/api/orders/');
      // Filter out 'pending' orders (abandoned checkouts) and sort newest first
      const validOrders = res.data.filter(o => o.status !== 'pending');
      const sorted = validOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("We couldn't load your order history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-600/20';
      case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-600/20';
      case 'delivered': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 ring-1 ring-indigo-600/20';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-600/20';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-600/20';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!currentUser && !loading) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Store
            </Link>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
               My <span className="text-primary">Orders</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">View and track your previous purchases.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 inline-flex items-center gap-3">
             <Package className="text-primary w-5 h-5" />
             <span className="font-bold text-gray-700 dark:text-gray-300">Total Orders: {orders.length}</span>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
             <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600" />
             </div>
             <h3 className="text-2xl font-bold mb-3 dark:text-white">No Orders Yet</h3>
             <p className="text-gray-500 mb-8 max-w-md mx-auto">It looks like you haven't made any purchases yet. Explore our collection and find your next great read!</p>
             <Link to="/" className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1">
                Start Shopping
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Order Header */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Order #{order.id}</span>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                       <Calendar className="w-3.5 h-3.5" /> {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Order Total</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">{toINR(order.total_amount)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Items Included</h4>
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Book className="w-5 h-5 text-gray-400" />
                           </div>
                           <div>
                             <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Product ID: {item.product_id}</p>
                             <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity} × {toINR(item.price)}</p>
                           </div>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {toINR(item.quantity * item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Footer Actions */}
                <div className="bg-gray-50/30 dark:bg-gray-800/30 px-6 py-4 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                   <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                      Need Help With Order? <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Book Icon for fallback
const Book = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
);

export default MyOrders;
