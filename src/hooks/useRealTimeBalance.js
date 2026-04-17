import { useEffect, useState } from 'react';
import echo from '../services/echo';

const useRealTimeBalance = (userId, initialBalance) => {
    const [balance, setBalance] = useState(initialBalance);

    useEffect(() => {
        if (!userId) return;

        const channel = echo.private(`App.Models.User.${userId}`);

        channel.listen('.balance.updated', (e) => {
            console.log('Real-time balance update received:', e);
            setBalance(e.funding_balance);
        });

        // Cleanup
        return () => {
            channel.stopListening('.balance.updated');
        };
    }, [userId]);

    return [balance, setBalance];
};

export default useRealTimeBalance;
