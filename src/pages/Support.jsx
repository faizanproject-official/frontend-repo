import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import './Support.css';

// Reusable Dropdown for this component
const SupportDropdown = ({ options, value, onChange, placeholder = "Select" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="support-dropdown" ref={dropdownRef}>
            <div className={`support-dropdown-header ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span>{value || placeholder}</span>
                <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <ul className="support-dropdown-list">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={`support-dropdown-item ${value === option ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Support = ({ defaultTab = 'new' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(defaultTab);

    // View & Reply States
    const [viewTicket, setViewTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [replyFiles, setReplyFiles] = useState([]);
    const replyFileRef = useRef(null);

    // Create Ticket Form States
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('High');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState({ type: '', text: '' });

    // My Tickets List State
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(() => {
        setActiveTab(defaultTab);
        if (defaultTab === 'new' || defaultTab === 'history') {
            setViewTicket(null);
        }
    }, [defaultTab]);

    useEffect(() => {
        if (activeTab === 'history' && !viewTicket) {
            fetchTickets();
        }
    }, [activeTab, viewTicket]);

    const fetchTickets = async () => {
        setLoadingTickets(true);
        try {
            const res = await api.get('/support/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleViewTicket = async (id) => {
        setLoadingTickets(true);
        try {
            const res = await api.get(`/support/tickets/${id}`);
            setViewTicket(res.data);
            setActiveTab('view');
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTickets(false);
        }
    };

    // Reply Handlers
    const handleReplyFileChange = (e) => {
        if (e.target.files) {
            setReplyFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeReplyFile = (index) => {
        setReplyFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleReply = async () => {
        if (!replyMessage.trim() && replyFiles.length === 0) return;
        setSendingReply(true);
        try {
            const formData = new FormData();
            formData.append('message', replyMessage);
            replyFiles.forEach((file) => {
                formData.append('attachments[]', file);
            });

            const res = await api.post(`/support/tickets/${viewTicket.id}/reply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Append new message to view
            setViewTicket(prev => ({
                ...prev,
                status: 'Replied', // Optimistic update
                messages: [...prev.messages, {
                    ...res.data.ticket_message,
                    user: { name: 'You' },
                    created_at: new Date().toISOString()
                }]
            }));
            setReplyMessage('');
            setReplyFiles([]);
        } catch (err) {
            alert('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    // Create Ticket Handlers
    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles([...files, ...newFiles]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitMsg({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('priority', priority);
            formData.append('message', message);
            files.forEach((file) => {
                formData.append('attachments[]', file);
            });

            await api.post('/support/tickets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSubmitMsg({ type: 'success', text: 'Ticket created successfully!' });
            setSubject('');
            setMessage('');
            setPriority('High');
            setFiles([]);

            fetchTickets();
            // Switch to history tab after delay
            setTimeout(() => {
                navigate('/support/history');
                setActiveTab('history');
            }, 1000);

        } catch (err) {
            setSubmitMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create ticket.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Determine what to render
    const activeSidebarPage = (activeTab === 'new' || activeTab === 'view') ? 'support' : 'support-history';

    return (
        <DashboardLayout activePage={activeSidebarPage}>
            <div className="support-container">
                {/* ... existing tabs ... */}
                {!viewTicket && (
                    <div className="support-tabs-header">
                        {/* ... */}
                        <button
                            className={`support-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('new'); navigate('/support/new'); }}
                        >
                            Open Ticket
                        </button>
                        <button
                            className={`support-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('history'); navigate('/support/history'); }}
                        >
                            My Ticket
                        </button>
                    </div>
                )}

                <div className="support-content-area">
                    {/* VIEW TICKET DETAIL */}
                    {viewTicket ? (
                        <div className="ticket-detail-wrapper">
                            <h2 className="view-ticket-title">View Ticket</h2>

                            <div className="ticket-header-card">
                                <div className="ticket-top-bar">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className={`ticket-status-pill ${viewTicket.status.toLowerCase()}`}>
                                            {viewTicket.status}
                                        </span>
                                        <span className="ticket-subject-line">
                                            [Ticket#{viewTicket.ticket_number}] {viewTicket.subject}
                                        </span>
                                    </div>
                                    <button className="close-view-btn" onClick={() => setViewTicket(null)}>×</button>
                                </div>

                                <textarea
                                    className="reply-textarea"
                                    placeholder="Type your reply here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                ></textarea>

                                {/* Selected Files Display */}
                                {replyFiles.length > 0 && (
                                    <div className="file-list" style={{ marginBottom: '15px' }}>
                                        {replyFiles.map((f, i) => (
                                            <span key={i} className="file-chip">
                                                {f.name}
                                                <span
                                                    style={{ marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    onClick={() => removeReplyFile(i)}
                                                >×</span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="reply-actions">
                                    <input
                                        type="file"
                                        multiple
                                        ref={replyFileRef}
                                        style={{ display: 'none' }}
                                        onChange={handleReplyFileChange}
                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                    />
                                    <button
                                        className="btn-add-attachment"
                                        onClick={() => replyFileRef.current.click()}
                                    >
                                        + Add Attachment
                                    </button>
                                    <button
                                        className="btn-reply-action"
                                        onClick={handleReply}
                                        disabled={sendingReply}
                                    >
                                        <span style={{ marginRight: '8px', display: 'inline-block', transform: 'scaleX(-1)' }}>➜</span>
                                        {sendingReply ? 'Sending...' : 'Reply'}
                                    </button>
                                </div>
                                <div className="upload-info-text">
                                    Max 5 files can be uploaded | Maximum upload size is 256MB | Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx
                                </div>
                            </div>

                            {/* Message History */}
                            <div className="ticket-messages-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {viewTicket.messages && viewTicket.messages.map((msg, index) => (
                                    <div key={index || msg.id} className="message-card">
                                        <div className="msg-user-col">
                                            <span>{msg.user ? (msg.user.name || 'User') : 'Support'}</span>
                                        </div>
                                        <div className="msg-content-col">
                                            <div className="msg-header">
                                                Posted on {new Date(msg.created_at).toLocaleString()}
                                            </div>
                                            <div className="msg-text">
                                                {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : activeTab === 'new' ? (
                        /* CREATE NEW TICKET */
                        <div className="new-ticket-card">
                            <h2 className="card-title">Open Ticket</h2>
                            {submitMsg.text && (
                                <div className={`alert-msg ${submitMsg.type}`}>{submitMsg.text}</div>
                            )}

                            <form onSubmit={handleSubmit} className="ticket-form">
                                <div className="form-row">
                                    <div className="form-group flex-2">
                                        <label>Subject <span className="req">*</span></label>
                                        <input
                                            type="text"
                                            className="dark-input"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group flex-1">
                                        <label>Priority <span className="req">*</span></label>
                                        <SupportDropdown
                                            options={['High', 'Medium', 'Low']}
                                            value={priority}
                                            onChange={setPriority}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Message <span className="req">*</span></label>
                                    <textarea
                                        className="dark-textarea"
                                        rows="6"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="attachment-section">
                                    <label htmlFor="file-upload" className="add-file-btn">+ Add Attachment</label>
                                    <input id="file-upload" type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                                    <div className="file-list">
                                        {files.map((f, i) => (<span key={i} className="file-chip">{f.name}</span>))}
                                    </div>
                                </div>
                                <p className="file-hint">Max 5 files can be uploaded | Maximum upload size is 256MB | Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx</p>

                                <div className="form-actions">
                                    <button type="submit" className="submit-ticket-btn" disabled={submitting}>
                                        {submitting ? 'Submitting...' : '> Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* MY TICKETS LIST */
                        <div className="my-tickets-card">
                            <h2 className="card-title">My Tickets</h2>
                            {loadingTickets ? (
                                <p style={{ color: '#94a3b8' }}>Loading...</p>
                            ) : tickets.length === 0 ? (
                                <p style={{ color: '#94a3b8', padding: '20px' }}>No support tickets found.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="support-table">
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Status</th>
                                                <th>Priority</th>
                                                <th>Last Reply</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map(t => (
                                                <tr key={t.id}>
                                                    <td className="ticket-subject-cell">
                                                        <span className="ticket-id-highlight">[Ticket#{t.ticket_number}]</span> {t.subject}
                                                    </td>
                                                    <td><span className={`status-badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                                                    <td><span className={`priority-badge ${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                                                    <td className="text-muted">{new Date(t.updated_at).toLocaleString()}</td>
                                                    <td>
                                                        <button
                                                            className="view-btn"
                                                            onClick={() => handleViewTicket(t.id)}
                                                        >
                                                            <span className="icon-monitor">🖥</span> Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Support;
