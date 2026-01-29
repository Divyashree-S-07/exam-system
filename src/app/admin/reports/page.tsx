
'use client';

import { useEffect, useState } from 'react';

interface MalpracticeLog {
    id: string;
    violationType: string;
    timestamp: string;
    details: string | null;
    session: {
        user: {
            username: string;
            fullName: string;
        }
    }
}

export default function AdminReports() {
    const [logs, setLogs] = useState<MalpracticeLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/all-malpractice');
            const data = await res.json();
            if (data.logs) setLogs(data.logs);
        } catch (err) {
            console.error('Failed to fetch malpractice logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <a href="/admin/dashboard" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.9rem' }}>← Back to Dashboard</a>
                    <h1 style={{ color: 'var(--primary)', margin: '0.5rem 0 0' }}>Master Malpractice Reports</h1>
                </div>
                <button onClick={fetchLogs} className="btn-secondary">Refresh Logs</button>
            </div>

            <div className="card">
                {loading && logs.length === 0 ? <p>Loading logs...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Candidate</th>
                                <th style={{ padding: '1rem' }}>Violation</th>
                                <th style={{ padding: '1rem' }}>Timestamp</th>
                                <th style={{ padding: '1rem' }}>Context</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No malpractice recorded yet.</td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{log.session.user.fullName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{log.session.user.username}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            background: 'var(--danger)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                            {log.violationType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#888' }}>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#888', fontSize: '0.9rem' }}>
                                        {log.details || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
