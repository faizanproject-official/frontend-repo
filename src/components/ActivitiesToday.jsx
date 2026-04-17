import React, { useState, useEffect } from 'react';
import './ActivitiesToday.css';

const names = [
    "Greis", "Faruk", "Eli", "Diego", "Phil", "Mate", "Aysu", "Noah", "Liam", "Emma",
    "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Amelia", "Harper", "Evelyn", "Abigail", "Emily",
    "Henry", "Lucas", "Benjamin", "Elijah", "James", "William", "Alexander", "Michael", "Daniel", "Logan",
    "Chloe", "Luna", "Ella", "Grace", "Zoe", "Nora", "Hannah", "Layla", "Scarlett", "Victoria",
    "Aria", "Penelope", "Riley", "Stella", "Aaliyah", "Sofia", "Camila", "Avery", "Mila", "Hazel",
    "Ahmed", "Fatima", "Hassan", "Aisha", "Tariq", "Nadia", "Yusuf", "Leila", "Omar", "Samira",
    "Kenji", "Yuki", "Haruto", "Aiko", "Takeshi", "Mei", "Chen", "Wei", "Priya", "Rahul",
    "Ananya", "Arjun", "Ji-ho", "Min-jun", "Seo-yeon", "Thabo", "Amara", "Kofi", "Zara", "Carlos"
];

const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatCurrency = (amount) => '$' + amount.toLocaleString();
const getRandomName = () => names[Math.floor(Math.random() * names.length)];

const generateItem = (isInvestment) => ({
    name: getRandomName(),
    amount: isInvestment ? getRandomAmount(1000, 50000) : getRandomAmount(500, 20000),
    id: Math.random()
});

const ActivitiesToday = () => {
    const [investments, setInvestments] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [flashInv, setFlashInv] = useState(false);
    const [flashWith, setFlashWith] = useState(false);

    // Initialize data
    useEffect(() => {
        setInvestments(Array.from({ length: 5 }, () => generateItem(true)));
        setWithdrawals(Array.from({ length: 5 }, () => generateItem(false)));
    }, []);

    // Update investments every 1 second
    useEffect(() => {
        const interval = setInterval(() => {
            setInvestments(prev => [generateItem(true), ...prev.slice(0, 4)]);
            setFlashInv(true);
            setTimeout(() => setFlashInv(false), 400);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Update withdrawals every 1.3 seconds (slightly offset so they don't both fire at same time)
    useEffect(() => {
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setWithdrawals(prev => [generateItem(false), ...prev.slice(0, 4)]);
                setFlashWith(true);
                setTimeout(() => setFlashWith(false), 400);
            }, 1000);
            return () => clearInterval(interval);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <section className="activities-today-section">
            <div className="section-header-top centered">
                <div className="section-tag-pill">
                    <div className="dot-blue"></div>
                    <span className="tag-text">Live Statistics</span>
                </div>
                <h2 className="features-heading">Activities Today</h2>
                <p className="features-description-text">This is a live update of the deposits and withdrawals done on our investment system today</p>
            </div>

            <div className="activities-container">
                <div className={`activity-column${flashInv ? ' flash' : ''}`}>
                    <h3 className="activity-title investments-title">
                        <span className="live-dot"></span> Latest Investments
                    </h3>
                    <div className="activity-list">
                        {investments.map((item, idx) => (
                            <div key={item.id} className={`activity-row${idx === 0 ? ' slide-in' : ''}`}>
                                <div className="activity-name-container">
                                    <div className="activity-avatar">{item.name.charAt(0)}</div>
                                    <span className="activity-name">{item.name}</span>
                                </div>
                                <span className="activity-amount">{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`activity-column${flashWith ? ' flash' : ''}`}>
                    <h3 className="activity-title withdrawals-title">
                        <span className="live-dot withdrawal-dot"></span> Latest Withdrawals
                    </h3>
                    <div className="activity-list">
                        {withdrawals.map((item, idx) => (
                            <div key={item.id} className={`activity-row${idx === 0 ? ' slide-in' : ''}`}>
                                <div className="activity-name-container">
                                    <div className="activity-avatar withdrawal">{item.name.charAt(0)}</div>
                                    <span className="activity-name">{item.name}</span>
                                </div>
                                <span className="activity-amount withdrawal">{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ActivitiesToday;
