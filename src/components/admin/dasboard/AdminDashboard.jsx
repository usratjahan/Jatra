import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../../services/adminService';

const StatCard = ({ icon, label, value }) => (
  <div className="flex-1 min-w-[120px] bg-[#e8f5f3] border border-[#b2dfdb] rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
    <div className="text-teal-600">{icon}</div>
    <p className="text-xs font-semibold text-gray-500 text-center">{label}</p>
    <p className="text-xl font-extrabold text-gray-800">{value}</p>
  </div>
);

// Icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const EventsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    <path d="m9 16 2 2 4-4"/>
  </svg>
);
const RevenueIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 18V6"/>
  </svg>
);
const SalesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);
const ProfitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 9h1.5a1.5 1.5 0 0 1 0 3H9v3m0-6V7m0 8v2"/>
  </svg>
);

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const s = await getDashboardStats();
      setStats(s);
      setLoading(false);
    };

    // Keep cards synced with new localStorage writes when user returns to dashboard.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadStats();
    };

    loadStats();
    window.addEventListener('focus', loadStats);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', loadStats);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const fmt = (n) => Number(n || 0).toLocaleString('en-BD');

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-8">
        Welcome to Admin Dashboard
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-8 h-8 animate-spin text-teal-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-wrap gap-4">
            <StatCard icon={<UsersIcon />}   label="Total Users"   value={fmt(stats?.totalUsers)} />
            <StatCard icon={<EventsIcon />}  label="Total Events"  value={fmt(stats?.totalEvents)} />
            <StatCard icon={<RevenueIcon />} label="Total Revenue" value={fmt(stats?.totalRevenue)} />
            <StatCard icon={<SalesIcon />}   label="Total Sales"   value={fmt(stats?.totalSales)} />
            <StatCard icon={<ProfitIcon />}  label="Total Profit"  value={fmt(stats?.totalProfit)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;