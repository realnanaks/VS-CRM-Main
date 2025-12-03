import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { User, Country } from '../../types';
import { EditUserModal } from './EditUserModal';
import { InviteUserModal } from './InviteUserModal';
import { cn } from '../../utils/cn';

interface TeamManagementProps {
    users: User[];
    currentUser: User | null;
    countries: Country[];
    onUpdateUser: (user: User) => Promise<void>;
    onInviteUser: (user: Partial<User>) => Promise<void>;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ users, currentUser, countries, onUpdateUser, onInviteUser }) => {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isInviting, setIsInviting] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User>>({ role: 'Country Manager', assignedCountries: [] });

    const handleSaveUser = async () => {
        if (editingUser) {
            await onUpdateUser(editingUser);
            setEditingUser(null);
        }
    };

    const handleInvite = async () => {
        if (newUser.name && newUser.email && newUser.role) {
            await onInviteUser(newUser);
            setIsInviting(false);
            setNewUser({ role: 'Country Manager', assignedCountries: [] });
        }
    };

    return (
        <div className={cn(
            "bg-white rounded-xl shadow-sm border border-gray-200",
            "overflow-hidden animate-fade-in"
        )}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Active Users ({users.length})</h3>
                <button onClick={() => setIsInviting(true)} className="text-sm text-[var(--primary)] font-medium hover:text-opacity-80">Invite User</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.filter(user => {
                            if (!currentUser || currentUser.role === 'Super Admin') return true;
                            if (currentUser.role === 'Country Manager') {
                                return user.assignedCountries.some(c => currentUser.assignedCountries.includes(c));
                            }
                            return false;
                        }).map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                        user.role === 'Super Admin' && "bg-purple-100 text-purple-800",
                                        user.role === 'Country Manager' && "bg-blue-100 text-blue-800",
                                        user.role === 'Member' && "bg-green-100 text-green-800"
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                        (user.status === 'Active' || !user.status) && "bg-green-100 text-green-800",
                                        user.status === 'Pending' && "bg-yellow-100 text-yellow-800",
                                        user.status === 'Inactive' && "bg-red-100 text-red-800"
                                    )}>
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.assignedCountries.join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onUpdateUser({ ...user, status: (user.status === 'Active' || !user.status) ? 'Inactive' : 'Active' })}
                                        className={cn(
                                            "mr-4",
                                            (user.status === 'Active' || !user.status) ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"
                                        )}
                                    >
                                        {(user.status === 'Active' || !user.status) ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => setEditingUser(user)} className="text-[var(--primary)] hover:text-opacity-80">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    countries={countries}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                    onUpdateUser={setEditingUser}
                />
            )}

            {isInviting && (
                <InviteUserModal
                    newUser={newUser}
                    countries={countries}
                    onClose={() => setIsInviting(false)}
                    onInvite={handleInvite}
                    onUpdateNewUser={setNewUser}
                />
            )}
        </div>
    );
};
