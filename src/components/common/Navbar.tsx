import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import type { Language, Currency } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Search, Heart, ShoppingCart, User, Sun, Moon, 
  ChevronDown, LogOut, Menu, X, Shield, Laptop 
} from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, searchQuery }) => {
  const navigate = useNavigate();
  const { t, language, currency, setLanguage, setCurrency, formatPrice } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cart, wishlist, getCartTotals } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (langRef.current && !langRef.current.contains(target)) setLangOpen(false);
      if (currRef.current && !currRef.current.contains(target)) setCurrOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { total } = getCartTotals();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      scrolled 
        ? 'glass-panel-light dark:glass-panel-dark shadow-lg py-3' 
        : 'bg-white/40 dark:bg-slate-950/40 border-b border-slate-200/20 dark:border-slate-800/20 py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <Laptop className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            Pravix
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full bg-slate-100/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200/50 dark:border-slate-800/50 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Right Nav Options */}
        <div className="hidden lg:flex items-center gap-4 text-slate-700 dark:text-slate-200">
          
          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 hover:text-indigo-500 transition-colors text-sm font-semibold cursor-pointer"
            >
              <span>{language}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 overflow-hidden z-50">
                {(['EN', 'DE', 'ES', 'FR'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                      language === lang ? 'text-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10' : ''
                    }`}
                  >
                    {lang === 'EN' ? 'English' : lang === 'DE' ? 'Deutsch' : lang === 'ES' ? 'Español' : 'Français'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div ref={currRef} className="relative">
            <button 
              onClick={() => setCurrOpen(!currOpen)}
              className="flex items-center gap-1 hover:text-indigo-500 transition-colors text-sm font-semibold cursor-pointer"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {currOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 overflow-hidden z-50">
                {(['USD', 'EUR', 'GBP', 'INR'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => { setCurrency(curr); setCurrOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                      currency === curr ? 'text-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10' : ''
                    }`}
                  >
                    {curr} ({curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '₹'})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Icon */}
          <Link 
            to="/account/wishlist" 
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors relative flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 px-3"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCartQty > 0 ? (
              <>
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 animate-pulse">
                  {totalCartQty}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 hidden xl:inline">
                  {formatPrice(total)}
                </span>
              </>
            ) : null}
          </Link>

          {/* User Profile dropdown */}
          <div ref={profileRef} className="relative">
            {user ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-xl border border-indigo-500/20 bg-slate-100 dark:bg-slate-800 p-0.5"
                />
                <span className="text-sm font-semibold hidden xl:inline">{user.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <Link 
                to="/account/login" 
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}

            {user && profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 overflow-hidden z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                  <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.email}</p>
                </div>
                <Link
                  to="/account/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 dark:text-indigo-400"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-rose-500/10 hover:text-rose-500 text-rose-400 text-left border-t border-slate-100 dark:border-slate-800/60 mt-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile menu and toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <Link to="/cart" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 relative">
            <ShoppingCart className="w-4 h-4" />
            {totalCartQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white font-bold text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {totalCartQty}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 shadow-2xl py-4 px-6 flex flex-col gap-4 z-50">
          
          {/* Mobile Search */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2.5 font-semibold">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-500">Home</Link>
            <Link to="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-500 flex items-center justify-between">
              <span>{t('nav.wishlist')}</span>
              {wishlist.length > 0 && <span className="bg-rose-500 text-white text-xs px-2.5 py-0.5 rounded-full">{wishlist.length}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/account/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-500">User Dashboard</Link>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-indigo-500">Admin Control Panel</Link>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="py-2 text-rose-500 text-left cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/account/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-indigo-500 text-white text-center font-bold"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

          {/* Language & Currency select in mobile */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Language:</span>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg px-2 py-1 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="EN">English</option>
                <option value="DE">Deutsch</option>
                <option value="ES">Español</option>
                <option value="FR">Français</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Currency:</span>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg px-2 py-1 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

        </div>
      )}
    </nav>
  );
};
