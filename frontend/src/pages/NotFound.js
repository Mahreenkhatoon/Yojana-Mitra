import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found-page flex-center flex-col text-center">
    <div className="not-found-card animate-fade-up">
      <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🏛️</div>
      <div className="error-code-badge">404 • PAGE NOT FOUND</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)', margin: '0.75rem 0 0.5rem' }}>
        Scheme or Page Not Found
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
        The welfare scheme link or resource you are looking for has been relocated or is no longer listed in this portal index.
      </p>

      <div className="flex-center flex-wrap gap-2">
        <Link to="/" className="btn btn-primary">
          <span>🏠</span> Back to Home
        </Link>
        <Link to="/schemes" className="btn btn-outline">
          <span>📋</span> Browse All Schemes
        </Link>
        <Link to="/eligibility" className="btn btn-secondary">
          <span>🎯</span> Check Eligibility
        </Link>
      </div>
    </div>

    <style>{`
      .not-found-page {
        min-height: 75vh;
        padding: 3rem 1.5rem;
        background: radial-gradient(circle at 50% 20%, #e0e7ff 0%, #f8fafc 60%, #f1f5f9 100%);
      }
      .not-found-card {
        background: #ffffff;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 3rem 2rem;
        max-width: 540px;
        box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.1);
      }
      .error-code-badge {
        display: inline-block;
        background: #eff6ff;
        color: var(--primary);
        border: 1px solid #bfdbfe;
        border-radius: var(--radius-full);
        padding: 0.3rem 0.85rem;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.05em;
      }
    `}</style>
  </div>
);

export default NotFound;
