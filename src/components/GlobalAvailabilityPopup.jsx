import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GlobalAvailabilityPopup.css';

const GlobalAvailabilityPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(true);

    useEffect(() => {
        // Check if user has already seen the popup (if "Do not show again" was selected)
        const hasSeen = localStorage.getItem('global_popup_seen');

        if (!hasSeen) {
            // Show popup after 4 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('global_popup_seen', 'true');
        }
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="global-popup-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="global-popup-container"
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <button className="global-popup-close" onClick={handleClose} aria-label="Close">
                            &times;
                        </button>

                        <h2 className="global-popup-title">Global Availability</h2>
                        <p className="global-popup-text">
                            Italy Rome all over Europe Japan Australia
                        </p>

                        <div className="global-popup-actions">
                            <button className="global-popup-btn" onClick={handleClose}>
                                Continue
                            </button>

                            <label className="global-popup-footer">
                                <input
                                    type="checkbox"
                                    className="global-popup-checkbox"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                />
                                Don't show again
                            </label>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalAvailabilityPopup;
