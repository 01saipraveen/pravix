import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Trash2, ShoppingBag, ArrowRight, ArrowLeft, Ticket, 
  Trash, Bookmark, ShoppingCart, Info 
} from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { t, formatPrice } = useLocale();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { 
    cart, savedForLater, appliedCoupon, updateQuantity, 
    removeFromCart, saveForLater, moveToCart, removeFromSavedForLater, applyCoupon, 
    removeCoupon, getCartTotals 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const { subtotal, discount, tax, shipping, total } = getCartTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    
    const res = applyCoupon(couponCode);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponCode('');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      showToast('Authentication required for secure gateway checkout.', 'info');
      navigate('/account/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mb-8">
          {t('cart.title')}
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Side: Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                
                {cart.map((item) => {
                  const product = item.product;
                  const unitPrice = product.flashSaleDiscount
                    ? product.price * (1 - product.flashSaleDiscount / 100)
                    : product.price;

                  return (
                    <div 
                      key={product.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-20 h-20 object-cover rounded-xl border border-slate-200/50 dark:border-slate-800/50 shrink-0 bg-slate-50 dark:bg-slate-950" 
                        />
                        <div>
                          <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wider">{product.category}</span>
                          <h3 className="font-bold text-slate-900 dark:text-white hover:text-indigo-500 transition-colors text-base line-clamp-1">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="text-xs text-indigo-500 mt-0.5">{formatPrice(unitPrice)} each</p>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-950">
                          <button
                            onClick={() => updateQuantity(product.id, item.quantity - 1)}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-100">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, item.quantity + 1)}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Total price for product */}
                        <span className="font-extrabold text-sm text-slate-950 dark:text-white shrink-0 w-20 text-right">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { saveForLater(product.id); showToast(`${product.name} saved for later.`, 'info'); }}
                            title="Save for later"
                            className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-500 hover:text-indigo-500 transition-colors cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { removeFromCart(product.id); showToast(`${product.name} removed.`, 'info'); }}
                            title="Remove from Cart"
                            className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* Continue Shopping Link */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors self-start mt-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Calibration (Shopping)</span>
              </Link>

            </div>

            {/* Right Side: Order Summary & Coupon System */}
            <div className="flex flex-col gap-6">
              
              {/* Order Summary breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">{t('cart.summary')}</h3>
                
                <div className="flex flex-col gap-3 text-sm text-slate-500">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Discount ({appliedCoupon.code})</span>
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t('cart.tax')} (8%)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(tax)}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Spend {formatPrice(500 - (subtotal - discount))} more to qualify for Free Shipping!</span>
                    </p>
                  )}

                  <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />

                  <div className="flex justify-between text-base text-slate-950 dark:text-white font-extrabold">
                    <span>{t('cart.total')}</span>
                    <span className="text-xl text-indigo-500">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t('cart.checkout')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

              </div>

              {/* Coupon code form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Coupon Code</h4>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      <span>{appliedCoupon.code} applied ({appliedCoupon.description})</span>
                    </div>
                    <button 
                      onClick={() => { removeCoupon(); showToast('Coupon removed.', 'info'); }}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. TECH20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs focus:outline-none border border-slate-200 dark:border-slate-850"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {t('cart.coupon')}
                    </button>
                  </form>
                )}

                <p className="text-[10px] text-slate-400">
                  Try "TECH20" for 20% off all systems, or "WELCOME10" for 10% off.
                </p>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-1">{t('cart.empty')}</h3>
            <p className="text-sm text-slate-500 mb-6">Explore our neural computing catalog to configure a system.</p>
            <Link to="/" className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm">
              Shop Nexus Systems
            </Link>
          </div>
        )}

        {/* Save for later section */}
        {savedForLater.length > 0 && (
          <section className="mt-16 border-t border-slate-200/60 dark:border-slate-800/80 pt-12">
            <h3 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-500" />
              <span>{t('cart.saveLater')} ({savedForLater.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedForLater.map((item) => (
                <div 
                  key={item.product.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg bg-slate-50 dark:bg-slate-950" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate w-36">{item.product.name}</h4>
                      <span className="text-xs text-indigo-500 font-extrabold">{formatPrice(item.product.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveToCart(item.product.id)}
                      className="px-3 py-1.5 bg-indigo-500 text-white font-bold text-[10px] rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => { removeFromSavedForLater(item.product.id); showToast('Saved component removed.', 'info'); }}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
