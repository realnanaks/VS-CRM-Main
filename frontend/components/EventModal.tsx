import React, { useState, useEffect } from 'react';
import { MapPin, X, Music2, ArrowUp, ArrowDown, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { Event, CountryCode, TicketTier, Performance } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { addEvent, updateEvent, deleteEvent } from '../services/data';
import { cn } from '../utils/cn';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingId: string | null;
    initialData?: Event;
    country: CountryCode;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, editingId, initialData, country }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [status, setStatus] = useState<'Scheduled' | 'Active' | 'Completed'>('Scheduled');
    const [description, setDescription] = useState('');
    const [tiers, setTiers] = useState<Partial<TicketTier>[]>([{ name: 'General Admission', price: 0, capacity: 100 }]);
    const [performances, setPerformances] = useState<Partial<Performance>[]>([]);

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setDate(initialData.date);
            setLocation(initialData.location);
            setAttendees(initialData.attendees);
            setCapacity(initialData.capacity);
            setStatus(initialData.status);
            setDescription(initialData.description);
            setTiers(initialData.ticketTiers || [{ name: 'General Admission', price: 0, capacity: 100 }]);
            setPerformances(initialData.performances || []);
        } else if (isOpen && !editingId) {
            resetForm();
        }
    }, [isOpen, initialData, editingId]);

    const resetForm = () => {
        setName('');
        setDate('');
        setLocation('');
        setAttendees(0);
        setCapacity(0);
        setStatus('Scheduled');
        setDescription('');
        setTiers([{ name: 'General Admission', price: 0, capacity: 100 }]);
        setPerformances([]);
    };

    const handleSave = () => {
        if (!name || !date || !location) return;

        // Filter valid tiers
        const validTiers = tiers.filter(t => t.name && t.capacity).map((t, i) => {
            const existingId = t.id;
            const existingSold = t.sold || 0;

            return {
                id: existingId || `tier-${Date.now()}-${i}`,
                name: t.name!,
                price: Number(t.price) || 0,
                capacity: Number(t.capacity) || 0,
                sold: existingSold
            };
        }) as TicketTier[];

        // Process Performances/Lineup
        const validPerformances = performances.filter(p => p.artistName).map((p, i) => ({
            id: p.id || `perf-${Date.now()}-${i}`,
            artistName: p.artistName!,
            timeSlot: p.timeSlot || 'TBA',
            avgDecibels: p.avgDecibels || 0,
            peakDecibels: p.peakDecibels || 0,
            crowdSizeEstimate: p.crowdSizeEstimate || 0,
            artistImage: p.artistImage
        })) as Performance[];

        const totalCapacity = validTiers.reduce((acc, t) => acc + t.capacity, 0) || capacity;

        if (editingId && initialData) {
            const updatedEvent: Event = {
                ...initialData,
                name,
                date,
                location,
                capacity: totalCapacity,
                status,
                description,
                country: country === 'Global' ? initialData.country : country,
                ticketTiers: validTiers,
                performances: validPerformances
            };
            updateEvent(updatedEvent);
        } else {
            const newEvent: Event = {
                id: Date.now().toString(),
                name,
                date,
                location,
                attendees: 0,
                capacity: totalCapacity,
                status,
                description,
                banner: `https://picsum.photos/800/400?random=${Date.now()}`,
                country: country === 'Global' ? 'US' : country,
                ticketTiers: validTiers,
                performances: validPerformances,
                revenue: 0
            };
            addEvent(newEvent);
        }

        onClose();
        resetForm();
    };

    const handleDeleteEvent = async () => {
        if (editingId && confirm("Are you sure you want to delete this event?")) {
            await deleteEvent(editingId);
            onClose();
            resetForm();
        }
    };

    // --- Tier Logic ---
    const handleAddTier = () => {
        setTiers([...tiers, { name: '', price: 0, capacity: 0 }]);
    };

    const handleRemoveTier = (index: number) => {
        setTiers(tiers.filter((_, i) => i !== index));
    };

    const handleUpdateTier = (index: number, field: keyof TicketTier, value: any) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setTiers(newTiers);
    };

    // --- Lineup Logic ---
    const handleAddArtist = () => {
        setPerformances([...performances, { artistName: '', timeSlot: '' }]);
    };

    const handleRemoveArtist = (index: number) => {
        setPerformances(performances.filter((_, i) => i !== index));
    };

    const handleUpdateArtist = (index: number, field: keyof Performance, value: any) => {
        const newPerfs = [...performances];
        newPerfs[index] = { ...newPerfs[index], [field]: value };
        setPerformances(newPerfs);
    };

    const handleMoveArtist = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === performances.length - 1) return;

        const newPerfs = [...performances];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newPerfs[index];
        newPerfs[index] = newPerfs[targetIndex];
        newPerfs[targetIndex] = temp;
        setPerformances(newPerfs);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editingId ? "Edit Event" : "Create New Event"}>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                {/* Section 1: Basic Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Basic Details</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                            <input
                                className={cn(
                                    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
                                    "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                )}
                                value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Annual Tech Summit"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className={cn(
                                        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
                                        "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    )}
                                    value={date} onChange={e => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className={cn(
                                        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
                                        "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                    )}
                                    value={status} onChange={e => setStatus(e.target.value as any)}
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    className={cn(
                                        "w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm",
                                        "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    )}
                                    value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Virtual or 123 Main St"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className={cn(
                                    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
                                    "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-16 resize-none"
                                )}
                                value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief overview..."
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Ticketing */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket Tiers</label>
                        <button onClick={handleAddTier} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add Tier</button>
                    </div>
                    <div className="space-y-2">
                        {tiers.map((tier, index) => (
                            <div key={index} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                                <input
                                    placeholder="Name (e.g. VIP)"
                                    className={cn(
                                        "flex-1 min-w-0 text-xs border border-gray-200 rounded px-2 py-1",
                                        "outline-none focus:border-indigo-500"
                                    )}
                                    value={tier.name}
                                    onChange={(e) => handleUpdateTier(index, 'name', e.target.value)}
                                />
                                <div className="relative w-20">
                                    <span className="absolute left-2 top-1.5 text-xs text-gray-400">$</span>
                                    <input
                                        type="number"
                                        className={cn(
                                            "w-full text-xs border border-gray-200 rounded pl-4 pr-1 py-1",
                                            "outline-none focus:border-indigo-500"
                                        )}
                                        value={tier.price}
                                        onChange={(e) => handleUpdateTier(index, 'price', e.target.value)}
                                    />
                                </div>
                                <div className="relative w-20">
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        className={cn(
                                            "w-full text-xs border border-gray-200 rounded px-2 py-1",
                                            "outline-none focus:border-indigo-500"
                                        )}
                                        value={tier.capacity}
                                        onChange={(e) => handleUpdateTier(index, 'capacity', e.target.value)}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 w-12 text-center">
                                    {tier.sold || 0} Sold
                                </div>
                                {tiers.length > 1 && (
                                    <button onClick={() => handleRemoveTier(index)} className="text-gray-400 hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-xs text-right text-gray-500 mt-2">
                        Total Capacity: {tiers.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0)}
                    </div>
                </div>

                {/* Section 3: Lineup / Performers */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Music2 size={12} /> Lineup & Schedule
                        </label>
                        <button onClick={handleAddArtist} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add Performer</button>
                    </div>

                    {performances.length === 0 ? (
                        <div className="text-center py-4 bg-white rounded-lg border border-dashed border-gray-200 text-xs text-gray-400 italic">
                            No performers added yet.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {performances.map((perf, index) => (
                                <div key={index} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                                    <div className="flex flex-col gap-0.5">
                                        <button onClick={() => handleMoveArtist(index, 'up')} disabled={index === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30">
                                            <ArrowUp size={10} />
                                        </button>
                                        <button onClick={() => handleMoveArtist(index, 'down')} disabled={index === performances.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30">
                                            <ArrowDown size={10} />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            placeholder="Artist / Performer Name"
                                            className={cn(
                                                "w-full text-xs font-medium border-b border-gray-100 py-1 mb-1",
                                                "outline-none focus:border-indigo-500 bg-transparent"
                                            )}
                                            value={perf.artistName}
                                            onChange={(e) => handleUpdateArtist(index, 'artistName', e.target.value)}
                                        />
                                        <div className="flex items-center gap-1">
                                            <Clock size={10} className="text-gray-400" />
                                            <input
                                                placeholder="Time Slot (e.g. 20:00 - 21:00)"
                                                className="w-full text-[10px] text-gray-500 py-0.5 outline-none bg-transparent"
                                                value={perf.timeSlot}
                                                onChange={(e) => handleUpdateArtist(index, 'timeSlot', e.target.value)}
                                            />
                                        </div>
                                        <input
                                            placeholder="Direct Image Link (e.g. .jpg, .png)"
                                            className={cn(
                                                "w-full text-[10px] text-gray-400 py-0.5 outline-none bg-transparent",
                                                "border-b border-transparent focus:border-gray-100 mb-1"
                                            )}
                                            value={perf.artistImage || ''}
                                            onChange={(e) => handleUpdateArtist(index, 'artistImage', e.target.value)}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`upload-${index}`}
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    const formData = new FormData();
                                                    formData.append('image', file);

                                                    try {
                                                        const res = await fetch('http://localhost:3001/api/upload', {
                                                            method: 'POST',
                                                            body: formData
                                                        });
                                                        const data = await res.json();
                                                        if (data.url) {
                                                            handleUpdateArtist(index, 'artistImage', data.url);
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload failed", err);
                                                        alert("Failed to upload image");
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={`upload-${index}`}
                                                className={cn(
                                                    "cursor-pointer text-[10px] font-bold text-indigo-600 hover:text-indigo-800",
                                                    "bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center gap-1"
                                                )}
                                            >
                                                {perf.artistImage ? 'Change Image' : 'Upload Image'}
                                            </label>
                                            {perf.artistImage && (
                                                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Uploaded
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveArtist(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                    <div>
                        {editingId && (
                            <Button variant="danger" onClick={handleDeleteEvent}>
                                <Trash2 size={16} className="mr-2" /> Delete Event
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>{editingId ? "Update Event" : "Create Event"}</Button>
                    </div>
                </div>
            </div>
        </Modal >
    );
};
