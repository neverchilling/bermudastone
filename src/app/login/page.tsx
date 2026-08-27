'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (data?.session) {
        router.push('/portal');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative bg-neutral-950 overflow-y-auto">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bermuda-bg.png')",
        }}
      />
      {/* Contrast Overlay */}
      <div className="fixed inset-0 z-0 bg-black/45 backdrop-blur-[1px]" />

      {/* Centered Single-Column Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center my-auto py-6">
        {/* Centered Logo */}
        <div className="mb-2 w-full max-w-xl flex justify-center items-center px-4">
          <img
            src="/logo.png"
            alt="Bermuda Stone Properties"
            className="w-80 sm:w-96 md:w-[440px] max-w-full h-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] filter brightness-150 contrast-125"
          />
        </div>

        {/* Login Card */}
        <div className="w-full rounded-3xl border border-neutral-800/90 bg-neutral-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Resident Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Philadelphia, PA • Resident Account Login
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-950/60 border border-red-800/80 p-3 text-xs text-red-300 text-center font-medium">
              {error}
            </div>
          )}

          
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-emerald-400 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Resident Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-sm font-bold text-neutral-950 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In to Portal →'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <span>Need access? Contact management</span>
            <Link
              href="/admin/login"
              className="font-semibold text-neutral-300 hover:text-emerald-400 transition"
            >
              Landlord Console →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
