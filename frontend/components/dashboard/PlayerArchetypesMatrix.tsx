import React from 'react';
import { Target, AlertTriangle, Crown, Coffee, Zap, Shield, AlertOctagon, CheckCircle2, DollarSign, Activity, Ban } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PlayerArchetypesMatrix: React.FC = () => {
    const archetypes = [
        {
            title: "Bonus Hunter",
            icon: <Target size={24} className="text-blue-500" />,
            color: "blue",
            features: [
                "Acceptance Rate > 75%",
                "Low Net Lifetime Deposits",
                "High Wagering Completion"
            ],
            strategy: "Suppress or restrict to low/no-wager offers only (ROI protection)",
            riskProfile: "Low",
            riskColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
            safeguard: "Value-seeking but not harm-indicative",
            citation: "(Philander, 2021)"
        },
        {
            title: "Chasing / High-Risk Player",
            icon: <AlertOctagon size={24} className="text-red-500" />,
            color: "red",
            features: [
                "Loss Ratio (7d) > 0.85",
                "Deposit Burst Flag = TRUE",
                "Net Loss > 70% of Deposits"
            ],
            strategy: "Full suppression of deposit-matched bonuses; only wager-free cashback or mandatory cooling-off",
            riskProfile: "Critical",
            riskColor: "text-red-700 bg-red-50 border-red-200",
            safeguard: "CRG-Risk enforces full block/severe restriction",
            citation: "(Auer & Griffiths, 2021; UKGC, 2023)"
        },
        {
            title: "Drifting VIP",
            icon: <Crown size={24} className="text-amber-500" />,
            color: "amber",
            features: [
                "High Historical Stakes/LTV",
                "Days Since Deposit > 14 (Increasing)",
                "Declining Session Frequency"
            ],
            strategy: "Low-intensity reactivation; wager-free offers only",
            riskProfile: "Moderate",
            riskColor: "text-amber-700 bg-amber-50 border-amber-200",
            safeguard: "Affordability and cooling-off checks required",
            citation: "(Delfabbro & King, 2020)"
        },
        {
            title: "Steady Casual",
            icon: <Coffee size={24} className="text-slate-500" />,
            color: "slate",
            features: [
                "Low-to-Moderate Deposit Intensity",
                "Stable Weekly Play Pattern",
                "Low Volatility Score"
            ],
            strategy: "Standard retention offers (e.g., free spins, small deposit matches)",
            riskProfile: "Low",
            riskColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
            safeguard: "Consistent recreational pattern",
            citation: "(Gainsbury et al., 2018)"
        },
        {
            title: "High-Engagement Grinder",
            icon: <Zap size={24} className="text-purple-500" />,
            color: "purple",
            features: [
                "Very High Session Velocity",
                "Stake-to-Deposit Ratio > 6",
                "Stable Session Duration"
            ],
            strategy: "High-value loyalty rewards or personalised cashback; avoid escalatory incentives",
            riskProfile: "Low–Moderate",
            riskColor: "text-blue-700 bg-blue-50 border-blue-200",
            safeguard: "Routine monitoring; escalate only if volatility sharply increases",
            citation: "(Perczyk et al., 2023)"
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archetypes.map((item, index) => (
                    <div key={index} className={cn(
                        "relative flex flex-col h-full bg-white rounded-xl border-2 shadow-sm overflow-hidden hover:shadow-md transition-shadow",
                        `border-${item.color}-100` // Note: Tailwind might not pick this up with dynamic classes, stick to static border-slate-100 usually, but let's try or use explicit mapping if needed. For now using static border-slate-200 in class below to be safe if dynamic fails or style attribute.
                    )}
                        style={{ borderColor: `var(--color-${item.color}-200)` }} /* Fallback / Enhancement */
                    >
                        {/* Header */}
                        <div className={cn("p-4 border-b flex items-center gap-3", `bg-${item.color}-50/50 border-${item.color}-100`)}>
                            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                                {item.icon}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                        </div>

                        <div className="p-4 flex flex-col flex-grow gap-4">
                            {/* Features */}
                            <div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Activity size={12} /> Defining Features
                                </div>
                                <ul className="space-y-1.5">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                            <span className={`mt-1 w-1 h-1 rounded-full bg-${item.color}-400 shrink-0`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Strategy */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-auto">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <DollarSign size={12} /> Strategy
                                </div>
                                <p className="text-xs text-slate-700 italic leading-relaxed">
                                    "{item.strategy}"
                                </p>
                            </div>

                            {/* Risk Profile & Safeguard */}
                            <div className={cn("rounded-lg p-3 border", item.riskColor)}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold uppercase flex items-center gap-1">
                                        <Shield size={12} /> CRG-Risk Profile
                                    </span>
                                    <span className="text-xs font-extrabold">{item.riskProfile}</span>
                                </div>
                                <p className="text-[10px] opacity-90 leading-snug">
                                    {item.safeguard}
                                </p>
                                <div className="mt-2 text-[9px] opacity-70 text-right">
                                    {item.citation}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend / Info Footer */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                <p>
                    <strong>Note:</strong> All recommended strategies are subject to real-time overrides by the Ethical Guardrails system.
                    Even if a "Bonus Hunter" qualifies for a low-wager offer, it will be blocked if their <i>Deposit Burst Flag</i> activates within the session.
                </p>
            </div>
        </div>
    );
};
