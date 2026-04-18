import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import logo from '../assets/new_logo.png';

const Login = () => {
    const { login } = useAuth(); // Use the hook
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
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
            // Call login from context (it handles localStorage and state update)
            const user = await login(formData.email, formData.password);

            setLoading(false);
            if (user.is_admin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setLoading(false);
            setError('Invalid credentials');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-page"
        >
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-image-side">
                        <div className="auth-overlay">
                            <h2>Welcome Back!</h2>
                            <p>Continue your trading journey with the world's most trusted investment platform.</p>
                        </div>
                    </div>
                    <div className="auth-form-side">
                        <div className="auth-header">
                            <Link to="/" className="auth-logo">
                                <img src={logo} alt="Logo" style={{ height: '60px' }} />
                            </Link>
                            <h1>Sign In</h1>
                            <p>Enter your details to access your account</p>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <div className="label-row">
                                    <label>Password</label>
                                    <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Don't have an account? <Link to="/signup">Create account</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
