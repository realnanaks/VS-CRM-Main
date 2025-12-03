import React from 'react';
import { Check } from 'lucide-react';
import { User, CountryCode, Country } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface EditUserModalProps {
    user: User;
    countries: Country[];
    onClose: () => void;
    onSave: () => void;
    onUpdateUser: (user: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, countries, onClose, onSave, onUpdateUser }) => {
    const toggleCountry = (code: CountryCode) => {
        const current = user.assignedCountries || [];
        const exists = current.includes(code);
        let newCountries;

        if (exists) {
            newCountries = current.filter(c => c !== code);
        } else {
            newCountries = [...current, code];
        }

        onUpdateUser({ ...user, assignedCountries: newCountries });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={cn(
                "bg-white rounded-xl shadow-2xl p-6",
                "w-full max-w-md animate-fade-in"
            )}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User Access</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-900">{user.name}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            )}
                            value={user.role}
                            onChange={(e) => onUpdateUser({ ...user, role: e.target.value as any })}
                        >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Country Manager">Country Manager</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Countries</label>
                        <div className="grid grid-cols-2 gap-2">
                            {countries.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => toggleCountry(c.code)}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all",
                                        user.assignedCountries.includes(c.code)
                                            ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center",
                                        user.assignedCountries.includes(c.code)
                                            ? "bg-[var(--primary)] border-[var(--primary)]"
                                            : "border-gray-300"
                                    )}>
                                        {user.assignedCountries.includes(c.code) && <Check size={10} className="text-white" />}
                                    </div>
                                    <span>{c.flag} {c.name}</span>
                                </button>
                            ))}
                        </div>
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
