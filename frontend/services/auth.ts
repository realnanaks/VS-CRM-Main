import { User } from '../types';
import { BASE_API_URL } from './data';

export const activateAccount = async (token: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${BASE_API_URL}/auth/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
    });
    if (!response.ok) throw new Error('Activation failed');
    return response.json();
};

export const login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const signup = async (name: string, email: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${BASE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
};

export const completeOnboarding = async (userId: string): Promise<User> => {
    const response = await fetch(`${BASE_API_URL}/users/${userId}/onboarding`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to complete onboarding');
    return response.json();
};
