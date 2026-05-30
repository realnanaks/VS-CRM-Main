import React from 'react';
import { Activity, AlertTriangle, Clock, Zap, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export const RiskIndicatorsInfographic: React.FC = () => {
    const indicators = [
        {
            name: "Loss Ratio (LR)",
            definition: "Net Loss / Total Stakes (7-day window). Measures proportion of stakes lost.",
            icon: <Activity size={20} className="text-secondary-500" />,
            low: "< 0.70 – Typical recreational fluctuation",
            moderate: "0.70–0.89 – Elevated losses",
            high: "≥ 0.90 – Strong loss-chasing behaviour",
            references: "Auer & Griffiths (2021)"
        },
        {
            name: "Deposit Burst (DB)",
            definition: "Number of deposits within 24 hours. Indicates impulsive or emotional redepositing.",
            icon: <Zap size={20} className="text-amber-500" />,
            low: "0–1",
            moderate: "2–3",
            high: "≥ 4 (or ≥3 in 2 hours) – High-risk impulsive redepositing",
            references: "Delfabbro & King (2020)"
        },
        {
            name: "Session Duration (SD)",
            definition: "Longest continuous session (7 days). Indicates self-control and cognitive load.",
            icon: <Clock size={20} className="text-blue-500" />,
            low: "< 60 min",
            moderate: "60–179 min",
            high: "≥ 180 min",
            references: "Auer & Griffiths (2016)"
        },
        {
            name: "Cooling-Off Interval (CI)",
            definition: "Hours between a significant loss and next login. Indicates emotional regulation.",
            icon: <AlertTriangle size={20} className="text-indigo-500" />,
            low: "> 48 h",
            moderate: "24–48 h",
            high: "< 24 h",
            references: "Harris & Griffiths (2018)"
        }
    ];

    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Row */}
            <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider items-center">
                <div className="col-span-4">Indicator & Definition</div>
                <div className="col-span-2 text-center text-emerald-600">Low Risk</div>
                <div className="col-span-2 text-center text-amber-600">Moderate Risk</div>
                <div className="col-span-4 text-center text-red-600">High Risk</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {indicators.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-6 items-start hover:bg-slate-50/50 transition-colors">
                        {/* Indicator & Definition */}
                        <div className="col-span-4 flex gap-3">
                            <div className="mt-1 p-2 bg-slate-100 rounded-lg h-fit shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {item.definition}
                                </p>
                            </div>
                        </div>

                        {/* Low Risk */}
                        <div className="col-span-2 flex justify-center">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 w-full text-center">
                                <span className="text-xs font-medium text-emerald-700 block">
                                    {item.low}
                                </span>
                            </div>
                        </div>

                        {/* Moderate Risk */}
                        <div className="col-span-2 flex justify-center">
                            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 w-full text-center">
                                <span className="text-xs font-medium text-amber-700 block">
                                    {item.moderate}
                                </span>
                            </div>
                        </div>

                        {/* High Risk */}
                        <div className="col-span-4 flex justify-center">
                            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-full text-center">
                                <span className="text-xs font-bold text-red-700 block">
                                    {item.high}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
