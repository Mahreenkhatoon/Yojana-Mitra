import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../services/api';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Delhi','Jammu & Kashmir',
  'Lakshadweep','Puducherry',
];

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return '';
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return age;
};

const Dashboard = () => {
  const { user, updateUser, logout } = useAuth();

  const [tab,          setTab]          = useState('profile');
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [profile,      setProfile]      = useState(user?.profile || {});
  const [name,         setName]         = useState(user?.name || '');
  const [saving,       setSaving]       = useState(false);
  const [msg,          setMsg]          = useState('');
  const [pwForm,       setPwForm]       = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg,        setPwMsg]        = useState('');

  useEffect(() => {
    userAPI
      .getSaved()
      .then(({ data }) => setSavedSchemes(data.savedSchemes || []))
      .catch(() => {})
      .finally(() => setLoadingSaved(false));
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const { data } = await authAPI.updateProfile({ name, profile });
      updateUser(data.user);
      setMsg('✅ Citizen profile updated successfully!');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Update failed.'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg('❌ Passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg('❌ Password must be at least 6 characters.');
      return;
    }
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('✅ Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwMsg('❌ ' + (err.response?.data?.message || 'Password update failed.'));
    }
  };

  const handleUnsave = async (schemeId) => {
    await userAPI.unsave(schemeId);
    setSavedSchemes((p) => p.filter((s) => s.scheme?._id !== schemeId));
  };

  return (
    <div className="dashboard-page-wrapper">
      {/* Top Banner */}
      <div className="dashboard-hero-banner">
        <div className="container flex-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="dashboard-avatar-large">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="dashboard-user-name">{user?.name}</div>
              <div className="dashboard-user-email">{user?.email}</div>
              <div className="dashboard-user-role-badge">
                <span>🛡️ Verified Citizen Account</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/eligibility" className="btn btn-secondary btn-sm">
              <span>🎯</span> Check New Eligibility
            </Link>
            <button onClick={logout} className="btn btn-outline-white btn-sm">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4.5rem' }}>
        {/* Navigation Tabs */}
        <div className="dashboard-tab-bar">
          <button
            type="button"
            className={`dashboard-tab-item ${tab === 'profile' ? 'active' : ''}`}
            onClick={() => setTab('profile')}
          >
            <span>👤</span> Citizen Profile
          </button>
          <button
            type="button"
            className={`dashboard-tab-item ${tab === 'saved' ? 'active' : ''}`}
            onClick={() => setTab('saved')}
          >
            <span>🔖</span> Bookmarked Schemes ({savedSchemes.length})
          </button>
          <button
            type="button"
            className={`dashboard-tab-item ${tab === 'security' ? 'active' : ''}`}
            onClick={() => setTab('security')}
          >
            <span>🔒</span> Security & Password
          </button>
        </div>

        {/* Tab 1: Profile */}
        {tab === 'profile' && (
          <div className="dashboard-card-box animate-fade-up">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Manage Your Demographic Profile</h3>
              <p className="dashboard-card-sub">
                Keeping this updated helps us provide instant 100% accurate scheme recommendations.
              </p>
            </div>

            {msg && (
              <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
                {msg}
              </div>
            )}

            <form onSubmit={handleProfileSave}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.email}
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={profile.dateOfBirth || ''}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => {
                      const dateOfBirth = e.target.value;
                      const age = calculateAge(dateOfBirth);
                      setProfile((p) => ({ ...p, dateOfBirth, age: age === '' ? '' : age }));
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    className="form-control"
                    value={profile.age || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, age: Number(e.target.value) }))}
                    readOnly={Boolean(profile.dateOfBirth)}
                    placeholder="e.g. 28"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    value={profile.gender || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">State of Residence</label>
                  <select
                    className="form-control"
                    value={profile.state || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                  >
                    <option value="">-- Choose State --</option>
                    {STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Area Type</label>
                  <select
                    className="form-control"
                    value={profile.location || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  >
                    <option value="">-- Select Area Type --</option>
                    <option value="rural">Rural (Village)</option>
                    <option value="urban">Urban (City)</option>
                    <option value="semi-urban">Semi-Urban</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={profile.income || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, income: Number(e.target.value) }))}
                    placeholder="e.g. 150000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Social Category</label>
                  <select
                    className="form-control"
                    value={profile.category || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="">-- Select Category --</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="ews">EWS</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Saved Schemes */}
        {tab === 'saved' && (
          <div className="dashboard-card-box animate-fade-up">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Bookmarked Government Schemes</h3>
              <p className="dashboard-card-sub">
                Quick access to schemes you have shortlisted for application.
              </p>
            </div>

            {loadingSaved ? (
              <div className="loading-center">
                <div className="spinner spinner-sm" />
                <p className="text-muted">Loading saved schemes...</p>
              </div>
            ) : savedSchemes.length === 0 ? (
              <div className="empty-saved-box">
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔖</div>
                <h3>No Bookmarked Schemes Yet</h3>
                <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>
                  Explore the schemes catalog and click the Bookmark button on any scheme to save it here.
                </p>
                <Link to="/schemes" className="btn btn-primary btn-sm">
                  Browse Schemes Catalog
                </Link>
              </div>
            ) : (
              <div className="saved-schemes-list">
                {savedSchemes.map(({ scheme, savedAt }) => {
                  if (!scheme) return null;
                  return (
                    <div key={scheme._id} className="saved-scheme-row">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge badge-primary">{scheme.category}</span>
                          {scheme.benefitAmount && (
                            <span className="badge badge-success">{scheme.benefitAmount}</span>
                          )}
                        </div>
                        <h4 className="saved-scheme-name">
                          <Link to={`/schemes/${scheme.slug || scheme._id}`}>
                            {scheme.name}
                          </Link>
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          🏛️ {scheme.ministry || 'Government of India'}
                        </p>
                      </div>

                      <div className="saved-actions-flex">
                        <Link
                          to={`/schemes/${scheme.slug || scheme._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Details <span>→</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleUnsave(scheme._id)}
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Security */}
        {tab === 'security' && (
          <div className="dashboard-card-box animate-fade-up" style={{ maxWidth: '540px', margin: '0 auto' }}>
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Update Account Password</h3>
              <p className="dashboard-card-sub">
                Ensure your account is protected with a secure password.
              </p>
            </div>

            {pwMsg && (
              <div className={`alert ${pwMsg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
                {pwMsg}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-page-wrapper {
          background: #f8fafc;
          min-height: 100vh;
        }
        .dashboard-hero-banner {
          background: radial-gradient(circle at 75% 25%, #1e40af 0%, #172554 60%, #0a1128 100%);
          padding: 2.75rem 0;
          color: #ffffff;
          margin-bottom: 2rem;
        }
        .dashboard-avatar-large {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .dashboard-user-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
        }
        .dashboard-user-email {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.3rem;
        }
        .dashboard-user-role-badge {
          display: inline-block;
          font-size: 0.72rem;
          color: #bfdbfe;
          font-weight: 700;
        }
        .dashboard-tab-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }
        .dashboard-tab-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          background: none;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
        }
        .dashboard-tab-item:hover {
          color: var(--primary);
          background: #eff6ff;
        }
        .dashboard-tab-item.active {
          color: var(--primary);
          background: #eff6ff;
          border-color: #bfdbfe;
          font-weight: 700;
        }
        .dashboard-card-box {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }
        .dashboard-card-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .dashboard-card-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 0.25rem;
        }
        .dashboard-card-sub {
          font-size: 0.86rem;
          color: var(--text-muted);
        }
        .saved-schemes-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .saved-scheme-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          gap: 1.5rem;
          flex-wrap: wrap;
          transition: border-color 0.2s;
        }
        .saved-scheme-row:hover {
          border-color: var(--primary);
          background: #ffffff;
        }
        .saved-scheme-name {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }
        .saved-scheme-name a {
          color: var(--dark);
          text-decoration: none;
        }
        .saved-scheme-name a:hover {
          color: var(--primary);
        }
        .saved-actions-flex {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .empty-saved-box {
          text-align: center;
          padding: 3rem 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
