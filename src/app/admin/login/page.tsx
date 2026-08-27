'use client';

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        if (data.session.user.email?.toLowerCase() !== "mykeluci@gmail.com".toLowerCase()) {
          await supabase.auth.signOut();
          setErrorMessage("Access denied. Landlord credentials required.");
        } else {
          router.push("/admin");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-black text-white px-4 selection:bg-emerald-500 selection:text-black overflow-hidden">
      {/* High-Res Bermuda City Waterfront Background */}
      <img
        src="/bermudacity.png"
        alt="Bermuda Waterfront"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-30 pointer-events-none z-0 filter brightness-80 contrast-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/60 via-transparent to-transparent pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950/85 p-8 sm:p-10 shadow-2xl ">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-700 px-3.5 py-1 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Operations &amp; Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Landlord Console
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Bermuda Stone Properties • Portfolio Dashboard
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/50 p-3.5 text-xs text-red-200">
            {errorMessage}
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
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Authorized Landlord Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mykeluci@gmail.com"
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Master Password
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
            className="w-full rounded-xl  py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:bg-neutral-200 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Verifying Credentials..." : "Access Console →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
          <Link href="/login" className="text-xs text-neutral-400 hover:text-emerald-400 transition font-medium">
            ← Return to Resident Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
