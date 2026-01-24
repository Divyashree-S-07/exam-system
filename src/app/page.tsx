
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #2563eb, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Multi-Role Examination System
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Secure, monitored, and efficient.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/login" className="card" style={{ width: '300px', cursor: 'pointer', transition: 'transform 0.2s', textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>For Candidates</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Take your scheduled exams in a secure environment.
          </p>
          <div className="btn btn-primary" style={{ width: '100%' }}>Login as Candidate</div>
        </Link>

        <Link href="/handler/login" className="card" style={{ width: '300px', cursor: 'pointer', transition: 'transform 0.2s', textDecoration: 'none', color: 'inherit', display: 'block', borderColor: 'var(--warning)' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>For Handlers</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Monitor live exams and view malpractice reports.
          </p>
          <div className="btn" style={{ width: '100%', background: 'var(--warning)', color: 'black' }}>Login as Handler</div>
        </Link>
      </div>
    </div>
  );
}
