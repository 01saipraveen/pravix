import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Address } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { 
  CreditCard, Shield, Truck, CheckCircle, Smartphone, 
  MapPin, ShoppingBag, Loader2, ArrowRight, ArrowLeft 
} from 'lucide-react';

interface CheckoutFormInput {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  upiId?: string;
  paypalEmail?: string;
}

export const Checkout: React.FC = () => {
  const { cart, getCartTotals, clearCart } = useCart();
  const { addresses, addOrder } = useAuth();
  const { formatPrice, t } = useLocale();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Razorpay' | 'PayPal'>('Stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const { register, watch, setValue } = useForm<CheckoutFormInput>({
    defaultValues: {
      fullName: addresses[0]?.fullName || '',
      street: addresses[0]?.street || '',
      city: addresses[0]?.city || '',
      state: addresses[0]?.state || '',
      zipCode: addresses[0]?.zipCode || '',
      country: addresses[0]?.country || 'United States',
      phone: addresses[0]?.phone || '',
    }
  });

  const { subtotal, discount, tax, shipping, total } = getCartTotals();

  // Watch fields for Step 3 summary
  const formValues = watch();

  const handleSelectAddress = (addr: Address) => {
    setValue('fullName', addr.fullName);
    setValue('street', addr.street);
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('zipCode', addr.zipCode);
    setValue('country', addr.country);
    setValue('phone', addr.phone);
    showToast('Address loaded from profiles.', 'success');
  };

  const onNextStep = () => {
    if (step === 1) {
      // Validate shipping address
      if (!formValues.fullName || !formValues.street || !formValues.city || !formValues.zipCode) {
        showToast('Please fill out all shipping details.', 'warning');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate payment info depending on selection
      if (paymentMethod === 'Stripe' && (!formValues.cardNumber || !formValues.cardExpiry || !formValues.cardCvc)) {
        showToast('Please enter credit card info.', 'warning');
        return;
      }
      if (paymentMethod === 'Razorpay' && !formValues.upiId) {
        showToast('Please enter your UPI ID.', 'warning');
        return;
      }
      if (paymentMethod === 'PayPal' && !formValues.paypalEmail) {
        showToast('Please enter your PayPal email.', 'warning');
        return;
      }
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate gateway steps
    const statusSteps = [
      'Establishing secure token handshake with payment gateway...',
      'Verifying account calibration & routing details...',
      'Processing transactional blockchain blocks...',
      'Authorization successful. Creating order logs...'
    ];

    for (let i = 0; i < statusSteps.length; i++) {
      setProcessingStatus(statusSteps[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const shippingAddress: Address = {
      id: Math.random().toString(36).substring(7),
      fullName: formValues.fullName,
      street: formValues.street,
      city: formValues.city,
      state: formValues.state,
      zipCode: formValues.zipCode,
      country: formValues.country,
      phone: formValues.phone,
    };

    const orderItems = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.flashSaleDiscount
        ? item.product.price * (1 - item.product.flashSaleDiscount / 100)
        : item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    const order = addOrder(
      orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod
    );

    setCreatedOrder(order);
    setIsProcessing(false);
    clearCart();
    showToast('Secure transaction authorized!', 'success');
  };

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl mt-28">
        <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="font-bold text-xl mb-2">No active order to checkout</h3>
        <Link to="/" className="px-6 py-2 bg-indigo-500 text-white rounded-xl">Back to Terminal</Link>
      </div>
    );
  }

  // Final confirmation screen
  if (createdOrder) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/20">
              <CheckCircle className="w-10 h-10 fill-emerald-500/20" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Order Calibration Complete</h1>
              <p className="text-sm text-slate-500 mt-1">Transaction block logged as ID: <span className="font-bold text-indigo-500">{createdOrder.id}</span></p>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Thank you for configuring your hardware with Pravix. Your order has been placed into processing. We will notify you when shipment begins.
            </p>

            <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-850 flex flex-col gap-3 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Estimated Arrival:</span>
                <span className="font-bold">{createdOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Payment Protocol:</span>
                <span className="font-bold">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Total Charged:</span>
                <span className="font-bold text-indigo-500">{formatPrice(createdOrder.total)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/account/dashboard" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors">
                View Dashboard
              </Link>
              <Link to="/" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all shadow shadow-indigo-500/20">
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center flex flex-col gap-2 mb-10">
          <Shield className="w-8 h-8 text-indigo-500 mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">{t('checkout.title')}</h1>
          <p className="text-sm text-slate-500">256-Bit Encrypted Secure Payment Session</p>
        </div>

        {/* Steps Progress Indicator */}
        <div className="flex items-center justify-center max-w-lg mx-auto mb-10 gap-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20' : 'bg-slate-200 text-slate-500'
            }`}>
              1
            </span>
            <span className="text-xs font-bold hidden sm:inline">Address</span>
          </div>

          <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-800" />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20' : 'bg-slate-200 text-slate-500'
            }`}>
              2
            </span>
            <span className="text-xs font-bold hidden sm:inline">Protocol</span>
          </div>

          <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-800" />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </span>
            <span className="text-xs font-bold hidden sm:inline">Summary</span>
          </div>
        </div>

        {/* Checkout Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Forms Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Step 1: Address Form */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                
                {/* Profile Address Presets */}
                {addresses.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Address Book Presets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => (
                        <button
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 text-left bg-slate-50/50 dark:bg-slate-950/20 hover:border-indigo-500 transition-colors cursor-pointer text-xs flex items-start gap-2.5"
                        >
                          <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{addr.fullName}</p>
                            <p className="text-slate-500 mt-1">{addr.street}, {addr.city}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-500" />
                  <span>{t('checkout.shipping')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      {...register('fullName', { required: true })}
                      placeholder="e.g. John Doe"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Contact Phone</label>
                    <input
                      type="text"
                      required
                      {...register('phone', { required: true })}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  {/* Street */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Street Address</label>
                    <input
                      type="text"
                      required
                      {...register('street', { required: true })}
                      placeholder="e.g. 128 Innovation Way, Suite 400"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">City</label>
                    <input
                      type="text"
                      required
                      {...register('city', { required: true })}
                      placeholder="San Francisco"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">State / Region</label>
                    <input
                      type="text"
                      required
                      {...register('state', { required: true })}
                      placeholder="CA"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  {/* ZIP */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">ZIP / Postal Code</label>
                    <input
                      type="text"
                      required
                      {...register('zipCode', { required: true })}
                      placeholder="94107"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                  {/* Country */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Country</label>
                    <select
                      {...register('country', { required: true })}
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
                </div>

                <button
                  onClick={onNextStep}
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition-all mt-4 self-end flex items-center gap-2 cursor-pointer"
                >
                  <span>Select Payment Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            )}

            {/* Step 2: Payment Selector */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  <span>Select Payment Gateway Protocol</span>
                </h3>

                {/* Gateway radio selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('Stripe')}
                    className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      paymentMethod === 'Stripe'
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs">Credit Card (Stripe)</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      paymentMethod === 'Razorpay'
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs">UPI / Net (Razorpay)</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('PayPal')}
                    className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      paymentMethod === 'PayPal'
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-xs">PayPal Express</span>
                  </button>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Gateway Simulated Fields */}
                {paymentMethod === 'Stripe' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">Card Number</label>
                      <input
                        type="text"
                        required
                        {...register('cardNumber', { required: true })}
                        placeholder="4242 •••• •••• 4242"
                        className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">Expiration Date</label>
                      <input
                        type="text"
                        required
                        {...register('cardExpiry', { required: true })}
                        placeholder="MM / YY"
                        className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">Security CVC</label>
                      <input
                        type="text"
                        required
                        {...register('cardCvc', { required: true })}
                        placeholder="•••"
                        className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'Razorpay' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">UPI ID / VPA</label>
                    <input
                      type="text"
                      required
                      {...register('upiId', { required: true })}
                      placeholder="e.g. username@paytm"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                )}

                {paymentMethod === 'PayPal' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">PayPal Account Email</label>
                    <input
                      type="email"
                      required
                      {...register('paypalEmail', { required: true })}
                      placeholder="username@email.com"
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-6 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Address</span>
                  </button>

                  <button
                    onClick={onNextStep}
                    className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Order Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* Step 3: Summary & Process */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-500" />
                  <span>Verify Specifications & Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                  {/* Address Summary */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recipient Coordinates</h4>
                    <p className="font-bold">{formValues.fullName}</p>
                    <p className="text-slate-500">{formValues.street}</p>
                    <p className="text-slate-500">{formValues.city}, {formValues.state} {formValues.zipCode}</p>
                    <p className="text-slate-500">{formValues.country}</p>
                    <p className="text-slate-500">Phone: {formValues.phone}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gateway Protocol</h4>
                    <p className="font-bold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      <span>{paymentMethod} Secure Tunnel</span>
                    </p>
                    {paymentMethod === 'Stripe' && <p className="text-slate-500">Card Number: •••• •••• •••• {formValues.cardNumber?.slice(-4)}</p>}
                    {paymentMethod === 'Razorpay' && <p className="text-slate-500">UPI VPA: {formValues.upiId}</p>}
                    {paymentMethod === 'PayPal' && <p className="text-slate-500">PayPal Account: {formValues.paypalEmail}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isProcessing}
                    className="py-3 px-6 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Gateway Auth...</span>
                      </>
                    ) : (
                      <span>Place Order & Authorize</span>
                    )}
                  </button>
                </div>

                {isProcessing && (
                  <p className="text-xs text-center font-semibold text-indigo-500 mt-2 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl animate-pulse">
                    {processingStatus}
                  </p>
                )}

              </div>
            )}

          </div>

          {/* Right Side: Order summary basket */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-extrabold text-lg text-slate-950 dark:text-white flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-indigo-500" />
              <span>Checkout Basket</span>
            </h3>

            {/* Cart Items list */}
            <div className="flex flex-col gap-4 max-h-60 overflow-y-auto no-scrollbar">
              {cart.map((item) => {
                const product = item.product;
                const unitPrice = product.flashSaleDiscount
                  ? product.price * (1 - product.flashSaleDiscount / 100)
                  : product.price;

                return (
                  <div key={product.id} className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 truncate">
                      <h4 className="font-bold text-xs truncate">{product.name}</h4>
                      <p className="text-[10px] text-slate-400">{item.quantity}x • {formatPrice(unitPrice)}</p>
                    </div>
                    <span className="font-bold text-xs shrink-0">{formatPrice(unitPrice * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            {/* Total breakdown */}
            <div className="flex flex-col gap-2.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />
              <div className="flex justify-between text-sm text-slate-950 dark:text-white font-extrabold">
                <span>Total Budget</span>
                <span className="text-base text-indigo-500">{formatPrice(total)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
