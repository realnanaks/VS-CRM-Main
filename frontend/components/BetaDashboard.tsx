import React, { useState, useEffect } from 'react';
import { Users, Mail, MousePointer2, DollarSign, Sparkles, BrainCircuit, TrendingUp, PieChart as PieChartIcon, Target, Download, Shield, Activity, Crown, Coffee, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { toJpeg } from 'html-to-image';
import { useRef, useCallback } from 'react';
import { ChartData, CountryCode } from '../types';
import { retrieveDashboardData, subscribeToStateChanges } from '../services/data';
import { StatCard } from './dashboard/StatCard';
import { TrafficOverview } from './dashboard/TrafficOverview';
import { CampaignConversions } from './dashboard/CampaignConversions';
import { RiskLogicFlow } from './dashboard/RiskLogicFlow';
import { ZScoreTable } from './dashboard/ZScoreTable';
import { DataPipelineFlow } from './dashboard/DataPipelineFlow';
import { RiskArchitectureFlow } from './dashboard/RiskArchitectureFlow';
import { PartitionStrategyDiagram } from './dashboard/PartitionStrategyDiagram';
import { PlayerArchetypesInfographic } from './dashboard/PlayerArchetypesInfographic';
import { RiskIndicatorsInfographic } from './dashboard/RiskIndicatorsInfographic';
import { SegmentationPyramid } from './dashboard/SegmentationPyramid';
import { PredictionFrameworkDiagram } from './dashboard/PredictionFrameworkDiagram';
import { cn } from '../utils/cn';

interface BetaDashboardProps {
    country: CountryCode;
}

export const BetaDashboard: React.FC<BetaDashboardProps> = ({ country }) => {
    const [metrics, setMetrics] = useState({
        subscribers: 0,
        revenue: 0,
        openRate: 0,
        clickRate: 0
    });

    useEffect(() => {
        const updateMetrics = () => {
            const data = retrieveDashboardData(country);

            const subscribers = data.contacts.length;
            const revenue = data.deals.reduce((acc, deal) => acc + (deal.stage === 'Closed Won' ? deal.value : 0), 0) +
                data.events.reduce((acc, event) => acc + (event.revenue || 0), 0);

            const campaigns = data.campaigns.filter(c => c.status !== 'Draft');
            const openRate = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) / campaigns.length : 0;
            const clickRate = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + (c.clickRate || 0), 0) / campaigns.length : 0;

            setMetrics({
                subscribers,
                revenue,
                openRate,
                clickRate
            });
        };

        updateMetrics();
        return subscribeToStateChanges(updateMetrics);
    }, [country]);

    // Mock chart data for now
    const trafficData: ChartData[] = [
        { name: 'Mon', value: metrics.revenue * 0.1, uv: metrics.subscribers * 0.1 },
        { name: 'Tue', value: metrics.revenue * 0.2, uv: metrics.subscribers * 0.15 },
        { name: 'Wed', value: metrics.revenue * 0.15, uv: metrics.subscribers * 0.2 },
        { name: 'Thu', value: metrics.revenue * 0.25, uv: metrics.subscribers * 0.25 },
        { name: 'Fri', value: metrics.revenue * 0.2, uv: metrics.subscribers * 0.2 },
        { name: 'Sat', value: metrics.revenue * 0.05, uv: metrics.subscribers * 0.05 },
        { name: 'Sun', value: metrics.revenue * 0.05, uv: metrics.subscribers * 0.05 },
    ];

    const campaignConversionData: ChartData[] = [
        { name: 'Email', value: metrics.openRate },
        { name: 'Social', value: metrics.clickRate * 1.5 },
        { name: 'Direct', value: 15 },
        { name: 'Search', value: 32 },
    ];

    const revenueDistributionData = [
        { name: 'Casual', population: 60, revenue: 5, popLabel: '60%', revLabel: '5%', amount: 'KSh 5M' },
        { name: 'Core', population: 30, revenue: 15, popLabel: '30%', revLabel: '15%', amount: 'KSh 15M' },
        { name: 'High Rollers', population: 8, revenue: 30, popLabel: '8%', revLabel: '30%', amount: 'KSh 30M' },
        { name: 'VIP', population: 2, revenue: 50, popLabel: '2%', revLabel: '50%', amount: 'KSh 50M' },
    ];

    const segmentationData = [
        { name: 'Casual', value: 60, color: '#94a3b8' },
        { name: 'Core', value: 30, color: '#818cf8' },
        { name: 'High Rollers', value: 8, color: '#4f46e5' },
        { name: 'VIP', value: 2, color: '#312e81' },
    ];

    const barChartRef = useRef<HTMLDivElement>(null);
    const pieChartRef = useRef<HTMLDivElement>(null);
    const riskFlowRef = useRef<HTMLDivElement>(null);
    const riskArchRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const segmentationRef = useRef<HTMLDivElement>(null);
    const partitionRef = useRef<HTMLDivElement>(null);
    const archetypesRef = useRef<HTMLDivElement>(null);
    const riskIndicatorsRef = useRef<HTMLDivElement>(null);
    const frameworkRef = useRef<HTMLDivElement>(null);

    const handleExport = useCallback((ref: React.RefObject<HTMLDivElement | null>, fileName: string) => {
        if (ref.current === null) {
            return;
        }

        const filter = (node: HTMLElement) => {
            const exclusionClasses = ['export-exclude'];
            return !exclusionClasses.some((classname) => node.classList?.contains(classname));
        };

        toJpeg(ref.current, { cacheBust: true, backgroundColor: '#ffffff', style: { borderRadius: '12px' }, filter })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `${fileName}.jpg`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Failed to export chart', err);
            });
    }, []);



    return (
        <div className={cn("space-y-8 animate-fade-in")} ref={dashboardRef}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                        <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={12} /> BETA
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">Next-generation analytics for {country}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleExport(dashboardRef, 'full-dashboard-export')}
                        className="export-exclude flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                    >
                        <Download size={16} />
                        Export Dashboard
                    </button>
                    <div className={cn(
                        "flex items-center gap-2 text-sm text-slate-500",
                        "bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
                    )}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Updates
                    </div>
                </div>
            </div>

            {/* AI Insights Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BrainCircuit size={120} className="text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2 mb-4">
                        <BrainCircuit className="text-indigo-600" size={20} />
                        AI Executive Summary
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                            <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center gap-2">
                                <TrendingUp size={16} /> Revenue Forecast
                            </h4>
                            <p className="text-sm text-indigo-700">
                                Projected to exceed Q4 targets by <strong>15%</strong> based on current deal velocity in {country}.
                            </p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                            <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center gap-2">
                                <Users size={16} /> Churn Risk
                            </h4>
                            <p className="text-sm text-indigo-700">
                                Detected <strong>3 high-value accounts</strong> showing signs of disengagement. Recommended action: Schedule check-ins.
                            </p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                            <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center gap-2">
                                <Mail size={16} /> Campaign Optimization
                            </h4>
                            <p className="text-sm text-indigo-700">
                                "Summer Sale" email subject line is underperforming. AI suggests: "Exclusive Summer Savings for You ☀️".
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Distribution Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <PieChartIcon className="text-indigo-600" size={20} />
                            Player Value Distribution
                        </h3>
                        <p className="text-sm text-slate-500">Population vs. Revenue Contribution</p>
                    </div>
                    <div className="flex gap-4 text-sm items-center">
                        <button
                            onClick={() => handleExport(barChartRef, 'player-value-distribution')}
                            className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                            <Download size={14} />
                            Export JPG
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-slate-300"></span>
                                <span className="text-slate-600">Population %</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-indigo-600"></span>
                                <span className="text-slate-600">Revenue %</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-80 w-full" ref={barChartRef}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 500, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`${value}%`, '']}
                            />
                            <Bar dataKey="population" name="Population" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={60} />
                            <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6 border-t border-slate-100 pt-6">
                    <div className="text-center">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Casual</div>
                        <div className="text-2xl font-bold text-slate-700">60%</div>
                        <div className="text-sm font-semibold text-indigo-600 mt-1">KSh 5M</div>
                        <div className="text-xs text-slate-400 mt-1">Rec. players</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Core</div>
                        <div className="text-2xl font-bold text-indigo-500">30%</div>
                        <div className="text-sm font-semibold text-indigo-600 mt-1">KSh 15M</div>
                        <div className="text-xs text-slate-400 mt-1">Steady eng.</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">High Rollers</div>
                        <div className="text-2xl font-bold text-indigo-700">8%</div>
                        <div className="text-sm font-semibold text-indigo-700 mt-1">KSh 30M</div>
                        <div className="text-xs text-slate-400 mt-1">High vol.</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">VIP</div>
                        <div className="text-2xl font-bold text-indigo-900">2%</div>
                        <div className="text-sm font-semibold text-indigo-900 mt-1">KSh 50M</div>
                        <div className="text-xs text-slate-400 mt-1">Dominant GGR</div>
                    </div>
                </div>
            </div>

            {/* Player Segmentation & Attributes */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Target className="text-indigo-600" size={20} />
                    Simulated Player Segmentation Framework
                </h3>
                <button
                    onClick={() => handleExport(segmentationRef, 'segmentation-framework')}
                    className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                >
                    <Download size={14} />
                    Export JPG
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={segmentationRef}>
                {/* Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-1 h-fit">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <Target className="text-indigo-600" size={20} />
                        Segmentation Model
                    </h3>
                    <div className="h-64 w-full relative" ref={pieChartRef}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={segmentationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {segmentationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900">100k</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Players</div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Attributes Details */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Attributes Calibrated to the Kenyan Market</h3>
                    <SegmentationPyramid />
                </div>
            </div>


            {/* Risk Logic Flow Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BrainCircuit className="text-indigo-600" size={20} />
                        Kill Zone Logic Flow
                    </h3>
                    <button
                        onClick={() => handleExport(riskFlowRef, 'outlier-detection-logic')}
                        className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export JPG
                    </button>
                </div>
                <div className="overflow-x-auto bg-white p-4 rounded-lg" ref={riskFlowRef}>
                    <RiskLogicFlow />
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <ZScoreTable />
                </div>
            </div>

            {/* High Level Risk Architecture */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="text-indigo-600" size={20} />
                        High-Level Risk Architecture
                    </h3>
                    <button
                        onClick={() => handleExport(riskArchRef, 'risk-architecture-flow')}
                        className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export JPG
                    </button>
                </div>
                <div ref={riskArchRef} className="bg-white p-2 rounded-lg">
                    <RiskArchitectureFlow />
                </div>
            </div>

            {/* ML Data Pipeline Flow */}
            <DataPipelineFlow />

            {/* Conceptual Framework Diagram */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BrainCircuit className="text-indigo-600" size={20} />
                        Conceptual Framework for Predicting Promotional Offers
                    </h3>
                    <button
                        onClick={() => handleExport(frameworkRef, 'prediction-framework')}
                        className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export JPG
                    </button>
                </div>
                <div ref={frameworkRef} className="bg-white p-2 rounded-lg">
                    <PredictionFrameworkDiagram />
                </div>
            </div>

            {/* Partitioning Strategy Diagram */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="text-indigo-600" size={20} />
                        Partitioning Strategy
                    </h3>
                    <button
                        onClick={() => handleExport(partitionRef, 'partitioning-strategy')}
                        className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export JPG
                    </button>
                </div>
                <div ref={partitionRef} className="bg-white p-2 rounded-lg">
                    <PartitionStrategyDiagram />
                </div>
            </div>

            {/* Archetypes & Strategies Infographic */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-indigo-600" size={20} />
                        Interpretable Player Archetypes & Ethical Safeguards
                    </h3>
                    <button
                        onClick={() => handleExport(archetypesRef, 'player-archetypes-infographic')}
                        className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export JPG
                    </button>
                </div>
                <div ref={archetypesRef} className="bg-white p-2 rounded-lg">
                    <PlayerArchetypesInfographic />
                </div>
            </div>

            {/* Risk Indicators Infographic */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-indigo-600" size={20} />
                        Behavioral Risk Indicators
                    </h3>
                    <button
                        onClick={() => handleExport(riskIndicatorsRef, 'risk-indicators-infographic')}
                        className="export-exclude flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export JPG
                    </button>
                </div>
                <div ref={riskIndicatorsRef} className="bg-white p-2 rounded-lg">
                    <RiskIndicatorsInfographic />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Subscribers" value={metrics.subscribers.toLocaleString()} trend="+12%" isUp={true} icon={<Users size={22} />} />
                <StatCard title="Avg. Open Rate" value={`${metrics.openRate.toFixed(1)}%`} trend="+5%" isUp={true} icon={<Mail size={22} />} />
                <StatCard title="Click Rate" value={`${metrics.clickRate.toFixed(1)}%`} trend="-2%" isUp={false} icon={<MousePointer2 size={22} />} />
                <StatCard title="Revenue Attr." value={`$${metrics.revenue.toLocaleString()}`} trend="+8%" isUp={true} icon={<DollarSign size={22} />} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <TrafficOverview data={trafficData} />
                <CampaignConversions data={campaignConversionData} />
            </div>
        </div >
    );
};
