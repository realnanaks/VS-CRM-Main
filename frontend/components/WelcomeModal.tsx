import React from 'react';
import { User } from '../types';
import { completeOnboarding } from '../services/auth';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '../utils/cn';

interface WelcomeModalProps {
    user: User;
    onStartTour: () => void;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ user, onStartTour, onClose }) => {
    const handleStartOnboarding = async () => {
        try {
            await completeOnboarding(user.id);
            onClose();
            onStartTour();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={cn(
                "bg-white rounded-2xl shadow-2xl w-full max-w-2xl",
                "overflow-hidden animate-fade-in"
            )}>
                <VideoPlayer
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                    title="Welcome to Visionary Space"
                />

                <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Visionary Space!</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        We're thrilled to have you on board. Visionary Space is designed to help you manage projects, track growth, and collaborate seamlessly.
                    </p>

                    <button
                        onClick={handleStartOnboarding}
                        className={cn(
                            "bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg",
                            "hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                        )}
                    >
                        Let's Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};
