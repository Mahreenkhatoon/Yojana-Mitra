import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]                 = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  // Clean validation suitable for college project
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      e.name = 'Full name must be at least 2 characters.';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Please provide a valid email address.';
    }
    if (!form.password) {
      e.password = 'Password is required.';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    } else if (!/\d/.test(form.password) || !/[a-zA-Z]/.test(form.password)) {
      e.password = 'Password must contain both letters and numbers.';
    }
    if (!form.confirm) {
      e.confirm = 'Please confirm your password.';
    } else if (form.password !== form.confirm) {
      e.confirm = 'Passwords do not match.';
    }
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const result = await register(form.name.trim(), form.email.trim(), form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.message || 'Registration failed. Please try again.');
      if (result.message && result.message.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: result.message }));
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-box animate-fade-up">
        {/* Tricolor accent bar */}
        <div className="tricolor-bar" style={{ borderRadius: '12px 12px 0 0' }} />

        <div className="auth-card-inner">
          <div className="auth-header text-center">
            <div className="auth-icon-bubble">📝</div>
            <h2 className="auth-title">Citizen Registration</h2>
            <p className="auth-sub">
              Create an account to save eligibility results and track welfare schemes
            </p>
          </div>

          {apiError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <span>⚠️</span>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Registration Failed</strong>
                <div>{apiError}</div>
                {apiError.toLowerCase().includes('already registered') && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      Already have an account? Sign In here →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="req">*</span>
              </label>
              <input
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'error' : ''}`}
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
              />
              {errors.name && <div className="form-error">⚠️ {errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address <span className="req">*</span>
              </label>
              <input
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                value={form.email}
                onChange={handleChange}
                placeholder="ramesh@example.com"
                autoComplete="email"
              />
              {errors.email && <div className="form-error">⚠️ {errors.email}</div>}
            </div>

            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Password <span className="req">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'error' : ''}`}
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters (e.g. Pass123)"
                autoComplete="new-password"
              />
              <div className="form-hint">At least 6 characters with letters and numbers</div>
              {errors.password && <div className="form-error">⚠️ {errors.password}</div>}
            </div>

            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Confirm Password <span className="req">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`form-control ${errors.confirm ? 'error' : ''}`}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              {errors.confirm && <div className="form-error">⚠️ {errors.confirm}</div>}
              {!errors.confirm && form.confirm && form.password === form.confirm && (
                <div style={{ color: '#059669', fontSize: '0.8rem', marginTop: '0.35rem', fontWeight: 600 }}>
                  ✓ Passwords match
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: '0.75rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm" /> Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Options */}
          <div className="auth-footer text-center">
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                Sign In here
              </Link>
            </p>
            <div className="auth-divider" />
            <Link
              to="/eligibility"
              className="btn btn-outline btn-sm btn-full"
            >
              🎯 Check Eligibility as Guest (No Registration Required)
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper {
          min-height: 85vh;
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
          max-width: 460px;
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

export default Register;
