import React from 'react';
import { Check } from 'lucide-react';
import { Theme } from '../../types';
import { cn } from '../../utils/cn';

interface AppearanceSettingsProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ currentTheme, onThemeChange }) => {
    const themes: { id: Theme; name: string; color: string }[] = [
        { id: 'indigo', name: 'Visionary Indigo (Default)', color: '#4f46e5' },
        { id: 'rose', name: 'Coral Rose', color: '#e11d48' },
        { id: 'emerald', name: 'Success Emerald', color: '#059669' },
        { id: 'amber', name: 'Warm Amber', color: '#d97706' },
        { id: 'violet', name: 'Royal Violet', color: '#7c3aed' },
        { id: 'sky', name: 'Sky Blue', color: '#0284c7' },
        { id: 'slate', name: 'Minimal Slate', color: '#475569' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Theme & Brand Color</h3>
            <p className="text-sm text-gray-500 mb-6">Customize the look and feel of your Visionary Space workspace.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border transition-all",
                            currentTheme === theme.id
                                ? "border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]"
                                : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <div className="h-10 w-10 rounded-full shadow-sm flex items-center justify-center shrink-0" style={{ backgroundColor: theme.color }}>
                            {currentTheme === theme.id && <Check size={20} className="text-white" />}
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">{theme.name}</div>
                            <div className="text-xs text-gray-500">Primary Color</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
