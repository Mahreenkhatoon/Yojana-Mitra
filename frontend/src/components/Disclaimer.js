import React, { useState } from 'react';

const Disclaimer = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <aside className="official-disclaimer-bar" aria-label="Official Disclaimer">
      <div className="container flex items-center justify-between gap-3">
        <div className="flex items-center gap-2" style={{ flex: 1 }}>
          <span style={{ fontSize: '1.1rem' }}>🏛️</span>
          <p className="disclaimer-text">
            <strong>Official Guidance Notice:</strong> Eligibility predictions are generated automatically based on your provided inputs.
            Final benefit sanction and approval rest exclusively with the respective Union or State Government Ministry.
            Always cross-verify requirements and guidelines on the <strong>Official Government Portal</strong> before submitting formal applications.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="disclaimer-close-btn"
          aria-label="Dismiss notice"
          title="Dismiss"
        >
          ✕
        </button>
      </div>

      <style>{`
        .official-disclaimer-bar {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.65rem 0;
          position: relative;
          z-index: 50;
        }
        .disclaimer-text {
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.5;
        }
        .disclaimer-text strong {
          color: #0f172a;
        }
        .disclaimer-close-btn {
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .disclaimer-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
      `}</style>
    </aside>
  );
};

export default Disclaimer;
