"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const AUTHORIZED_LANDLORD_EMAIL = "mykeluci@gmail.com";

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
  lease_id: string;
  tenant_name: string;
  tenant_email: string;
  property_name: string;
  unit_number: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const router = useRouter();

  const [selectedLeaseId, setSelectedLeaseId] = useState("");
  const [chargeDescription, setChargeDescription] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeDueDate, setChargeDueDate] = useState("");
  const [submittingCharge, setSubmittingCharge] = useState(false);

  const [newPropertyName, setNewPropertyName] = useState("Duplex on Thompson");
  const [newUnitNumber, setNewUnitNumber] = useState("");
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantEmail, setNewTenantEmail] = useState("");
  const [newMonthlyRent, setNewMonthlyRent] = useState("");
  const [submittingLease, setSubmittingLease] = useState(false);

  const [deletingChargeId, setDeletingChargeId] = useState<string | null>(null);
  const [deletingLeaseId, setDeletingLeaseId] = useState<string | null>(null);
  const [remindingLeaseId, setRemindingLeaseId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [runningCron, setRunningCron] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAdminData = async () => {
    const { data: leaseData } = await supabase
      .from("leases")
      .select("id, tenant_name, tenant_email, monthly_rent, property_name, unit_number, charges ( id, description, amount, due_date, status )")
      .order("unit_number", { ascending: true });

    if (leaseData) {
      setLeases(leaseData as any);
      if (leaseData.length > 0) {
        setSelectedLeaseId((prev) => (leaseData.some((d) => d.id === prev) ? prev : leaseData[0].id));
      } else {
        setSelectedLeaseId("");
      }
    }

    const { data: ticketData } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (ticketData) {
      setTickets(ticketData);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || session.user?.email?.toLowerCase() !== AUTHORIZED_LANDLORD_EMAIL.toLowerCase()) {
        if (session) {
          await supabase.auth.signOut();
        }
        router.push("/admin/login");
        return;
      }

      setAdminUser(session.user);
      await fetchAdminData();
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    setUpdatingTicketId(ticketId);
    try {
      const res = await fetch("/api/admin/tickets/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`Ticket status updated to ${status}.`);
        fetchAdminData();
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to update ticket.");
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm("Delete this maintenance ticket?")) return;
    setUpdatingTicketId(ticketId);

    try {
      const res = await fetch("/api/admin/tickets/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Ticket deleted.");
        fetchAdminData();
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete ticket.");
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleSendReminder = async (leaseId: string) => {
    setRemindingLeaseId(leaseId);
    setMessage("");

    try {
      const res = await fetch("/api/admin/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaseId }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✉️ " + data.message);
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to send reminder.");
    } finally {
      setRemindingLeaseId(null);
    }
  };

  const handleAddCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaseId) {
      setMessage("Please select a tenant/unit first.");
      return;
    }
    setSubmittingCharge(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaseId: selectedLeaseId,
          description: chargeDescription,
          amount: chargeAmount,
          dueDate: chargeDueDate,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("Charge posted successfully.");
        setChargeDescription("");
        setChargeAmount("");
        setChargeDueDate("");
        fetchAdminData();
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to post charge.");
    } finally {
      setSubmittingCharge(false);
    }
  };

  const handleDeleteCharge = async (chargeId: string, description: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete charge: " + description + "?");
    if (!confirmDelete) return;

    setDeletingChargeId(chargeId);
    setMessage("");

    try {
      const res = await fetch("/api/admin/charge/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chargeId }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("Deleted charge: " + description);
        fetchAdminData();
      } else {
        setMessage("Error deleting charge: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to delete charge.");
    } finally {
      setDeletingChargeId(null);
    }
  };

  const handleDeleteLease = async (leaseId: string, tenantName: string, unitNumber: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete " + tenantName + " (" + unitNumber + ")? All related charges will also be deleted."
    );
    if (!confirmDelete) return;

    setDeletingLeaseId(leaseId);
    setMessage("");

    try {
      const res = await fetch("/api/admin/lease/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaseId }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("Removed tenant & unit: " + tenantName);
        fetchAdminData();
      } else {
        setMessage("Error deleting tenant: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to delete tenant.");
    } finally {
      setDeletingLeaseId(null);
    }
  };

  const handleCreateLease = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLease(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/lease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName: newPropertyName,
          unitNumber: newUnitNumber,
          tenantName: newTenantName,
          tenantEmail: newTenantEmail,
          monthlyRent: newMonthlyRent,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("New unit created successfully.");
        setNewUnitNumber("");
        setNewTenantName("");
        setNewTenantEmail("");
        setNewMonthlyRent("");
        fetchAdminData();
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to create unit lease.");
    } finally {
      setSubmittingLease(false);
    }
  };

  const handleRunLateFeeCron = async () => {
    setRunningCron(true);
    setMessage("");

    try {
      const res = await fetch("/api/cron/late-fees");
      const data = await res.json();
      if (data.success) {
        setMessage("Late Fee Check Complete: " + data.newLateFeesApplied + " late fee(s) applied.");
        fetchAdminData();
      } else {
        setMessage(data.message || data.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to run late fee check.");
    } finally {
      setRunningCron(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-neutral-800 border-t-emerald-500"></div>
          <p className="mt-4 text-xs font-medium text-neutral-400">Verifying management access for mykeluci@gmail.com...</p>
        </div>
      </div>
    );
  }

  let totalRevenueCollected = 0;
  let totalUnpaidOutstanding = 0;
  let totalMonthlyPotential = 0;

  leases.forEach((lease) => {
    totalMonthlyPotential += Number(lease.monthly_rent || 0);
    lease.charges?.forEach((charge) => {
      if (charge.status === "paid") {
        totalRevenueCollected += Number(charge.amount);
      } else if (charge.status === "unpaid") {
        totalUnpaidOutstanding += Number(charge.amount);
      }
    });
  });

  const openTicketsCount = tickets.filter((t) => t.status !== "resolved").length;

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-emerald-500 selection:text-black">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Portfolio Operations</span>
              <span className="text-[11px] text-neutral-400 font-medium">({AUTHORIZED_LANDLORD_EMAIL})</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Multi-Unit Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunLateFeeCron}
              disabled={runningCron}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-200 hover:border-neutral-700 hover:text-white transition disabled:opacity-50"
            >
              {runningCron ? "Checking..." : "⚡ Run Late Fee Check"}
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-400 hover:border-neutral-700 hover:text-white transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        {message && (
          <div className="mb-6 text-xs font-semibold text-neutral-200 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            {message}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-2xl bg-neutral-950 p-5 border border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Active Units</span>
            <p className="mt-2 text-3xl font-extrabold text-white">{leases.length}</p>
          </div>
          <div className="rounded-2xl bg-neutral-950 p-5 border border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Scheduled Rent</span>
            <p className="mt-2 text-3xl font-extrabold text-white">${totalMonthlyPotential.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-neutral-950 p-5 border border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Total Collected</span>
            <p className="mt-2 text-3xl font-extrabold text-emerald-400">${totalRevenueCollected.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-neutral-950 p-5 border border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Outstanding</span>
            <p className="mt-2 text-3xl font-extrabold text-neutral-200">${totalUnpaidOutstanding.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-neutral-950 p-5 border border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">Open Repairs</span>
            <p className="mt-2 text-3xl font-extrabold text-amber-400">{openTicketsCount}</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-neutral-950 p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Maintenance & Repair Work Orders</h3>
              <p className="text-xs text-neutral-500">Active tickets submitted by residents across all properties</p>
            </div>
            <span className="text-xs font-bold text-neutral-400">{tickets.length} total</span>
          </div>

          {tickets.length === 0 ? (
            <p className="text-xs text-neutral-500 py-3">No maintenance tickets logged yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-neutral-700">
                        {(ticket.property_name || "Property") + " • " + (ticket.unit_number || "Unit")}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${
                        ticket.priority === "urgent" ? "text-red-400" : ticket.priority === "high" ? "text-amber-400" : "text-neutral-400"
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ticket.category} - <span className="text-neutral-400 font-normal">{ticket.tenant_name}</span></h4>
                    <p className="text-xs text-neutral-300 mt-2 bg-neutral-950 p-3 rounded-lg border border-neutral-800/60">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value)}
                        disabled={updatingTicketId === ticket.id}
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        disabled={updatingTicketId === ticket.id}
                        className="text-neutral-500 hover:text-red-400 text-xs px-1.5 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-neutral-950 p-6 border border-neutral-800">
            <h3 className="mb-4 text-base font-bold text-white">Add Property Unit</h3>
            <form onSubmit={handleCreateLease} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Property</label>
                  <input
                    type="text"
                    value={newPropertyName}
                    onChange={(e) => setNewPropertyName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Unit Number</label>
                  <input
                    type="text"
                    value={newUnitNumber}
                    onChange={(e) => setNewUnitNumber(e.target.value)}
                    placeholder="e.g. Unit A"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Tenant Name</label>
                  <input
                    type="text"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Tenant Email</label>
                  <input
                    type="email"
                    value={newTenantEmail}
                    onChange={(e) => setNewTenantEmail(e.target.value)}
                    placeholder="email@address.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMonthlyRent}
                    onChange={(e) => setNewMonthlyRent(e.target.value)}
                    placeholder="1400.00"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
              </div>
              <button
                type="submit"
                disabled={submittingLease}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-700 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {submittingLease ? "Adding Unit..." : "+ Register Unit & Tenant"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-neutral-950 p-6 border border-neutral-800">
            <h3 className="mb-4 text-base font-bold text-white">Post Charge to Ledger</h3>
            <form onSubmit={handleAddCharge} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Target Unit</label>
                <select
                  value={selectedLeaseId}
                  onChange={(e) => setSelectedLeaseId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                >
                  {leases.map((lease) => (
                    <option key={lease.id} value={lease.id}>
                      {(lease.property_name || "Property") + " - " + (lease.unit_number || "Unit") + " : " + lease.tenant_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Utility / Rent / Maintenance"
                  value={chargeDescription}
                  onChange={(e) => setChargeDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={chargeDueDate}
                    onChange={(e) => setChargeDueDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submittingCharge || leases.length === 0}
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition disabled:opacity-50 uppercase tracking-wider"
              >
                {submittingCharge ? "Posting..." : "Post Charge to Unit"}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-950 p-6 border border-neutral-800">
          <h3 className="mb-4 text-base font-bold text-white">Active Units & Ledgers</h3>
          {leases.length === 0 ? (
            <p className="text-xs text-neutral-500">No units registered yet.</p>
          ) : (
            <div className="space-y-4">
              {leases.map((lease) => {
                const leaseUnpaid = (lease.charges || [])
                  .filter((c) => c.status === "unpaid")
                  .reduce((acc, curr) => acc + Number(curr.amount), 0);

                return (
                  <div key={lease.id} className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800/60 pb-3 mb-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-neutral-700">
                            {(lease.property_name || "Property") + " • " + (lease.unit_number || "Unit")}
                          </span>
                          <h4 className="text-sm font-bold text-white">{lease.tenant_name}</h4>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {lease.tenant_email + " | Base: "}<strong className="text-white">${Number(lease.monthly_rent).toFixed(2)}/mo</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-left md:text-right mr-1">
                          <span className="text-[10px] font-medium text-neutral-500 block uppercase">Balance</span>
                          <span className={`text-base font-extrabold ${leaseUnpaid > 0 ? "text-white" : "text-emerald-400"}`}>
                            ${leaseUnpaid.toFixed(2)}
                          </span>
                        </div>
                        {leaseUnpaid > 0 && (
                          <button
                            onClick={() => handleSendReminder(lease.id)}
                            disabled={remindingLeaseId === lease.id}
                            className="rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 px-3 py-1.5 text-xs shadow-md shadow-emerald-500/20 transition disabled:opacity-50"
                          >
                            {remindingLeaseId === lease.id ? "Sending..." : "✉️ Remind"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteLease(lease.id, lease.tenant_name, lease.unit_number || "Unit")}
                          disabled={deletingLeaseId === lease.id}
                          className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                        >
                          {deletingLeaseId === lease.id ? "..." : "Delete Unit"}
                        </button>
                      </div>
                    </div>

                    {(!lease.charges || lease.charges.length === 0) ? (
                      <p className="text-[11px] text-neutral-500">No charges recorded.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {lease.charges.map((charge) => (
                          <div
                            key={charge.id}
                            className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/60 text-xs"
                          >
                            <div>
                              <span className="font-medium text-neutral-300">{charge.description}</span>
                              <span className="text-neutral-500 ml-2 text-[11px]">({charge.due_date})</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-white">${Number(charge.amount).toFixed(2)}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                                  charge.status === "paid"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                                    : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                                }`}
                              >
                                {charge.status}
                              </span>
                              <button
                                onClick={() => handleDeleteCharge(charge.id, charge.description)}
                                disabled={deletingChargeId === charge.id}
                                className="text-neutral-500 hover:text-neutral-300 text-[11px] px-1 transition"
                              >
                                {deletingChargeId === charge.id ? "..." : "✕"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}