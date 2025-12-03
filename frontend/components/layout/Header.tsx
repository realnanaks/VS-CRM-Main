import React from 'react';
import { Menu, Search, Command, Globe, Bell, ChevronDown, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { User, CountryCode, Country, AppView } from '../../types';
import { cn } from '../../utils/cn';

interface HeaderProps {
    currentUser: User | null;
    selectedCountry: CountryCode;
    countries: Country[];
    onSidebarToggle: () => void;
    onCountryChange: (code: CountryCode) => void;
    onLogout: () => void;
    onViewChange: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, selectedCountry, countries, onSidebarToggle, onCountryChange, onLogout, onViewChange }) => {
    return (
        <header className={cn(
            "flex h-20 items-center justify-between",
            "border-b border-slate-200/60 bg-white/80 backdrop-blur-md",
            "px-6 lg:px-10 z-10 sticky top-0"
        )}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onSidebarToggle}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar - Modern */}
                <div className="hidden md:flex items-center relative group">
                    <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className={cn(
                            "pl-10 pr-4 py-2 w-64",
                            "bg-slate-100 border-transparent rounded-xl text-sm",
                            "focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)] transition-all outline-none"
                        )}
                        style={{ borderColor: 'transparent' }}
                    />
                    <div className="absolute right-3 flex items-center pointer-events-none">
                        <span className="text-xs text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm flex items-center">
                            <Command size={10} className="mr-0.5" /> K
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Country Selector */}
                <div className="hidden lg:flex items-center px-1">
                    <div className="relative">
                        <select
                            className={cn(
                                "appearance-none pl-9 pr-8 py-2",
                                "bg-white border border-slate-200 rounded-xl",
                                "text-sm font-medium text-slate-700",
                                "hover:border-slate-300 focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary-light)]",
                                "outline-none cursor-pointer shadow-sm transition-all"
                            )}
                            value={selectedCountry}
                            onChange={(e) => onCountryChange(e.target.value as CountryCode)}
                        >
                            {countries.filter(c => {
                                if (!currentUser || currentUser.role === 'Super Admin') return true;
                                return currentUser.assignedCountries.includes(c.code);
                            }).map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
                            {countries.find(c => c.code === selectedCountry)?.flag}
                        </div>
                    </div>
                </div>

                <button className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="relative group">
                    <button
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <img
                            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random`}
                            alt="Profile"
                            className="h-9 w-9 rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="hidden md:block text-left mr-1">
                            <div className="text-sm font-medium text-slate-700">{currentUser?.name || 'User'}</div>
                            <div className="text-[10px] text-slate-500 leading-none">{currentUser?.role || 'Member'}</div>
                        </div>
                        <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className={cn(
                        "absolute right-0 mt-2 w-48",
                        "bg-white rounded-xl shadow-lg border border-slate-100 py-1",
                        "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                        "transition-all duration-200 transform origin-top-right z-50"
                    )}>
                        <div className="px-4 py-2 border-b border-slate-50">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Account</p>
                        </div>
                        <button
                            onClick={() => onViewChange('settings')}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                            <SettingsIcon size={16} /> Settings
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <LogOut size={16} /> Log Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
