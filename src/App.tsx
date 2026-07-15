import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Components & Layout
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';
import { About, Contact, PrivacyPolicy, TermsConditions, ReturnRefundPolicy } from './pages/StaticPages';

// Scroll to Top on Page navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Account Subroutes */}
          <Route path="/account/*" element={<Account />} />
          
          {/* Admin panel */}
          <Route path="/admin/*" element={<Admin />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies/privacy" element={<PrivacyPolicy />} />
          <Route path="/policies/terms" element={<TermsConditions />} />
          <Route path="/policies/refund" element={<ReturnRefundPolicy />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <BrowserRouter>
                <ScrollToTop />
                <MainLayout />
              </BrowserRouter>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};

export default App;
