import { Event } from '../types';

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active': return 'bg-emerald-100 text-emerald-800';
        case 'Scheduled': return 'bg-blue-100 text-blue-800';
        case 'Completed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const calculateProgress = (curr: number, total: number) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((curr / total) * 100));
};
