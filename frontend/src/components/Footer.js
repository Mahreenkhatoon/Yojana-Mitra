import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    {/* Tricolor Top Line */}
    <div className="tricolor-bar" />

    {/* Helplines Emergency Bar */}
    <div className="footer-helplines-strip">
      <div className="container flex-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.1rem' }}>📞</span>
          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>
            National Citizen Welfare Helplines:
          </span>
        </div>
        <div className="helplines-links-flex">
          <span className="helpline-badge">General Portal: <strong>1800-11-0031</strong></span>
          <span className="helpline-badge">Kisan Call Center: <strong>1551</strong></span>
          <span className="helpline-badge">Ayushman Bharat: <strong>14555</strong></span>
          <span className="helpline-badge">Women Helpline: <strong>1091</strong></span>
        </div>
      </div>
    </div>

    <div className="container footer-main-content">
      <div className="footer-columns-grid">
        {/* Brand Column */}
        <div className="footer-col-brand">
          <div className="footer-brand-title">
            <span>🏛️</span> YojanaMitra
          </div>
          <p className="footer-brand-desc">
            Find the right government schemes, check your eligibility in seconds, and access benefits designed for your household with clarity and trust.
          </p>
          <div className="footer-trust-pill">
            <span>🛡️</span> Find. Check. Benefit.
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="footer-heading">Quick Navigation</div>
          <ul className="footer-nav-list">
            <li><Link to="/">🏠 Home</Link></li>
            <li><Link to="/eligibility">✅ Check Eligibility</Link></li>
            <li><Link to="/schemes">📋 Explore All Schemes</Link></li>
            <li><Link to="/register">📝 Create Citizen Account</Link></li>
            <li><Link to="/login">🔑 Citizen Sign In</Link></li>
          </ul>
        </div>

        {/* Welfare Categories */}
        <div>
          <div className="footer-heading">Welfare Sectors</div>
          <ul className="footer-nav-list">
            {['Agriculture', 'Education', 'Health', 'Employment', 'Housing', 'Pension', 'Women & Child Welfare', 'Skill Development'].map((c) => (
              <li key={c}>
                <Link to={`/schemes?category=${encodeURIComponent(c)}`}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Official Portals */}
        <div>
          <div className="footer-heading">Official Government Portals</div>
          <ul className="footer-nav-list">
            {[
              { label: 'MyScheme Portal',     url: 'https://myscheme.gov.in' },
              { label: 'India.gov.in National',url: 'https://india.gov.in' },
              { label: 'DigiLocker India',     url: 'https://digilocker.gov.in' },
              { label: 'Aadhaar (UIDAI)',      url: 'https://uidai.gov.in' },
              { label: 'National Scholarships',url: 'https://scholarships.gov.in' },
              { label: 'PM-KISAN Samman',     url: 'https://pmkisan.gov.in' },
              { label: 'Ayushman Bharat PMJAY',url: 'https://pmjay.gov.in' },
            ].map(({ label, url }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="external-portal-link">
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer Strip */}
      <div className="footer-bottom-strip">
        <div style={{ flex: 1 }}>
          © {new Date().getFullYear()} <strong>YojanaMitra</strong>. Educational & Civic Initiative.
          Not affiliated with any official political or government department.
        </div>
        <div style={{ color: '#94a3b8' }}>
          Find. Check. Benefit. • Built for Indian Citizens
        </div>
      </div>
    </div>

    {/* Scoped CSS for Footer */}
    <style>{`
      .site-footer {
        background: #09132b;
        color: #cbd5e1;
        margin-top: auto;
        position: relative;
      }
      .footer-helplines-strip {
        background: #0f1e42;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 0.75rem 0;
      }
      .helplines-links-flex {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .helpline-badge {
        font-size: 0.76rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.2rem 0.6rem;
        border-radius: var(--radius-full);
        color: #cbd5e1;
      }
      .helpline-badge strong {
        color: #fbbf24;
      }
      .footer-main-content {
        padding-top: 3.5rem;
      }
      .footer-columns-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
        gap: 2.5rem;
        padding-bottom: 3rem;
      }
      .footer-brand-title {
        font-size: 1.35rem;
        font-weight: 800;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.85rem;
      }
      .footer-brand-desc {
        font-size: 0.84rem;
        color: #94a3b8;
        line-height: 1.7;
        margin-bottom: 1.25rem;
      }
      .footer-trust-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.25);
        color: #34d399;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.35rem 0.75rem;
        border-radius: var(--radius-full);
      }
      .footer-heading {
        font-size: 0.85rem;
        font-weight: 800;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 1.15rem;
      }
      .footer-nav-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
      }
      .footer-nav-list a {
        color: #94a3b8;
        font-size: 0.84rem;
        text-decoration: none;
        transition: all 0.18s;
      }
      .footer-nav-list a:hover {
        color: #ffffff;
        transform: translateX(3px);
        display: inline-block;
      }
      .external-portal-link {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .footer-bottom-strip {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 1.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.8rem;
        color: #64748b;
      }
      @media (max-width: 960px) {
        .footer-columns-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 580px) {
        .footer-columns-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </footer>
);

export default Footer;
