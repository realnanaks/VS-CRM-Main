import React, { useRef, useState } from 'react';
import { Code, Download, Cloud, Check, Upload, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { DataArchitectureInfographic } from '../DataArchitectureInfographic';

interface DataIntegrationsProps {
    isDriveConnected: boolean;
    driveEmail: string | null;
    isZipping: boolean;
    onDownloadSource: () => void;
    onConnectDrive: () => void;
    onExportData: () => void;
    onRestoreDatabase: (file: File) => void;
}

export const DataIntegrations: React.FC<DataIntegrationsProps> = ({
    isDriveConnected,
    driveEmail,
    isZipping,
    onDownloadSource,
    onConnectDrive,
    onExportData,
    onRestoreDatabase
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showArchitecture, setShowArchitecture] = useState(false);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onRestoreDatabase(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Code Export */}
            <div className={cn(
                "bg-gradient-to-r from-slate-900 to-slate-800",
                "rounded-xl shadow-lg border border-slate-700 p-6 text-white"
            )}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center text-[var(--primary-light)]">
                            <Code size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Developer Export</h3>
                            <p className="text-sm text-slate-300 mt-1">Download the full React source code project to push to GitHub.</p>
                        </div>
                    </div>
                    <Button
                        onClick={onDownloadSource}
                        isLoading={isZipping}
                        className="bg-white text-slate-900 hover:bg-slate-100 border-none"
                    >
                        <Download size={16} className="mr-2" /> Download .ZIP
                    </Button>
                </div>
            </div>

            {/* Data Architecture */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Data Architecture</h3>
                                <p className="text-xs text-gray-600">View the complete 4-tier data flow</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setShowArchitecture(!showArchitecture)}
                            variant="secondary"
                        >
                            {showArchitecture ? 'Hide' : 'View'} Architecture
                        </Button>
                    </div>
                </div>
                
                {showArchitecture && (
                    <div className="p-6">
                        <DataArchitectureInfographic />
                    </div>
                )}
                
                {!showArchitecture && (
                    <div className="p-6">
                        <div className="text-center py-8">
                            <div className="text-5xl mb-3">📊</div>
                            <p className="text-gray-600 mb-4">
                                Visualize how data flows from 6 sources through 4 processing tiers to AI insights
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 flex-wrap">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">6 Data Sources</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">4 Tiers</span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">81 Folders</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cloud Integration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Cloud size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Cloud Storage</h3>
                            <p className="text-sm text-gray-500">Connect Google Drive to sync your data backups.</p>
                        </div>
                    </div>
                    <div>
                        {isDriveConnected ? (
                            <div className="flex flex-col items-end">
                                <Button variant="secondary" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100" disabled>
                                    <Check size={16} className="mr-2" /> Connected
                                </Button>
                                {driveEmail && <span className="text-xs text-gray-500 mt-1">{driveEmail}</span>}
                            </div>
                        ) : (
                            <Button onClick={onConnectDrive}>Connect Drive</Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Legacy Migration */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Legacy Data Migration</h3>
                            <p className="text-sm text-indigo-100 mt-1">Import old files with AI-powered classification</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => window.location.hash = 'migration'}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 border-none"
                    >
                        Start Migration →
                    </Button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/10 rounded p-3">
                        <div className="font-semibold">6-Step Wizard</div>
                        <div className="text-xs text-indigo-100">Guided process</div>
                    </div>
                    <div className="bg-white/10 rounded p-3">
                        <div className="font-semibold">AI Classification</div>
                        <div className="text-xs text-indigo-100">Auto-categorize</div>
                    </div>
                    <div className="bg-white/10 rounded p-3">
                        <div className="font-semibold">Data Extraction</div>
                        <div className="text-xs text-indigo-100">Import to CRM</div>
                    </div>
                </div>
            </div>

            {/* Manual Backup */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Data Backup & Restore</h3>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className={cn(
                        "border border-gray-200 rounded-lg p-5",
                        "hover:border-[var(--primary-light)] transition-all"
                    )}>
                        <div className="mb-4 text-[var(--primary)]">
                            <Download size={32} />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Export Data (JSON)</h4>
                        <p className="text-sm text-gray-500 mb-4">Download a full JSON backup of your database (Contacts, Events, Campaigns).</p>
                        <Button onClick={onExportData} variant="secondary" className="w-full justify-center">Download JSON</Button>
                    </div>

                    <div className={cn(
                        "border border-gray-200 rounded-lg p-5",
                        "hover:border-[var(--primary-light)] transition-all"
                    )}>
                        <div className="mb-4 text-emerald-600">
                            <Upload size={32} />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
                        <p className="text-sm text-gray-500 mb-4">Restore your CRM from a previous JSON backup file.</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".json"
                            onChange={handleFileUpload}
                        />
                        <Button onClick={handleImportClick} variant="secondary" className="w-full justify-center">Select File</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
