from PIL import Image
import os

logo_path = "public/logo.png"

# Auto-crop transparent boundaries to ensure true center alignment
if os.path.exists(logo_path):
    img = Image.open(logo_path)
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        cropped.save(logo_path)
        print("✅ Cleanly trimmed transparent margins for true centering!")

# Update src/app/login/page.tsx with tighter vertical spacing & clean text contrast
login_jsx = """'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(nu);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative bg-neutral-950 overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/bermuda-bg.png')",
        }}
      />
      {/* Contrast Overlay */}
      <div className="fixed inset-0 z-0 bg-black/45 backdrop-blur-[1px]" />

      {/* Centered Single-Column Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Perfectly Centered Logo */}
        <div className="mb-4 w-full flex justify-center items-center">
          <img
            src="/logo.png"
            alt="Bermuda Stone Properties"
            className="h-36 sm:h-40 w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] filter brightness-150 contrast-125"
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
              className="w-full mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-sm font-bold text-neutral-950 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/50"
            >
              {loading ? 'Signing in...' : 'Sign In to Portal →'}
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
"""

with open("src/app/login/page.tsx", "w", encoding="utf-8") as f:
    f.write(login_jsx)

print("✅ Updated login page alignment and styling!")
