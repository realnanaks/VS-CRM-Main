import React, { useState } from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { Country } from '../../types';
import { AddCountryModal } from './AddCountryModal';
import { EditCountryModal } from './EditCountryModal';
import { cn } from '../../utils/cn';

interface CountrySettingsProps {
    countries: Country[];
    onAddCountry: (country: { code: string; name: string; flag: string }) => Promise<void>;
    onUpdateCountry: (originalCode: string, country: { code: string; name: string; flag: string }) => Promise<void>;
    onDeleteCountry: (code: string) => Promise<void>;
}

export const CountrySettings: React.FC<CountrySettingsProps> = ({ countries, onAddCountry, onUpdateCountry, onDeleteCountry }) => {
    const [isAddingCountry, setIsAddingCountry] = useState(false);
    const [editingCountry, setEditingCountry] = useState<{ originalCode: string; code: string; name: string; flag: string } | null>(null);
    const [newCountry, setNewCountry] = useState({ code: '', name: '', flag: '' });

    const handleAdd = async () => {
        if (newCountry.code && newCountry.name && newCountry.flag) {
            await onAddCountry(newCountry);
            setIsAddingCountry(false);
            setNewCountry({ code: '', name: '', flag: '' });
        }
    };

    const handleUpdate = async () => {
        if (editingCountry && editingCountry.code && editingCountry.name && editingCountry.flag) {
            await onUpdateCountry(editingCountry.originalCode, {
                code: editingCountry.code,
                name: editingCountry.name,
                flag: editingCountry.flag
            });
            setEditingCountry(null);
        }
    };

    return (
        <div className={cn(
            "bg-white rounded-xl shadow-sm border border-gray-200",
            "overflow-hidden animate-fade-in"
        )}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Managed Countries</h3>
                <button
                    onClick={() => setIsAddingCountry(true)}
                    className="text-sm text-[var(--primary)] font-medium hover:text-opacity-80 flex items-center gap-1"
                >
                    <Plus size={16} /> Add Country
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {countries.map(c => (
                            <tr key={c.code}>
                                <td className="px-6 py-4 whitespace-nowrap text-2xl">{c.flag}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {c.code !== 'Global' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingCountry({ originalCode: c.code, ...c })} className="text-[var(--primary)] hover:text-opacity-80">
                                                Edit
                                            </button>
                                            <button onClick={() => onDeleteCountry(c.code)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAddingCountry && (
                <AddCountryModal
                    newCountry={newCountry}
                    onClose={() => setIsAddingCountry(false)}
                    onAdd={handleAdd}
                    onUpdateNewCountry={setNewCountry}
                />
            )}

            {editingCountry && (
                <EditCountryModal
                    country={editingCountry}
                    onClose={() => setEditingCountry(null)}
                    onSave={handleUpdate}
                    onUpdateCountry={setEditingCountry}
                />
            )}
        </div>
    );
};
