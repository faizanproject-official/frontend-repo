import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Expose Pusher to window object for Echo
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: process.env.REACT_APP_REVERB_PORT ?? 80,
    wssPort: process.env.REACT_APP_REVERB_PORT ?? 443,
    forceTLS: (process.env.REACT_APP_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    // Add auth endpoint if backend is on different domain (handled by axios usually, but echo implies its own)
    authEndpoint: 'http://localhost:8000/api/broadcasting/auth', 
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    },
});

export default echo;
