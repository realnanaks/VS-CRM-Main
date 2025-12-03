import React, { useState } from 'react';
import { LayoutDashboard, Users, Megaphone, Bot, CheckSquare, Ticket, GitBranch, Calendar as CalendarIcon, Image as ImageIcon, Briefcase, Share2, FormInput, DollarSign, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { AppView, Theme, CountryCode } from '../../types';
import { cn } from '../../utils/cn';
import { useFeatureFlags } from '../../context/FeatureFlagContext';

interface SidebarProps {
    isOpen: boolean;
    activeView: AppView;
    onViewChange: (view: AppView) => void;
    onCloseSidebar: () => void;
    taskCount: number;
    currentTheme: Theme;
    selectedCountry?: CountryCode;
}

// Theme Definitions for Dynamic Style Injection (reused for badge color)
const THEMES: Record<Theme, { primary: string }> = {
    indigo: { primary: '#4f46e5' },
    rose: { primary: '#e11d48' },
    emerald: { primary: '#059669' },
    amber: { primary: '#d97706' },
    violet: { primary: '#7c3aed' },
    sky: { primary: '#0284c7' },
    slate: { primary: '#475569' },
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onViewChange, onCloseSidebar, taskCount, currentTheme, selectedCountry = 'Global' }) => {
    const { isFeatureEnabled } = useFeatureFlags();

    const NavGroup = ({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) => {
        const [isGroupOpen, setIsGroupOpen] = useState(defaultOpen);
        return (
            <div className="mb-2">
                <button
                    onClick={() => setIsGroupOpen(!isGroupOpen)}
                    className={cn(
                        "flex w-full items-center justify-between px-3 py-2",
                        "text-xs font-bold uppercase tracking-wider",
                        "text-slate-500 hover:text-slate-300 transition-colors"
                    )}
                >
                    {label}
                    {isGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {isGroupOpen && <div className="space-y-1 mt-1">{children}</div>}
            </div>
        );
    };

    const NavItem = ({ view, icon: Icon, label, badge, featureFlag }: { view: AppView; icon: any; label: string; badge?: string | number; featureFlag?: string }) => {
        if (featureFlag && !isFeatureEnabled(featureFlag, selectedCountry)) {
            return null;
        }

        const isActive = activeView === view;
        return (
            <button
                onClick={() => {
                    onViewChange(view);
                    onCloseSidebar();
                }}
                className={cn(
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    isActive ? "bg-slate-800 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
                style={isActive ? { boxShadow: `0 10px 15px -3px ${THEMES[currentTheme].primary}33` } : {}}
            >
                <div className="flex items-center gap-3">
                    <Icon
                        size={18}
                        style={{ color: isActive ? 'var(--primary-light)' : undefined }}
                        className={cn(isActive ? '' : 'text-slate-500 group-hover:text-slate-300')}
                    />
                    <span>{label}</span>
                </div>
                {badge ? (
                    <span
                        className="text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        {badge}
                    </span>
                ) : null}
            </button>
        );
    };

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-30 w-72 transform",
            "bg-slate-900 border-r border-slate-800",
            "transition-transform duration-300 ease-out",
            "lg:relative lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex h-full flex-col">
                {/* Logo Area */}
                <div className="flex h-20 items-center px-6 border-b border-slate-800/50">
                    <div className="mr-3">
                        <img src="/logo.png" alt="EchoHouse Logo" className="h-10 w-auto object-contain" />
                    </div>
                    <div>
                        <span className="block text-lg font-bold text-white tracking-tight">Visionary Space</span>
                        <span className="block text-xs text-slate-500 font-medium">EchoHouse Edition</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-hide">
                    <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" featureFlag="feature_dashboard" />
                    <NavItem view="beta_dashboard" icon={Bot} label="Beta Dashboard" featureFlag="ff_beta_dashboard" />

                    <NavGroup label="Workspace" defaultOpen={true}>
                        <NavItem view="projects" icon={Briefcase} label="Projects" featureFlag="feature_projects" />
                        <NavItem view="tasks" icon={CheckSquare} label="My Tasks" badge={taskCount > 0 ? taskCount : undefined} featureFlag="feature_tasks" />
                        <NavItem view="calendar" icon={CalendarIcon} label="Calendar" featureFlag="feature_calendar" />
                    </NavGroup>

                    <NavGroup label="Marketing & Growth" defaultOpen={true}>
                        <NavItem view="campaigns" icon={Megaphone} label="Campaigns" featureFlag="feature_campaigns" />
                        <NavItem view="social" icon={Share2} label="Social Suite" featureFlag="feature_social" />
                        <NavItem view="events" icon={MapPin} label="Events" featureFlag="feature_events" />
                        <NavItem view="promotions" icon={Ticket} label="Promotions" featureFlag="feature_promotions" />
                        <NavItem view="forms" icon={FormInput} label="Lead Forms" featureFlag="feature_forms" />
                        <NavItem view="contacts" icon={Users} label="Contacts" featureFlag="feature_contacts" />
                    </NavGroup>

                    <NavGroup label="Sales & Revenue" defaultOpen={true}>
                        <NavItem view="deals" icon={DollarSign} label="Sales Pipeline" featureFlag="feature_deals" />
                        <NavItem view="infographics" icon={ImageIcon} label="Infographics" />
                    </NavGroup>

                    <NavGroup label="Automation & Assets" defaultOpen={true}>
                        <NavItem view="automation" icon={GitBranch} label="Journeys" featureFlag="feature_automation" />
                        <NavItem view="assets" icon={ImageIcon} label="Asset Library" featureFlag="feature_assets" />
                    </NavGroup>

                    <NavGroup label="AI Intelligence" defaultOpen={true}>
                        <NavItem view="advisor" icon={Bot} label="Visionary Space AI" featureFlag="feature_advisor" />
                    </NavGroup>
                </nav>
            </div>
        </aside>
    );
};
