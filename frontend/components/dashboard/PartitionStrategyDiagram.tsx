import React from 'react';
import { ShieldCheck, Scale, History, Split, Users, Hash, Lock, CheckCircle2 } from 'lucide-react';

export const PartitionStrategyDiagram: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">

            {/* 1. The Split Visual */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium text-slate-600 mb-1">
                    <span>Total Dataset</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">100% Data Volume</span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-16 w-full flex rounded-xl overflow-hidden shadow-sm border border-slate-100">
                    {/* Training */}
                    <div className="w-[70%] bg-indigo-600 h-full flex flex-col items-center justify-center text-white relative group">
                        <span className="font-bold text-lg">70%</span>
                        <span className="text-[10px] uppercase opacity-80 font-semibold tracking-wider">Training</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Validation */}
                    <div className="w-[15%] bg-violet-500 h-full flex flex-col items-center justify-center text-white relative group border-l border-white/20">
                        <span className="font-bold text-lg">15%</span>
                        <span className="text-[10px] uppercase opacity-80 font-semibold tracking-wider hidden sm:block">Validation</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Testing */}
                    <div className="w-[15%] bg-emerald-500 h-full flex flex-col items-center justify-center text-white relative group border-l border-white/20">
                        <span className="font-bold text-lg">15%</span>
                        <span className="text-[10px] uppercase opacity-80 font-semibold tracking-wider hidden sm:block">Testing</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 italic text-center">
                    *Unlike random shuffle, a dual-constraint rule was enforced
                </p>
            </div>

            {/* 2. Dual-Constraint Rules */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Player-ID Purging */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative overflow-hidden hover:border-indigo-300 transition-colors group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={80} className="text-indigo-600" />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Hash size={18} />
                        </div>
                        <h4 className="font-bold text-slate-800">Player-ID Purging</h4>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        Strict hashing ensures any given <span className="font-mono text-xs bg-white px-1 py-0.5 border border-slate-200 rounded text-slate-700">Player_ID</span> exists in <strong>only one</strong> partition.
                    </p>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                            <Lock size={12} className="text-emerald-500" />
                            <span>Removes Identity Leakage</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                            <Users size={12} className="text-indigo-500" />
                            <span>Forces Behavioral Generalization</span>
                        </div>
                    </div>
                </div>

                {/* Class Stratification */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative overflow-hidden hover:border-indigo-300 transition-colors group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Scale size={80} className="text-violet-600" />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                            <Scale size={18} />
                        </div>
                        <h4 className="font-bold text-slate-800">Class Stratification</h4>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        Maintains consistent ratio of <span className="font-mono text-xs text-emerald-600 font-bold">y=1</span> (Accept) and <span className="font-mono text-xs text-slate-500 font-bold">y=0</span> (Reject) across all sets.
                    </p>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            </div>
                            <span>Handles Inherent Class Imbalance</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                            <CheckCircle2 size={12} className="text-violet-500" />
                            <span>Ensures Model Stability</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Robustness Check */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <History size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <div className="font-bold text-sm">Purged Temporal Split</div>
                        <div className="text-xs text-slate-400">Robustness Check on 10% Subsample</div>
                    </div>
                </div>
                <div className="text-xs text-slate-300 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
                    Assess generalization under deployment realistic conditions
                </div>
            </div>

        </div>
    );
};
