'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, LockKeyhole } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    billingEmail: session?.user?.email || '',
    billingCountry: 'Morocco',
  });

  const orderId = searchParams.get('orderId');
  const productTitle = searchParams.get('title') || 'Digital Product';
  const productCategory = searchParams.get('category') || 'Digital Access';
  const productPrice = searchParams.get('price') || '0.00';

  const maskedCardHint = useMemo(() => '4242 4242 4242 4242', []);

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!session?.accessToken) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    if (!orderId) {
      setError('Missing order reference.');
      return;
    }

    try {
      setSubmitting(true);

      // This simulates the final confirmation step of a hosted payment form.
      const res = await fetch(`${API_BASE_URL}/stripe/complete-order?orderId=${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!res.ok) throw new Error('Checkout confirmation failed');

      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (submitError) {
      console.error('Checkout confirmation failed:', submitError);
      setError('Payment confirmation failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/shop" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-10 uppercase tracking-widest text-xs font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour a la boutique
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-zinc-950 border border-zinc-800 p-8 md:p-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-primary-light uppercase tracking-[0.35em] text-xs mb-3">Secure checkout</p>
                <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide">Payment Details</h1>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <LockKeyhole className="w-4 h-4 text-primary-light" />
                <span>Simulation only</span>
              </div>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 p-4 mb-8 text-sm text-zinc-400">
              Enter card and billing details to simulate a bank checkout flow. No real card is charged and no bank is contacted.
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Cardholder name</label>
                <input
                  type="text"
                  required
                  value={formData.cardholderName}
                  onChange={(event) => handleChange('cardholderName', event.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                  placeholder="Name as shown on card"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Card number</label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  value={formData.cardNumber}
                  onChange={(event) => handleChange('cardNumber', event.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                  placeholder={maskedCardHint}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Expiry date</label>
                  <input
                    type="text"
                    required
                    value={formData.expiryDate}
                    onChange={(event) => handleChange('expiryDate', event.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                    placeholder="MM / YY"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Security code</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={formData.cvc}
                    onChange={(event) => handleChange('cvc', event.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                    placeholder="CVC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Billing email</label>
                <input
                  type="email"
                  required
                  value={formData.billingEmail}
                  onChange={(event) => handleChange('billingEmail', event.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Billing country</label>
                <input
                  type="text"
                  required
                  value={formData.billingCountry}
                  onChange={(event) => handleChange('billingCountry', event.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-white text-black py-5 uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex justify-center items-center gap-3"
              >
                <CreditCard className="w-5 h-5" />
                {submitting ? 'Processing payment...' : 'Pay now'}
              </button>
            </form>
          </div>

          <aside className="bg-zinc-950 border border-zinc-800 p-8 h-fit">
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-4">Order Summary</p>
            <div className="border-b border-zinc-800 pb-6 mb-6">
              <p className="text-zinc-500 text-sm mb-2">{productCategory}</p>
              <h2 className="text-white text-2xl font-semibold mb-4">{productTitle}</h2>
              <p className="text-4xl text-white font-bold">{productPrice} EUR</p>
            </div>

            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-start justify-between gap-4">
                <span>Order reference</span>
                <span className="text-zinc-200">#{orderId || 'Pending'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span>Delivery</span>
                <span className="text-zinc-200">Instant digital access</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span>Payment network</span>
                <span className="text-zinc-200">Visa, Mastercard, Amex</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span>Bank integration</span>
                <span className="text-zinc-200">Not connected</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CheckoutFallback() {
  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-lg w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-light mx-auto mb-8"></div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Loading checkout...</h1>
        <p className="text-zinc-400">Preparing payment details.</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
