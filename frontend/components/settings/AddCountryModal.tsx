import React from 'react';
import { Button } from '../ui/Button';
import { CountrySelect } from '../ui/CountrySelect';
import { cn } from '../../utils/cn';

interface AddCountryModalProps {
    newCountry: { code: string; name: string; flag: string };
    onClose: () => void;
    onAdd: () => void;
    onUpdateNewCountry: (country: { code: string; name: string; flag: string }) => void;
}

export const AddCountryModal: React.FC<AddCountryModalProps> = ({ newCountry, onClose, onAdd, onUpdateNewCountry }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={cn(
                "bg-white rounded-xl shadow-2xl p-6",
                "w-full max-w-md animate-fade-in"
            )}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Country</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                        <CountrySelect
                            value={newCountry.name}
                            onChange={(selected) => {
                                onUpdateNewCountry({ name: selected.name, code: selected.code, flag: selected.flag });
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
                            value={newCountry.code}
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
                            value={newCountry.flag}
                            readOnly
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={onAdd} disabled={!newCountry.code || !newCountry.name || !newCountry.flag}>Add Country</Button>
                </div>
            </div>
        </div>
    );
};
