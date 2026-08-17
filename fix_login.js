const fs = require('fs');

const content = `'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TenantLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-black text-white px-4 selection:bg-emerald-500 selection:text-black">
      {/* Background Philadelphia Skyline with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 filter grayscale contrast-125 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1569974498991-d3c12a504f95?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      
      {/* Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-800/80 bg-neutral-950/75 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Bermuda Stone Properties
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Resident Portal
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Philadelphia, PA • Secure Resident Access
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/50 p-3.5 text-xs text-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Resident Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenant@example.com"
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Need access? Contact management</span>
          <Link href="/admin/login" className="text-neutral-400 hover:text-emerald-400 transition font-medium">
            Landlord Console →
          </Link>
        </div>
      </div>
    </main>
  );
}
`;

fs.writeFileSync('src/app/login/page.tsx', content, 'utf8');
console.log('✅ Resident login page styled with Philadelphia backdrop!');
