import React, { useState, useEffect } from 'react';
import { Users, Mail, MousePointer2, DollarSign } from 'lucide-react';
import { ChartData, CountryCode } from '../types';
import { retrieveDashboardData, subscribeToStateChanges } from '../services/data';
import { StatCard } from './dashboard/StatCard';
import { TrafficOverview } from './dashboard/TrafficOverview';
import { CampaignConversions } from './dashboard/CampaignConversions';
import { cn } from '../utils/cn';

interface DashboardProps {
  country: CountryCode;
}

export const Dashboard: React.FC<DashboardProps> = ({ country }) => {
  const [metrics, setMetrics] = useState({
    subscribeToStateChangesrs: 0,
    revenue: 0,
    openRate: 0,
    clickRate: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      const data = retrieveDashboardData(country);

      const subscribeToStateChangesrs = data.contacts.length;
      const revenue = data.deals.reduce((acc, deal) => acc + (deal.stage === 'Closed Won' ? deal.value : 0), 0) +
        data.events.reduce((acc, event) => acc + (event.revenue || 0), 0);

      const campaigns = data.campaigns.filter(c => c.status !== 'Draft');
      const openRate = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) / campaigns.length : 0;
      const clickRate = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + (c.clickRate || 0), 0) / campaigns.length : 0;

      setMetrics({
        subscribeToStateChangesrs,
        revenue,
        openRate,
        clickRate
      });
    };

    updateMetrics();
    return subscribeToStateChanges(updateMetrics);
  }, [country]);

  // Mock chart data for now, but could be real if we had historical data
  const trafficData: ChartData[] = [
    { name: 'Mon', value: metrics.revenue * 0.1, uv: metrics.subscribeToStateChangesrs * 0.1 },
    { name: 'Tue', value: metrics.revenue * 0.2, uv: metrics.subscribeToStateChangesrs * 0.15 },
    { name: 'Wed', value: metrics.revenue * 0.15, uv: metrics.subscribeToStateChangesrs * 0.2 },
    { name: 'Thu', value: metrics.revenue * 0.25, uv: metrics.subscribeToStateChangesrs * 0.25 },
    { name: 'Fri', value: metrics.revenue * 0.2, uv: metrics.subscribeToStateChangesrs * 0.2 },
    { name: 'Sat', value: metrics.revenue * 0.05, uv: metrics.subscribeToStateChangesrs * 0.05 },
    { name: 'Sun', value: metrics.revenue * 0.05, uv: metrics.subscribeToStateChangesrs * 0.05 },
  ];

  const campaignConversionData: ChartData[] = [
    { name: 'Email', value: metrics.openRate },
    { name: 'Social', value: metrics.clickRate * 1.5 }, // Mock relation
    { name: 'Direct', value: 15 },
    { name: 'Search', value: 32 },
  ];

  return (
    <div className={cn("space-y-8 animate-fade-in")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time performance overview for {country}.</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-sm text-slate-500",
          "bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
        )}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Updates
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Subscribers" value={metrics.subscribeToStateChangesrs.toLocaleString()} trend="+0%" isUp={true} icon={<Users size={22} />} />
        <StatCard title="Avg. Open Rate" value={`${metrics.openRate.toFixed(1)}%`} trend="+0%" isUp={true} icon={<Mail size={22} />} />
        <StatCard title="Click Rate" value={`${metrics.clickRate.toFixed(1)}%`} trend="+0%" isUp={false} icon={<MousePointer2 size={22} />} />
        <StatCard title="Revenue Attr." value={`$${metrics.revenue.toLocaleString()}`} trend="+0%" isUp={true} icon={<DollarSign size={22} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TrafficOverview data={trafficData} />
        <CampaignConversions data={campaignConversionData} />
      </div>
    </div>
  );
};