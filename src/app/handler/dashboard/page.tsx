
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [sessions, setSessions] = useState<any[]>([]);

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/handler/live-sessions');
            const data = await res.json();
            setSessions(data.sessions || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Live Exam Monitor</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/handler/malpractice" className="btn btn-danger">
                        View Malpractice Logs
                    </Link>
                    <button onClick={fetchSessions} className="btn" style={{ background: 'var(--surface)' }}>Refresh</button>
                </div>
            </header>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Candidate</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Start Time</th>
                            <th style={{ padding: '1rem' }}>Score</th>
                            <th style={{ padding: '1rem' }}>Violations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{s.user.fullName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.user.username}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.8rem',
                                        background: s.status === 'ACTIVE' ? 'var(--primary)' :
                                            s.status === 'TERMINATED' ? 'var(--danger)' : 'var(--success)',
                                        color: 'white'
                                    }}>
                                        {s.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(s.startTime).toLocaleTimeString()}</td>
                                <td style={{ padding: '1rem' }}>{s.score}</td>
                                <td style={{ padding: '1rem', color: s._count.malpracticeLogs > 0 ? 'var(--danger)' : 'inherit', fontWeight: 'bold' }}>
                                    {s._count.malpracticeLogs}
                                </td>
                            </tr>
                        ))}
                        {sessions.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No active sessions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
