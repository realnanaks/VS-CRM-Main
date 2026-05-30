import React from 'react';
import { ArrowDown, Cpu, Shield, AlertOctagon, Check, Filter, X, Activity, Zap, Clock, Hourglass } from 'lucide-react';
import { cn } from '../../utils/cn';

export const RiskArchitectureFlow: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center">

            <h3 className="text-lg font-bold text-slate-900 mb-8 self-start flex items-center gap-2">
                <Shield className="text-indigo-600" size={20} />
                High-Level Risk Architecture
            </h3>

            {/* 1. START */}
            <div className="bg-slate-800 text-white px-8 py-3 rounded-lg shadow-md mb-2 z-10">
                <div className="font-bold text-sm tracking-wide">PLAYER DATA INPUT</div>
            </div>

            {/* Connector */}
            <div className="h-6 w-0.5 bg-slate-300"></div>
            <ArrowDown className="text-slate-300 -mt-2 mb-2" size={16} />

            {/* 2. COMPUTE INDICATORS */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm w-full max-w-2xl mb-2 z-10 relative">
                <div className="absolute -top-3 left-1/2 -ml-20 bg-white px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Compute Indicators
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Loss Ratio */}
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={14} className="text-indigo-500" />
                            <span className="text-xs font-bold text-slate-700">Loss Ratio (LR)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 text-center leading-tight">Net Loss ÷ Stakes</span>
                    </div>

                    {/* Deposit Burst */}
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={14} className="text-amber-500" />
                            <span className="text-xs font-bold text-slate-700">Deposit Burst (DB)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 text-center leading-tight">Freq. last 2h/24h</span>
                    </div>

                    {/* Session Dur */}
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700">Session Dur (SD)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 text-center leading-tight">Current + Max 7d</span>
                    </div>

                    {/* Cool-Off */}
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Hourglass size={14} className="text-emerald-500" />
                            <span className="text-xs font-bold text-slate-700">Cool-Off (CI)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 text-center leading-tight">Hrs since big loss</span>
                    </div>
                </div>
            </div>

            {/* Connector */}
            <div className="h-6 w-0.5 bg-slate-300"></div>
            <ArrowDown className="text-slate-300 -mt-2 mb-2" size={16} />

            {/* 3. CALCULATE SCORE */}
            <div className="bg-indigo-50 border border-indigo-200 px-6 py-4 rounded-lg shadow-sm text-center mb-6 z-10 max-w-sm w-full">
                <div className="font-bold text-indigo-900">CALCULATE CRG-RISK SCORE</div>
                <div className="text-xs text-indigo-700 mt-2 font-mono bg-indigo-100/50 px-2 py-1 rounded inline-block">
                    0.4(LR) + 0.3(DB) + 0.15(SD) + 0.15(CI)
                </div>
            </div>

            {/* 4. BRANCHING */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative">
                {/* Connector Lines (Desktop) */}
                <div className="hidden md:block absolute -top-6 left-[16.66%] right-[16.66%] h-6 border-t-2 border-l-2 border-r-2 border-slate-300 rounded-t-xl"></div>
                <div className="hidden md:block absolute -top-6 left-1/2 -ml-0.5 h-6 w-0.5 bg-slate-300"></div>

                {/* === LEFT: LOW RISK === */}
                <div className="flex flex-col items-center relative">
                    <div className="md:hidden h-6 w-0.5 bg-slate-300 absolute -top-6 left-1/2"></div>

                    {/* Header */}
                    <div className="bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-md mb-4 text-center w-full">
                        <div className="font-bold text-emerald-800 text-sm">LOW RISK</div>
                        <div className="text-xs text-emerald-700 font-mono">Score &lt; 40</div>
                    </div>

                    {/* Flow */}
                    <div className="flew flex-col items-center gap-2 w-full">
                        <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-center gap-2">
                                <Cpu size={14} className="text-indigo-500" /> RUN ML MODEL
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Predict optimal offer</div>
                        </div>
                        <ArrowDown className="text-slate-300 mx-auto my-2" size={14} />

                        <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-slate-800 text-sm">SELECT BEST</div>
                            <div className="text-[10px] text-slate-500 mt-1">e.g. Reload Bonus</div>
                        </div>
                        <ArrowDown className="text-slate-300 mx-auto my-2" size={14} />

                        <div className="bg-emerald-600 text-white p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-sm flex items-center justify-center gap-2">
                                <Check size={14} /> SEND OFFER
                            </div>
                        </div>
                    </div>
                </div>

                {/* === MIDDLE: MODERATE RISK === */}
                <div className="flex flex-col items-center relative">
                    <div className="md:hidden h-6 w-0.5 bg-slate-300 absolute -top-6 left-1/2"></div>

                    {/* Header */}
                    <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-md mb-4 text-center w-full">
                        <div className="font-bold text-amber-800 text-sm">MODERATE</div>
                        <div className="text-xs text-amber-700 font-mono">Score 40-59</div>
                    </div>

                    {/* Flow */}
                    <div className="flew flex-col items-center gap-2 w-full">
                        <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-slate-800 text-sm">BYPASS MODEL</div>
                            <div className="text-[10px] text-slate-500 mt-1">Force "Safe" Type</div>
                        </div>
                        <ArrowDown className="text-slate-300 mx-auto my-2" size={14} />

                        <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-center gap-2">
                                <Filter size={14} className="text-amber-500" /> FILTER LIST
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">e.g. Free Spins Only</div>
                        </div>
                        <ArrowDown className="text-slate-300 mx-auto my-2" size={14} />

                        <div className="bg-amber-500 text-white p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-sm flex items-center justify-center gap-2">
                                <Check size={14} /> SEND OFFER
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RIGHT: HIGH RISK === */}
                <div className="flex flex-col items-center relative">
                    <div className="md:hidden h-6 w-0.5 bg-slate-300 absolute -top-6 left-1/2"></div>

                    {/* Header */}
                    <div className="bg-red-100 border border-red-300 px-4 py-2 rounded-md mb-4 text-center w-full">
                        <div className="font-bold text-red-800 text-sm">HIGH RISK</div>
                        <div className="text-xs text-red-700 font-mono">Score &gt;= 60</div>
                    </div>

                    {/* Flow */}
                    <div className="flew flex-col items-center gap-2 w-full">
                        <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-slate-800 text-sm">BLOCK COMMS</div>
                            <div className="text-[10px] text-slate-500 mt-1">Suppress Marketing</div>
                        </div>
                        <ArrowDown className="text-slate-300 mx-auto my-2" size={14} />

                        <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-center gap-2">
                                <AlertOctagon size={14} className="text-red-500" /> INTERVENTION
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Flag for Review</div>
                        </div>
                        <ArrowDown className="text-slate-300 mx-auto my-2" size={14} />

                        <div className="bg-red-600 text-white p-3 rounded shadow-sm text-center w-full">
                            <div className="font-bold text-sm flex items-center justify-center gap-2">
                                <X size={14} /> NO OFFER
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
