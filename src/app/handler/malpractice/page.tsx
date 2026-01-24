
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MalpracticePage() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/handler/malpractice-list')
            .then(res => res.json())
            .then(data => setLogs(data.logs || []));
    }, []);

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Malpractice Logs</h1>
                <Link href="/handler/dashboard" className="btn" style={{ background: 'var(--surface)' }}>
                    Back to Dashboard
                </Link>
            </header>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Candidate</th>
                            <th style={{ padding: '1rem' }}>Violation Type</th>
                            <th style={{ padding: '1rem' }}>Details / Agent</th>
                            <th style={{ padding: '1rem' }}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{log.session.user.fullName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.session.user.username}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.8rem',
                                        background: 'var(--danger)',
                                        color: 'white'
                                    }}>
                                        {log.violationType}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{log.details || 'N/A'}</td>
                                <td style={{ padding: '1rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No malpractice recorded.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
