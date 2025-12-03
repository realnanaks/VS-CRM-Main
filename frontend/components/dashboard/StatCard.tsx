import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    isUp: boolean;
    icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isUp, icon }) => (
    <div className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-6",
        "shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100",
        "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group"
    )}>
        <div className="flex items-center justify-between mb-4">
            <div className={cn(
                "rounded-xl bg-indigo-50/80 p-3 text-indigo-600",
                "group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300"
            )}>
                {icon}
            </div>
            <span className={cn(
                "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                isUp ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
            )}>
                {isUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {trend}
            </span>
        </div>
        <div>
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <p className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
);
