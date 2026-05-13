'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/services/api';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError('Incorrect email or password');
        setLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const loginRes = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          if (!loginRes?.error) {
            router.push(callbackUrl);
          }
        } else {
          setError('Registration failed. This email may already be in use.');
        }
      } catch {
        setError('Server error.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900/50 p-8 border border-zinc-800 backdrop-blur">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-white uppercase tracking-widest mb-2">
            {isLogin ? 'Login' : 'Sign Up'}
          </h1>
          <p className="text-zinc-500 text-sm">
            {isLogin ? 'Access your member area' : 'Join the Veloir community'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-primary-light"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-primary-light"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-primary-light"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-primary-light"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 mt-4 uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800 pt-6">
          <p className="text-zinc-500 text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:text-primary-light ml-2 font-semibold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900/50 p-8 border border-zinc-800 backdrop-blur text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-light mx-auto mb-6"></div>
        <p className="text-zinc-400">Loading login...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
