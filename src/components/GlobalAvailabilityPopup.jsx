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

    // Lock body scroll when modal is visible
    useEffect(() => {
        if (isVisible) {
            // Store current scroll position
            const scrollY = window.scrollY;
            // Add class to body to prevent scrolling
            document.body.classList.add('modal-open');
            document.body.style.top = `-${scrollY}px`;
        } else {
            // Remove class and restore scroll position
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
            if (document.body.style.top) {
                window.scrollTo(0, parseInt(document.body.style.top || '0') * -1);
            }
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
        };
    }, [isVisible]);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('global_popup_seen', 'true');
        }
        setIsVisible(false);
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isVisible) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="global-popup-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="global-popup-container"
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
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
