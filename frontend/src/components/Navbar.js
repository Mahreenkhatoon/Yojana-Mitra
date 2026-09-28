import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuth, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `nav-item-link ${isActive ? 'active' : ''}`;

  return (
    <header className="site-header">
      {/* 🇮🇳 Indian Civic Tricolor Top Bar */}
      <div className="tricolor-bar" />

      {/* Main Frosted Glass Navbar */}
      <nav className="main-nav">
        <div className="container flex-between" style={{ height: '70px' }}>
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileOpen(false)}>
            <div className="brand-emblem">
              <span>🏛️</span>
            </div>
            <div>
              <div className="brand-title">Yojana<span style={{ color: 'var(--primary)', fontWeight: 800 }}>Mitra</span></div>
              <div className="brand-sub">Find. Check. Benefit.</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="desktop-nav-links">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/schemes" className={navLinkClass}>
              Explore Schemes
            </NavLink>
            <a className="nav-item-link" href="https://pgportal.gov.in/" target="_blank" rel="noreferrer">
              Grievance
            </a>
            <NavLink to="/eligibility" className={({ isActive }) => `eligibility-btn-nav ${isActive ? 'active' : ''}`}>
              <span className="sparkle-dot"></span>
              Check Eligibility
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                ⚙️ Admin
              </NavLink>
            )}
          </div>

          {/* Auth / Action Area */}
          <div className="nav-auth-area">
            {isAuth ? (
              <div className="user-profile-menu">
                <Link to="/dashboard" className="user-pill-btn">
                  <div className="user-avatar-circle">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hide-mobile" style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark)' }}>
                      {user?.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Citizen Dashboard</div>
                  </div>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-xs" title="Logout">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="mobile-drawer animate-fade-up">
          <NavLink to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>
            <span>🏠</span> Home
          </NavLink>
          <NavLink to="/schemes" className="mobile-link" onClick={() => setMobileOpen(false)}>
            <span>📋</span> Explore Schemes
          </NavLink>
          <a className="mobile-link" href="https://pgportal.gov.in/" target="_blank" rel="noreferrer">
            <span>📝</span> Grievance
          </a>
          <NavLink to="/eligibility" className="mobile-link highlight" onClick={() => setMobileOpen(false)}>
            <span>✅</span> Check My Eligibility
          </NavLink>
          {isAuth && (
            <NavLink to="/dashboard" className="mobile-link" onClick={() => setMobileOpen(false)}>
              <span>👤</span> Citizen Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="mobile-link" onClick={() => setMobileOpen(false)}>
              <span>⚙️</span> Admin Portal
            </NavLink>
          )}

          <div style={{ margin: '0.75rem 0', borderTop: '1px solid var(--border)' }} />

          {isAuth ? (
            <button onClick={handleLogout} className="mobile-link" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--danger)' }}>
              <span>🚪</span> Sign Out ({user?.name})
            </button>
          ) : (
            <div className="flex gap-2" style={{ padding: '0.5rem 0' }}>
              <Link to="/login" className="btn btn-outline btn-full btn-sm" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-full btn-sm" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Scoped CSS Styles for Navbar */}
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
        }
        .utility-bar {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .main-nav {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .brand-emblem {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1.5px solid #bfdbfe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.12);
          transition: transform 0.2s var(--ease);
        }
        .brand-logo:hover .brand-emblem {
          transform: scale(1.05);
        }
        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--dark);
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .brand-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .desktop-nav-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-item-link {
          color: #475569;
          font-size: 0.92rem;
          font-weight: 600;
          padding: 0.4rem 0.2rem;
          position: relative;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-item-link:hover, .nav-item-link.active {
          color: var(--primary);
        }
        .nav-item-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2.5px;
          background: var(--primary);
          border-radius: 99px;
        }
        .eligibility-btn-nav {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 1rem;
          background: #eff6ff;
          color: var(--primary);
          border: 1.5px solid #bfdbfe;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s var(--ease);
        }
        .eligibility-btn-nav:hover, .eligibility-btn-nav.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }
        .sparkle-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
          animation: pulseGlow 2s infinite;
        }
        .nav-auth-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .user-pill-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.75rem 0.3rem 0.35rem;
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          text-decoration: none;
          transition: all 0.2s;
        }
        .user-pill-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .user-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.6rem;
          color: var(--dark);
          cursor: pointer;
          padding: 0.3rem;
          line-height: 1;
        }
        .mobile-drawer {
          display: none;
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          padding: 1rem 1.5rem 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.5rem;
          color: #334155;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .mobile-link:hover {
          background: #f1f5f9;
          color: var(--primary);
        }
        .mobile-link.highlight {
          color: var(--primary);
          background: #eff6ff;
          font-weight: 700;
        }
        @media (max-width: 920px) {
          .desktop-nav-links { display: none !important; }
          .hamburger-btn { display: block !important; }
          .mobile-drawer { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
