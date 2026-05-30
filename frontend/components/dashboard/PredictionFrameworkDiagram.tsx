import React from 'react';
import { Database, BrainCircuit, ShieldCheck, Gift, ArrowRight } from 'lucide-react';

export const PredictionFrameworkDiagram = () => {
    return (
        <div className="w-full bg-slate-50 p-10 rounded-xl border border-slate-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">

                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-slate-300 -z-10 -translate-y-1/2 transform"></div>

                {/* Layer 1: Input */}
                <div className="group relative bg-white w-full lg:w-64 h-64 rounded-[4rem] border-2 border-slate-100 shadow-md flex flex-col items-center justify-center text-center p-6 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Database size={28} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Input Layer</span>
                        <h4 className="font-bold text-slate-800 text-sm">Player Behavioral Information</h4>
                        <p className="text-xs text-slate-500 leading-relaxed px-2">
                            Synthetic simulation of real iGaming behaviors ensuring privacy & compliance.
                        </p>
                    </div>
                </div>

                {/* Arrow Connector */}
                <div className="lg:hidden text-slate-300">
                    <ArrowRight size={24} className="rotate-90 lg:rotate-0" />
                </div>

                {/* Layer 2: Model */}
                <div className="group relative bg-white w-full lg:w-64 h-64 rounded-[4rem] border-2 border-slate-100 shadow-md flex flex-col items-center justify-center text-center p-6 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-purple-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <BrainCircuit size={28} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Model Layer</span>
                        <h4 className="font-bold text-slate-800 text-sm">Supervised ML Models</h4>
                        <p className="text-xs text-slate-500 leading-relaxed px-2">
                            Processing behavioral data to map inputs to predicted offer types.
                        </p>
                    </div>
                </div>

                {/* Arrow Connector */}
                <div className="lg:hidden text-slate-300">
                    <ArrowRight size={24} className="rotate-90 lg:rotate-0" />
                </div>

                {/* Layer 3: Ethical Screening */}
                <div className="group relative bg-white w-full lg:w-64 h-64 rounded-[4rem] border-2 border-emerald-100 shadow-md flex flex-col items-center justify-center text-center p-6 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10 ring-4 ring-emerald-50/50">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck size={28} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Ethical Layer</span>
                        <h4 className="font-bold text-slate-800 text-sm">Responsible Gambling Filter</h4>
                        <p className="text-xs text-slate-500 leading-relaxed px-2">
                            Ensuring recommended promotions do not encourage high-risk behaviors.
                        </p>
                    </div>
                </div>

                {/* Arrow Connector */}
                <div className="lg:hidden text-slate-300">
                    <ArrowRight size={24} className="rotate-90 lg:rotate-0" />
                </div>

                {/* Layer 4: Output */}
                <div className="group relative bg-white w-full lg:w-64 h-64 rounded-[4rem] border-2 border-slate-100 shadow-md flex flex-col items-center justify-center text-center p-6 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Gift size={28} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Output Layer</span>
                        <h4 className="font-bold text-slate-800 text-sm">Tailor-made Offers</h4>
                        <p className="text-xs text-slate-500 leading-relaxed px-2">
                            Maximally effective but ethically constrained recommendations.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
