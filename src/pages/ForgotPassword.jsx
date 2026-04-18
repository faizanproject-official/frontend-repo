import React, { useState } from 'react';
import api from '../services/api';
import './Auth.css'; 
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.new_password !== formData.new_password_confirmation) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/change-password', {
                email: formData.email,
                old_password: formData.old_password,
                new_password: formData.new_password, // match backend expectation
                new_password_confirmation: formData.new_password_confirmation // validation check
            });
            setMessage('Password changed successfully! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password. check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card" style={{ minHeight: 'auto', maxWidth: '600px', margin: '0 auto' }}>
                    <div className="auth-form-side">
                        <div className="auth-header">
                            <h1>Change Password</h1>
                            <p>Enter your credentials to set a new password.</p>
                        </div>
                        
                        {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>{message}</div>}
                        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #fecaca' }}>{error}</div>}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Old Password</label>
                                <input
                                    type="password"
                                    name="old_password"
                                    value={formData.old_password}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Repeat Password</label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    value={formData.new_password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Processing...' : 'Change Password'}
                            </button>
                            
                            <div className="auth-footer">
                                <p>Remembered? <Link to="/login">Sign In</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
