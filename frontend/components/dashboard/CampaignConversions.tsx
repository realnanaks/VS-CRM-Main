import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../../types';
import { cn } from '../../utils/cn';

interface CampaignConversionsProps {
    data: ChartData[];
}

export const CampaignConversions: React.FC<CampaignConversionsProps> = ({ data }) => {
    return (
        <div className={cn(
            "rounded-2xl bg-white p-6",
            "shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100"
        )}>
            <h3 className="mb-8 text-lg font-bold text-slate-900">Campaign Conversions</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={24}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Bar dataKey="value" fill="#818cf8" radius={[0, 4, 4, 0]} animationDuration={1500}>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
