'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResidentPortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setTenant(data.user || data);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handlePayRent = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: tenant?.monthly_rent || 1200,
          description: `Rent Payment - ${tenant?.unit || 'Bermuda Stone Properties'}`
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Payment service unavailable. Please contact management.');
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTicket(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          details: ticketDetails,
          unit: tenant?.unit || 'Unit A'
        })
      });
      if (res.ok) {
        setTicketSuccess(true);
        setTicketSubject('');
        setTicketDetails('');
      }
    } catch (err) {
      alert('Error submitting maintenance request.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Bermuda Stone Resident Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Portal Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
            <span className="font-bold text-sm tracking-wider text-white">BERMUDA STONE</span>
          </Link>
          <span className="text-xs bg-neutral-800 text-emerald-400 px-2.5 py-1 rounded-full border border-neutral-700">
            Resident Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-400 hidden sm:inline">
            Logged in as <strong className="text-neutral-200">{tenant?.name || 'Resident'}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {tenant?.name || 'Resident'}</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Unit: <span className="text-emerald-400 font-semibold">{tenant?.unit || 'Duplex on Thompson - Unit A'}</span>
            </p>
          </div>
          <button
            onClick={handlePayRent}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-sm"
          >
            💳 Pay Rent Online (${tenant?.monthly_rent || 1200})
          </button>
        </div>

        {/* 2-Column Grid: Lease & Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Account & Lease Info */}
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📄</span> Lease & Billing Details
            </h2>
            <div className="divide-y divide-neutral-800 text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400">Monthly Rent</span>
                <span className="text-white font-semibold">${tenant?.monthly_rent || 1200}.00</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400">Payment Due Date</span>
                <span className="text-white font-semibold">1st of every month</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400">Payment Status</span>
                <span className="text-emerald-400 font-semibold">Current</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400">Keyless Access</span>
                <span className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded text-xs">Active</span>
              </div>
            </div>
          </div>

          {/* Maintenance Ticket Form */}
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🛠️</span> Submit Maintenance Request
            </h2>
            
            {ticketSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs">
                ✅ Ticket submitted! Management has been notified directly.
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Issue Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Leaky faucet, AC filter"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Details & Location in Unit</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingTicket}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold text-xs rounded-lg border border-neutral-700 transition-all disabled:opacity-50"
              >
                {submittingTicket ? 'Submitting...' : 'Dispatch Maintenance Request'}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
