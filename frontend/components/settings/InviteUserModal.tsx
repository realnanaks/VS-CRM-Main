import React from 'react';
import { Check } from 'lucide-react';
import { User, CountryCode, Country } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface InviteUserModalProps {
    newUser: Partial<User>;
    countries: Country[];
    onClose: () => void;
    onInvite: () => void;
    onUpdateNewUser: (user: Partial<User>) => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ newUser, countries, onClose, onInvite, onUpdateNewUser }) => {
    const toggleNewUserCountry = (code: CountryCode) => {
        const current = newUser.assignedCountries || [];
        const exists = current.includes(code);
        let newCountries;
        if (exists) {
            newCountries = current.filter(c => c !== code);
        } else {
            newCountries = [...current, code];
        }
        onUpdateNewUser({ ...newUser, assignedCountries: newCountries });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={cn(
                "bg-white rounded-xl shadow-2xl p-6",
                "w-full max-w-md animate-fade-in"
            )}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Invite New User</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            )}
                            value={newUser.name || ''}
                            onChange={(e) => onUpdateNewUser({ ...newUser, name: e.target.value })}
                            placeholder="e.g. Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            )}
                            value={newUser.email || ''}
                            onChange={(e) => onUpdateNewUser({ ...newUser, email: e.target.value })}
                            placeholder="jane@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            )}
                            value={newUser.role}
                            onChange={(e) => onUpdateNewUser({ ...newUser, role: e.target.value as any })}
                        >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Country Manager">Country Manager</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Countries</label>
                        <div className="grid grid-cols-2 gap-2">
                            {countries.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => toggleNewUserCountry(c.code)}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all",
                                        (newUser.assignedCountries || []).includes(c.code)
                                            ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center",
                                        (newUser.assignedCountries || []).includes(c.code)
                                            ? "bg-[var(--primary)] border-[var(--primary)]"
                                            : "border-gray-300"
                                    )}>
                                        {(newUser.assignedCountries || []).includes(c.code) && <Check size={10} className="text-white" />}
                                    </div>
                                    <span>{c.flag} {c.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={onInvite} disabled={!newUser.name || !newUser.email}>Send Invite</Button>
                </div>
            </div>
        </div>
    );
};
