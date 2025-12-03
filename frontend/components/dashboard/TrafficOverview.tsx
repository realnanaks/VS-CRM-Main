import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ChartData } from '../../types';
import { cn } from '../../utils/cn';

interface TrafficOverviewProps {
    data: ChartData[];
}

export const TrafficOverview: React.FC<TrafficOverviewProps> = ({ data }) => {
    return (
        <div className={cn(
            "lg:col-span-2 rounded-2xl bg-white p-6",
            "shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100"
        )}>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-600" /> Traffic Overview
                </h3>
                <select className={cn(
                    "text-sm border-none bg-slate-50 rounded-lg",
                    "text-slate-600 focus:ring-0 cursor-pointer"
                )}>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
