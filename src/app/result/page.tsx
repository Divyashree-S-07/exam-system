
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ResultContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const router = useRouter();

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <div className="card" style={{ padding: '3rem' }}>
                {status === 'terminated' ? (
                    <>
                        <h1 style={{ color: 'var(--danger)', fontSize: '3rem', marginBottom: '1rem' }}>EXAM TERMINATED</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                            Malpractice was detected during your session. <br />
                            Your exam has been automatically submitted and reported.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 style={{ color: 'var(--success)', fontSize: '3rem', marginBottom: '1rem' }}>EXAM ENDED!</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                            You have successfully submitted your exam.
                        </p>
                    </>
                )}

                <button className="btn btn-primary" onClick={() => router.push('/login')}>
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultContent />
        </Suspense>
    );
}
