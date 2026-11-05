import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Search,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Code,
  Sparkles,
  Eye,
  SlidersHorizontal,
  X,
  UserCheck,
} from 'lucide-react';
import type {
  AdminUser,
  StudentRegistration,
  DashboardStats,
  SyncLog,
} from '../../types/index.ts';
import { StudentDetailModal } from './StudentDetailModal.tsx';
import { GoogleAppsScriptModal } from './GoogleAppsScriptModal.tsx';
import { WebhookTestModal } from './WebhookTestModal.tsx';

interface AdminDashboardProps {
  user: AdminUser;
  token: string;
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  token,
  onLogout,
  onClose,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [registrationFilter, setRegistrationFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [showSyncDrawer, setShowSyncDrawer] = useState(false);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState(false);
  const [showWebhookTester, setShowWebhookTester] = useState(false);

  // Fetch Dashboard Statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/statistics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, [token]);

  // Fetch Registrations Table with Search and Filters
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8',
      });
      if (search.trim()) params.append('search', search.trim());
      if (paymentFilter !== 'all') params.append('payment_status', paymentFilter);
      if (registrationFilter !== 'all') params.append('registration_status', registrationFilter);

      const res = await fetch(`/api/admin/registrations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.items);
        setTotalCount(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, paymentFilter, registrationFilter]);

  // Fetch Sync Logs
  const fetchSyncLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sync-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSyncLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch sync logs:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
    fetchRegistrations();
  }, [fetchStats, fetchRegistrations]);

  const handleRefresh = () => {
    fetchStats();
    fetchRegistrations();
    if (showSyncDrawer) fetchSyncLogs();
  };

  const handleExportCsv = () => {
    window.location.href = `/api/admin/export/csv?auth=${token}`;
  };

  const handleExportExcel = () => {
    window.location.href = `/api/admin/export/excel?auth=${token}`;
  };

  const handleRetrySync = async (logId: string) => {
    try {
      const res = await fetch(`/api/admin/sync-logs/${logId}/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchSyncLogs();
        fetchStats();
        fetchRegistrations();
      }
    } catch (err) {
      console.error('Error retrying sync:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto text-slate-900 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-700/20">
            EDL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                EXPOSYS DATA LABS
              </span>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                Admin Console
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              AI Assistant Assessment Program 2026 Management
            </div>
          </div>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setShowSyncDrawer(true);
              fetchSyncLogs();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Google Webhook Sync Logs"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                stats?.failedSynchronizations && stats.failedSynchronizations > 0
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
            />
            <span className="hidden md:inline">Sync Logs</span>
            {stats && stats.failedSynchronizations > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded font-mono font-bold">
                {stats.failedSynchronizations} failed
              </span>
            )}
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Refresh Table & Statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Exit Console</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ========================================================= */}
        {/* SECTION 1: OVERVIEW METRIC CARDS (6 Mandated Statistics)  */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
              Live Assessment Metrics & Reconciliation
            </h2>
            <div className="text-xs text-slate-500 font-mono font-medium">
              Auto-sync: Enabled · Webhook active
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Total Registrations */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500 font-bold">Total Registrations</span>
                <Users className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
                {stats?.totalRegistrations ?? '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">Google Form entries</div>
            </div>

            {/* 2. Verified Payments */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-emerald-700 font-bold">Verified Payments</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
                {stats?.verifiedPayments ?? '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                ₹{((stats?.verifiedPayments || 0) * 999).toLocaleString()} collected
              </div>
            </div>

            {/* 3. Pending Payments */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-amber-700 font-bold">Pending Payments</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
                {stats?.pendingPayments ?? '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">Awaiting receipt verify</div>
            </div>

            {/* 4. Confirmed Registrations */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-blue-700 font-bold">Confirmed Reg.</span>
                <UserCheck className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
                {stats?.confirmedRegistrations ?? '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">Enrolled for assessment</div>
            </div>

            {/* 5. Pending Registrations */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-600 font-bold">Pending Reg.</span>
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
                {stats?.pendingRegistrations ?? '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">In review pipeline</div>
            </div>

            {/* 6. Failed Synchronizations */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-red-700 font-bold">Failed Syncs</span>
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
                {stats?.failedSynchronizations ?? '0'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">Webhook retry logs</div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: CHARTS & STATISTICAL BREAKDOWNS                */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Registration Trend Chart */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-slate-900">Daily Registration Trend</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Recent Activity</span>
              </div>

              {/* Bar visualization */}
              <div className="h-44 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {stats?.dailyTrend && stats.dailyTrend.length > 0 ? (
                  stats.dailyTrend.map((d) => {
                    const maxVal = Math.max(...stats.dailyTrend.map((item) => item.count), 5);
                    const heightPercent = Math.min(100, Math.max(15, (d.count / maxVal) * 100));

                    return (
                      <div
                        key={d.date}
                        className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                      >
                        <span className="text-[10px] font-mono text-blue-800 tabular-nums font-bold opacity-80 group-hover:opacity-100">
                          {d.count}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[36px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t group-hover:from-blue-800 group-hover:to-blue-600 transition-all shadow-xs"
                        />
                        <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-800">
                          {d.date.slice(5)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    No timeline records yet
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600 font-mono font-medium">
              <span>Standard fee: ₹999 / candidate</span>
              <span className="text-blue-700 font-bold">Total Program Candidates: {stats?.totalRegistrations || 0}</span>
            </div>
          </div>

          {/* Engineering Branch Distribution */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Engineering Branch Breakdown</h3>
                <span className="text-xs font-mono text-slate-500">All Disciplines</span>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {stats?.branchDistribution && Object.keys(stats.branchDistribution).length > 0 ? (
                  Object.entries(stats.branchDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([branch, count]) => {
                      const total = stats.totalRegistrations || 1;
                      const pct = Math.round((count / total) * 100);

                      return (
                        <div key={branch} className="text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-700 font-medium truncate max-w-[70%]">{branch}</span>
                            <span className="font-mono text-slate-600 font-semibold tabular-nums">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-blue-700 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-xs text-slate-400 py-6 text-center">
                    No branch data available
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Open to CS, AI & DS, IT, ECE, EEE, Mechanical, Civil & allied engineering.
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: MANAGEMENT TABLE TOOLBAR & ACTIONS             */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search candidates by name, email, mobile, college..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
              />
            </div>

            {/* Filter Tabs & Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-700 font-medium"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid (Verified)</option>
                <option value="pending">Pending Payment</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              {/* Registration Status Filter */}
              <select
                value={registrationFilter}
                onChange={(e) => {
                  setRegistrationFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-700 font-medium"
              >
                <option value="all">All Reg. Status</option>
                <option value="confirmed">Confirmed / Verified</option>
                <option value="pending">Pending / Unverified</option>
                <option value="completed">Completed</option>
              </select>

              {/* Google Apps Script code modal trigger */}
              <button
                onClick={() => setShowAppsScriptModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="View Google Apps Script setup instructions"
              >
                <Code className="w-3.5 h-3.5 text-blue-700" />
                <span>Apps Script</span>
              </button>

              {/* Webhook test simulator */}
              <button
                onClick={() => setShowWebhookTester(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
                title="Simulate incoming Google Form submission"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Test Webhook</span>
              </button>

              {/* Export CSV */}
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Download CSV report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              {/* Export Excel */}
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                title="Download Excel spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 4: STUDENT REGISTRATIONS TABLE                    */}
          {/* ========================================================= */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-3 w-12 text-center">S.No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-3">Branch & Year</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-center">Payment Status</th>
                  <th className="py-3 px-3 text-center">Reg. Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      Loading registrations...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      No student registrations matching your filters.
                    </td>
                  </tr>
                ) : (
                  registrations.map((student, idx) => {
                    const serialNumber = (page - 1) * 8 + idx + 1;
                    const isPaid = student.payment_status === 'paid';
                    const isConfirmed = student.registration_status === 'confirmed';

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="py-3 px-3 text-center font-mono text-slate-400 tabular-nums font-semibold">
                          {serialNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-blue-800">
                          {student.full_name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px] truncate max-w-[180px]">
                          {student.email}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono tabular-nums whitespace-nowrap">
                          {student.mobile_number}
                        </td>
                        <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]" title={student.college_name}>
                          {student.college_name}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          <span className="block truncate max-w-[140px] font-medium">{student.engineering_branch}</span>
                          <span className="text-[10px] text-slate-500">{student.academic_year}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px] tabular-nums whitespace-nowrap">
                          {student.registration_timestamp
                            ? student.registration_timestamp.slice(0, 10)
                            : student.created_at.slice(0, 10)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : student.payment_status === 'failed'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {student.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                              isConfirmed
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {student.registration_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View & Edit Record"
                          >
                            <Eye className="w-4 h-4 text-blue-700" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 font-medium">
            <div>
              Showing <span className="font-mono text-slate-900 font-bold tabular-nums">{registrations.length}</span> of{' '}
              <span className="font-mono text-slate-900 font-bold tabular-nums">{totalCount}</span> candidates
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 text-slate-600 hover:text-slate-900 disabled:text-slate-300 rounded-lg hover:bg-slate-100 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs tabular-nums text-slate-700 font-bold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-1.5 text-slate-600 hover:text-slate-900 disabled:text-slate-300 rounded-lg hover:bg-slate-100 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* DRAWER: GOOGLE WEBHOOK SYNCHRONIZATION LOGS               */}
      {/* ========================================================= */}
      {showSyncDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-white border-l border-slate-200 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-950">Google Forms Webhook Logs</h3>
                <p className="text-xs text-slate-500 font-medium">Incoming submission audit trail</p>
              </div>
              <button
                onClick={() => setShowSyncDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {syncLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No synchronization logs captured yet.
                </div>
              ) : (
                syncLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-slate-800 text-xs font-sans font-medium">{log.payload_summary}</div>

                    {log.error_message && (
                      <div className="text-red-700 text-[11px] bg-red-50 p-2 rounded border border-red-200">
                        {log.error_message}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span>IP: {log.ip_address || 'unknown'}</span>
                      {log.status === 'failed' && (
                        <button
                          onClick={() => handleRetrySync(log.id)}
                          className="text-blue-700 hover:text-blue-800 font-bold underline cursor-pointer"
                        >
                          Retry Entry
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Details & Payment/Registration Status Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          token={token}
          onClose={() => setSelectedStudent(null)}
          onUpdated={(updated) => {
            setSelectedStudent(updated);
            fetchStats();
            fetchRegistrations();
          }}
          onDeleted={() => {
            setSelectedStudent(null);
            fetchStats();
            fetchRegistrations();
          }}
        />
      )}

      {/* Google Apps Script Modal */}
      {showAppsScriptModal && (
        <GoogleAppsScriptModal onClose={() => setShowAppsScriptModal(false)} />
      )}

      {/* Webhook Test Simulation Modal */}
      {showWebhookTester && (
        <WebhookTestModal
          token={token}
          onClose={() => setShowWebhookTester(false)}
          onSuccess={() => {
            fetchStats();
            fetchRegistrations();
          }}
        />
      )}
    </div>
  );
};
