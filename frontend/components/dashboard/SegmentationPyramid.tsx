import React from 'react';
import { Crown, Zap, Users, Coffee, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SegmentationPyramid: React.FC = () => {
    // Reverting to ORIGINAL text and values exactly as requested.
    const segments = [
        {
            title: "VIP",
            pop: "2%",
            basis: "Top 2%",
            deposits: "10,000–20,000+",
            stakes: "50,000–80,000+",
            value: "≥ 60,000",
            desc: "Extremely high-value bettors with largest deposits and exceptionally high turnover. VIPs are also dominant contributors to operators GGR.",
            icon: <Crown size={22} className="text-amber-600" />,
            theme: "amber",
            bg: "bg-amber-50/60",
            border: "border-amber-200"
        },
        {
            title: "High Rollers",
            pop: "8%",
            basis: "2nd–10th percentile",
            deposits: "5,000–10,000",
            stakes: "15,000–50,000",
            value: "20,000–60,000",
            desc: "High-frequency bettors with substantial deposit volumes and strong wagering intensity.",
            icon: <Zap size={22} className="text-violet-600" />,
            theme: "violet",
            bg: "bg-white",
            border: "border-slate-100"
        },
        {
            title: "Core Players",
            pop: "30%",
            basis: "10th–40th percentile",
            deposits: "1,000–5,000",
            stakes: "4,000–15,000",
            value: "5,000–20,000",
            desc: "Moderately engaged bettors with steady deposit behaviour and mid-level turnover.",
            icon: <Users size={22} className="text-indigo-500" />,
            theme: "indigo",
            bg: "bg-white",
            border: "border-slate-100"
        },
        {
            title: "Casual Players",
            pop: "60%",
            basis: "40th–100th percentile",
            deposits: "< 1,000",
            stakes: "< 4,000",
            value: "< 5,000",
            desc: "Majority of the population who have a low-frequency, low-stake and minimal individual contribution.",
            icon: <Coffee size={22} className="text-slate-500" />,
            theme: "slate",
            bg: "bg-slate-50/30",
            border: "border-slate-100"
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Summary Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-400" />
                        Value Distribution Analysis
                    </h4>
                    <p className="text-slate-300 text-sm mt-1">
                        Top <span className="text-white font-bold">2%</span> of players drive majority of revenue (Pareto Efficiency).
                    </p>
                </div>
            </div>

            {/* List Layout with "Tech-Table" Aesthetics */}
            <div className="grid gap-3">
                {/* Column Headers */}
                <div className="hidden md:grid grid-cols-12 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="col-span-3">Segment / Profile</div>
                    <div className="col-span-2">Percentile of Total Value</div>
                    <div className="col-span-4">Annual Activity (KSh)</div>
                    <div className="col-span-3">Description</div>
                </div>

                {segments.map((seg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "relative grid grid-cols-1 md:grid-cols-12 items-center p-5 rounded-xl border transition-all duration-200 hover:shadow-md",
                            seg.bg,
                            seg.border,
                            idx === 0 ? "shadow-sm border-l-[6px] border-l-amber-500" :
                                idx === 1 ? "border-l-[6px] border-l-violet-500" :
                                    idx === 2 ? "border-l-[6px] border-l-indigo-400" : "border-l-[6px] border-l-slate-300"
                        )}
                    >
                        {/* 1. Profile */}
                        <div className="col-span-12 md:col-span-3 flex items-center gap-4 mb-4 md:mb-0">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                                {seg.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{seg.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-sm">
                                        {seg.pop}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">Population</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Basis */}
                        <div className="col-span-12 md:col-span-2 mb-4 md:mb-0">
                            <p className="text-xs font-bold text-slate-400 uppercase md:hidden mb-1">Percentile of Total Value</p>
                            <span className="text-sm font-semibold text-slate-700 bg-white/50 px-2 py-1 rounded inline-block">
                                {seg.basis}
                            </span>
                        </div>

                        {/* 3. Activity Stats (The Core Data) */}
                        <div className="col-span-12 md:col-span-4 grid grid-cols-3 gap-4 mb-4 md:mb-0 bg-white/50 p-3 rounded-lg border border-black/5">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Deposits</p>
                                <p className="text-xs font-bold text-slate-900 font-mono tracking-tight">{seg.deposits}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stakes</p>
                                <p className="text-xs font-bold text-slate-900 font-mono tracking-tight">{seg.stakes}</p>
                            </div>
                            <div>
                                <p className={cn(
                                    "text-[10px] font-bold uppercase mb-1",
                                    idx === 0 ? "text-amber-600" : "text-slate-400"
                                )}>Total</p>
                                <p className={cn(
                                    "text-xs font-bold font-mono tracking-tight",
                                    idx === 0 ? "text-amber-700" : "text-slate-900"
                                )}>{seg.value}</p>
                            </div>
                        </div>

                        {/* 4. Description */}
                        <div className="col-span-12 md:col-span-3">
                            <p className="text-xs leading-relaxed text-slate-600 font-medium text-pretty opacity-90">
                                {seg.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
