import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Megaphone, Ticket, CheckSquare } from 'lucide-react';
import { CountryCode } from '../types';
import { retrieveDashboardData, subscribeToStateChanges } from '../services/data';
import { cn } from '../utils/cn';

interface CalendarProps {
  country: CountryCode;
}

export const Calendar: React.FC<CalendarProps> = ({ country }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState(retrieveDashboardData(country));

  useEffect(() => {
    const update = () => setData(retrieveDashboardData(country));
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const campaigns = data.campaigns.filter(c => c.startDate === dateStr).map(c => ({ ...c, type: 'campaign' }));
    const promotions = data.promotions.filter(p => p.startDate === dateStr).map(p => ({ ...p, type: 'promotion' }));
    const tasks = data.tasks.filter(t => t.dueDate === dateStr).map(t => ({ ...t, type: 'task' }));

    return [...campaigns, ...promotions, ...tasks];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Calendar</h1>
          <p className="text-sm text-gray-500">Global overview of all scheduled activities in {country === 'Global' ? 'all regions' : country}.</p>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600"><ChevronLeft size={20} /></button>
          <span className="px-4 font-semibold text-gray-900 w-32 text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[140px] divide-x divide-gray-200 border-b border-gray-200">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50/30" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDay(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <div key={day} className={cn(
                "relative p-2 hover:bg-gray-50 transition-colors group",
                isToday ? "bg-indigo-50/30" : ""
              )}>
                <span className={cn(
                  "absolute top-2 right-2 text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
                  isToday ? "bg-indigo-600 text-white" : "text-gray-400 group-hover:text-gray-900"
                )}>
                  {day}
                </span>
                <div className="mt-6 space-y-1.5 overflow-y-auto max-h-[100px] pr-1 scrollbar-hide">
                  {events.map((event: any) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-[10px] px-1.5 py-1 rounded border truncate flex items-center gap-1.5",
                        event.type === 'campaign' && "bg-purple-50 text-purple-700 border-purple-100",
                        event.type === 'promotion' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                        event.type === 'task' && "bg-amber-50 text-amber-700 border-amber-100"
                      )}
                    >
                      {event.type === 'campaign' && <Megaphone size={10} />}
                      {event.type === 'promotion' && <Ticket size={10} />}
                      {event.type === 'task' && <CheckSquare size={10} />}
                      <span className="font-medium">{event.name || event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};