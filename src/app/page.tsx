'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface Charge {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
}

interface Lease {
  id: string;
  tenant_name: string;
  tenant_email: string;
  monthly_rent: number;
  property_name: string;
  unit_number: string;
  charges: Charge[];
}

interface Ticket {
  id: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  created_at: string;
}

export default function TenantPortal() {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [lease, setLease] = useState<Lease | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Maintenance Request Modal State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('Plumbing');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');

  const fetchTenantData = async (email: string) => {
    const { data: leaseData } = await supabase
      .from('leases')
      .select('id, tenant_name, tenant_email, monthly_rent, property_name, unit_number, charges ( id, description, amount, due_date, status )')
      .eq('tenant_email', email)
      .maybeSingle();

    if (leaseData) {
      setLease(leaseData as any);

      // Fetch active tickets for this lease
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('lease_id', leaseData.id)
        .order('created_at', { ascending: false });

      if (ticketData) {
        setTickets(ticketData);
      }
    }
  };

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email || null);
      if (session.user.email) {
        await fetchTenantData(session.user.email);
      }
      setLoading(false);
    }

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handlePayBalance = async (chargeId: string, amount: number) => {
    setPaying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          chargeId,
          tenantEmail: lease?.tenant_email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment initialization failed: ' + (data.error || 'Unknown error'));
        setPaying(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout.');
      setPaying(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lease) return;
    setSubmittingTicket(true);
    setTicketMessage('');

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseId: lease.id,
          tenantName: lease.tenant_name,
          tenantEmail: lease.tenant_email,
          propertyName: lease.property_name,
          unitNumber: lease.unit_number,
          category: ticketCategory,
          priority: ticketPriority,
          description: ticketDescription,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTicketMessage('Ticket submitted successfully.');
        setTicketDescription('');
        setShowTicketModal(false);
        if (userEmail) fetchTenantData(userEmail);
      } else {
        setTicketMessage('Error: ' + data.error);
      }
    } catch (err: any) {
      console.error(err);
      setTicketMessage('Failed to submit maintenance ticket.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-neutral-800 border-t-emerald-500"></div>
          <p className="mt-4 text-xs font-medium text-neutral-400">Loading resident portal...</p>
        </div>
      </div>
    );
  }

  const unpaidCharges = lease?.charges?.filter((c) => c.status === 'unpaid') || [];
  const totalBalance = unpaidCharges.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const primaryUnpaidCharge = unpaidCharges[0];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-emerald-500 selection:text-black">

      {/* Bermuda Stone Properties Brand Header */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center gap-4 border-b border-neutral-800/80 pb-6">
        <img
            src="/logo.png"
            alt="Bermuda Stone Properties"
            className="h-14 w-14 object-contain"
          />
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Bermuda Stone Properties
          </h1>
          <p className="text-xs text-neutral-400 font-medium tracking-wide">
            Resident Portal • Account Management
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Top Header */}
        <header className="mb-8 flex items-center justify-between border-b border-neutral-800 pb-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Resident Portal</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {lease?.tenant_name || 'Resident'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTicketModal(true)}
              className="rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
            >
              🛠️ Request Repair
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:border-neutral-700 hover:text-white transition"
            >
          Sign Out
            </button>
          </div>
        </header>

        {ticketMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
            {ticketMessage}
          </div>
        )}

        {/* Property Info Card */}
        <div className="mb-6 rounded-3xl border border-neutral-800 bg-neutral-950 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Lease Details</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {(lease?.property_name || 'Property') + ' • ' + (lease?.unit_number || 'Unit')}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Base Monthly Rent: <strong className="text-white">${Number(lease?.monthly_rent || 0).toFixed(2)}/mo</strong></p>
            </div>
            <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 text-left md:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 block">Total Balance Due</span>
              <p className={`text-3xl font-extrabold mt-1 ${totalBalance > 0 ? 'text-white' : 'text-emerald-400'}`}>
                ${totalBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {totalBalance > 0 && primaryUnpaidCharge && (
            <div className="mt-6 border-t border-neutral-800 pt-6">
              <button
                onClick={() => handlePayBalance(primaryUnpaidCharge.id, totalBalance)}
                disabled={paying}
                className="w-full rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold uppercase tracking-wider text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50"
              >
                {paying ? 'Connecting to Secure Checkout...' : `Pay Balance ($${totalBalance.toFixed(2)}) with Card`}
              </button>
            </div>
          )}
        </div>

        {/* Ledger Breakdown */}
          <div className="mb-8 rounded-3xl border border-neutral-800 bg-neutral-950 p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Account Ledger</h3>
              {lease?.charges && lease.charges.length > 6 && (
                <span className="text-[11px] font-medium text-neutral-400">
                  Showing {showAllTransactions ? lease.charges.length : 6} of {lease.charges.length} items
                </span>
              )}
            </div>

            {(!lease?.charges || lease.charges.length === 0) ? (
              <p className="text-xs text-neutral-500">No charges posted to ledger.</p>
            ) : (
              <div className="space-y-2">
                {(showAllTransactions ? lease.charges : lease.charges.slice(0, 6)).map((charge: any) => (
                  <div key={charge.id} className="flex items-center justify-between bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/80 text-xs">
                    <div>
                      <span className="font-medium text-neutral-200">{charge.description}</span>
                      <span className="text-neutral-500 ml-2">({charge.due_date})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">${Number(charge.amount).toFixed(2)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        charge.status === 'paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      }`}>
                        {charge.status}
                      </span>
                    </div>
                  </div>
                ))}

                {lease.charges && lease.charges.length > 6 && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAllTransactions(!showAllTransactions)}
                      className="w-full py-2.5 px-4 rounded-xl border border-neutral-800 bg-neutral-900/90 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>
                        {showAllTransactions
                          ? "Show Less ↑"
                          : `Show All Transactions (${lease.charges.length} total) ↓`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Maintenance Requests Section */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Maintenance & Repair Requests</h3>
            <button
              onClick={() => setShowTicketModal(true)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              + New Request
            </button>
          </div>

          {tickets.length === 0 ? (
            <p className="text-xs text-neutral-500">No open repair requests.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-white border border-neutral-700">
                        {t.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${
                        t.priority === 'urgent' ? 'text-red-400' : t.priority === 'high' ? 'text-amber-400' : 'text-neutral-400'
                      }`}>
                        {t.priority} Priority
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      t.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : t.status === 'in_progress'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1">{t.description}</p>
                  <span className="text-[10px] text-neutral-500 mt-2 block">
                    Submitted on {new Date(t.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Request Modal */}
        {showTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80  p-4">
            <div className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-white">Submit Maintenance Request</h3>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-neutral-500 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Issue Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Plumbing">Plumbing / Leak</option>
                      <option value="HVAC / Heating">HVAC / Heating / AC</option>
                      <option value="Electrical">Electrical / Lighting</option>
                      <option value="Appliance">Appliance</option>
                      <option value="Structural / Door">Door / Lock / Structural</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Urgency</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="low">Low (Routine maintenance)</option>
                      <option value="medium">Medium (Needs attention)</option>
                      <option value="high">High (Urgent repair)</option>
                      <option value="urgent">Critical / Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Description of the Issue</label>
                  <textarea
                    rows={4}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Describe what is occurring, room location, and any relevant details..."
                    required
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="flex-1 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black uppercase tracking-wider hover:bg-emerald-400 transition disabled:opacity-50"
                  >
                    {submittingTicket ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs font-semibold text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
