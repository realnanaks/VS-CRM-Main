import React from 'react';
import { Database, Binary, Tag, Brain, ChevronRight, FileSpreadsheet, Server, Layers } from 'lucide-react';

export const DataPipelineFlow: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Layers className="text-indigo-600" size={20} />
                ML Data Pipeline
            </h3>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto pb-4 -mx-2 px-2">
                <div className="flex items-start gap-4 min-w-max">

                    {/* 1. Raw Transaction Logs */}
                    <div className="group flex-shrink-0 w-64 bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-indigo-100 rounded-md text-indigo-600">
                                <Server size={18} />
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">Raw Transaction Logs</span>
                        </div>
                        <div className="space-y-2">
                            <ul className="text-[10px] text-slate-600 list-disc list-inside leading-relaxed">
                                <li>Deposits</li>
                                <li>Wagers</li>
                                <li>Wins / Losses</li>
                                <li>Session Start / End</li>
                                <li>Game Category</li>
                                <li>Offer Sent / Claimed Events</li>
                                <li>Timestamps</li>
                                <li>Platform (Mobile/Desktop)</li>
                            </ul>
                        </div>
                        <div className="absolute top-1/2 -right-3 z-10 bg-white p-1 rounded-full border border-slate-200 text-slate-400">
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* 2. Raw Observations */}
                    <div className="group flex-shrink-0 w-64 bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                                <Database size={18} />
                            </div>
                            <div>
                                <span className="font-semibold text-slate-800 text-sm block">Raw Observations</span>
                                <span className="text-[10px] text-slate-400 font-mono">(Section 3.2.2)</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                                {['Total Stakes', 'Net Deposits', 'Active Days', 'Average Stake', 'Session Durations', 'Offer Claim Flags', 'Time-of-Day Usage', 'Platform Type'].map(item => (
                                    <span key={item} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600">{item}</span>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-1/2 -right-3 z-10 bg-white p-1 rounded-full border border-slate-200 text-slate-400">
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* 3. Feature Engineering */}
                    <div className="group flex-shrink-0 w-72 bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-amber-100 rounded-md text-amber-600">
                                <Binary size={18} />
                            </div>
                            <div>
                                <span className="font-semibold text-slate-800 text-sm block">Feature Engineering</span>
                                <span className="text-[10px] text-slate-400 font-mono">(Phase 2)</span>
                            </div>
                        </div>
                        <div className="space-y-3 text-[10px]">
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Financial Behaviour Features</div>
                                <div className="text-slate-500">avg_deposit_amount, stake_to_deposit_ratio, net_loss_position, volatility_score</div>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Gaming Pattern Features</div>
                                <div className="text-slate-500">session_frequency, avg_session_duration, preferred_game_category, session_velocity</div>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Promotional Responsiveness</div>
                                <div className="text-slate-500">acceptance_rate, type_specific_acceptance, response_latency</div>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Temporal & Contextual</div>
                                <div className="text-slate-500">days_since_last_deposit, weekly_play_pattern</div>
                            </div>
                            <div>
                                <div className="font-bold text-red-600 mb-1">Ethical Risk Indicators</div>
                                <div className="text-red-500">loss_ratio_7d, deposit_burst_flag, session_duration_trend</div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 -right-3 z-10 bg-white p-1 rounded-full border border-slate-200 text-slate-400">
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* 4. Heuristic Labeling */}
                    <div className="group flex-shrink-0 w-60 bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-emerald-100 rounded-md text-emerald-600">
                                <Tag size={18} />
                            </div>
                            <div>
                                <span className="font-semibold text-slate-800 text-sm block">Heuristic Labeling</span>
                                <span className="text-[10px] text-slate-400 font-mono">(Phase 3)</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded text-center">
                                <span className="text-xs font-bold text-emerald-700 block">Offer_Response (Target)</span>
                            </div>
                            <div className="text-[10px] space-y-2 mt-1">
                                <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                                    <span className="font-bold text-emerald-600">y = 1</span>
                                    <div className="text-slate-500">Claimed + Qualified + Used</div>
                                </div>
                                <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                                    <span className="font-bold text-slate-500">y = 0</span>
                                    <div className="text-slate-500">Ignored / Expired / Claimed-only</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 -right-3 z-10 bg-white p-1 rounded-full border border-slate-200 text-slate-400">
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* 5. Final ML Training Matrix */}
                    <div className="group flex-shrink-0 w-48 bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-violet-100 rounded-md text-violet-600">
                                <FileSpreadsheet size={18} />
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">Final Matrix</span>
                        </div>
                        <div className="space-y-2">
                            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-center">
                                <div className="font-mono font-bold text-lg text-slate-700">X</div>
                                <div className="text-[10px] text-slate-500">Engineered Behavioural Features</div>
                            </div>
                            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-center">
                                <div className="font-mono font-bold text-lg text-emerald-600">y</div>
                                <div className="text-[10px] text-slate-500">Offer_Response (0/1)</div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 -right-3 z-10 bg-white p-1 rounded-full border border-slate-200 text-slate-400">
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* 6. Supervised Learning Model */}
                    <div className="group flex-shrink-0 w-64 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-lg p-4 shadow-md relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-white/20 rounded-md text-white">
                                <Brain size={18} />
                            </div>
                            <span className="font-semibold text-sm">Supervised Learning</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="text-[10px]">Promotion Acceptance Prediction</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="text-[10px]">Ethical Risk Guardrails Applied</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="text-[10px]">Deployment-Ready CRM Scoring</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
