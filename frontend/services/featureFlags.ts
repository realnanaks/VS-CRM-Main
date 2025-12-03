import { FeatureFlag } from '../types';

const API_URL = 'http://localhost:3001/api/feature-flags';

export const getFeatureFlags = async (): Promise<FeatureFlag[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch feature flags');
    }
    return response.json();
};

export const updateFeatureFlag = async (flag: FeatureFlag): Promise<FeatureFlag> => {
    const response = await fetch(`${API_URL}/${flag.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flag),
    });
    if (!response.ok) {
        throw new Error('Failed to update feature flag');
    }
    return response.json();
};
