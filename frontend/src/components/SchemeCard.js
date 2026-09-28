import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_THEMES = {
  'Education'           : { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '🎓' },
  'Agriculture'         : { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', icon: '🌾' },
  'Employment'          : { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '💼' },
  'Women & Child Welfare':{ color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8', icon: '👩‍👧' },
  'Health'              : { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '🏥' },
  'Housing'             : { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: '🏠' },
  'Pension'             : { color: '#475569', bg: '#f1f5f9', border: '#cbd5e1', icon: '👴' },
  'Financial Assistance': { color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: '💰' },
  'Skill Development'   : { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: '🛠️' },
  'Entrepreneurship'    : { color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: '🚀' },
};

const SchemeCard = ({ scheme, saved, onSave, onUnsave, showSave = true }) => {
  const theme = CATEGORY_THEMES[scheme.category] || {
    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '🏛️'
  };

  return (
    <div className="scheme-modern-card">
      {/* Top Category Accent Line */}
      <div className="card-accent-bar" style={{ background: theme.color }} />

      <div className="scheme-card-inner">
        {/* Category & Status Badges */}
        <div className="scheme-badge-row">
          <span
            className="scheme-cat-pill"
            style={{ color: theme.color, background: theme.bg, borderColor: theme.border }}
          >
            <span>{theme.icon}</span> {scheme.category}
          </span>
          {scheme.isFeatured && (
            <span className="badge badge-warning" style={{ fontWeight: 700 }}>
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Scheme Name */}
        <h3 className="scheme-card-name">
          <Link to={`/schemes/${scheme.slug || scheme._id}`}>
            {scheme.name}
          </Link>
        </h3>

        {/* Ministry */}
        <p className="scheme-card-ministry">
          <span>🏛️</span> {scheme.ministry || 'Government of India'}
        </p>

        {/* Description snippet */}
        <p className="scheme-card-desc">
          {scheme.description?.length > 135
            ? scheme.description.slice(0, 135) + '…'
            : scheme.description}
        </p>

        {/* Highlighted Benefit Box */}
        {scheme.benefitAmount && (
          <div className="scheme-benefit-box">
            <div className="benefit-box-header">
              <span>⚡</span> BENEFIT VALUE
            </div>
            <div className="benefit-box-amount">
              {scheme.benefitAmount}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="scheme-card-footer">
          <Link
            to={`/schemes/${scheme.slug || scheme._id}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            View Details <span>→</span>
          </Link>

          {showSave && (
            <button
              onClick={() => (saved ? onUnsave?.(scheme._id) : onSave?.(scheme._id))}
              className={`btn btn-sm ${saved ? 'btn-danger' : 'btn-outline'}`}
              title={saved ? 'Remove from saved' : 'Save this scheme'}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark scheme'}
              style={{ padding: '0.45rem 0.75rem' }}
            >
              {saved ? '🔖 Saved' : '🔖 Save'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .scheme-modern-card {
          background: #ffffff;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease), border-color 0.25s;
        }
        .scheme-modern-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 30px -8px rgba(15, 23, 42, 0.12);
          border-color: #cbd5e1;
        }
        .card-accent-bar {
          height: 4px;
          width: 100%;
          flex-shrink: 0;
        }
        .scheme-card-inner {
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .scheme-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }
        .scheme-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.74rem;
          font-weight: 700;
          border: 1px solid;
          letter-spacing: 0.02em;
        }
        .scheme-card-name {
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.35rem;
        }
        .scheme-card-name a {
          color: var(--dark);
          text-decoration: none;
        }
        .scheme-card-name a:hover {
          color: var(--primary);
        }
        .scheme-card-ministry {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .scheme-card-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.55;
          margin-bottom: 1rem;
          flex: 1;
        }
        .scheme-benefit-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          margin-bottom: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .benefit-box-header {
          font-size: 0.68rem;
          font-weight: 800;
          color: #059669;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .benefit-box-amount {
          font-size: 0.92rem;
          font-weight: 800;
          color: #065f46;
          line-height: 1.2;
        }
        .scheme-card-footer {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default SchemeCard;
