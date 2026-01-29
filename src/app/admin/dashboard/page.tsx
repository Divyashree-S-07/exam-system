
'use client';

import { useEffect, useState } from 'react';
import styles from '@/app/globals.css'; // Reusing global styles for consistency

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSessions: 0,
        active: 0,
        completed: 0,
        terminated: 0,
        totalViolations: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/system-stats');
            const data = await res.json();
            if (data.stats) setStats(data.stats);
        } catch (err) {
            console.error('Failed to fetch admin stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Admin System Overview</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="/handler/dashboard" style={{ textDecoration: 'none', color: '#888' }}>Live Monitor</a>
                    <a href="/admin/reports" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>Malpractice Reports</a>
                    <button onClick={() => window.location.href = '/api/auth/logout'} className="btn-logout">Logout Staff</button>
                </div>
            </div>

            {loading ? <p>Loading system stats...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
                        <h3 style={{ margin: '0', fontSize: '0.9rem', color: '#888' }}>Total Candidates</h3>
                        <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.totalSessions}</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #facc15' }}>
                        <h3 style={{ margin: '0', fontSize: '0.9rem', color: '#888' }}>Active Now</h3>
                        <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.active}</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #22c55e' }}>
                        <h3 style={{ margin: '0', fontSize: '0.9rem', color: '#888' }}>Completed</h3>
                        <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.completed}</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--danger)' }}>
                        <h3 style={{ margin: '0', fontSize: '0.9rem', color: '#888' }}>Terminated</h3>
                        <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.terminated}</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #a855f7' }}>
                        <h3 style={{ margin: '0', fontSize: '0.9rem', color: '#888' }}>Total Violations</h3>
                        <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.totalViolations}</p>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: '2rem' }}>
                <h2>Quick Actions</h2>
                <p style={{ color: '#888' }}>System is running normally. Real-time malpractice monitoring is active across all sessions.</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.location.href = '/admin/reports'} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Open Master Reports</button>
                    <button onClick={() => window.location.href = '/handler/dashboard'} style={{ padding: '0.8rem 1.5rem', background: '#334155', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>View Live Proctoring</button>
                </div>
            </div>
        </div>
    );
}
