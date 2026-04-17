import React, { useState, useEffect, useCallback } from 'react';
import './LiveInvestorToast.css';

const countries = [
    // Europe
    'England', 'France', 'Germany', 'Italy', 'Greece', 'Spain', 'Portugal',
    'Netherlands', 'Belgium', 'Switzerland', 'Sweden', 'Norway', 'Denmark',
    'Poland', 'Austria', 'Czech Republic', 'Romania', 'Hungary', 'Bulgaria',
    // Middle East
    'Dubai', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan',
    'Turkey', 'Israel', 'Lebanon', 'Egypt',
    // Asia
    'Thailand', 'Japan', 'South Korea', 'China', 'India', 'Malaysia',
    'Indonesia', 'Philippines', 'Vietnam', 'Singapore', 'Pakistan',
    'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia',
    'Taiwan', 'Hong Kong', 'Kazakhstan', 'Azerbaijan',
    // Americas
    'USA', 'Canada', 'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru',
    // Africa & Oceania
    'Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Australia', 'New Zealand',
];

const plans = [
    'Commence 0.5%', 'General 1%', 'VIP I 2%', 'VIP II 3%',
    'Supreme I 4%', 'Supreme II 5%', 'Royal 6%', 'Royal Plus 7%', 'Exclusive 10%',
];

const actions = [
    { type: 'invested', color: '#22c55e', icon: '✅' },
    { type: 'withdrew earnings from', color: '#4A9FD4', icon: '✅' },
    { type: 'joined with', color: '#a855f7', icon: '✅   ' },
];

let countryIndex = 0;

const LiveInvestorToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(() => {
        const country = countries[countryIndex % countries.length];
        countryIndex++;

        const action = actions[Math.floor(Math.random() * actions.length)];
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const amount = Math.floor(Math.random() * 49000 + 1000);

        const id = Date.now() + Math.random();
        const message =
            action.type === 'joined with'
                ? `An Investor from ${country} ${action.type} $${amount.toLocaleString()}`
                : `An Investor from ${country} ${action.type} ${plan} plan`;

        const toast = { id, message, icon: action.icon, color: action.color };

        setToasts(prev => [...prev.slice(-2), toast]); // max 3 toasts

        // Auto remove after 4s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    useEffect(() => {
        // First toast immediately
        showToast();
        const interval = setInterval(showToast, 1500);
        return () => clearInterval(interval);
    }, [showToast]);

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <div className="lit-container">
            {toasts.map((toast) => (
                <div key={toast.id} className="lit-toast">
                    <div className="lit-icon" style={{ color: toast.color }}>
                        {toast.icon}
                    </div>
                    <p className="lit-message">{toast.message}</p>
                    <button className="lit-close" onClick={() => dismiss(toast.id)}>✕</button>
                </div>
            ))}
        </div>
    );
};

export default LiveInvestorToast;
