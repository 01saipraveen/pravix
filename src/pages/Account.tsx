import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { 
  User as UserIcon, Lock, Mail, ShoppingBag, Heart, 
  MapPin, Settings, Power, Plus, Trash, Shield 
} from 'lucide-react';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const { formatPrice } = useLocale();
  const { showToast } = useToast();
  const { 
    user, addresses, orders, login, register, 
    logout, forgotPassword, addAddress, removeAddress, updateProfile 
  } = useAuth();
  
  const { wishlist, toggleWishlist, addToCart } = useCart();

  // Mode: login, register, forgot-password, or dashboard
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'dashboard'>('login');
  
  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');

  // Load correct view based on login state
  useEffect(() => {
    if (user) {
      setMode('dashboard');
    } else if (mode === 'dashboard') {
      setMode('login');
    }
  }, [user]);

  // Loading states
  const [loading, setLoading] = useState(false);

  // OTP Login states
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');

  // Forms
  const { register: regLogin, handleSubmit: handleLoginSubmit } = useForm();
  const { register: regRegister, handleSubmit: handleRegisterSubmit } = useForm();
  const { register: regAddress, handleSubmit: handleAddressSubmit, reset: resetAddressForm } = useForm();
  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm();

  // Send OTP handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForOtp) {
      showToast('Please enter an email identifier.', 'error');
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulating latency
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      showToast(`Verification code dispatched to ${emailForOtp}. Check your inbox!`, 'success');
      showToast(`[Security Test OTP]: ${code}`, 'info'); // Display OTP code in toast for easy testing
    } catch {
      showToast('Failed to dispatch verification code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp) {
      showToast('Please enter the 6-digit verification code.', 'error');
      return;
    }
    if (enteredOtp !== generatedOtp) {
      showToast('Invalid verification code parameters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const simulatedPassword = emailForOtp.toLowerCase() === 'pravixp5@gmail.com' ? 'admin' : 'otp-backdoor';
      const ok = await login(emailForOtp, simulatedPassword);
      if (ok) {
        showToast('OTP authorized. Login successful.', 'success');
        if (redirect === 'checkout') {
          navigate('/checkout');
        } else {
          setMode('dashboard');
        }
      }
    } catch {
      showToast('Authentication protocol failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const onLogin = async (data: any) => {
    setLoading(true);
    try {
      const ok = await login(data.email, data.password);
      if (ok) {
        showToast('Login authorized. Token registered.', 'success');
        if (redirect === 'checkout') {
          navigate('/checkout');
        } else {
          setMode('dashboard');
        }
      }
    } catch {
      showToast('Authentication check failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const onRegister = async (data: any) => {
    setLoading(true);
    try {
      const ok = await register(data.username, data.email, data.password);
      if (ok) {
        showToast('User account compiled successfully.', 'success');
        if (redirect === 'checkout') {
          navigate('/checkout');
        } else {
          setMode('dashboard');
        }
      }
    } catch {
      showToast('Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const onForgot = async (data: any) => {
    setLoading(true);
    await forgotPassword(data.email);
    showToast('Simulated password reset instructions dispatched to email.', 'info');
    setMode('login');
    setLoading(false);
  };

  // Add Address handler
  const onAddAddress = (data: any) => {
    addAddress({
      fullName: data.fullName,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      phone: data.phone,
    });
    showToast('New shipping coordinates logged.', 'success');
    resetAddressForm();
  };

  // Update profile handler
  const onUpdateProfile = (data: any) => {
    updateProfile(data.username, data.email, `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`);
    showToast('Telemetry profile parameters updated.', 'success');
  };

  // Login view
  if (mode === 'login') {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-3xl shadow-xl">
          <div className="text-center flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Access Core Terminal</h2>
            <p className="text-xs text-slate-500">Log in to track orders and manage system parameters.</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-850">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                loginMethod === 'password'
                  ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                loginMethod === 'otp'
                  ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              Gmail OTP Login
            </button>
          </div>

          {loginMethod === 'password' ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Email Identifier</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    {...regLogin('email')}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400">Security Key (Password)</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-indigo-500 hover:underline"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    {...regLogin('password')}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow transition-colors cursor-pointer flex items-center justify-center"
              >
                {loading ? 'Validating Token...' : 'Authorize Login'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400">Gmail Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={emailForOtp}
                        onChange={(e) => setEmailForOtp(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow transition-colors cursor-pointer flex items-center justify-center"
                  >
                    {loading ? 'Generating Code...' : 'Send Verification OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 mb-2">
                    <p className="text-[10px] text-slate-400 font-bold">Target Identity</p>
                    <p className="text-xs font-bold text-indigo-500 mt-0.5">{emailForOtp}</p>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setEnteredOtp(''); }}
                      className="text-[9px] text-slate-400 hover:text-indigo-500 font-bold underline mt-1"
                    >
                      Change Email Address
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400">Verification OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="w-full text-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-sm font-extrabold tracking-widest border border-slate-200 dark:border-slate-850"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow transition-colors cursor-pointer flex items-center justify-center"
                  >
                    {loading ? 'Verifying...' : 'Verify & Authorize Login'}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-xs text-center text-slate-400 mt-6">
            New node?{' '}
            <button onClick={() => setMode('register')} className="text-indigo-500 font-bold hover:underline">
              Create Account
            </button>
          </p>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850 text-[10px] text-slate-400">
            <span className="font-bold text-indigo-500">Backdoor Hint:</span> Log in with email starting with <span className="font-bold">"admin"</span> (e.g. `admin@nexus.com`) to unlock Admin Dashboard control panel!
          </div>
        </div>
      </div>
    );
  }

  // Register view
  if (mode === 'register') {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-3xl shadow-xl">
          <div className="text-center flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Compile Account Node</h2>
            <p className="text-xs text-slate-500">Register in our database for premium checkout speeds.</p>
          </div>

          <form onSubmit={handleRegisterSubmit(onRegister)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">User Handle</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  {...regRegister('username')}
                  placeholder="e.g. tech_architect"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  {...regRegister('email')}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">Security Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  {...regRegister('password')}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow transition-colors cursor-pointer flex items-center justify-center"
            >
              {loading ? 'Compiling Account...' : 'Compile Account Node'}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-6">
            Already registered?{' '}
            <button onClick={() => setMode('login')} className="text-indigo-500 font-bold hover:underline">
              Log In
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Forgot password view
  if (mode === 'forgot') {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-3xl shadow-xl">
          <div className="text-center flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Dispatch Key Recovery</h2>
            <p className="text-xs text-slate-500">Provide account email to dispatch recovery tokens.</p>
          </div>

          <form onSubmit={handleLoginSubmit(onForgot)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs border border-slate-200 dark:border-slate-850"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow transition-colors cursor-pointer flex items-center justify-center"
            >
              {loading ? 'Dispatching...' : 'Dispatch Recovery Ticket'}
            </button>
          </form>

          <button
            onClick={() => setMode('login')}
            className="w-full text-center text-xs text-slate-400 hover:underline mt-4 cursor-pointer"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    );
  }

  // Dashboard / Authenticated view
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Dashboard Header banner */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={user?.avatar} 
              alt={user?.username} 
              className="w-16 h-16 rounded-2xl border border-indigo-500/20 bg-slate-50 dark:bg-slate-950 p-1 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white leading-tight">{user?.username}</h1>
                {user?.isAdmin && (
                  <span className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">Logged Email: <span className="font-semibold text-slate-600 dark:text-slate-300">{user?.email}</span></p>
            </div>
          </div>

          <div className="flex gap-3">
            {user?.isAdmin && (
              <Link to="/admin/dashboard" className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow transition-all">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Terminal</span>
              </Link>
            )}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 dark:bg-slate-950 dark:hover:bg-rose-950/40 text-slate-500 transition-colors rounded-xl text-xs flex items-center gap-2 font-bold cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Tab Sidebar selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-4 shadow-sm flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-indigo-500/10 text-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order History</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'wishlist' ? 'bg-indigo-500/10 text-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>My Wishlist</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'addresses' ? 'bg-indigo-500/10 text-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'bg-indigo-500/10 text-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px]">
            
            {/* Orders Panel */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Transaction History</h3>
                
                {orders.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                        {/* Order Header bar */}
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border-b border-slate-200 dark:border-slate-800/60 flex flex-wrap justify-between items-center gap-4 text-xs font-semibold">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <p className="text-slate-400">Order ID</p>
                              <p className="font-extrabold text-indigo-500 mt-0.5">{ord.id}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Placed On</p>
                              <p className="text-slate-700 dark:text-slate-350 mt-0.5">{ord.date}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Total Charged</p>
                              <p className="font-extrabold text-slate-950 dark:text-white mt-0.5">{formatPrice(ord.total)}</p>
                            </div>
                          </div>

                          <div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${
                              ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              ord.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                              'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ord.status === 'Delivered' ? 'bg-emerald-500' : ord.status === 'Cancelled' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                              <span>{ord.status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Order Products */}
                        <div className="p-4 flex flex-col gap-4">
                          {ord.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200/50 dark:border-slate-800/50 shrink-0 bg-slate-50" />
                                <div>
                                  <h4 className="font-bold text-xs line-clamp-1">{item.name}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {item.quantity} • Unit Cost: {formatPrice(item.price)}</p>
                                </div>
                              </div>
                              <span className="font-extrabold text-xs">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer bar */}
                        <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 border-t border-slate-200/50 dark:border-slate-800/40 flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Estimated Delivery: <span className="font-bold text-slate-700 dark:text-slate-200">{ord.estimatedDelivery}</span></span>
                          <button
                            onClick={() => showToast(`Mock tracking ID generated: Carrier Express (USA) ${ord.id}`, 'info')}
                            className="text-indigo-500 font-bold hover:underline cursor-pointer"
                          >
                            Track Shipment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No telemetry log entries found.</p>
                  </div>
                )}

              </div>
            )}

            {/* Wishlist Panel */}
            {activeTab === 'wishlist' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Bookmarks & Wishlist</h3>
                
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((prod) => (
                      <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-4 shadow-sm bg-slate-50/20 dark:bg-slate-950/10">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-lg bg-slate-50 shrink-0" />
                          <div className="truncate w-28">
                            <h4 className="font-bold text-xs truncate">{prod.name}</h4>
                            <span className="text-xs text-indigo-500 font-extrabold">{formatPrice(prod.price)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { addToCart(prod, 1); showToast(`${prod.name} added.`, 'success'); }}
                            className="px-3 py-1.5 bg-indigo-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => { toggleWishlist(prod); showToast(`${prod.name} removed.`, 'info'); }}
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-500 rounded-lg cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Your wishlist is currently empty.</p>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Panel */}
            {activeTab === 'addresses' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Shipping Coordinates</h3>
                
                {/* List addresses */}
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs flex flex-col justify-between gap-3 relative shadow-inner">
                        <button
                          onClick={() => { removeAddress(addr.id); showToast('Address deleted.', 'info'); }}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="font-extrabold text-slate-950 dark:text-white text-sm">{addr.fullName}</p>
                          <p className="text-slate-500 mt-1">{addr.street}</p>
                          <p className="text-slate-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                          <p className="text-slate-500">{addr.country}</p>
                          <p className="text-slate-500 mt-2">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No address coordinates configured.</p>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />

                {/* Add new address */}
                <form onSubmit={handleAddressSubmit(onAddAddress)} className="flex flex-col gap-4">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Add New Coordinates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      {...regAddress('fullName')}
                      placeholder="FullName"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                    <input
                      type="text"
                      required
                      {...regAddress('phone')}
                      placeholder="Contact Phone"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                    <input
                      type="text"
                      required
                      {...regAddress('street')}
                      placeholder="Street Address"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 sm:col-span-2"
                    />
                    <input
                      type="text"
                      required
                      {...regAddress('city')}
                      placeholder="City"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                    <input
                      type="text"
                      required
                      {...regAddress('state')}
                      placeholder="State / Region"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                    <input
                      type="text"
                      required
                      {...regAddress('zipCode')}
                      placeholder="ZIP / Postal Code"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                    <select
                      {...regAddress('country')}
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 outline-none"
                    >
                      <option>United States</option>
                      <option>Germany</option>
                      <option>Spain</option>
                      <option>France</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 self-end cursor-pointer transition-colors shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Coordinates</span>
                  </button>
                </form>
              </div>
            )}

            {/* Profile Settings Panel */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Profile Telemetry</h3>
                
                <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="flex flex-col gap-4 max-w-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">User Handle</label>
                    <input
                      type="text"
                      required
                      defaultValue={user?.username}
                      {...regProfile('username')}
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Email Identifier</label>
                    <input
                      type="email"
                      required
                      defaultValue={user?.email}
                      {...regProfile('email')}
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer self-start shadow"
                  >
                    Update Profile Parameters
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
