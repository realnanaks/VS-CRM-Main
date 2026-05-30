import React from 'react';
import { ArrowDown, Scale, CheckCircle, AlertTriangle, XCircle, Play, Database, Calculator, List, Shield, Ban, Activity, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export const RiskLogicFlow: React.FC = () => {
    return (
        <div className="w-full bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center">

            {/* Header */}
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 self-start">
                <Scale className="text-indigo-600" size={24} />
                Kill Zone Logic Flow
            </h3>

            {/* 1. START: Opportunity Trigger */}
            <div className="relative group z-10">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 border-2 border-slate-700">
                    <Play size={18} className="text-emerald-400 fill-current" />
                    <div className="text-center">
                        <div className="font-bold text-sm">New Offer Opportunity Triggered</div>
                        <div className="text-[10px] text-slate-400">Login • Deposit • Session End</div>
                    </div>
                </div>
                <div className="absolute left-1/2 -ml-0.5 bottom-0 h-8 w-0.5 bg-slate-300 translate-y-full"></div>
            </div>

            {/* Spacer for connector */}
            <div className="h-8"></div>

            {/* 2. Extract Window */}
            <div className="relative group z-10">
                <div className="bg-white border border-slate-300 px-5 py-3 rounded-lg shadow-sm flex items-center gap-3 w-64 justify-center">
                    <Database size={18} className="text-indigo-600" />
                    <div className="text-center">
                        <div className="font-bold text-xs text-slate-800">Extract Behavioural Window</div>
                        <div className="text-[10px] text-slate-500">Rolling 1h / 24h / 7d / 30d</div>
                    </div>
                </div>
                <div className="absolute left-1/2 -ml-0.5 bottom-0 h-8 w-0.5 bg-slate-300 translate-y-full"></div>
            </div>
            <div className="h-8"></div>

            {/* 3. Indicators Grid */}
            <div className="relative z-10 bg-white border border-slate-200 rounded-xl p-4 shadow-sm w-full max-w-4xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 rounded border border-slate-200">
                    COMPUTE INDICATORS
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                        <div className="flex justify-center mb-1"><TrendingUp size={16} className="text-blue-500" /></div>
                        <div className="font-bold text-xs text-slate-700">Loss Ratio (LR)</div>
                        <div className="text-[10px] text-slate-500">Net Loss ÷ Stakes</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                        <div className="flex justify-center mb-1"><Activity size={16} className="text-amber-500" /></div>
                        <div className="font-bold text-xs text-slate-700">Deposit Burst (DB)</div>
                        <div className="text-[10px] text-slate-500">Freq. last 2h/24h</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                        <div className="flex justify-center mb-1"><Clock size={16} className="text-purple-500" /></div>
                        <div className="font-bold text-xs text-slate-700">Session Dur (SD)</div>
                        <div className="text-[10px] text-slate-500">Current + Max 7d</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                        <div className="flex justify-center mb-1"><Ban size={16} className="text-red-500" /></div>
                        <div className="font-bold text-xs text-slate-700">Cool-Off (CI)</div>
                        <div className="text-[10px] text-slate-500">Hrs since big loss</div>
                    </div>
                </div>
                <div className="absolute left-1/2 -ml-0.5 bottom-0 h-8 w-0.5 bg-slate-300 translate-y-full"></div>
            </div>
            <div className="h-8"></div>

            {/* 4. Scoring Node */}
            <div className="relative group z-10 mb-8">
                <div className="bg-indigo-50 border border-indigo-200 px-6 py-4 rounded-lg shadow-sm flex items-center gap-4 text-center">
                    <Calculator size={24} className="text-indigo-600" />
                    <div>
                        <div className="font-bold text-sm text-indigo-900">Calculate CRG-Risk Score</div>
                        <div className="text-[10px] text-indigo-700 font-mono mt-1">
                            0.4(LR) + 0.3(DB) + 0.15(SD) + 0.15(CI)
                        </div>
                    </div>
                </div>
                <div className="absolute left-1/2 -ml-0.5 bottom-0 h-8 w-0.5 bg-slate-300 translate-y-full"></div>
            </div>

            {/* 5. DECISION SPLIT */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 relative mt-4">
                {/* Horizontal Bar for Tree Split */}
                <div className="hidden md:block absolute -top-8 left-[16.66%] right-[16.66%] h-8 border-t-2 border-l-2 border-r-2 border-slate-300 rounded-t-xl"></div>
                {/* Center Line connection */}
                <div className="hidden md:block absolute -top-8 left-1/2 -ml-0.5 h-8 w-0.5 bg-slate-300"></div>


                {/* === LOW RISK === */}
                <div className="flex flex-col gap-3 relative">
                    <div className="md:hidden h-8 w-0.5 bg-slate-300 absolute -top-8 left-1/2"></div>
                    {/* Header */}
                    <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-lg text-center shadow-sm">
                        <div className="font-bold text-emerald-800 text-sm">LOW RISK</div>
                        <div className="text-xs text-emerald-600 font-mono">Score 0 – 39</div>
                    </div>
                    {/* Steps */}
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg space-y-3 h-full">
                        <div className="flex items-start gap-2 text-xs">
                            <CheckCircle size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700">Run <strong>XGBoost</strong> Model</span>
                        </div>
                        <div className="flex items-center justify-center"><ArrowDown size={12} className="text-emerald-300" /></div>
                        <div className="flex items-start gap-2 text-xs">
                            <List size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700">Get Ranked Offers (100%, Spins...)</span>
                        </div>
                        <div className="flex items-center justify-center"><ArrowDown size={12} className="text-emerald-300" /></div>
                        <div className="flex items-start gap-2 text-xs">
                            <Shield size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700">Light Rules (Caps, Timers)</span>
                        </div>
                        <div className="mt-4 bg-white border border-emerald-200 p-2 rounded text-center shadow-sm">
                            <span className="font-bold text-emerald-700 text-xs">DELIVER BEST OFFER</span>
                        </div>
                    </div>
                </div>

                {/* === MODERATE RISK === */}
                <div className="flex flex-col gap-3 relative">
                    <div className="md:hidden h-8 w-0.5 bg-slate-300 absolute -top-8 left-1/2"></div>
                    {/* Header */}
                    <div className="bg-amber-100 border border-amber-300 p-3 rounded-lg text-center shadow-sm">
                        <div className="font-bold text-amber-800 text-sm">MODERATE RISK</div>
                        <div className="text-xs text-amber-700 font-mono">Score 40 – 59</div>
                    </div>
                    {/* Steps */}
                    <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg space-y-3 h-full">
                        <div className="flex items-start gap-2 text-xs">
                            <Ban size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700">Bypass ML Ranking</span>
                        </div>
                        <div className="flex items-center justify-center"><ArrowDown size={12} className="text-amber-300" /></div>
                        <div className="flex items-start gap-2 text-xs">
                            <Shield size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <div className="text-slate-700">
                                <strong>Safe Whitelist Only</strong>
                                <ul className="list-disc pl-3 mt-1 text-[10px] text-slate-500">
                                    <li>No Deposit Match</li>
                                    <li>Cashback ≤ 10%</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center justify-center"><ArrowDown size={12} className="text-amber-300" /></div>
                        <div className="flex items-start gap-2 text-xs">
                            <Activity size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700">Soft Nudge ("Take a break?")</span>
                        </div>
                        <div className="mt-4 bg-white border border-amber-200 p-2 rounded text-center shadow-sm">
                            <span className="font-bold text-amber-700 text-xs">SAFE OFFER / NONE</span>
                        </div>
                    </div>
                </div>

                {/* === HIGH RISK === */}
                <div className="flex flex-col gap-3 relative">
                    <div className="md:hidden h-8 w-0.5 bg-slate-300 absolute -top-8 left-1/2"></div>
                    {/* Header */}
                    <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-center shadow-sm">
                        <div className="font-bold text-red-800 text-sm">HIGH RISK</div>
                        <div className="text-xs text-red-700 font-mono">Score ≥ 60</div>
                    </div>
                    {/* Steps */}
                    <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg space-y-3 h-full">
                        <div className="flex items-start gap-2 text-xs">
                            <Ban size={14} className="text-red-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700 font-semibold">SUPPRESS ALL INCENTIVES</span>
                        </div>
                        <div className="flex items-center justify-center"><ArrowDown size={12} className="text-red-300" /></div>
                        <div className="flex items-start gap-2 text-xs">
                            <AlertTriangle size={14} className="text-red-600 mt-0.5 shrink-0" />
                            <div className="text-slate-700">
                                <strong>Intervention</strong>
                                <ul className="list-disc pl-3 mt-1 text-[10px] text-slate-500">
                                    <li>24h Enforced Cooling</li>
                                    <li>Direct RG Contact</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 bg-white border border-red-200 p-2 rounded text-center shadow-sm">
                            <span className="font-bold text-red-700 text-xs">NO OFFER FLAGGED</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Final Log */}
            <div className="mt-8 text-center text-xs text-slate-400 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                Log decision trace for audit (CRG-Risk, S-Scores, Action)
            </div>

        </div>
    );
};
