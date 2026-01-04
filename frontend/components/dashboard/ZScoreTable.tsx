import React from 'react';
import { Table, ArrowRight } from 'lucide-react';

export const ZScoreTable: React.FC = () => {
    const data = [
        { z: 0, raw: '12.18', stake: '122', mult: '1×', interp: 'Typical casual bet', color: 'text-slate-600', bg: 'bg-slate-50' },
        { z: 3, raw: '445.86', stake: '4,459', mult: '~37×', interp: 'Realistic VIP / high roller', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { z: 4, raw: '1,480.29', stake: '14,803', mult: '~121×', interp: 'Strong whale', color: 'text-purple-600', bg: 'bg-purple-50' },
        { z: 5, raw: '4,914.77', stake: '49,148', mult: '~402×', interp: 'Extreme whale (rare but possible)', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
        { z: 6, raw: '16,309.57', stake: '163,096', mult: '~1,337×', interp: 'Ultra-whale (very rare — top ~0.001% of players)', color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="w-full">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Table size={16} className="text-slate-500" />
                Z-Score Interpretation Matrix
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">Z-Score</th>
                            <th className="px-4 py-3">Raw Value <span className="text-xs font-normal text-slate-400 block">exp(μ + Zσ)</span></th>
                            <th className="px-4 py-3">Scaled Stake <span className="text-xs font-normal text-slate-400 block">(KSh)</span></th>
                            <th className="px-4 py-3">Multiplier <span className="text-xs font-normal text-slate-400 block">vs Median (~122)</span></th>
                            <th className="px-4 py-3">Interpretation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.map((row) => (
                            <tr key={row.z} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-center font-bold text-slate-700 bg-slate-50/30">{row.z}</td>
                                <td className="px-4 py-3 font-mono text-slate-600">{row.raw}</td>
                                <td className="px-4 py-3 font-mono font-medium text-slate-900">{row.stake}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.bg} ${row.color}`}>
                                        {row.mult}
                                    </span>
                                </td>
                                <td className={`px-4 py-3 font-medium ${row.color}`}>
                                    <div className="flex items-center gap-2">
                                        {row.z >= 4 && <ArrowRight size={12} />}
                                        {row.interp}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-3 text-xs text-slate-400 italic">
                * Top 0.001% threshold represents statistically significant outliers (Kill Zone boundary)
            </div>
        </div>
    );
};
