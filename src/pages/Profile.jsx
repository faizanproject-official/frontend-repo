import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return (
            <DashboardLayout activePage="profile">
                <div style={{ padding: '2rem', color: '#64748b' }}>Loading Profile...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activePage="profile">
            <div style={{ padding: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '2rem' }}>My Profile</h1>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', maxWidth: '600px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1.5rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>{user.name}</h2>
                            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Investor</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '500' }}>{user.name}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '500' }}>{user.email}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Account Status</label>
                            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.9rem', fontWeight: '600' }}>Active</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Member Since</label>
                            <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '500' }}>{new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
