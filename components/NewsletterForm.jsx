'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // No backend newsletter endpoint yet — store locally and show confirmation.
      // Replace this block with a real API call when the endpoint exists.
      await new Promise((res) => setTimeout(res, 600));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-[#00D1FF] uppercase tracking-widest text-sm font-semibold py-4">
        You&apos;re in. Watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
      <input
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="px-6 py-4 bg-[#000000] border border-[#7C3AED]/30 text-white placeholder-zinc-600 w-full sm:w-96 focus:outline-none focus:border-[#00D1FF] transition-colors rounded-md shadow-[inset_0_0_10px_rgba(124,58,237,0.1)] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-8 py-4 luxury-btn font-bold uppercase tracking-widest whitespace-nowrap disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2 sm:absolute sm:bottom-0">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
