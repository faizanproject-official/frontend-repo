import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/new_logo.png';
import { FaTelegramPlane } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-top-row">
                    <div className="footer-left">
                        <div className="footer-brand-section">
                            <div className="footer-logo">
                                <img src={logo} alt="Investment Smart Crypto Investing Logo" style={{ height: '50px', width: 'auto', marginRight: '10px' }} />
                                <span className="footer-brand-name">Investment Smart Crypto Investing</span>
                            </div>
                            <p className="footer-description">
                                Investment Smart Crypto Investing is a multi-asset, tech-focused broker utilizing advanced algorithms for enhanced trading conditions.
                            </p>
                        </div>

                        <div className="footer-links-grid">
                            <div className="footer-column">
                                <h3>Company</h3>
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                    <li><Link to="/support">Support</Link></li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h3>Policy</h3>
                                <ul>
                                    <li><Link to="/compliance">Compliance</Link></li>
                                    <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                                    <li><Link to="/cookies">Cookies Policy</Link></li>
                                    <li><Link to="/privacy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Map on the right side */}
                    <div className="footer-map-section">
                        <h3 className="footer-map-title">Our Location</h3>
                        <div className="footer-map-wrapper">
                            <iframe
                                title="Our Location"
                                src="https://maps.google.com/maps?q=New+York,+NY,+USA&t=&z=11&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="380"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">Copyright © 2026 All Rights Reserved.</p>
                    <div className="footer-telegram">
                        <a
                            href="https://t.me/invest_mentsupport"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="telegram-link"
                        >
                            <FaTelegramPlane className="telegram-icon" />
                            <span>Join us on Telegram</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

