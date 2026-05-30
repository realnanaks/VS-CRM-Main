import React from 'react';
import { Target, AlertTriangle, Crown, Coffee, Zap, Shield, AlertOctagon, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PlayerArchetypesInfographic: React.FC = () => {
    // Ordered by Risk Level for the Infographic Flow: Low -> Critical
    const archetypes = [
        {
            title: "Steady Casual",
            icon: <Coffee size={32} className="text-emerald-600" />,
            color: "emerald",
            gradient: "from-emerald-50 to-emerald-100/50",
            border: "border-emerald-200",
            features: [
                "Low-to-Mod Deposit",
                "Stable Weekly Play Pattern",
                "Low Volatility"
            ],
            strategy: "Standard Retention Offers (e.g. Free Spins)",
            riskProfile: "Low",
            riskLevel: 1, // for visual scaling
            safeguard: "Consistent recreational pattern"
        },
        {
            title: "Bonus Hunter",
            icon: <Target size={32} className="text-blue-600" />,
            color: "blue",
            gradient: "from-blue-50 to-blue-100/50",
            border: "border-blue-200",
            features: [
                "Acceptance Rate > 75%",
                "Low Net Deposits",
                "High Wagering Completion"
            ],
            strategy: "Restrict to Low/No-Wager Offers",
            riskProfile: "Low",
            riskLevel: 1.5,
            safeguard: "Value-seeking, not harm-indicative"
        },
        {
            title: "High-Engagement",
            // Subtitle removed as requested
            icon: <Zap size={32} className="text-violet-600" />,
            color: "violet",
            gradient: "from-violet-50 to-violet-100/50",
            border: "border-violet-200",
            features: [
                "High Session Velocity",
                "Stake/Deposit Ratio > 6",
                "Stable Session Durations"
            ],
            strategy: "Loyalty Rewards or Cashback Offers",
            riskProfile: "Low-Moderate", // Updated from Low-Mod
            riskLevel: 2.5,
            safeguard: "Monitor for volatility spikes"
        },
        {
            title: "Drifting VIP",
            icon: <Crown size={32} className="text-amber-600" />,
            color: "amber",
            gradient: "from-amber-50 to-amber-100/50",
            border: "border-amber-200",
            features: [
                "High History Stakes",
                "Days Since Last Dep. > 14",
                "Declining Session Frequency"
            ],
            strategy: "Low-Intensity Reactivation (Wager-Free Offers only)",
            riskProfile: "Moderate",
            riskLevel: 3.5,
            safeguard: "Affordability + Cooling-off Checks"
        },
        {
            title: "Chasing / High-Risk",
            icon: <AlertOctagon size={32} className="text-red-600" />,
            color: "red",
            gradient: "from-red-50 to-red-100/50",
            border: "border-red-200",
            features: [
                "Loss Ratio (7d) > 0.85",
                "Deposit Bursts Flag = True",
                "Net Loss (7d) > 70%"
            ],
            strategy: "Full Suppression / Block or Mandatory Cooling-Off",
            riskProfile: "Critical",
            riskLevel: 5,
            safeguard: "Mandatory Cooling-off / Block"
        }
    ];

    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <Shield className="text-indigo-600" size={24} />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-600">
                            Archetype safeguards & Risk Spectrum
                        </span>
                    </h3>
                    <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                        Classifying player behavior from recreational to high-risk to apply automated ethical guardrails.
                    </p>
                </div>
            </div>

            {/* Infographic Main Content */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
                {archetypes.map((item, index) => (
                    <div key={index} className="flex flex-col h-full group">
                        {/* Connection Line (Desktop) */}
                        {index < archetypes.length - 1 && (
                            <div className="hidden md:block absolute top-[4.5rem] left-[calc(10%_+_20%_*_var(--index))] w-[20%] h-0.5 bg-gradient-to-r from-slate-200 to-slate-200 z-0" style={{ '--index': index } as any}></div>
                        )}

                        {/* Card */}
                        <div className={cn(
                            "relative flex flex-col h-full rounded-xl border transition-all duration-300 z-10",
                            "hover:-translate-y-1 hover:shadow-lg",
                            "bg-white",
                            item.border
                        )}>
                            {/* Gradient Overlay */}
                            <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-b opacity-50", item.gradient)}></div>

                            {/* Icon Header */}
                            <div className="p-5 flex flex-col items-center text-center relative border-b border-slate-100">
                                <div className={cn("p-3 rounded-full bg-white shadow-sm mb-3 ring-1", `ring-${item.color}-200`)}>
                                    {item.icon}
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm leading-tight">
                                    {item.title}
                                </h4>
                            </div>

                            {/* Features */}
                            <div className="p-4 flex flex-col flex-grow relative gap-4">
                                <ul className="space-y-2">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="text-xs text-slate-700 font-medium flex items-start gap-2 leading-snug">
                                            <div className={cn("mt-1 w-1.5 h-1.5 rounded-full shrink-0", `bg-${item.color}-500`)} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Strategy Box */}
                                <div className="mt-auto pt-3 border-t border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        Strategy {/* Removed DollarSign icon as requested */}
                                    </div>
                                    <p className={cn("text-xs font-bold italic", `text-${item.color}-700`)}>
                                        "{item.strategy}"
                                    </p>
                                </div>
                            </div>

                            {/* Risk Meter Footer */}
                            <div className={cn("p-2 rounded-b-xl border-t border-slate-100 bg-slate-50/50")}>
                                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-600 mb-1.5 px-1">
                                    <span>Risk</span>
                                    <span className={cn(`text-${item.color}-700`)}>{item.riskProfile}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden w-full">
                                    <div
                                        className={cn("h-full rounded-full bg-gradient-to-r",
                                            item.riskLevel >= 4 ? "from-orange-500 to-red-600" :
                                                item.riskLevel >= 3 ? "from-amber-400 to-orange-500" :
                                                    item.riskLevel >= 2 ? "from-blue-400 to-violet-500" :
                                                        "from-emerald-400 to-teal-500"
                                        )}
                                        style={{ width: `${(item.riskLevel / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Citation & Legend */}
            <div className="relative z-10 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                    <p>
                        <strong className="text-slate-800">Ethical Override:</strong> Even if a player qualifies for rewards, the CRG-Risk system will block offers immediately if <span className="text-slate-800 font-bold font-mono bg-slate-100 px-1 rounded">loss_ratio_7d</span> exceeds safe thresholds.
                    </p>
                </div>
            </div>
        </div>
    );
};
