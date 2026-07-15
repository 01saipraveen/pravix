import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { 
  products as defaultProducts, categories as defaultCategories, 
  coupons as defaultCoupons 
} from '../data/database';
import type { Product, Category, Coupon } from '../data/database';
import { 
  Shield, BarChart2, Package, Tag, ShoppingCart, Users, 
  TrendingUp, Plus, Trash, ArrowLeft, Layers 
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { user, orders } = useAuth();
  const { formatPrice } = useLocale();
  const { showToast } = useToast();

  // Route protection - Redirect if not admin
  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl mt-28">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="font-bold text-xl mb-2">Access Denied</h3>
        <p className="text-sm text-slate-500 mb-6">Your authorization token does not carry administrator parameters.</p>
        <Link to="/" className="px-6 py-2 bg-indigo-500 text-white rounded-xl">Back to Terminal</Link>
      </div>
    );
  }

  // Active Admin view
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'coupons'>('dashboard');

  // Local state databases
  const [productsList, setProductsList] = useState<Product[]>(defaultProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [couponsList, setCouponsList] = useState<Coupon[]>(defaultCoupons);

  // Add Product Form
  const { register: regProduct, handleSubmit: handleProductSubmit, reset: resetProductForm } = useForm();
  
  // Add Category Form
  const { register: regCategory, handleSubmit: handleCategorySubmit, reset: resetCategoryForm } = useForm();

  // Add Coupon Form
  const { register: regCoupon, handleSubmit: handleCouponSubmit, reset: resetCouponForm } = useForm();

  // Stats calculation
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0) + 12840; // Base + current simulated
  const totalOrders = orders.length + 42;
  const totalCustomers = 318;

  // Inventory adjustment
  const adjustStock = (productId: string, amount: number) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + amount) } : p
      )
    );
    showToast('Inventory level recalibrated.', 'success');
  };

  // Add Product
  const onAddProduct = (data: any) => {
    const newProd: Product = {
      id: (productsList.length + 1).toString(),
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      rating: 5.0,
      reviewsCount: 0,
      stock: Number(data.stock),
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
      specifications: {
        Processor: data.processor || 'Custom neural node',
        Display: data.display || 'Generic display',
      },
      reviews: [],
      isNew: true,
      isBestSeller: false,
    };

    setProductsList((prev) => [newProd, ...prev]);
    showToast(`${data.name} initialized into database catalog.`, 'success');
    resetProductForm();
  };

  // Add Category
  const onAddCategory = (data: any) => {
    const newCat: Category = {
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      icon: 'Home',
      description: data.description,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    };

    setCategoriesList((prev) => [...prev, newCat]);
    showToast(`New category '${data.name}' registered.`, 'success');
    resetCategoryForm();
  };

  // Add Coupon
  const onAddCoupon = (data: any) => {
    const newCoup: Coupon = {
      code: data.code.toUpperCase(),
      discountType: data.discountType as any,
      value: Number(data.value),
      description: data.description,
    };

    setCouponsList((prev) => [...prev, newCoup]);
    showToast(`Coupon ${data.code} compiled into system registry.`, 'success');
    resetCouponForm();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Link to="/account/dashboard" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-indigo-500" />
                <span>Admin Control Center</span>
              </h1>
              <p className="text-xs text-slate-500">Global system metrics and database control panels.</p>
            </div>
          </div>

          {/* Quick select tabs */}
          <div className="flex items-center flex-wrap gap-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-1.5 shadow-sm">
            {(['dashboard', 'products', 'categories', 'orders', 'coupons'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer capitalize ${
                  activeView === view
                    ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="flex flex-col gap-8">
            
            {/* Stat Widgets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Stat 1 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Total Revenue</p>
                  <h3 className="text-2xl font-extrabold mt-1 text-slate-950 dark:text-white">{formatPrice(totalRevenue)}</h3>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Transactions</p>
                  <h3 className="text-2xl font-extrabold mt-1 text-slate-950 dark:text-white">{totalOrders} Orders</h3>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Database Catalog</p>
                  <h3 className="text-2xl font-extrabold mt-1 text-slate-950 dark:text-white">{productsList.length} Models</h3>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center border border-pink-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Registered Nodes</p>
                  <h3 className="text-2xl font-extrabold mt-1 text-slate-950 dark:text-white">{totalCustomers} Users</h3>
                </div>
              </div>

            </div>

            {/* SVG Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sales Chart (Line) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  <span>Telemetry Revenue Stream</span>
                </h3>
                
                {/* SVG Line Chart */}
                <div className="w-full h-64 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-850 p-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
                    
                    {/* Simulated Sales Line */}
                    <path
                      d="M 20 180 Q 100 130 180 150 T 340 80 T 480 30"
                      fill="none"
                      stroke="url(#indigo-grad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="indigo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Axis labels */}
                  <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[8px] text-slate-400 font-bold uppercase">
                    <span>Q1 2026</span>
                    <span>Q2 2026</span>
                    <span>Q3 2026</span>
                    <span>Q4 2026</span>
                  </div>
                </div>
              </div>

              {/* Top Products Share (Bar chart) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" />
                  <span>Module Popularity Allocation</span>
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Item 1 */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Laptops & Workstations</span>
                      <span>48%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Smartphones & Mobiles</span>
                      <span>32%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Wearables & Audio</span>
                      <span>20%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. Products Panel View */}
        {activeView === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Products List */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Active Product Database</h3>
              
              <div className="flex flex-col gap-4">
                {productsList.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-lg bg-slate-50 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{prod.name}</h4>
                        <p className="text-slate-400 mt-0.5">Category: {prod.category} • Cost: {formatPrice(prod.price)}</p>
                        <p className="font-bold mt-1 text-indigo-500">Current Stock: {prod.stock}</p>
                      </div>
                    </div>

                    {/* Stock Adjustment Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => adjustStock(prod.id, -1)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustStock(prod.id, 5)}
                        className="px-2.5 py-1.5 bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
                      >
                        +5 Stock
                      </button>
                      <button
                        onClick={() => { setProductsList((prev) => prev.filter((p) => p.id !== prod.id)); showToast('Product catalog record deleted.', 'info'); }}
                        className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-500 rounded-lg cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Add Product Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <form onSubmit={handleProductSubmit(onAddProduct)} className="flex flex-col gap-4">
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  <span>Register Hardware</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Model Name</label>
                  <input
                    type="text"
                    required
                    {...regProduct('name')}
                    placeholder="e.g. Nexus Tablet S3"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Marketing Tagline</label>
                  <input
                    type="text"
                    required
                    {...regProduct('tagline')}
                    placeholder="e.g. Pure OLED Processing"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">System Category</label>
                  <select
                    {...regProduct('category')}
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 outline-none"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="audio">Audio Gear</option>
                    <option value="smarthome">Smart Home</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Unit Price (USD)</label>
                    <input
                      type="number"
                      required
                      {...regProduct('price')}
                      placeholder="899"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Initial Stock</label>
                    <input
                      type="number"
                      required
                      {...regProduct('stock')}
                      placeholder="10"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Detailed Description</label>
                  <textarea
                    required
                    rows={3}
                    {...regProduct('description')}
                    placeholder="Details..."
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register System</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* 3. Categories Panel View */}
        {activeView === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Active Database Categories</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 text-xs flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{cat.name}</h4>
                        <p className="text-slate-400 mt-0.5 truncate w-40">{cat.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setCategoriesList((prev) => prev.filter((c) => c.id !== cat.id)); showToast('Category deleted.', 'info'); }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Category form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <form onSubmit={handleCategorySubmit(onAddCategory)} className="flex flex-col gap-4">
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  <span>Register Category</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Category Name</label>
                  <input
                    type="text"
                    required
                    {...regCategory('name')}
                    placeholder="e.g. Accessories"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Category Description</label>
                  <textarea
                    required
                    rows={3}
                    {...regCategory('description')}
                    placeholder="e.g. Cables, power bricks, and adapters"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Category</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* 4. Orders Panel View */}
        {activeView === 'orders' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Fulfillment Order Logs</h3>
            
            {orders.length > 0 ? (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-indigo-500">{ord.id}</span>
                        <span className="text-[10px] text-slate-400">Date: {ord.date}</span>
                        <span className="font-extrabold">{formatPrice(ord.total)}</span>
                      </div>
                      <p className="text-slate-500 mt-1">Recipient: <span className="font-bold text-slate-700 dark:text-slate-350">{ord.shippingAddress.fullName}</span> ({ord.shippingAddress.city}, {ord.shippingAddress.country})</p>
                      
                      {/* Products */}
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {ord.items.map((item) => (
                          <span key={item.id} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                        <span className="font-bold text-indigo-500 text-xs mt-0.5 block">{ord.status}</span>
                      </div>
                      <button
                        onClick={() => {
                          // Cycle status
                          if (ord.status === 'Processing') ord.status = 'Shipped';
                          else if (ord.status === 'Shipped') ord.status = 'Delivered';
                          else ord.status = 'Processing';
                          showToast(`Order status updated to ${ord.status}`, 'success');
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No order transaction logs found in system database.</p>
            )}
          </div>
        )}

        {/* 5. Coupons Panel View */}
        {activeView === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Active Discount Codes</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {couponsList.map((coup) => (
                  <div key={coup.code} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 text-xs flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-indigo-500">{coup.code}</h4>
                        <p className="text-slate-400 mt-0.5">{coup.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setCouponsList((prev) => prev.filter((c) => c.code !== coup.code)); showToast('Coupon deleted.', 'info'); }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Coupon form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <form onSubmit={handleCouponSubmit(onAddCoupon)} className="flex flex-col gap-4">
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  <span>Compile Coupon</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Coupon Code</label>
                  <input
                    type="text"
                    required
                    {...regCoupon('code')}
                    placeholder="e.g. FLASH50"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Discount Protocol</label>
                    <select
                      {...regCoupon('discountType')}
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Protocol Value</label>
                    <input
                      type="number"
                      required
                      {...regCoupon('value')}
                      placeholder="20"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Code Description</label>
                  <input
                    type="text"
                    required
                    {...regCoupon('description')}
                    placeholder="e.g. $50 discount on checkout"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Compile Coupon</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
