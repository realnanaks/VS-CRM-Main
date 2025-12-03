
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Users, Ticket as TicketIcon, BarChart3, Star, MessageSquare, DollarSign, QrCode, Trash2, Printer, Pencil, Mic, Trophy, Crown, StopCircle, Smartphone, Sparkles, CheckSquare, CheckCircle2, X, Activity, Volume2, RotateCcw, BrainCircuit, Music2, ArrowUp, ArrowDown, Clock, Music } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, CartesianGrid } from 'recharts';
import { Event, CountryCode, TicketTier, Ticket, Prospect, Performance } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addEvent, updateEvent, issueTicket, getEventTickets, subscribeToStateChanges, deleteEvent } from '../services/data';
import { predictEventAttendance } from '../services/gemini';
import { EventCard } from './EventCard';
import { EventModal } from './EventModal';
import { getStatusColor, calculateProgress } from '../utils/eventUtils';
import { cn } from '../utils/cn';

interface EventsProps {
    country: CountryCode;
}

export const Events: React.FC<EventsProps> = ({ country }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Analytics State
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [analyticsTab, setAnalyticsTab] = useState<'overview' | 'live' | 'performances'>('overview');

    // Live Recording State
    const [recordingArtistId, setRecordingArtistId] = useState<string | null>(null);
    const [liveDecibels, setLiveDecibels] = useState<number[]>([]);
    const [recordingSuccess, setRecordingSuccess] = useState<string | null>(null);
    const recordingReadings = React.useRef<number[]>([]);

    // Ticketing State
    const [isTicketingOpen, setIsTicketingOpen] = useState(false);
    const [eventTickets, setEventTickets] = useState<Ticket[]>([]);
    const [purchaseTier, setPurchaseTier] = useState('');
    const [purchaseName, setPurchaseName] = useState('');
    const [purchaseEmail, setPurchaseEmail] = useState('');
    const [activeTicketTab, setActiveTicketTab] = useState<'overview' | 'issue' | 'list'>('overview');

    // Promote / AI Early Bird State
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSendingSMS, setIsSendingSMS] = useState(false);

    // Create/Edit Form State


    useEffect(() => {
        const update = () => {
            const currentEvents = retrieveDashboardData(country).events;
            setEvents(currentEvents);

            if (selectedEvent) {
                const updated = currentEvents.find(e => e.id === selectedEvent.id);
                if (updated) {
                    setSelectedEvent(updated);
                    setEventTickets(getEventTickets(updated.id));
                }
            }
        }
        update();
        return subscribeToStateChanges(update);
    }, [country, selectedEvent?.id]);

    // Live Recording Effect
    useEffect(() => {
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let microphone: MediaStreamAudioSourceNode;
        let stream: MediaStream;
        let intervalId: any;

        const startMicrophone = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);

                analyser.fftSize = 2048;
                microphone.connect(analyser);

                recordingReadings.current = []; // Reset readings
                setLiveDecibels(Array(20).fill(40)); // Reset visual (start at noise floor)

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                intervalId = setInterval(() => {
                    analyser.getByteTimeDomainData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        const x = (dataArray[i] - 128) / 128.0;
                        sum += x * x;
                    }
                    const rms = Math.sqrt(sum / bufferLength);

                    // Calculate dB. 
                    // Map RMS 0.001 (-60dB) to 40dB SPL (Quiet room)
                    // Map RMS 1.0 (0dB) to 110dB SPL (Loud concert)
                    const dbFS = 20 * Math.log10(rms || 0.000001);
                    const dbSPL = Math.max(40, Math.min(130, Math.round(110 + dbFS)));

                    recordingReadings.current.push(dbSPL);
                    setLiveDecibels(prev => {
                        const next = [...prev.slice(1), dbSPL];
                        return next;
                    });
                }, 100); // Update every 100ms

            } catch (err) {
                console.error("Microphone access denied:", err);
                alert("Please allow microphone access to measure real crowd noise!");
                setRecordingArtistId(null);
            }
        };

        if (recordingArtistId) {
            startMicrophone();
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (audioContext) audioContext.close();
        };
    }, [recordingArtistId]);

    // ... (handleSave, resetForm, etc.)
    const handleEditClick = (event: Event) => {
        setEditingId(event.id);
        setIsModalOpen(true);
    };

    const handleOpenAnalytics = (event: Event) => {
        setSelectedEvent(event);
        // Default tab based on status
        if (event.status === 'Completed') {
            setAnalyticsTab('performances');
        } else {
            setAnalyticsTab('live');
        }
        setIsAnalyticsOpen(true);
    };

    const handleOpenTicketing = (event: Event) => {
        setSelectedEvent(event);
        setEventTickets(getEventTickets(event.id));
        setActiveTicketTab('overview');
        setIsTicketingOpen(true);
    };

    const handleIssueTicket = () => {
        if (!selectedEvent || !purchaseTier || !purchaseName) return;
        issueTicket(selectedEvent.id, purchaseTier, purchaseName, purchaseEmail);
        setEventTickets(getEventTickets(selectedEvent.id));
        setPurchaseName('');
        setPurchaseEmail('');
        alert("Ticket generated successfully!");
    };

    const handleOpenPromote = (event: Event) => {
        setSelectedEvent(event);
        // Load contacts initially
        const contacts = retrieveDashboardData(country).contacts;
        setProspects(contacts.map(c => ({ ...c, selected: false })));
        setIsPromoteModalOpen(true);
    };

    const handleAnalyzeAudience = async () => {
        if (!selectedEvent) return;
        setIsAnalyzing(true);

        const scoredProspects: Prospect[] = [];
        const contacts = retrieveDashboardData(country).contacts;

        // Analyze top 5 for demo to save time/quota, mock the rest
        for (let i = 0; i < contacts.length; i++) {
            const c = contacts[i];
            if (i < 5) {
                const prediction = await predictEventAttendance(selectedEvent, c);
                scoredProspects.push({ ...c, attendanceScore: prediction.score, attendanceReason: prediction.reasoning, selected: prediction.score > 70 });
            } else {
                // Mock logic for the rest
                const mockScore = c.status === 'Customer' ? 80 : 40;
                scoredProspects.push({ ...c, attendanceScore: mockScore, attendanceReason: 'Historical engagement pattern.', selected: mockScore > 70 });
            }
        }

        setProspects(scoredProspects.sort((a, b) => (b.attendanceScore || 0) - (a.attendanceScore || 0)));
        setIsAnalyzing(false);
    };

    const handleToggleProspect = (id: string) => {
        setProspects(prospects.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    };

    const handleSendSMS = () => {
        const selectedCount = prospects.filter(p => p.selected).length;
        if (selectedCount === 0) return;

        setIsSendingSMS(true);
        setTimeout(() => {
            setIsSendingSMS(false);
            setIsPromoteModalOpen(false);
            alert(`Early Bird SMS sent to ${selectedCount} prospects!`);
        }, 1500);
    };

    const handleSimulateRecording = (artistId: string) => {
        if (recordingArtistId === artistId) {
            // STOP RECORDING
            setRecordingArtistId(null);

            if (selectedEvent && selectedEvent.performances) {
                // Calculate stats from actual captured readings
                const readings = recordingReadings.current;
                const avg = readings.length > 0
                    ? Math.round(readings.reduce((a, b) => a + b, 0) / readings.length)
                    : 105 + Math.floor(Math.random() * 10); // Fallback if too short
                const peak = readings.length > 0
                    ? Math.round(Math.max(...readings))
                    : 120 + Math.floor(Math.random() * 5); // Fallback

                const updatedPerformances = selectedEvent.performances.map(p => {
                    if (p.id === artistId) {
                        return {
                            ...p,
                            avgDecibels: avg,
                            peakDecibels: peak,
                            crowdSizeEstimate: selectedEvent.attendees
                        };
                    }
                    return p;
                });

                const updatedEvent = { ...selectedEvent, performances: updatedPerformances };

                // Update Backend
                updateEvent(updatedEvent);

                // Update Local State Immediately
                setSelectedEvent(updatedEvent);
                setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));

                // Trigger success UX
                const artist = selectedEvent.performances.find(p => p.id === artistId);
                setRecordingSuccess(artist?.artistName || 'Artist');
                setTimeout(() => setRecordingSuccess(null), 3000);
            }
        } else {
            // START RECORDING
            setRecordingArtistId(artistId);
        }
    };



    const getSentimentData = (event: Event) => {
        if (!event.feedback) return [];
        const counts: Record<string, number> = { Positive: 0, Neutral: 0, Negative: 0 };
        event.feedback.forEach(f => {
            if (f.sentiment in counts) counts[f.sentiment]++;
        });
        return [
            { name: 'Positive', value: counts.Positive, color: '#10b981' },
            { name: 'Neutral', value: counts.Neutral, color: '#f59e0b' },
            { name: 'Negative', value: counts.Negative, color: '#ef4444' }
        ];
    };

    const getTierSalesData = (event: Event) => {
        if (!event.ticketTiers) return [];
        return event.ticketTiers.map(t => ({
            name: t.name,
            Sold: t.sold,
            Available: t.capacity - t.sold,
            Revenue: t.sold * t.price
        }));
    };

    const getNoiseData = (event: Event) => {
        if (!event.performances) return [];
        return event.performances.map(p => ({
            name: p.artistName,
            decibels: p.avgDecibels,
            peak: p.peakDecibels
        }));
    };

    const getLoudestArtist = (event: Event) => {
        if (!event.performances || event.performances.length === 0) return null;
        const hasData = event.performances.some(p => p.avgDecibels > 0);
        if (!hasData) return null;
        return event.performances.reduce((prev, current) => (prev.avgDecibels > current.avgDecibels) ? prev : current);
    };



    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Events {country !== 'Global' && `(${country})`}</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage physical and virtual events, ticketing, and analytics.</p>
                </div>
                <Button onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
                    <Plus size={16} className="mr-2" />
                    Create Event
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onEdit={handleEditClick}
                        onPromote={handleOpenPromote}
                        onTicket={handleOpenTicketing}
                        onAnalytics={handleOpenAnalytics}
                    />
                ))}
            </div>

            {/* Create/Edit Event Modal */}
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingId={editingId}
                initialData={editingId ? events.find(e => e.id === editingId) : undefined}
                country={country}
            />

            {/* Analytics / Live Monitor Modal */}
            < Modal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} title="Event Analytics Center" >
                {selectedEvent && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider", getStatusColor(selectedEvent.status))}>{selectedEvent.status}</span>
                                    <span>•</span>
                                    <MapPin size={12} /> {selectedEvent.location}
                                </p>
                            </div>
                            {/* Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setAnalyticsTab('overview')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                        analyticsTab === 'overview' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    )}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setAnalyticsTab('live')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1",
                                        analyticsTab === 'live' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    )}
                                >
                                    <Activity size={12} className={analyticsTab === 'live' ? "animate-pulse" : ""} /> Live Stage
                                </button>
                                <button
                                    onClick={() => setAnalyticsTab('performances')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                        analyticsTab === 'performances' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    )}
                                >
                                    Performances
                                </button>
                            </div>
                        </div>

                        {/* --- TAB: OVERVIEW --- */}
                        {analyticsTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                        <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                                        <div className="text-2xl font-bold text-gray-900">${(selectedEvent.revenue || 0).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">Tickets Sold</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {selectedEvent.ticketTiers?.reduce((acc, t) => acc + t.sold, 0) || 0}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Occupancy</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {calculateProgress(selectedEvent.attendees, selectedEvent.capacity)}%
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                        <div className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">Avg Rating</div>
                                        <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                                            {selectedEvent.averageRating || '-'} <Star size={16} fill="currentColor" className="text-amber-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Sales by Tier */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <TicketIcon size={16} className="text-indigo-600" /> Ticket Sales by Tier
                                        </h4>
                                        <div className="h-60">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={getTierSalesData(selectedEvent)} layout="vertical" margin={{ left: 40 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="Sold" stackId="a" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                                                    <Bar dataKey="Available" stackId="a" fill="#e5e7eb" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Revenue Share */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <DollarSign size={16} className="text-emerald-600" /> Revenue Breakdown
                                        </h4>
                                        <div className="h-60">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={getTierSalesData(selectedEvent)}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                                    <YAxis tick={{ fontSize: 11 }} />
                                                    <Tooltip formatter={(value) => `$${value}`} />
                                                    <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback & Sentiment */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-900 mb-4">Sentiment Analysis</h4>
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={getSentimentData(selectedEvent)}
                                                        cx="50%" cy="50%"
                                                        innerRadius={40} outerRadius={60}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {getSentimentData(selectedEvent).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-900 mb-4">Recent Feedback</h4>
                                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                            {selectedEvent.feedback?.map(f => (
                                                <div key={f.id} className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-semibold text-gray-900">{f.attendeeName}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star size={12} className="text-amber-500" fill="currentColor" />
                                                            <span className="font-bold">{f.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600">{f.comment}</p>
                                                </div>
                                            ))}
                                            {(!selectedEvent.feedback || selectedEvent.feedback.length === 0) && (
                                                <div className="text-center text-gray-400 py-8 text-sm italic">
                                                    No feedback collected yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- TAB: LIVE MONITOR --- */}
                        {analyticsTab === 'live' && selectedEvent && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center justify-between bg-gray-900 text-white p-6 rounded-xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Current Status</h4>
                                        <div className="text-3xl font-bold flex items-center gap-3">
                                            {recordingArtistId ? (
                                                <>
                                                    <span className="relative flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                                    </span>
                                                    Live Recording
                                                </>
                                            ) : (
                                                <>
                                                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                                                    Standby
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Audio Visualizer Simulation */}
                                    <div className="flex items-end gap-1 h-16 relative z-10">
                                        {liveDecibels.map((db, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-2 rounded-t transition-all duration-75",
                                                    db > 105 ? 'bg-red-500' : db > 95 ? 'bg-amber-400' : 'bg-emerald-400'
                                                )}
                                                style={{ height: `${Math.max(10, (db - 60) * 1.5)}%` }}
                                            ></div>
                                        ))}
                                    </div>

                                    {/* Success Overlay */}
                                    {recordingSuccess && (
                                        <div className="absolute inset-0 bg-emerald-600 z-20 flex items-center justify-center animate-fade-in">
                                            <div className="text-center">
                                                <CheckCircle2 size={48} className="mx-auto mb-2 text-white" />
                                                <h3 className="text-xl font-bold text-white">Performance Captured!</h3>
                                                <p className="text-emerald-100">Data saved for {recordingSuccess}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                        <h4 className="font-bold text-gray-800">Stage Lineup</h4>
                                        <span className="text-xs text-gray-500">Real-time decibel tracking</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {selectedEvent.performances?.map(p => {
                                            const isRecording = recordingArtistId === p.id;
                                            const hasData = p.avgDecibels > 0; // Check if data exists

                                            return (
                                                <div key={p.id} className={cn(
                                                    "p-4 flex items-center justify-between transition-colors",
                                                    isRecording ? 'bg-indigo-50/50' : 'hover:bg-gray-50'
                                                )}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm",
                                                            isRecording ? 'bg-red-500 animate-pulse' : hasData ? 'bg-emerald-500' : 'bg-gray-300'
                                                        )}>
                                                            {isRecording ? <Mic size={20} /> : hasData ? <CheckCircle2 size={20} /> : <Users size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{p.artistName}</div>
                                                            <div className="text-xs text-gray-500">{p.timeSlot}</div>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="flex-1 flex justify-center">
                                                        {isRecording ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse border border-red-200">
                                                                <Activity size={12} /> LIVE 🔴
                                                            </span>
                                                        ) : hasData ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                                <CheckCircle2 size={12} /> Captured
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold border border-gray-200">
                                                                Upcoming
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        {(hasData || isRecording) && (
                                                            <div className="text-right">
                                                                <div className="text-xs text-gray-400 font-medium uppercase">Peak dB</div>
                                                                <div className={cn(
                                                                    "font-mono font-bold",
                                                                    isRecording ? 'text-red-600' : 'text-gray-900'
                                                                )}>
                                                                    {isRecording ? Math.floor(liveDecibels[liveDecibels.length - 1]) : p.peakDecibels} dB
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="w-28 flex justify-end">
                                                            {isRecording ? (
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => handleSimulateRecording(p.id)}
                                                                    className="shadow-red-200 shadow-lg"
                                                                >
                                                                    <StopCircle size={16} className="mr-2" /> Stop Set
                                                                </Button>
                                                            ) : hasData ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                                                        {p.avgDecibels} dB Avg
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleSimulateRecording(p.id)}
                                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                        title="Retake Recording"
                                                                    >
                                                                        <RotateCcw size={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleSimulateRecording(p.id)}
                                                                    className="bg-gray-900 hover:bg-black border-gray-800"
                                                                >
                                                                    <Mic size={16} className="mr-2" /> Start Set
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- TAB: PERFORMANCES (COMPLETED) --- */}
                        {analyticsTab === 'performances' && selectedEvent && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Winner Card */}
                                {getLoudestArtist(selectedEvent) && (
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2 text-indigo-100 text-sm font-bold uppercase tracking-wider">
                                                <Crown size={16} className="text-yellow-400" /> Crowd Favorite
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-3xl font-bold mb-1">{getLoudestArtist(selectedEvent)?.artistName}</h3>
                                                    <div className="text-indigo-100 mb-4">Generated the highest crowd energy response</div>

                                                    <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                                                        <div>
                                                            <div className="text-xs text-indigo-200">Peak Noise</div>
                                                            <div className="font-bold text-xl">{getLoudestArtist(selectedEvent)?.peakDecibels} dB</div>
                                                        </div>
                                                        <div className="w-px h-8 bg-white/20"></div>
                                                        <div>
                                                            <div className="text-xs text-indigo-200">Avg Noise</div>
                                                            <div className="font-bold text-xl">{getLoudestArtist(selectedEvent)?.avgDecibels} dB</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {getLoudestArtist(selectedEvent)?.artistImage && (
                                                    <div className="mr-4">
                                                        <img
                                                            src={getLoudestArtist(selectedEvent)?.artistImage}
                                                            alt="Winner"
                                                            className="h-56 w-56 rounded-full object-cover border-4 border-white/20 shadow-lg bg-gray-800"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Comparison Chart */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Activity size={16} className="text-indigo-600" /> Noise Level Comparison
                                    </h4>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={getNoiseData(selectedEvent)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                                <YAxis domain={[0, 130]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                                <Legend />
                                                <Bar dataKey="decibels" name="Avg dB" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="peak" name="Peak dB" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button variant="secondary" onClick={() => setIsAnalyticsOpen(false)}>Close Report</Button>
                        </div>
                    </div>
                )}
            </Modal >

            {/* Ticket Management Modal */}
            < Modal isOpen={isTicketingOpen} onClose={() => setIsTicketingOpen(false)} title="Event Ticketing" >
                {selectedEvent && (
                    <div className="space-y-6">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 flex space-x-6">
                            <button
                                onClick={() => setActiveTicketTab('overview')}
                                className={cn(
                                    "pb-2 text-sm font-medium border-b-2 transition-colors",
                                    activeTicketTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                )}
                            >
                                Sales Overview
                            </button>
                            <button
                                onClick={() => setActiveTicketTab('issue')}
                                className={cn(
                                    "pb-2 text-sm font-medium border-b-2 transition-colors",
                                    activeTicketTab === 'issue' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                )}
                            >
                                Issue Ticket
                            </button>
                            <button
                                onClick={() => setActiveTicketTab('list')}
                                className={cn(
                                    "pb-2 text-sm font-medium border-b-2 transition-colors",
                                    activeTicketTab === 'list' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                )}
                            >
                                Ticket List
                            </button>
                        </div>

                        {activeTicketTab === 'overview' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-gray-900">Tier Breakdown</h4>
                                        <span className="text-sm text-gray-500">Total Revenue: <span className="text-gray-900 font-bold">${selectedEvent.revenue?.toLocaleString()}</span></span>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedEvent.ticketTiers?.map(tier => (
                                            <div key={tier.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-sm">{tier.name}</span>
                                                    <span className="text-xs font-bold text-gray-900">${tier.price}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${calculateProgress(tier.sold, tier.capacity)}%` }}></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>{tier.sold} sold</span>
                                                    <span>{tier.capacity} available</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTicketTab === 'issue' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Tier</label>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                            value={purchaseTier}
                                            onChange={(e) => setPurchaseTier(e.target.value)}
                                        >
                                            <option value="">Select Tier</option>
                                            {selectedEvent.ticketTiers?.map(t => (
                                                <option key={t.id} value={t.id} disabled={t.sold >= t.capacity}>
                                                    {t.name} - ${t.price} {t.sold >= t.capacity ? '(Sold Out)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Attendee Name</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                            value={purchaseName} onChange={e => setPurchaseName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Attendee Email</label>
                                        <input
                                            type="email"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                            value={purchaseEmail} onChange={e => setPurchaseEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleIssueTicket} disabled={!purchaseTier || !purchaseName}>
                                        <Printer size={16} className="mr-2" /> Generate Ticket
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTicketTab === 'list' && (
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 animate-fade-in">
                                {eventTickets.map(ticket => {
                                    const tier = selectedEvent.ticketTiers?.find(t => t.id === ticket.tierId);
                                    return (
                                        <div key={ticket.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded text-gray-400">
                                                    <QrCode size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{ticket.attendeeName}</div>
                                                    <div className="text-xs text-gray-500">{tier?.name} • <span className="font-mono">{ticket.id.slice(-6).toUpperCase()}</span></div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Paid</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{new Date(ticket.purchaseDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {eventTickets.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 text-sm">No tickets issued yet.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal >

            {/* AI Promote Modal */}
            < Modal isOpen={isPromoteModalOpen} onClose={() => setIsPromoteModalOpen(false)} title="AI Smart Promotion" >
                <div className="space-y-6">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-4">
                        <div className="bg-indigo-600 text-white p-3 rounded-full h-12 w-12 flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Target Early Birds</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Use AI to analyze your contacts and identify those most likely to attend
                                <span className="font-semibold text-indigo-700"> {selectedEvent?.name}</span>.
                            </p>
                        </div>
                    </div>

                    {!isAnalyzing && prospects.every(p => !p.attendanceScore) && (
                        <div className="flex justify-center py-8">
                            <Button size="lg" onClick={handleAnalyzeAudience} className="shadow-xl shadow-indigo-100">
                                <BrainCircuit size={20} className="mr-2" /> Analyze Audience Fit
                            </Button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500 font-medium"> analyzing engagement patterns...</p>
                        </div>
                    )}

                    {!isAnalyzing && prospects.some(p => p.attendanceScore) && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-end">
                                <h4 className="font-bold text-gray-900">High Potential Leads</h4>
                                <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">
                                    {prospects.filter(p => p.selected).length} selected
                                </span>
                            </div>

                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
                                {prospects.map(p => (
                                    <div key={p.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleToggleProspect(p.id)} className={cn(
                                                "text-gray-300 hover:text-indigo-600",
                                                p.selected && "text-indigo-600"
                                            )}>
                                                {p.selected ? <CheckSquare size={20} /> : <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>}
                                            </button>
                                            <div>
                                                <div className="font-medium text-sm text-gray-900">{p.name}</div>
                                                <div className="text-xs text-gray-500">{p.company} • {p.country}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn(
                                                "text-sm font-bold",
                                                p.attendanceScore! > 70 ? 'text-emerald-600' : p.attendanceScore! > 40 ? 'text-amber-600' : 'text-gray-400'
                                            )}>
                                                {p.attendanceScore}% Match
                                            </div>
                                            <div className="text-[10px] text-gray-400 max-w-[120px] truncate" title={p.attendanceReason}>
                                                {p.attendanceReason}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SMS Preview</h4>
                                <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-600 shadow-sm relative">
                                    <p>Hi [Name], exclusive early access for {selectedEvent?.name} is here! 🎟️ Get your VIP tickets before they sell out: visionary.com/e/{selectedEvent?.id?.slice(0, 4)}</p>
                                    <div className="absolute -right-1 -top-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="secondary" onClick={() => setIsPromoteModalOpen(false)}>Cancel</Button>
                                <Button
                                    onClick={handleSendSMS}
                                    disabled={prospects.filter(p => p.selected).length === 0 || isSendingSMS}
                                    isLoading={isSendingSMS}
                                >
                                    <MessageSquare size={16} className="mr-2" /> Send SMS Blast
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal >
        </div >
    );
};
