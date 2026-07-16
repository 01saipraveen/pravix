/**
 * Razorpay Frontend Integration Utility
 * Uses Razorpay's official hosted checkout script loaded dynamically.
 *
 * For LIVE mode: Get your keys from https://dashboard.razorpay.com
 * VITE_RAZORPAY_KEY_ID = your live/test key_id
 */

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export const isRazorpayConfigured =
  RAZORPAY_KEY_ID &&
  !RAZORPAY_KEY_ID.includes('YOUR_') &&
  !RAZORPAY_KEY_ID.startsWith('rzp_test_YOUR') &&
  RAZORPAY_KEY_ID.length > 10;

/** Dynamically load the Razorpay checkout script from CDN */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOptions {
  key: string;
  amount: number; // amount in paise (1 INR = 100 paise)
  currency: string;
  name: string;
  description: string;
  order_id?: string; // From Razorpay backend order creation (optional for test mode)
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

/** Open the Razorpay checkout modal */
export async function openRazorpayCheckout(options: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error('Failed to load Razorpay checkout script. Check your internet connection.');
  }

  const rzp = new (window as any).Razorpay(options);
  rzp.on('payment.failed', (response: any) => {
    console.error('Razorpay payment failed:', response.error);
  });
  rzp.open();
}
