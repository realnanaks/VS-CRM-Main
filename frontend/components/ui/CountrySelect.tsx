import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { ALL_COUNTRIES } from '../../data/allCountries';
import { cn } from '../../utils/cn';

interface CountrySelectProps {
    value: string; // Country name
    onChange: (country: { name: string; code: string; flag: string }) => void;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = ALL_COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCountry = ALL_COUNTRIES.find(c => c.name === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full p-2 border border-gray-300 rounded-lg",
                    "focus:ring-2 focus:ring-[var(--primary)] outline-none",
                    "bg-white text-left flex items-center justify-between"
                )}
            >
                <span className={selectedCountry ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Select a country...'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute z-10 w-full mt-1 bg-white border border-gray-200",
                    "rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col"
                )}>
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className={cn(
                                    "w-full pl-8 pr-2 py-1.5 text-sm bg-gray-50 border border-gray-200",
                                    "rounded-md focus:outline-none focus:border-[var(--primary)]"
                                )}
                                placeholder="Search country..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredCountries.length === 0 ? (
                            <div className="p-3 text-sm text-gray-500 text-center">No countries found</div>
                        ) : (
                            filteredCountries.map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                        onChange(c);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={cn(
                                        "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                                        "flex items-center justify-between",
                                        c.name === value ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-gray-700"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">{c.flag}</span>
                                        <span>{c.name}</span>
                                    </span>
                                    {c.name === value && <Check size={14} />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
