import React, { useState } from 'react';
import { activateAccount } from '../services/auth';
import { User } from '../types';
import { cn } from '../utils/cn';

interface ActivationPageProps {
    token: string;
    onSuccess: (user: User) => void;
}

export const ActivationPage: React.FC<ActivationPageProps> = ({ token, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            const { user } = await activateAccount(token, password);
            onSuccess(user);
        } catch (err) {
            setError('Activation failed. The link may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <span className="text-white font-extrabold text-2xl">V</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Activate Your Account</h2>
                    <p className="text-gray-500 mt-2">Welcome to Visionary Space! Please set your password to continue.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "focus:ring-2 focus:ring-indigo-500 outline-none"
                            )}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className={cn(
                                "w-full p-2 border border-gray-300 rounded-lg",
                                "focus:ring-2 focus:ring-indigo-500 outline-none"
                            )}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full bg-indigo-600 text-white py-2 rounded-lg font-medium",
                            "hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        )}
                    >
                        {isLoading ? 'Activating...' : 'Activate Account'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                        <button
                            onClick={() => {
                                const width = 500;
                                const height = 600;
                                const left = window.screen.width / 2 - width / 2;
                                const top = window.screen.height / 2 - height / 2;
                                const w = window.open('', '_blank', `width=${width},height=${height},top=${top},left=${left}`);
                                if (w) {
                                    w.document.write('<html><body style="font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:#fff">');
                                    w.document.write('<h2 style="color:#4285F4">Sign in with Google</h2>');
                                    w.document.write('<div style="margin-top:20px;width:40px;height:40px;border:4px solid #e2e8f0;border-top:4px solid #4285F4;border-radius:50%;animation:spin 1s linear infinite"></div>');
                                    w.document.write('<style>@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}</style>');
                                    w.document.write('</body></html>');
                                    setTimeout(() => {
                                        w.close();
                                        // Simulate successful login as John Doe
                                        // In a real app, this would link the Google account to the new user
                                        alert("Google Sign-In successful! Please set your password to complete activation.");
                                    }, 1500);
                                }
                            }}
                            className={cn(
                                "w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm",
                                "text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            )}
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
