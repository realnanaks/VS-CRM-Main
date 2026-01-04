import React from 'react';
import { ArrowDown, AlertTriangle, CheckCircle, Smartphone, Calculator, Scale } from 'lucide-react';
import { cn } from '../../utils/cn';

export const RiskLogicFlow: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Scale className="text-indigo-600" size={24} />
                Kill Zone Logic Flow
            </h3>

            <div className="flex flex-col items-center">
                {/* INPUT DATA */}
                <div className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-3 mb-2 z-10 relative">
                    <Smartphone size={20} className="text-indigo-400" />
                    <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Input Data</div>
                        <div className="font-bold text-lg">High Roller Bet of KSh 50,000</div>
                    </div>
                </div>

                {/* Arrow Down */}
                <div className="h-8 border-l-2 border-slate-300 border-dashed"></div>

                {/* SPLIT */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Horizontal Connector */}
                    <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-8 border-t-2 border-l-2 border-r-2 border-slate-300 rounded-t-xl border-dashed -mt-0.5"></div>

                    {/* MODEL A PATH */}
                    <div className="flex flex-col items-center">
                        <div className="h-8 border-l-2 border-slate-300 border-dashed md:hidden"></div>

                        {/* Model Node */}
                        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4 relative z-10">
                            <div className="font-bold text-slate-800">Model A: Linear / Normal</div>
                            <div className="text-xs text-slate-500 mt-1">Standard Bell Curve</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* Calculation Node */}
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4">
                            <div className="text-sm font-bold text-indigo-900">Calculate Z-Score</div>
                            <div className="text-xs text-indigo-600 italic mt-1">Distance is Additive</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* Result Node */}
                        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4">
                            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Result</div>
                            <div className="font-bold text-slate-900 text-xl">500 SD</div>
                            <div className="text-xs text-slate-500 mt-1">Extremely Far from Mean</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* Safety Check Node */}
                        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4">
                            <div className="font-bold text-slate-800">Safety Check</div>
                            {/* <div className="text-sm text-slate-600 mt-1">Is Z &gt; 6?</div> */}
                            <div className="font-bold text-red-600 mt-1">Score &gt; 6</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* OUTCOME: KILL ZONE */}
                        <div className="bg-red-50 border border-red-200 p-5 rounded-xl shadow-sm w-full max-w-xs text-center ring-4 ring-red-50/50">
                            <div className="flex justify-center mb-2">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <div className="font-bold text-red-700 text-lg uppercase tracking-tight">Kill Zone</div>
                            <div className="text-sm text-red-600 font-medium mt-1">Action: Delete Data</div>
                            <div className="text-xs text-red-400 mt-2 bg-white/50 py-1 px-2 rounded-full inline-block">Assumed System Error</div>
                        </div>
                    </div>

                    {/* MODEL B PATH */}
                    <div className="flex flex-col items-center">
                        <div className="h-8 border-l-2 border-slate-300 border-dashed md:hidden"></div>

                        {/* Model Node */}
                        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4 relative z-10">
                            <div className="font-bold text-slate-800">Model B: Log-Normal</div>
                            <div className="text-xs text-slate-500 mt-1">Geometric Growth</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* Calculation Node */}
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4">
                            <div className="text-sm font-bold text-indigo-900">Calculate Z-Score</div>
                            <div className="text-xs text-indigo-600 italic mt-1">Distance is Multiplicative</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* Result Node */}
                        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4">
                            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Result</div>
                            <div className="font-bold text-slate-900 text-xl">~4.5 SD</div>
                            <div className="text-xs text-slate-500 mt-1">Rare but Reachable</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* Safety Check Node */}
                        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full max-w-xs text-center mb-4">
                            <div className="font-bold text-slate-800">Safety Check</div>
                            {/* <div className="text-sm text-slate-600 mt-1">Is Z &lt; 6?</div> */}
                            <div className="font-bold text-emerald-600 mt-1">Score &lt; 6</div>
                        </div>
                        <ArrowDown className="text-slate-300 mb-4" />

                        {/* OUTCOME: SAFE ZONE */}
                        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm w-full max-w-xs text-center ring-4 ring-emerald-50/50">
                            <div className="flex justify-center mb-2">
                                <CheckCircle className="text-emerald-500" size={32} />
                            </div>
                            <div className="font-bold text-emerald-700 text-lg uppercase tracking-tight">Safe Zone</div>
                            <div className="text-sm text-emerald-600 font-medium mt-1">Action: Keep Data</div>
                            <div className="text-xs text-emerald-400 mt-2 bg-white/50 py-1 px-2 rounded-full inline-block">Valid VIP Behavior</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
