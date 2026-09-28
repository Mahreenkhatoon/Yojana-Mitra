import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Both email and password are required.');
      return;
    }

    const result = await login(form.email, form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleFillDemo = (email, password) => {
    setForm({ email, password });
    setError('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-box animate-fade-up">
        {/* Tricolor accent bar */}
        <div className="tricolor-bar" style={{ borderRadius: '12px 12px 0 0' }} />

        <div className="auth-card-inner">
          <div className="auth-header text-center">
            <div className="auth-icon-bubble">🏛️</div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-sub">
              Sign in to manage your saved schemes and track your applications
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="req">*</span>
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="citizen@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Password <span className="req">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter account password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm" /> Authenticating...
                </>
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="demo-credentials-box">
            <div className="demo-header-label">⚡ ONE-CLICK DEMO LOGIN</div>
            <div className="demo-buttons-flex">
              <button
                type="button"
                className="demo-pill-btn"
                onClick={() => handleFillDemo('admin@smartgov.in', 'Admin@1234')}
              >
                <span>🔑</span> Admin (admin@smartgov.in)
              </button>
            </div>
          </div>

          {/* Footer Options */}
          <div className="auth-footer text-center">
            <p className="text-sm text-muted">
              Don’t have an account?{' '}
              <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                Create Free Account
              </Link>
            </p>
            <div className="auth-divider" />
            <Link
              to="/eligibility"
              className="btn btn-outline btn-sm btn-full"
            >
              🎯 Check Eligibility Without Signing In
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper {
          min-height: 82vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          background: radial-gradient(circle at 50% 10%, #e0e7ff 0%, #f8fafc 50%, #f1f5f9 100%);
        }
        .auth-card-box {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          width: 100%;
          maxWidth: 450px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12);
          overflow: hidden;
        }
        .auth-card-inner {
          padding: 2.25rem;
        }
        .auth-header {
          margin-bottom: 1.75rem;
        }
        .auth-icon-bubble {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 0.75rem;
        }
        .auth-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 0.35rem;
        }
        .auth-sub {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.5;
        }
        .demo-credentials-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          margin-top: 1.5rem;
          text-align: center;
        }
        .demo-header-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #92400e;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }
        .demo-buttons-flex {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .demo-pill-btn {
          background: #ffffff;
          border: 1px solid #fcd34d;
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          font-size: 0.76rem;
          font-weight: 700;
          color: #78350f;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .demo-pill-btn:hover {
          background: #fef3c7;
        }
        .auth-footer {
          margin-top: 1.5rem;
        }
        .auth-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 1.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default Login;
