import React, { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import './KycSubmission.css';

const KycSubmission = ({ isEmbedded }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [docType, setDocType] = useState('passport');
    const [docNumber, setDocNumber] = useState('');
    const [frontFile, setFrontFile] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [statusData, setStatusData] = useState(null);

    React.useEffect(() => {
        api.get('/kyc/status').then(res => {
            if (res.data.data) {
                setStatusData(res.data.data);
                if (['pending', 'approved'].includes(res.data.data.status)) {
                    setStatus('existing');
                }
            }
        }).catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Uploading, please wait...');
        setStatus('');

        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('country', country);
        formData.append('city', city);
        formData.append('document_type', docType);
        formData.append('document_number', docNumber);
        formData.append('document_front', frontFile);
        if (backFile) formData.append('document_back', backFile);

        try {
            await api.post('/kyc/submit', formData); // Axios automatically sets Content-Type to multipart/form-data with boundary
            setMessage('Documents submitted successfully!');
            setStatus('success');
            api.get('/kyc/status').then(res => setStatusData(res.data.data));
        } catch (err) {
            console.error("KYC Submit Error:", err);
            const status = err.response?.status;
            if (status === 401) {
                setMessage('Session expired. Please login again.');
                // Optionally redirect to login
            } else {
                setMessage('Upload failed: ' + (err.response?.data?.message || err.message));
            }
            setStatus('error');
        }
    };

    // --- Status Views ---
    if (status === 'success' || (status === 'existing' && statusData?.status !== 'rejected')) {
        const isApproved = statusData?.status === 'approved';
        return (
            <motion.div
                className={!isEmbedded ? "kyc-page" : ""}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={!isEmbedded ? "kyc-container" : ""}>
                    <div className="kyc-card">
                        <div className="status-view">
                            <motion.div
                                className={`status-icon-wrapper ${isApproved ? 'approved' : 'pending'}`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                {isApproved ? '✓' : '⏳'}
                            </motion.div>

                            <div className={`status-badge ${isApproved ? 'approved' : 'pending'}`}>
                                {isApproved ? 'VERIFIED ACCOUNT' : 'PENDING REVIEW'}
                            </div>

                            <h2 className="status-title">
                                {isApproved ? 'Identity Verified' : 'Application Submitted'}
                            </h2>

                            <p className="status-message">
                                {isApproved
                                    ? "Congratulations! Your account has been fully verified. You now have unrestricted access to all trading features and instant withdrawals."
                                    : "Thank you for submitting your documents. Our compliance team is currently reviewing your application. This process typically takes less than an hour."}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={!isEmbedded ? "kyc-page" : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className={!isEmbedded ? "kyc-container" : ""}>
                <div className="kyc-card">
                    <div className="kyc-header">
                        <h1>Identity Verification</h1>
                        <p>Complete your KYC using our secure submission system.</p>
                    </div>

                    {message && (
                        <div style={{
                            background: status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: status === 'success' ? '#10b981' : '#ef4444',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                            border: `1px solid ${status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}>
                            {message}
                        </div>
                    )}

                    {statusData?.status === 'rejected' && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            marginBottom: '2rem'
                        }}>
                            <h3 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.1rem' }}>⚠️ Application Rejected</h3>
                            <p style={{ color: '#fca5a5', fontSize: '0.95rem' }}>
                                Reason: {statusData.rejection_reason || 'Document issues. Please try again with clearer photos.'}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="kyc-section">
                            <div className="kyc-section-title">Personal Information</div>
                            <div className="kyc-form-grid">
                                <div className="kyc-form-group">
                                    <label className="kyc-label">First Name</label>
                                    <input
                                        className="kyc-input"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        placeholder="John"
                                    />
                                </div>
                                <div className="kyc-form-group">
                                    <label className="kyc-label">Last Name</label>
                                    <input
                                        className="kyc-input"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="kyc-form-group">
                                    <label className="kyc-label">City</label>
                                    <input
                                        className="kyc-input"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="kyc-form-group">
                                    <label className="kyc-label">Country</label>
                                    <input
                                        className="kyc-input"
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                        placeholder="United States"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="kyc-section">
                            <div className="kyc-section-title">Document Details</div>
                            <div className="kyc-form-grid">
                                <div className="kyc-form-group full-width">
                                    <label className="kyc-label">Document Type</label>
                                    <select
                                        className="kyc-select"
                                        value={docType}
                                        onChange={(e) => setDocType(e.target.value)}
                                    >
                                        <option value="passport">Passport</option>
                                        <option value="id_card">Photo ID / Medicare Card and State ID</option>
                                        <option value="driving_license">Driving License</option>
                                    </select>
                                </div>
                                <div className="kyc-form-group full-width">
                                    <label className="kyc-label">Document Number</label>
                                    <input
                                        className="kyc-input"
                                        type="text"
                                        value={docNumber}
                                        onChange={(e) => setDocNumber(e.target.value)}
                                        required
                                        placeholder="e.g. A12345678"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="kyc-section">
                            <div className="kyc-section-title">Upload Documents</div>
                            <div className="kyc-form-grid">
                                <div className="kyc-form-group">
                                    <label className="kyc-label">Front Side</label>
                                    <div className="kyc-file-upload">
                                        <input
                                            className="kyc-file-input-hidden"
                                            type="file"
                                            onChange={(e) => setFrontFile(e.target.files[0])}
                                            required
                                            accept="image/*"
                                        />
                                        <span className="kyc-file-icon">🪪</span>
                                        <span className="kyc-file-text">
                                            {frontFile ? frontFile.name : "Click to Upload Front Side"}
                                        </span>
                                    </div>
                                </div>
                                <div className="kyc-form-group">
                                    <label className="kyc-label">Back Side (Optional)</label>
                                    <div className="kyc-file-upload">
                                        <input
                                            className="kyc-file-input-hidden"
                                            type="file"
                                            onChange={(e) => setBackFile(e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <span className="kyc-file-icon">🔄</span>
                                        <span className="kyc-file-text">
                                            {backFile ? backFile.name : "Click to Upload Back Side"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="kyc-submit-btn">
                            Submit Verification
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default KycSubmission;
