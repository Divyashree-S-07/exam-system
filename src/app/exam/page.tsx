
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Question = {
    id: string;
    text: string;
    options: string[];
};

export default function ExamPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [timeLeft, setTimeLeft] = useState(0);

    // Malpractice logs to prevent spamming
    const [hasTerminated, setHasTerminated] = useState(false);

    // LOG LOGIC
    const logMalpractice = useCallback(async (type: string, details?: string) => {
        if (hasTerminated) return;

        // Optimistic termination to stop UI
        setHasTerminated(true);
        alert(`MALPRACTICE DETECTED: ${type}. Exam Terminated.`);

        try {
            const res = await fetch('/api/exam/log-malpractice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ violationType: type, details }) // No sessionId needed
            });
            const data = await res.json();
            if (data.success || data.terminated) {
                router.push('/result?status=terminated');
            }
        } catch (e) {
            console.error(e);
        }
    }, [hasTerminated, router]);


    // INIT
    useEffect(() => {
        fetch(`/api/exam/questions`)
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then(data => {
                if (data.error) {
                    alert("Error: " + data.error);
                    router.push('/login');
                    return;
                }
                setQuestions(data.questions);

                // Calculate remaining time
                const start = new Date(data.startTime).getTime();
                const durationMs = data.durationMin * 60 * 1000;
                const end = start + durationMs;
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((end - now) / 1000));

                setTimeLeft(remaining);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
            });
    }, [router]);


    // TIMER
    useEffect(() => {
        if (loading || hasTerminated) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit(); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [loading, hasTerminated]);


    // MALPRACTICE LISTENERS
    useEffect(() => {
        if (loading || hasTerminated) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                logMalpractice('TAB_SWITCH', 'Switched tabs or minimized browser');
            }
        };

        const handleBlur = () => {
            logMalpractice('BLUR', 'Window lost focus');
        };

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                logMalpractice('DEVTOOLS', 'Attempted to open DevTools');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [loading, hasTerminated, logMalpractice]);


    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/exam/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }) // No sessionId needed
            });
            router.push('/result?status=completed');
        } catch (e) {
            alert('Submission failed');
        }
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div className="container">Loading Exam...</div>;

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--background)', zIndex: 10 }}>
                <h1>Exam in Progress</h1>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: timeLeft < 300 ? 'var(--danger)' : 'var(--primary)' }}>
                    Time Left: {formatTime(timeLeft)}
                </div>
            </header>

            <div style={{ marginTop: '2rem' }}>
                {questions.map((q, idx) => (
                    <div key={q.id} className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{idx + 1}. {q.text}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {q.options.map((opt) => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '0.5rem', background: answers[q.id] === opt ? 'var(--primary)' : 'var(--surface-hover)', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answers[q.id] === opt}
                                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                                        style={{ marginRight: '1rem' }}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '200px' }}>
                    Submit Exam
                </button>
            </div>
        </div>
    );
}
