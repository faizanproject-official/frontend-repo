import React, { useState, useEffect } from 'react';
import './StatsBar.css';
import { FaTelegramPlane } from 'react-icons/fa';

const StatsBar = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [daysOnline, setDaysOnline] = useState(0);

    useEffect(() => {
        // format: "15 Feb 2026"
        const date = new Date();
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-GB', options));

        // Calculate days online since Sep 27, 2015
        const startDate = new Date('2015-09-27');
        const diffTime = Math.abs(date - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysOnline(diffDays);
    }, []);

    return (
        <div className="stats-bar">
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-icon"></span>
                    <span className="stat-label">Investment:</span>
                    <span className="stat-value">$324,011,972</span>
                </div>

                <div className="stat-divider">|</div>

                <div className="stat-item">
                    <span className="stat-icon"></span>
                    <span className="stat-label">Insurance fund:</span>
                    <span className="stat-value">$349,145,108</span>
                </div>

                <div className="stat-divider">|</div>

                <div className="stat-item">
                    <span className="stat-icon"></span>
                    <span className="stat-label">Days online:</span>
                    <span className="stat-value">{daysOnline}</span>
                </div>

                <div className="stat-divider">|</div>

                <div className="stat-item">
                    <span className="stat-icon"></span>
                    <span className="stat-label">Date:</span>
                    <span className="stat-value">{currentDate}</span>
                </div>

                <div className="stats-spacer"></div>

                <div className="social-icons">
                    <a href="https://t.me/invest_mentsupport" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaTelegramPlane /> <span className="social-text">TELEGRAM</span>
                    </a>
                </div>


            </div>
        </div>
    );
};

export default StatsBar;
