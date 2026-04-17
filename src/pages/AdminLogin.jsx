import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import logo from '../assets/new_logo.png';
const AdminLogin = () => {
    const { login } = useAuth();
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    // eslint-disable-next-line
    const navigate = useNavigate();

    // Clear any existing session to prevent interference
    React.useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const user = await login(formData.email, formData.password);

            setLoading(false);
            if (user.is_admin) {
                // Success! The parent component (AdminRoute) will see isAdmin=true and render AdminPanel
                // We can also force navigate to /admin to trigger re-evaluation
                // navigate('/admin'); 
                window.location.reload(); // Hard reload to ensure fresh state if needed, or simple re-render. 
                // However, context update should be enough.
            } else {
                setError('Access Denied: This account does not have Administrator privileges.');
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            setError('Invalid Admin credentials.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="auth-page admin-login-page"
            style={{
                background: '#0f172a',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div className="auth-container" style={{ maxWidth: '400px', width: '100%', margin: '0' }}>
                <div className="auth-card" style={{ flexDirection: 'column', height: 'auto', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
                    {/* No Image Side - Just Form */}
                    <div className="auth-form-side" style={{ padding: '40px 30px', width: '100%', background: '#1e293b' }}>
                        <div className="auth-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                            <div className="admin-icon" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                                <img src={logo} alt="Admin Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                            </div>
                            <h1 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '10px' }}>Admin Portal</h1>
                            <p style={{ color: '#94a3b8' }}>Secure Login Required</p>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Admin Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        border: '1px solid #334155',
                                        background: '#0f172a',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        border: '1px solid #334155',
                                        background: '#0f172a',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#3b82f6',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    cursor: cursor => loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Verifying Access...' : 'Access Dashboard'}
                            </button>
                        </form>

                        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Authorized Personnel Only</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminLogin;
