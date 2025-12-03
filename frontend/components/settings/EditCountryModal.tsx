import React from 'react';
import { Button } from '../ui/Button';
import { CountrySelect } from '../ui/CountrySelect';
import { cn } from '../../utils/cn';

interface EditCountryModalProps {
    country: { originalCode: string; code: string; name: string; flag: string };
    onClose: () => void;
    onSave: () => void;
    onUpdateCountry: (country: { originalCode: string; code: string; name: string; flag: string }) => void;
}

export const EditCountryModal: React.FC<EditCountryModalProps> = ({ country, onClose, onSave, onUpdateCountry }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={cn(
                "bg-white rounded-xl shadow-2xl p-6",
                "w-full max-w-md animate-fade-in"
            )}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Country</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                        <CountrySelect
                            value={country.name}
                            onChange={(selected) => {
                                onUpdateCountry({ ...country, name: selected.name, code: selected.code, flag: selected.flag });
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Code (ISO)</label>
                        <input
                            type="text"
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "bg-gray-50 text-gray-500 cursor-not-allowed"
                            )}
                            value={country.code}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Flag Emoji</label>
                        <input
                            type="text"
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "bg-gray-50 text-gray-500 cursor-not-allowed"
                            )}
                            value={country.flag}
                            readOnly
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={onSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};
