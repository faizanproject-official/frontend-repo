import React, { useState } from 'react';
import api from '../services/api';
import './Auth.css'; // Reusing form styles
import './KycSubmission.css'; // Importing KYC specific styles
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const NewWithdraw = () => {
    const { user } = useAuth(); // Get user to check KYC status
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('crypto'); // 'bank' or 'crypto'
    const [destination, setDestination] = useState(''); // wallet address or IBAN
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    // --- KYC Enforcement Check ---
    const [showKycPrompt, setShowKycPrompt] = useState(false);
    const kycStatus = user?.kyc_record?.status;

    // Submit Withdrawal directly
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Check KYC Status on Submit
        if (kycStatus !== 'approved') {
            setShowKycPrompt(true);
            return;
        }

        // Validate fields
        if (!amount || !destination) {
            setStatus('error');
            setMessage('Please fill in all fields.');
            return;
        }

        if (parseFloat(amount) < 10) {
            setStatus('error');
            setMessage('Minimum withdrawal amount is $10.');
            return;
        }

        setLoading(true);
        setMessage('');
        setStatus('');

        try {
            const payload = {
                amount: parseFloat(amount),
                method,
                details: { destination }
            };

            const response = await api.post('/withdraw', payload);
            
            setStatus('success');
            setMessage('✅ Withdrawal request submitted successfully!\n\n' + (response.data.message || ''));
            
            // Reset form
            setAmount('');
            setDestination('');
            
        } catch (err) {
            setStatus('error');
            console.error('Withdrawal Error:', err.response?.data);
            
            // Handle 403: KYC Required (Backend Check)
            if (err.response?.status === 403) {
                 // Force refresh user data to likely update kycStatus
                 // In a real app we might call a refreshUser() function.
                 // Here, we just show the prompt assuming the backend is right.
                 setShowKycPrompt(true);
                 setMessage('');
                 return;
            }

            // Get error message from server or use default
            let errorMsg = err.response?.data?.message || 'Failed to submit withdrawal request.';
            
            // User friendly mapping for common errors
            if (err.response?.status === 422) {
                if (errorMsg.includes('balance')) {
                    errorMsg = 'Insufficient Balance. Please check your funds.';
                }
            }

            setMessage('❌ ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (showKycPrompt && kycStatus !== 'approved') {
        return (
            <div className="kyc-enforced-view">
                 <div className="kyc-status-card">
                    <div className="status-icon-wrapper pending" style={{ width: '80px', height: '80px', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                        🔒
                    </div>
                    
                    <h2 className="status-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        KYC Verification Required
                    </h2>
                    
                    <p className="status-message" style={{ marginBottom: '2rem' }}>
                        Security is our top priority. To ensure the safety of your funds, we require Identity Verification (KYC) before processing any withdrawals.
                    </p>
                    
                    {kycStatus === 'pending' ? (
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                            <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem' }}>⏳ Review in Progress</div>
                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
                                We have received your documents. An admin is currently reviewing them. You will be notified shortly.
                            </p>
                        </div>
                    ) : kycStatus === 'rejected' ? (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                            <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>⚠️ Application Rejected</div>
                            <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Reason: {user?.kyc_record?.rejection_reason || 'Document quality issue or mismatch.'}
                            </p>
                            <Link to="/kyc" className="kyc-submit-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                                Resubmit Documents
                            </Link>
                        </div>
                    ) : kycStatus === 'expired' ? (
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                            <div style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '0.5rem' }}>🔄 Re-verification Required</div>
                            <p style={{ color: '#60a5fa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                {user?.kyc_record?.rejection_reason || 'Identity verification is required for each withdrawal request.'}
                            </p>
                            <Link to="/kyc" className="kyc-submit-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                                Verify Identity Again
                            </Link>
                        </div>
                    ) : (
                        <Link to="/kyc" className="kyc-submit-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                            Complete Verification Now
                        </Link>
                    )}
                    
                    <button 
                        onClick={() => setShowKycPrompt(false)} 
                        style={{ marginTop: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Back to Withdrawal Form
                    </button>
                 </div>
            </div>
        );
    }

    return (
        <div className="kyc-page" style={{ minHeight: 'auto', padding: '0', background: 'transparent' }}>
            <div className="kyc-container">
                <div className="kyc-card">
                    <div className="auth-header">
                        <h2>Request Withdrawal</h2>
                        <p>Submit a secure withdrawal request</p>
                    </div>

                    {message && (
                        <div className={`error-message ${status === 'success' ? 'success' : ''}`}
                            style={{
                                color: status === 'success' ? 'green' : 'red',
                                textAlign: 'center',
                                marginBottom: '20px',
                                padding: '15px',
                                background: status === 'success' ? '#e6fffa' : '#fff5f5',
                                borderRadius: '8px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                fontSize: '0.95rem',
                                lineHeight: '1.6'
                            }}>
                            {message}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Amount (USD)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="10"
                                step="0.01"
                                placeholder="Minimum: $10.00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Withdrawal Method</label>
                            <select 
                                value={method} 
                                onChange={(e) => setMethod(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            >
                                <option value="crypto">Crypto Wallet (USDT/BTC)</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{method === 'crypto' ? 'Wallet Address' : 'IBAN / Account Number'}</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                                placeholder={method === 'crypto' ? '0x...' : 'US123...'}
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewWithdraw;
