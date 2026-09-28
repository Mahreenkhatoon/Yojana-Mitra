import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  eligible: {
    label: 'Eligible',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: '✅',
    summaryClass: 'summary-eligible',
  },
  partial: {
    label: 'Partially Eligible',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: '⚠️',
    summaryClass: 'summary-partial',
  },
  not_eligible: {
    label: 'Not Eligible',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '❌',
    summaryClass: 'summary-not',
  },
};

const FIELD_ICONS = {
  age: '🎂',
  income: '💰',
  gender: '👤',
  state: '📍',
  occupation: '💼',
  category: '🏷️',
  location: '🏘️',
  disability: '♿',
  bankAccount: '🏦',
  landOwnership: '🌾',
};

const ProfileSummary = ({ profile }) => {
  const items = [
    { key: 'age',           label: 'Age',        value: `${profile.age} years` },
    { key: 'gender',        label: 'Gender',     value: profile.gender },
    { key: 'state',         label: 'State',      value: profile.state },
    { key: 'income',        label: 'Income',     value: `₹${Number(profile.income).toLocaleString('en-IN')}/year` },
    { key: 'occupation',    label: 'Occupation', value: profile.occupation },
    { key: 'category',      label: 'Category',   value: profile.category?.toUpperCase() },
    { key: 'location',      label: 'Area Type',  value: profile.location },
    { key: 'landOwnership', label: 'Agri Land',  value: profile.landOwnership ? 'Yes, Owns Land' : 'No' },
  ];

  return (
    <div className="profile-summary-card">
      <div className="summary-card-header">
        <span>📋</span>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Your Input Profile</h4>
      </div>
      <div className="profile-items-list">
        {items.map(({ key, label, value }) => (
          <div key={label} className="profile-item-row">
            <span className="profile-item-icon">{FIELD_ICONS[key] || '•'}</span>
            <div style={{ flex: 1 }}>
              <div className="profile-item-label">{label}</div>
              <div className="profile-item-val">{value || '—'}</div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/eligibility" className="btn btn-outline btn-sm btn-full" style={{ marginTop: '1.25rem' }}>
        ✏️ Edit Input Profile
      </Link>
    </div>
  );
};

const RuleRow = ({ rule }) => {
  if (rule.passed === null) {
    return (
      <li className="rule-item-row rule-neutral">
        <span>ℹ️</span> <span>{rule.message}</span>
      </li>
    );
  }
  return (
    <li className={`rule-item-row ${rule.passed ? 'rule-passed' : 'rule-failed'}`}>
      <span>{rule.passed ? '✓' : '✗'}</span>
      <span>{rule.message}</span>
    </li>
  );
};

const ResultCard = ({ result, savedIds, onSave, onUnsave }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[result.status] || STATUS_CONFIG.partial;
  const saved = savedIds.has(result.scheme._id);

  return (
    <div className="result-scheme-card">
      {/* Top Status Accent Bar */}
      <div className="result-card-accent" style={{ background: cfg.color }} />

      <div className="result-card-inner">
        {/* Header Badges & Scheme Name */}
        <div className="result-header-flex">
          <div style={{ flex: 1 }}>
            <div className="result-badge-strip">
              <span
                className="status-pill-badge"
                style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
              >
                {cfg.icon} {cfg.label}
              </span>
              <span className="badge badge-gray">{result.scheme.category}</span>
              {result.totalRules > 0 && (
                <span className="badge badge-primary">
                  {result.eligibleCount}/{result.totalRules} Conditions Met ({result.score}%)
                </span>
              )}
            </div>

            <h3 className="result-scheme-title">
              <Link to={`/schemes/${result.scheme.slug || result.scheme._id}`}>
                {result.scheme.name}
              </Link>
            </h3>
            <p className="result-ministry-text">
              <span>🏛️</span> {result.scheme.ministry || 'Government of India'}
            </p>
          </div>

          {result.scheme.benefitAmount && (
            <div className="result-benefit-box">
              <span className="benefit-pill-label">Total Benefit</span>
              <span className="benefit-pill-value">{result.scheme.benefitAmount}</span>
            </div>
          )}
        </div>

        {/* Qualification Summary Banner */}
        <div className={`result-summary-alert ${cfg.summaryClass}`}>
          <span>{cfg.icon}</span>
          <p>
            <strong>{result.summary}</strong>
          </p>
        </div>

        {/* Criteria Breakdown Accordion */}
        {result.totalRules > 0 && (
          <div className="criteria-section">
            <button
              type="button"
              className="criteria-toggle-btn"
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? '▲ Hide' : '▼ View'} Detailed Eligibility Checklist</span>
              <span className="criteria-ratio">({result.eligibleCount} of {result.totalRules} met)</span>
            </button>

            {expanded && (
              <ul className="criteria-list-wrap animate-fade-up">
                {result.ruleResults?.map((rule, idx) => (
                  <RuleRow key={idx} rule={rule} />
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Required Documents Tag Row */}
        {result.scheme.documents?.length > 0 && (
          <div className="docs-preview-bar">
            <span style={{ fontWeight: 700, color: 'var(--dark)' }}>📄 Required Documents:</span>{' '}
            <span>{result.scheme.documents.slice(0, 3).join(' • ')}</span>
            {result.scheme.documents.length > 3 && (
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {' '}+{result.scheme.documents.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="result-footer-actions">
          <Link
            to={`/schemes/${result.scheme.slug || result.scheme._id}`}
            className="btn btn-primary btn-sm"
          >
            Full Scheme Details <span>→</span>
          </Link>

          {result.scheme.officialWebsite && (
            <a
              href={result.scheme.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Official Portal ↗
            </a>
          )}

          <button
            type="button"
            className={`btn btn-sm ${saved ? 'btn-danger' : 'btn-ghost'}`}
            onClick={() => (saved ? onUnsave(result.scheme._id) : onSave(result.scheme._id))}
            style={{ marginLeft: 'auto' }}
          >
            {saved ? '🔖 Bookmarked' : '🔖 Bookmark'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Results = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const [data,     setData]     = useState(null);
  const [filter,   setFilter]   = useState('all');
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem('eligibilityResults');
    if (!raw) {
      navigate('/eligibility');
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      navigate('/eligibility');
    }
  }, [navigate]);

  const handleSave = async (id) => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    try {
      await userAPI.save(id);
      setSavedIds((p) => new Set([...p, id]));
    } catch (err) {
      if (err.response?.status === 400) setSavedIds((p) => new Set([...p, id]));
    }
  };

  const handleUnsave = async (id) => {
    try {
      await userAPI.unsave(id);
      setSavedIds((p) => {
        const n = new Set(p);
        n.delete(id);
        return n;
      });
    } catch {}
  };

  if (!data) {
    return (
      <div className="loading-center">
        <div className="spinner spinner-lg" />
        <p className="text-muted">Loading your eligibility results...</p>
      </div>
    );
  }

  const { profile, summary, results } = data;

  const filtered =
    filter === 'all' ? results : results.filter((r) => r.status === filter);

  return (
    <div className="results-page-wrapper">
      {/* Banner */}
      <div className="results-hero-banner">
        <div className="container flex-between flex-wrap gap-2">
          <div>
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              🎉 Citizen Matching Complete
            </span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', marginBottom: '0.4rem' }}>
              Your Scheme Eligibility Report
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
              Evaluated against <strong>{summary.total}</strong> central and state welfare initiatives.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-outline-white btn-sm"
            >
              🖨️ Print / Save PDF
            </button>
            <Link to="/eligibility" className="btn btn-white btn-sm">
              ✏️ New Check
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4.5rem' }}>
        {/* Metric Counter Cards */}
        <div className="results-stats-grid">
          {[
            { label: 'Total Schemes Evaluated', value: summary.total,       color: '#1d4ed8', bg: '#eff6ff', icon: '🏛️' },
            { label: 'Directly Eligible',       value: summary.eligible,    color: '#059669', bg: '#ecfdf5', icon: '✅' },
            { label: 'Partially Eligible',      value: summary.partial,     color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
            { label: 'Currently Ineligible',    value: summary.notEligible, color: '#dc2626', bg: '#fef2f2', icon: '❌' },
          ].map(({ label, value, color, bg, icon }) => (
            <div key={label} className="result-metric-card" style={{ background: bg, borderColor: `${color}30` }}>
              <div className="flex-between">
                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                <span className="metric-val" style={{ color }}>{value}</span>
              </div>
              <div className="metric-lbl" style={{ color }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="results-layout-grid">
          {/* Main Feed */}
          <main>
            {/* Filter Tabs */}
            <div className="status-filter-pills">
              {[
                { key: 'all',          label: `All Schemes (${summary.total})` },
                { key: 'eligible',     label: `✅ Eligible (${summary.eligible})` },
                { key: 'partial',      label: `⚠️ Partially Eligible (${summary.partial})` },
                { key: 'not_eligible', label: `❌ Ineligible (${summary.notEligible})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`status-tab-btn ${filter === key ? 'active' : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {!isAuth && (
              <div className="alert alert-info">
                <span>💡</span>
                <div>
                  Want to track your eligible schemes?{' '}
                  <Link to="/register" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                    Create a free citizen account
                  </Link>{' '}
                  to save your results and receive notification updates.
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="empty-results-box">
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
                <h3>No Schemes Found Under This Filter</h3>
                <p style={{ color: '#64748b' }}>Try switching to the "All Schemes" tab to view all evaluations.</p>
              </div>
            ) : (
              <div className="results-list-stack">
                {filtered.map((result, i) => (
                  <ResultCard
                    key={result.scheme?._id || i}
                    result={result}
                    savedIds={savedIds}
                    onSave={handleSave}
                    onUnsave={handleUnsave}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="results-sidebar-stack">
            <ProfileSummary profile={profile} />

            {/* Next Steps Guidance Card */}
            <div className="next-steps-card">
              <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🚀</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Next Steps to Claim
              </h4>
              <ol className="next-steps-list">
                <li>Click <strong>Full Scheme Details</strong> to view instructions.</li>
                <li>Gather the required certificates mentioned on the scheme card.</li>
                <li>Click <strong>Official Portal</strong> to visit the authentic government website.</li>
                <li>Authenticate using Aadhaar e-KYC and submit your application.</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>

      {/* Scoped CSS for Results Page */}
      <style>{`
        .results-page-wrapper {
          background: #f8fafc;
          min-height: 100vh;
        }
        .results-hero-banner {
          background: radial-gradient(circle at 75% 25%, #1e40af 0%, #172554 60%, #0a1128 100%);
          padding: 3rem 0;
          color: #ffffff;
          margin-bottom: 2rem;
        }
        .results-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .result-metric-card {
          border-radius: var(--radius);
          border: 1.5px solid;
          padding: 1.25rem;
          box-shadow: var(--shadow-xs);
        }
        .metric-val {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }
        .metric-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
        .results-layout-grid {
          display: grid;
          grid-template-columns: 1fr 310px;
          gap: 2rem;
          align-items: start;
        }
        .status-filter-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .status-tab-btn {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background: #ffffff;
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.18s;
        }
        .status-tab-btn:hover {
          border-color: var(--primary);
          background: #eff6ff;
        }
        .status-tab-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }
        .results-list-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .result-scheme-card {
          background: #ffffff;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: transform 0.25s var(--ease), box-shadow 0.25s;
        }
        .result-scheme-card:hover {
          box-shadow: var(--shadow-md);
        }
        .result-card-accent {
          height: 4px;
          width: 100%;
        }
        .result-card-inner {
          padding: 1.5rem;
        }
        .result-header-flex {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 0.9rem;
        }
        .result-badge-strip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }
        .status-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 800;
          border: 1px solid;
        }
        .result-scheme-title {
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 0.25rem;
        }
        .result-scheme-title a {
          color: var(--dark);
          text-decoration: none;
        }
        .result-scheme-title a:hover {
          color: var(--primary);
        }
        .result-ministry-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .result-benefit-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 0.5rem 0.85rem;
          text-align: center;
          flex-shrink: 0;
          min-width: 130px;
        }
        .benefit-pill-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 800;
          color: #059669;
          text-transform: uppercase;
        }
        .benefit-pill-value {
          font-size: 0.92rem;
          font-weight: 800;
          color: #065f46;
        }
        .result-summary-alert {
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .summary-eligible {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }
        .summary-partial {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }
        .summary-not {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }
        .criteria-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
        }
        .criteria-toggle-btn {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.84rem;
          cursor: pointer;
        }
        .criteria-ratio {
          font-size: 0.78rem;
          color: #64748b;
        }
        .criteria-list-wrap {
          list-style: none;
          margin-top: 0.75rem;
          padding-top: 0.65rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .rule-item-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.84rem;
          line-height: 1.5;
        }
        .rule-passed {
          color: #059669;
        }
        .rule-failed {
          color: #dc2626;
        }
        .rule-neutral {
          color: #64748b;
        }
        .docs-preview-bar {
          font-size: 0.82rem;
          color: #475569;
          background: #f1f5f9;
          border-radius: 6px;
          padding: 0.55rem 0.85rem;
          margin-bottom: 1.15rem;
        }
        .result-footer-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          padding-top: 0.85rem;
          border-top: 1px solid #f1f5f9;
        }
        .profile-summary-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.35rem;
          box-shadow: var(--shadow-xs);
        }
        .summary-card-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }
        .profile-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .profile-item-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .profile-item-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .profile-item-label {
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1;
        }
        .profile-item-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--dark);
          text-transform: capitalize;
        }
        .next-steps-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius);
          padding: 1.35rem;
          margin-top: 1.25rem;
        }
        .next-steps-list {
          padding-left: 1.2rem;
          font-size: 0.82rem;
          color: #334155;
          line-height: 1.8;
        }
        .empty-results-box {
          background: #ffffff;
          border: 1px dashed var(--border);
          border-radius: var(--radius);
          padding: 3.5rem 1.5rem;
          text-align: center;
        }
        @media (max-width: 960px) {
          .results-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .results-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .results-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;
