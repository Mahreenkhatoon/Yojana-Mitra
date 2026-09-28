import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { schemesAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS = {
  'Education'            : '#2563eb',
  'Agriculture'          : '#059669',
  'Employment'           : '#d97706',
  'Women & Child Welfare': '#db2777',
  'Health'               : '#dc2626',
  'Housing'              : '#7c3aed',
  'Pension'              : '#475569',
  'Financial Assistance' : '#0d9488',
  'Skill Development'    : '#0284c7',
  'Entrepreneurship'     : '#ea580c',
};

const SchemeDetail = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { isAuth } = useAuth();

  const [scheme,  setScheme]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const loadScheme = async () => {
      try {
        const { data } = await schemesAPI.getById(id);
        setScheme(data.scheme);
      } catch {
        setError('Government Scheme details not found.');
      } finally {
        setLoading(false);
      }
    };
    loadScheme();
  }, [id]);

  const handleSave = async () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    try {
      await userAPI.save(scheme._id);
      setSaved(true);
      setSaveMsg('✅ Scheme saved to your dashboard.');
    } catch (err) {
      if (err.response?.status === 400) {
        setSaved(true);
        setSaveMsg('Already saved to your dashboard.');
      } else {
        setSaveMsg('❌ Could not save scheme.');
      }
    }
  };

  const handleUnsave = async () => {
    try {
      await userAPI.unsave(scheme._id);
      setSaved(false);
      setSaveMsg('Bookmark removed.');
    } catch {
      setSaveMsg('Error removing bookmark.');
    }
  };

  if (loading) {
    return (
      <div className="loading-center" style={{ minHeight: '60vh' }}>
        <div className="spinner spinner-lg" />
        <p className="text-muted">Retrieving official scheme guidelines...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="container section text-center">
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏛️</div>
        <h2>{error || 'Scheme Not Found'}</h2>
        <p className="text-muted mt-1" style={{ marginBottom: '1.5rem' }}>
          The requested scheme could not be located in the current database repository.
        </p>
        <Link to="/schemes" className="btn btn-primary">
          Browse All Schemes
        </Link>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[scheme.category] || '#1a56db';

  return (
    <div className="detail-page-wrapper">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <div
        className="detail-hero-banner"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${categoryColor} 0%, #0f172a 75%, #060d1f 100%)`,
        }}
      >
        <div className="container" style={{ maxWidth: '1050px' }}>
          {/* Breadcrumb Navigation */}
          <div className="detail-breadcrumb">
            <Link to="/schemes">← All Schemes</Link>
            <span>/</span>
            <span>{scheme.category}</span>
          </div>

          {/* Badges */}
          <div className="detail-badge-strip">
            <span
              className="badge"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.8rem' }}
            >
              {scheme.category}
            </span>
            {scheme.isFeatured && (
              <span className="badge badge-warning">⭐ Featured Initiative</span>
            )}
            {scheme.benefitType && (
              <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                {scheme.benefitType}
              </span>
            )}
          </div>

          <h1 className="detail-scheme-title">{scheme.name}</h1>
          <p className="detail-scheme-ministry">
            <span>🏛️</span> {scheme.ministry || 'Government of India'}
          </p>

          {/* Top Hero Actions */}
          <div className="detail-hero-actions">
            {saved ? (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleUnsave}
              >
                🔖 Remove Bookmark
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-white btn-sm"
                onClick={handleSave}
              >
                🔖 Bookmark Scheme
              </button>
            )}

            <Link
              to="/eligibility"
              className="btn btn-white btn-sm pulse-glow"
              style={{ fontWeight: 800 }}
            >
              ✅ Check My Eligibility
            </Link>

            {scheme.officialWebsite && (
              <a
                href={scheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-white btn-sm"
              >
                Official Portal ↗
              </a>
            )}
          </div>

          {saveMsg && (
            <div style={{ color: '#fbbf24', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 600 }}>
              {saveMsg}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT & SIDEBAR ─────────────────────────────────── */}
      <div className="container detail-main-container">
        <div className="detail-layout-grid">
          {/* Main Column */}
          <div className="detail-content-column">
            {/* Overview Card */}
            <div className="detail-card-panel">
              <h2 className="panel-title">
                <span>📖</span> Scheme Overview
              </h2>
              <p className="panel-text">{scheme.description}</p>

              {scheme.objective && (
                <div style={{ marginTop: '1.25rem' }}>
                  <h3 className="panel-subtitle">Primary Objective</h3>
                  <p className="panel-text">{scheme.objective}</p>
                </div>
              )}

              {scheme.targetBeneficiaries && (
                <div className="beneficiaries-highlight-box">
                  <strong>👥 Target Beneficiaries:</strong> {scheme.targetBeneficiaries}
                </div>
              )}
            </div>

            {/* Benefits Card */}
            {scheme.benefits?.length > 0 && (
              <div className="detail-card-panel">
                <h2 className="panel-title">
                  <span>🎁</span> Welfare Benefits & Assistance
                </h2>

                {scheme.benefitAmount && (
                  <div className="total-benefit-callout">
                    <span className="benefit-callout-label">Total Entitlement / Value</span>
                    <div className="benefit-callout-value">{scheme.benefitAmount}</div>
                  </div>
                )}

                <ul className="detail-benefit-list">
                  {scheme.benefits.map((b, i) => (
                    <li key={i} className="benefit-list-item">
                      <span className="check-icon">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility Criteria Checklist */}
            {scheme.eligibilityCriteria?.length > 0 && (
              <div className="detail-card-panel">
                <h2 className="panel-title">
                  <span>📋</span> Eligibility Criteria
                </h2>

                {scheme.eligibilitySummary && (
                  <p className="panel-text" style={{ marginBottom: '1.25rem' }}>
                    {scheme.eligibilitySummary}
                  </p>
                )}

                <ul className="criteria-checklist">
                  {scheme.eligibilityCriteria.map((c, i) => (
                    <li key={i} className="criteria-checklist-item">
                      <span className="bullet-node">◆</span>
                      <div>
                        <strong>{c.fieldLabel}:</strong>{' '}
                        <span>{c.label.replace('✅ ', '').replace('❌ ', '')}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="check-eligibility-callout">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e3a8a', marginBottom: '0.2rem' }}>
                    Want to confirm if your profile qualifies?
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
                    Our rule engine compares your age, caste, and income in real time.
                  </p>
                  <Link to="/eligibility" className="btn btn-primary btn-sm">
                    Run Eligibility Matcher <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Required Documents Card */}
            {scheme.documents?.length > 0 && (
              <div className="detail-card-panel">
                <h2 className="panel-title">
                  <span>📎</span> Required Documents Checklist
                </h2>
                <div className="documents-grid-layout">
                  {scheme.documents.map((doc, i) => (
                    <div key={i} className="doc-item-card">
                      <span className="doc-icon">📄</span>
                      <span className="doc-name">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Process Roadmap */}
            {scheme.applicationProcess?.length > 0 && (
              <div className="detail-card-panel">
                <h2 className="panel-title">
                  <span>🚀</span> Step-by-Step Application Process
                </h2>
                <div className="application-steps-roadmap">
                  {scheme.applicationProcess.map((step, i) => (
                    <div key={i} className="roadmap-step-item">
                      <div className="roadmap-step-num">{i + 1}</div>
                      <div className="roadmap-step-content">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Stack */}
          <aside className="detail-sidebar-stack">
            {/* Quick Information Summary Card */}
            <div className="detail-side-card">
              <h3 className="side-card-heading">
                <span>📊</span> Quick Information
              </h3>
              <div className="quick-info-table">
                {[
                  { label: 'Category',    value: scheme.category },
                  { label: 'Ministry',    value: scheme.ministry },
                  { label: 'Benefit Type',value: scheme.benefitType ? scheme.benefitType.toUpperCase() : 'N/A' },
                  { label: 'Launch Year', value: scheme.launchYear || 'Active' },
                  { label: 'Jurisdiction',value: scheme.states?.length === 0 ? 'Pan India (All States)' : scheme.states?.join(', ') },
                ].map(({ label, value }) => (
                  <div key={label} className="quick-info-row">
                    <span className="quick-info-lbl">{label}</span>
                    <span className="quick-info-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Action Box */}
            <div className="detail-side-card official-action-card">
              <h3 className="side-card-heading">
                <span>🔗</span> Official Government Portals
              </h3>

              {scheme.applicationLink && (
                <a
                  href={scheme.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-full btn-lg"
                  style={{ marginBottom: '0.65rem' }}
                >
                  Apply Online Now ↗
                </a>
              )}

              {scheme.officialWebsite && (
                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-full btn-sm"
                  style={{ marginBottom: '0.75rem' }}
                >
                  Visit Official Website ↗
                </a>
              )}

              {scheme.helplineNumber && (
                <div className="helpline-badge-box">
                  <span>📞 Helpline:</span> <strong>{scheme.helplineNumber}</strong>
                </div>
              )}

              <div className="official-disclaimer-mini">
                <span>⚠️</span>
                <span>
                  Always verify current terms, circulars, and deadlines on the official ministry website before submitting applications.
                </span>
              </div>
            </div>

            {/* Related Tags */}
            {scheme.tags?.length > 0 && (
              <div className="detail-side-card">
                <h3 className="side-card-heading">
                  <span>🏷️</span> Related Tags
                </h3>
                <div className="tag-chips-wrap">
                  {scheme.tags.map((tag, i) => (
                    <Link
                      key={i}
                      to={`/schemes?search=${encodeURIComponent(tag)}`}
                      className="badge badge-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Scoped CSS for Scheme Detail */}
      <style>{`
        .detail-page-wrapper {
          background: #f8fafc;
          min-height: 100vh;
          padding-bottom: 4.5rem;
        }
        .detail-hero-banner {
          padding: 3.5rem 0 3rem;
          color: #ffffff;
          position: relative;
        }
        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.25rem;
        }
        .detail-breadcrumb a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
        }
        .detail-breadcrumb a:hover {
          color: #ffffff;
        }
        .detail-badge-strip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }
        .detail-scheme-title {
          font-size: clamp(2rem, 3.8vw, 2.8rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin-bottom: 0.5rem;
        }
        .detail-scheme-ministry {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }
        .detail-hero-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .detail-main-container {
          max-width: 1050px;
          padding-top: 2.25rem;
        }
        .detail-layout-grid {
          display: grid;
          grid-template-columns: 1fr 330px;
          gap: 2.25rem;
          align-items: start;
        }
        .detail-content-column {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .detail-card-panel {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.75rem;
          box-shadow: var(--shadow-sm);
        }
        .panel-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .panel-subtitle {
          font-size: 1rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.35rem;
        }
        .panel-text {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.7;
        }
        .beneficiaries-highlight-box {
          background: #eff6ff;
          border-left: 4px solid var(--primary);
          padding: 0.75rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #1e3a8a;
          margin-top: 1.25rem;
        }
        .total-benefit-callout {
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
        }
        .benefit-callout-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #059669;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
        }
        .benefit-callout-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #065f46;
          margin-top: 0.2rem;
        }
        .detail-benefit-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .benefit-list-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.55;
        }
        .check-icon {
          color: #059669;
          font-weight: 800;
          font-size: 1rem;
        }
        .criteria-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .criteria-checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.55;
        }
        .bullet-node {
          color: var(--primary);
          font-size: 0.85rem;
          margin-top: 2px;
        }
        .check-eligibility-callout {
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          margin-top: 1.5rem;
        }
        .documents-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
        }
        .doc-item-card {
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #334155;
          font-weight: 500;
        }
        .doc-icon {
          font-size: 1.2rem;
        }
        .application-steps-roadmap {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
        }
        .roadmap-step-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .roadmap-step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .roadmap-step-content {
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.6;
          padding-top: 0.25rem;
        }
        .detail-sidebar-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 90px;
        }
        .detail-side-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-xs);
        }
        .side-card-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.6rem;
        }
        .quick-info-table {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .quick-info-row {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .quick-info-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .quick-info-val {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--dark);
          line-height: 1.4;
        }
        .helpline-badge-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          padding: 0.6rem;
          text-align: center;
          font-size: 0.85rem;
          color: #1e3a8a;
          margin-bottom: 0.85rem;
        }
        .official-disclaimer-mini {
          display: flex;
          gap: 0.45rem;
          font-size: 0.76rem;
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 6px;
          padding: 0.65rem;
          line-height: 1.5;
        }
        .tag-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        @media (max-width: 960px) {
          .detail-layout-grid {
            grid-template-columns: 1fr;
          }
          .detail-sidebar-stack {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default SchemeDetail;
