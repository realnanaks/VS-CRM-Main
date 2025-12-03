import React, { useState, useEffect } from 'react';
import { Shield, Clock, Database, Palette, Globe, ToggleLeft } from 'lucide-react';
import { CountryCode, User, AuditLog, Theme } from '../types';
import { retrieveDashboardData, subscribeToStateChanges, getFullDatabase, restoreDatabase, updateTheme, getAllUsers, updateUser, addUser, COUNTRIES, addCountry, deleteCountry, updateCountry } from '../services/data';
import { downloadSourceCode } from '../services/export';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { TeamManagement } from './settings/TeamManagement';
import { CountrySettings } from './settings/CountrySettings';
import { AuditLogs } from './settings/AuditLogs';
import { DataIntegrations } from './settings/DataIntegrations';
import { FeatureFlagsSettings } from './settings/FeatureFlagsSettings';
import { cn } from '../utils/cn';

interface SettingsProps {
    country: CountryCode;
    currentUser: User | null;
}

export const Settings: React.FC<SettingsProps> = ({ country, currentUser }) => {
    const [currentTab, setCurrentTab] = useState<'team' | 'logs' | 'data' | 'appearance' | 'countries' | 'features'>(() => {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/');
        if (parts[0] === 'settings' && parts[1]) {
            const tab = parts[1];
            if (['team', 'logs', 'data', 'appearance', 'countries', 'features'].includes(tab)) {
                return tab as any;
            }
        }
        return 'appearance';
    });

    useEffect(() => {
        window.location.hash = `settings/${currentTab}`;
    }, [currentTab]);

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentTheme, setCurrentTheme] = useState<Theme>('indigo');
    const [isDriveConnected, setIsDriveConnected] = useState(false);
    const [driveEmail, setDriveEmail] = useState<string | null>(null);
    const [isZipping, setIsZipping] = useState(false);
    const [countries, setCountries] = useState(COUNTRIES);

    useEffect(() => {
        const update = () => {
            const data = retrieveDashboardData(country);
            setLogs(data.logs);
            setCurrentTheme(data.theme);
            setUsers(getAllUsers());
            setCountries(data.countries);
        };
        update();
        return subscribeToStateChanges(update);
    }, [country]);

    const onThemeSelect = (theme: Theme) => {
        updateTheme(theme);
    };

    const exportDatabaseToJSON = () => {
        const data = getFullDatabase();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visionary_crm_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const onDownloadSource = () => {
        downloadSourceCode(setIsZipping);
    };

    const onRestoreDatabase = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) {
                const success = restoreDatabase(text);
                if (success) {
                    alert("Database restored successfully! The application will now reload.");
                    window.location.reload();
                } else {
                    alert("Failed to restore database. Invalid file format.");
                }
            }
        };
        reader.readAsText(file);
    };

    const checkDriveStatus = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/drive/status');
            const data = await res.json();
            setIsDriveConnected(data.connected);
            setDriveEmail(data.email);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        checkDriveStatus();
    }, []);

    const onConnectDrive = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/drive/connect', { method: 'POST' });
            const data = await res.json();
            if (data.connected) {
                setIsDriveConnected(true);
                setDriveEmail(data.email);
                alert(`Successfully connected to Google Drive as ${data.email}`);
            } else {
                alert("Failed to connect. Please check server logs.");
            }
        } catch (e) {
            console.error(e);
            alert("Error connecting to server.");
        }
    };

    const onUpdateUser = async (user: User) => {
        await updateUser(user);
        setUsers(getAllUsers());
    };

    const onInviteUser = async (user: Partial<User>) => {
        if (user.name && user.email && user.role) {
            await addUser({
                name: user.name,
                email: user.email,
                role: user.role as any,
                assignedCountries: user.assignedCountries || []
            });
            setUsers([...getAllUsers()]);
        }
    };

    const onAddCountry = async (countryData: { code: string; name: string; flag: string }) => {
        await addCountry(countryData);
        // Force re-render or data update
        const data = retrieveDashboardData(country);
        setLogs(data.logs); // Trigger update
    };

    const onUpdateCountry = async (originalCode: string, countryData: { code: string; name: string; flag: string }) => {
        await updateCountry(originalCode, countryData);
        const data = retrieveDashboardData(country);
        setLogs(data.logs);
    };

    const onDeleteCountry = async (code: string) => {
        if (confirm(`Are you sure you want to delete ${code}? This might affect existing data.`)) {
            await deleteCountry(code);
            const data = retrieveDashboardData(country);
            setLogs(data.logs);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <div className="border-b border-gray-200">
                <div className="flex space-x-8 overflow-x-auto">
                    <button
                        onClick={() => setCurrentTab('appearance')}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap",
                            currentTab === 'appearance' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                    >
                        <Palette size={18} /> Appearance
                    </button>
                    <button
                        onClick={() => setCurrentTab('team')}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap",
                            currentTab === 'team' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                        style={{ display: (!currentUser || currentUser.role === 'Employee') ? 'none' : 'flex' }}
                    >
                        <Shield size={18} /> Team Management
                    </button>
                    <button
                        onClick={() => setCurrentTab('countries')}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap",
                            currentTab === 'countries' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                    >
                        <Globe size={18} /> Countries
                    </button>
                    <button
                        onClick={() => setCurrentTab('logs')}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap",
                            currentTab === 'logs' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                    >
                        <Clock size={18} /> Audit Logs
                    </button>
                    <button
                        onClick={() => setCurrentTab('data')}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap",
                            currentTab === 'data' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                    >
                        <Database size={18} /> Data & Integrations
                    </button>
                    <button
                        onClick={() => setCurrentTab('features')}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap",
                            currentTab === 'features' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                    >
                        <ToggleLeft size={18} /> Feature Flags
                    </button>
                </div>
            </div>

            {currentTab === 'appearance' && (
                <AppearanceSettings
                    currentTheme={currentTheme}
                    onThemeChange={onThemeSelect}
                />
            )}

            {currentTab === 'team' && (
                <TeamManagement
                    users={users}
                    currentUser={currentUser}
                    countries={countries}
                    onUpdateUser={onUpdateUser}
                    onInviteUser={onInviteUser}
                />
            )}

            {currentTab === 'countries' && (
                <CountrySettings
                    countries={countries}
                    onAddCountry={onAddCountry}
                    onUpdateCountry={onUpdateCountry}
                    onDeleteCountry={onDeleteCountry}
                />
            )}

            {currentTab === 'logs' && (
                <AuditLogs logs={logs} />
            )}

            {currentTab === 'data' && (
                <DataIntegrations
                    isDriveConnected={isDriveConnected}
                    driveEmail={driveEmail}
                    isZipping={isZipping}
                    onDownloadSource={onDownloadSource}
                    onConnectDrive={onConnectDrive}
                    onExportData={exportDatabaseToJSON}
                    onRestoreDatabase={onRestoreDatabase}
                />
            )}

            {currentTab === 'features' && (
                <FeatureFlagsSettings countries={countries} />
            )}
        </div>
    );
};
