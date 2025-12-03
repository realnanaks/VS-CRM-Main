import React from 'react';
import { Calendar, MapPin, Ticket as TicketIcon, Music, Smartphone, BarChart3 } from 'lucide-react';
import { Event } from '../types';
import { getStatusColor, calculateProgress } from '../utils/eventUtils';
import { cn } from '../utils/cn';

interface EventCardProps {
    event: Event;
    onEdit: (event: Event) => void;
    onPromote: (event: Event) => void;
    onTicket: (event: Event) => void;
    onAnalytics: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onPromote, onTicket, onAnalytics }) => {
    return (
        <div onClick={() => onEdit(event)} className={cn(
            "group overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm",
            "hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        )}>
            <div>
                <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Music size={48} className="text-gray-300 absolute" />
                    <img
                        src={event.banner}
                        alt={event.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <div className="absolute top-4 right-4">
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold shadow-sm",
                            getStatusColor(event.status)
                        )}>
                            {event.status}
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-lg font-bold text-white shadow-black drop-shadow-md">{event.name}</h3>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-500" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-indigo-500" />
                            <span className="truncate max-w-[120px]" title={event.location}>{event.location}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                        {event.description}
                    </p>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                <TicketIcon size={14} />
                                <span>Attendance</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                <span className="font-bold text-gray-900">{event.attendees}</span> / {event.capacity}
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    calculateProgress(event.attendees, event.capacity) >= 90 ? 'bg-red-500' : 'bg-indigo-500'
                                )}
                                style={{ width: `${calculateProgress(event.attendees, event.capacity)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                    {event.country}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPromote(event); }}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                        title="AI Promote / Early Bird"
                    >
                        <Smartphone size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onTicket(event); }}
                        className={cn(
                            "flex items-center gap-1 text-xs font-semibold text-gray-700",
                            "hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200",
                            "px-2 py-1 rounded transition-colors"
                        )}
                    >
                        <TicketIcon size={14} /> Tickets
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAnalytics(event); }}
                        className={cn(
                            "flex items-center gap-1 text-xs font-semibold text-indigo-600",
                            "hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100",
                            "px-2 py-1 rounded transition-colors"
                        )}
                    >
                        <BarChart3 size={14} /> {event.status === 'Completed' ? 'Report' : 'Monitor'}
                    </button>
                </div>
            </div>
        </div>
    );
};
