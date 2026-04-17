import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import './Nav.css';
import logo from '../assets/new_logo.png';
import StatsBar from './StatsBar';

function Nav() {
    const { isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="sticky-nav-wrapper">
            <StatsBar />
            {/* Main Navbar */}
            <nav className="main-navbar">
                <div className="navbar-container">

                    {/* Logo */}
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <div className="logo-icon">
                            <img src={logo} alt="BuckHolding Logo" />
                        </div>
                    </Link>

                    {/* Hamburger Menu Icon */}
                    <div className="menu-icon" onClick={toggleMobileMenu}>
                        <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                        <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                        <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                    </div>

                    {/* Navigation Links */}
                    <ul className={isMobileMenuOpen ? "nav-menu active" : "nav-menu"}>
                        <li><Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link></li>
                        <li><Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link></li>
                        <li><Link to="/compliance" className="nav-link" onClick={closeMobileMenu}>Compliance</Link></li>
                        <li><Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact Us</Link></li>
                        <li><Link to="/support" className="nav-link" onClick={closeMobileMenu}>Support</Link></li>
                        <li><Link to="/investment-offers" className="nav-link" onClick={closeMobileMenu}>Investment Offers</Link></li>

                        {/* Mobile Auth Buttons (Keep inside menu for mobile) */}
                        <li className="mobile-auth">
                            <div className="auth-buttons">
                                {isAuthenticated ? (
                                    <div className="auth-logged-in">
                                        <Link to="/dashboard" className="dashboard-btn" onClick={closeMobileMenu} style={{
                                            background: '#4A9FD4',
                                            color: '#ffffff',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            fontWeight: 'bold'
                                        }}>
                                            Dashboard
                                        </Link>
                                        <button onClick={() => { logout(); closeMobileMenu(); }} className="logout-nav-btn" style={{
                                            background: 'transparent',
                                            border: '1px solid #ef4444',
                                            color: '#ef4444',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                            fontWeight: 'bold'
                                        }}>
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/login" className="login-btn" onClick={closeMobileMenu}>Login</Link>
                                        <Link to="/signup" className="signup-btn" onClick={closeMobileMenu}>
                                            Sign Up <span className="arrow">→</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </li>
                    </ul>

                    {/* Desktop Auth Buttons (Hidden on mobile via CSS) */}
                    <div className="auth-buttons desktop-auth">
                        {isAuthenticated ? (
                            <div className="auth-logged-in">
                                <Link to="/dashboard" className="dashboard-btn" style={{
                                    background: '#4A9FD4',
                                    color: '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold'
                                }}>
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="logout-nav-btn" style={{
                                    background: 'transparent',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                    fontWeight: 'bold'
                                }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="login-btn">Login</Link>
                                <Link to="/signup" className="signup-btn">
                                    Sign Up <span className="arrow">→</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Nav;
