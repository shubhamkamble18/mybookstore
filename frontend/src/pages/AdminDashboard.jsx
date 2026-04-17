import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, X, Check, Package, DollarSign, 
  ShoppingBag, TrendingUp, AlertCircle, Calendar,
  ArrowUpRight, ArrowDownRight, LayoutDashboard,
  Users, Settings, LogOut
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import toINR from '../utils/currency';

const AdminDashboard = () => {
  const { isAdmin, token, currentUser, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', price: '', image_url: '', category: '', description: '', stock: 0 });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/admin/stats', { headers }),
        fetch('http://127.0.0.1:5000/api/admin/orders', { headers }),
        fetch('http://127.0.0.1:5000/api/products/', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? `http://127.0.0.1:5000/api/products/${editingProduct.id}`
      : 'http://127.0.0.1:5000/api/products/';
    
    try {
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ title: '', author: '', price: '', image_url: '', category: '', description: '', stock: 0 });
        fetchAdminData();
      }
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (!isAdmin) return <Navigate to="/" />;
  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">A</div>
            <span className="text-xl font-black tracking-tighter">ADMIN CORE</span>
          </div>

          <nav className="space-y-2">
            <SidebarLink icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarLink icon={<ShoppingBag size={20}/>} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            <SidebarLink icon={<Package size={20}/>} label="Inventory" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          </nav>
        </div>

        <div className="mt-auto p-8 bg-gray-50/50 dark:bg-gray-800/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {currentUser?.photoURL ? <img src={currentUser.photoURL} /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">AD</div>}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-bold truncate dark:text-white">{currentUser?.displayName || 'Admin User'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 p-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'orders' && 'Order Management'}
                {activeTab === 'products' && 'Inventory Control'}
            </h1>
            <p className="text-gray-500 font-medium">Welcome back, manager. Here's what's happening today.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm text-sm font-bold text-gray-600 dark:text-gray-400">
                <Calendar size={16} /> Mar 29, 2026
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setFormData({ title: '', author: '', price: '', image_url: '', category: '', description: '', stock: 0 }); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <Plus size={20} /> Add New Book
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Paid Revenue" value={toINR(stats?.total_revenue || 0)} trend="+12.5%" positive={true} icon={<DollarSign className="text-emerald-500" />} />
              <StatCard title="Total Orders" value={stats?.total_orders} trend="+5 orders" positive={true} icon={<ShoppingBag className="text-blue-500" />} />
              <StatCard title="Total Customers" value={stats?.total_customers} trend="+2 new" positive={true} icon={<Users className="text-indigo-500" />} />
              <StatCard title="Inventory Items" value={stats?.total_products} trend="-2 sold today" positive={false} icon={<Package className="text-purple-500" />} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black dark:text-white">Revenue Performance</h3>
                            <p className="text-sm text-gray-500 font-medium">Daily earnings for the last 7 days</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Sales Amount</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.revenue_chart_data || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: '#fff'}} />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-black mb-6 dark:text-white">Leaderboard</h3>
                    <div className="space-y-6">
                        {stats?.top_books?.map((book, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-12 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                                     {book.image_url && <img src={book.image_url} className="w-full h-full object-cover" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold truncate dark:text-white">{book.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{book.author}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-primary">{toINR(book.price)}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">QTY: {book.stock}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">Recent Transactions</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">Export CSV</button>
                    <button className="px-4 py-2 text-xs font-bold bg-primary/10 text-primary rounded-lg">Filter</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 dark:bg-gray-800/20">
                    <tr>
                    <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</th>
                    <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-gray-400">Customer</th>
                    <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-gray-400">Total Amount</th>
                    <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-gray-400">Status</th>
                    <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-gray-400 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors">
                        <td className="px-8 py-6 text-sm font-mono font-bold text-gray-400">#{order.id}</td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500">{order.user_id.slice(0, 2).toUpperCase()}</div>
                                <span className="text-sm font-bold dark:text-gray-200">{order.user_id.slice(0, 12)}...</span>
                            </div>
                        </td>
                        <td className="px-8 py-6 font-black text-gray-900 dark:text-white">{toINR(order.total_amount)}</td>
                        <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                        <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-primary transition-all"
                        >
                            {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                        </select>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative mb-6">
                        <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                            {product.image_url && <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                        </div>
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingProduct(product); setFormData(product); setIsModalOpen(true); }} className="p-2 bg-white rounded-lg shadow-lg hover:text-primary transition-colors"><Edit2 size={16}/></button>
                            <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white rounded-lg shadow-lg hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                        {product.stock < 5 && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                <AlertCircle size={10} /> Low Stock
                            </div>
                        )}
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">{product.category || 'Book'}</span>
                        <h4 className="font-black truncate dark:text-white">{product.title}</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">{product.author}</p>
                        
                        <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                            <p className="text-lg font-black text-gray-900 dark:text-white">{toINR(product.price)}</p>
                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-[10px] font-black text-gray-500">
                                {product.stock} IN STOCK
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modern Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white"><X /></button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-4xl font-black mb-2 dark:text-white">{editingProduct ? 'Update Book' : 'New Creation'}</h2>
                    <p className="text-gray-500 font-medium mb-10">Fill in the details to curate your bookstore collection.</p>
                    
                    <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        {formData.image_url ? (
                            <img src={formData.image_url} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <Package size={48} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-xs font-bold text-gray-400">Preview Image</p>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                        <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-primary/50 text-font-bold dark:text-white" placeholder="Enter book title..." />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Author</label>
                            <input required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-primary/50 font-bold dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
                            <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-primary/50 font-bold dark:text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                            <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-primary/50 font-bold dark:text-white" placeholder="e.g. Fiction" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                            <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-primary/50 font-bold dark:text-white" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                        <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-primary/50 font-bold dark:text-white" />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-500 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all">
                            {editingProduct ? 'Save Changes' : 'Publish Book'}
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-500">
    <div className="absolute -right-4 -top-4 w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
    <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${positive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                {trend}
            </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}
  >
    {icon}
    {label}
  </button>
);

const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Core...</p>
    </div>
);

const getStatusStyle = (status) => {
  switch (status) {
    case 'paid': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
    case 'shipped': return 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20';
    case 'delivered': return 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-600/20';
    case 'cancelled': return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
    default: return 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20';
  }
};

export default AdminDashboard;
