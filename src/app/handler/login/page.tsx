
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HandlerLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/handler-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                // In a real app, strict session management. Here, simplistic local flag.
                router.push('/handler/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', borderTop: '4px solid var(--warning)' }}>
                <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Exam Handler</h1>
                <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Monitoring Access</p>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', color: 'white' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', color: 'white' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', backgroundColor: 'var(--warning)', color: 'black' }}>
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
