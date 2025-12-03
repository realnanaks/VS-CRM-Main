import React from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { CountryCode, Country } from '../../types';
import { ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

interface FeatureFlagsSettingsProps {
    countries: Country[];
}

export const FeatureFlagsSettings: React.FC<FeatureFlagsSettingsProps> = ({ countries }) => {
    const { flags, isLoading, error, toggleFlagForCountry } = useFeatureFlags();

    if (isLoading) return <div className="p-4">Loading feature flags...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-blue-500 mt-0.5" size={20} />
                <div>
                    <h3 className="font-medium text-blue-900">Feature Flag Management</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Control feature availability per country. "Global" enables the feature for all countries unless specifically disabled (if supported).
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {flags.map(flag => (
                    <div key={flag.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{flag.name}</h3>
                                <p className="text-sm text-gray-500">{flag.description}</p>
                                <p className="text-xs text-gray-400 mt-1 font-mono">{flag.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${flag.enabledCountries.includes('Global') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {flag.enabledCountries.includes('Global') ? 'Globally Enabled' : 'Restricted'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Country Availability</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                                    <span className="text-sm font-medium">🌍 Global</span>
                                    <button
                                        onClick={() => toggleFlagForCountry(flag.id, 'Global', !flag.enabledCountries.includes('Global'))}
                                        className={`text-2xl focus:outline-none transition-colors ${flag.enabledCountries.includes('Global') ? 'text-green-500' : 'text-gray-300'}`}
                                    >
                                        {flag.enabledCountries.includes('Global') ? <ToggleRight /> : <ToggleLeft />}
                                    </button>
                                </div>
                                {countries.filter(c => c.code !== 'Global').map(country => {
                                    const isEnabled = flag.enabledCountries.includes(country.code) || flag.enabledCountries.includes('Global');
                                    const isExplicitlyEnabled = flag.enabledCountries.includes(country.code);

                                    return (
                                        <div key={country.code} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                                            <span className="text-sm flex items-center gap-2">
                                                <span>{country.flag}</span> {country.name}
                                            </span>
                                            <button
                                                onClick={() => toggleFlagForCountry(flag.id, country.code, !isExplicitlyEnabled)}
                                                disabled={flag.enabledCountries.includes('Global')} // Disable individual toggle if global is on
                                                className={`text-2xl focus:outline-none transition-colors ${isEnabled ? 'text-green-500' : 'text-gray-300'} ${flag.enabledCountries.includes('Global') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={flag.enabledCountries.includes('Global') ? 'Enabled globally' : 'Toggle feature'}
                                            >
                                                {isEnabled ? <ToggleRight /> : <ToggleLeft />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
