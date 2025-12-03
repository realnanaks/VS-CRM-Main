import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeatureFlag, CountryCode } from '../types';
import { getFeatureFlags, updateFeatureFlag } from '../services/featureFlags';

interface FeatureFlagContextType {
    flags: FeatureFlag[];
    isLoading: boolean;
    error: string | null;
    isFeatureEnabled: (flagId: string, country: CountryCode) => boolean;
    toggleFlagForCountry: (flagId: string, country: CountryCode, enabled: boolean) => Promise<void>;
    refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFlags = async () => {
        try {
            setIsLoading(true);
            const data = await getFeatureFlags();
            setFlags(data);
            setError(null);
        } catch (err) {
            setError('Failed to load feature flags');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFlags();
    }, []);

    const isFeatureEnabled = (flagId: string, country: CountryCode): boolean => {
        const flag = flags.find(f => f.id === flagId);
        if (!flag) return false;
        return flag.enabledCountries.includes('Global') || flag.enabledCountries.includes(country);
    };

    const toggleFlagForCountry = async (flagId: string, country: CountryCode, enabled: boolean) => {
        const flag = flags.find(f => f.id === flagId);
        if (!flag) return;

        let newEnabledCountries = [...flag.enabledCountries];

        if (enabled) {
            if (!newEnabledCountries.includes(country)) {
                newEnabledCountries.push(country);
            }
        } else {
            newEnabledCountries = newEnabledCountries.filter(c => c !== country);
        }

        // Optimistic update
        const updatedFlag = { ...flag, enabledCountries: newEnabledCountries };
        setFlags(prev => prev.map(f => f.id === flagId ? updatedFlag : f));

        try {
            await updateFeatureFlag(updatedFlag);
        } catch (err) {
            console.error('Failed to update flag', err);
            // Revert on error
            setFlags(prev => prev.map(f => f.id === flagId ? flag : f));
            throw err;
        }
    };

    return (
        <FeatureFlagContext.Provider value={{ flags, isLoading, error, isFeatureEnabled, toggleFlagForCountry, refreshFlags: fetchFlags }}>
            {children}
        </FeatureFlagContext.Provider>
    );
};

export const useFeatureFlags = () => {
    const context = useContext(FeatureFlagContext);
    if (context === undefined) {
        throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
    }
    return context;
};
