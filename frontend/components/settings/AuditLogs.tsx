import React from 'react';
import { Search } from 'lucide-react';
import { AuditLog } from '../../types';
import { cn } from '../../utils/cn';

interface AuditLogsProps {
    logs: AuditLog[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
    return (
        <div className={cn(
            "bg-white rounded-xl shadow-sm border border-gray-200",
            "overflow-hidden animate-fade-in"
        )}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className={cn(
                            "pl-10 pr-4 py-2 w-full rounded-lg border-gray-300",
                            "text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                        )}
                    />
                </div>
            </div>
            <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {logs.map(log => (
                    <li key={log.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex space-x-3">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">{log.action}</h3>
                                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                                </div>
                                <p className="text-sm text-gray-500">by <span className="font-medium text-gray-900">{log.user}</span> in <span className="uppercase">{log.country}</span></p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
