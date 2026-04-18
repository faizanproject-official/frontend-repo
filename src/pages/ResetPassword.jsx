import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Auto-fill from URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            await api.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h2>Invalid Link</h2>
                    <p>This password reset link is invalid or missing information.</p>
                    <div className="register-link"><Link to="/forgot-password">Request a new link</Link></div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Set New Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#64748b' }}>
                    Create a secure password for your account.
                </p>

                {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>{message}</div>}
                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #fecaca' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input type="hidden" value={token} />
                    <input type="hidden" value={email} />

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    
                    <div className="register-link">
                        <Link to="/login">Back to Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
