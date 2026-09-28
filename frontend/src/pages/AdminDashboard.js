import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EMPTY_SCHEME = {
  name: '', description: '', objective: '', category: '', ministry: '',
  targetBeneficiaries: '', eligibilitySummary: '', benefitAmount: '',
  benefitType: 'other', officialWebsite: '', applicationLink: '',
  helplineNumber: '', launchYear: '', isFeatured: false, isActive: true,
  benefits: [], documents: [], applicationProcess: [], states: [], tags: [],
};

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ fontSize: '2rem' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', fontWeight: 600 }}>{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [tab,       setTab]       = useState('overview');
  const [stats,     setStats]     = useState(null);
  const [schemes,   setSchemes]   = useState([]);
  const [users,     setUsers]     = useState([]);
  const [categories,setCategories]= useState([]);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState('');

  // Scheme form state
  const [showForm,  setShowForm]  = useState(false);
  const [formData,  setFormData]  = useState(EMPTY_SCHEME);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, sc, u, c] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getSchemes({ limit: 100 }),
        adminAPI.getUsers({ limit: 50 }),
        categoriesAPI.getAll(),
      ]);
      setStats(s.data.stats);
      setSchemes(sc.data.schemes || []);
      setUsers(u.data.users || []);
      setCategories(c.data.categories || []);
    } catch (err) {
      setMsg('❌ Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };

  const handleSchemeSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convert comma-separated fields to arrays
      const payload = {
        ...formData,
        benefits          : parseLines(formData.benefits),
        documents         : parseLines(formData.documents),
        applicationProcess: parseLines(formData.applicationProcess),
        tags              : typeof formData.tags === 'string' ? formData.tags.split(',').map(t=>t.trim()).filter(Boolean) : formData.tags,
        states            : typeof formData.states === 'string' ? formData.states.split(',').map(t=>t.trim()).filter(Boolean) : formData.states,
      };

      if (editId) {
        await adminAPI.updateScheme(editId, payload);
        flash('✅ Scheme updated.');
      } else {
        await adminAPI.createScheme(payload);
        flash('✅ Scheme created.');
      }
      setShowForm(false); setEditId(null); setFormData(EMPTY_SCHEME);
      loadData();
    } catch (err) {
      flash('❌ ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const parseLines = (val) => {
    if (Array.isArray(val)) return val;
    return val.split('\n').map(l => l.trim()).filter(Boolean);
  };

  const startEdit = (scheme) => {
    setFormData({
      ...scheme,
      benefits          : scheme.benefits?.join('\n') || '',
      documents         : scheme.documents?.join('\n') || '',
      applicationProcess: scheme.applicationProcess?.join('\n') || '',
      tags              : scheme.tags?.join(', ') || '',
      states            : scheme.states?.join(', ') || '',
    });
    setEditId(scheme._id);
    setShowForm(true);
    setTab('schemes');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scheme? This cannot be undone.')) return;
    await adminAPI.deleteScheme(id);
    flash('✅ Scheme deleted.');
    loadData();
  };

  const handleToggleScheme = async (id) => {
    await adminAPI.toggleScheme(id);
    flash('✅ Status updated.');
    loadData();
  };

  const handleToggleUser = async (id) => {
    await adminAPI.toggleUser(id);
    flash('✅ User status updated.');
    loadData();
  };

  if (loading) return <div className="loading-center" style={{ minHeight: '80vh' }}><div className="spinner" /></div>;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div className="container" style={s.headerInner}>
          <div>
            <h1 style={{ color: '#fff', marginBottom: '0.25rem' }}>⚙️ Admin Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Manage schemes, users and categories</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-sm btn-outline-white">Logout</button>
          </div>
        </div>
      </div>

      <div className="container" style={s.content}>
        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>{msg}</div>}

        {/* Tabs */}
        <div style={s.tabs}>
          {['overview', 'schemes', 'users', 'categories'].map(t => (
            <button key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
              onClick={() => { setTab(t); setShowForm(false); }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && stats && (
          <div>
            <div style={s.statsGrid}>
              <StatCard label="Total Schemes"    value={stats.totalSchemes}   icon="📋" color="var(--primary)" />
              <StatCard label="Active Schemes"   value={stats.activeSchemes}  icon="✅" color="var(--success)" />
              <StatCard label="Total Users"      value={stats.totalUsers}     icon="👥" color="var(--info)" />
              <StatCard label="Featured Schemes" value={stats.featuredSchemes}icon="⭐" color="var(--warning)" />
            </div>
            <div style={s.card}>
              <h3 style={{ marginBottom: '1rem' }}>Schemes by Category</h3>
              <div style={s.catList}>
                {stats.categoryCounts?.map(({ _id, count }) => (
                  <div key={_id} style={s.catRow}>
                    <span style={{ fontWeight: 600 }}>{_id}</span>
                    <div style={s.catBar}>
                      <div style={{ ...s.catFill, width: `${Math.round(count / stats.totalSchemes * 100)}%` }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)', width: '30px', textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <h3 style={{ marginBottom: '1rem' }}>Recent Users</h3>
              <table style={s.table}>
                <thead><tr style={s.thead}>{['Name','Email','Joined'].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {stats.recentUsers?.map(u => (
                    <tr key={u._id} style={s.tr}>
                      <td style={s.td}>{u.name}</td>
                      <td style={s.td}>{u.email}</td>
                      <td style={s.td}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Schemes Tab ── */}
        {tab === 'schemes' && (
          <div>
            {/* Scheme Form */}
            {showForm ? (
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3>{editId ? 'Edit Scheme' : 'Add New Scheme'}</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setEditId(null); setFormData(EMPTY_SCHEME); }}>✕ Cancel</button>
                </div>
                <form onSubmit={handleSchemeSubmit}>
                  <div style={s.formGrid}>
                    {[
                      ['name',       'Scheme Name *', 'text'],
                      ['ministry',   'Ministry / Department *', 'text'],
                      ['benefitAmount', 'Benefit Amount', 'text'],
                      ['officialWebsite', 'Official Website URL', 'url'],
                      ['applicationLink', 'Application Link', 'url'],
                      ['helplineNumber',  'Helpline Number', 'text'],
                      ['launchYear',  'Launch Year', 'number'],
                    ].map(([key, label, type]) => (
                      <div className="form-group" key={key}>
                        <label className="form-label">{label}</label>
                        <input type={type} className="form-control" value={formData[key] || ''}
                          onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-control" value={formData.category}
                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                        <option value="">-- Select --</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Benefit Type</label>
                      <select className="form-control" value={formData.benefitType}
                        onChange={e => setFormData(p => ({ ...p, benefitType: e.target.value }))}>
                        {['financial','subsidy','loan','insurance','education','housing','employment','health','other'].map(bt =>
                          <option key={bt} value={bt}>{bt}</option>)}
                      </select>
                    </div>
                  </div>

                  {[
                    ['description', 'Description *', 4],
                    ['objective',   'Objective',     3],
                    ['eligibilitySummary', 'Eligibility Summary', 2],
                    ['targetBeneficiaries','Target Beneficiaries',2],
                    ['benefits',    'Benefits (one per line)', 4],
                    ['documents',   'Required Documents (one per line)', 4],
                    ['applicationProcess', 'Application Steps (one per line)', 4],
                    ['tags',        'Tags (comma-separated)', 2],
                    ['states',      'States (comma-separated, leave empty for pan-India)', 2],
                  ].map(([key, label, rows]) => (
                    <div className="form-group" key={key}>
                      <label className="form-label">{label}</label>
                      <textarea className="form-control" rows={rows} value={formData[key] || ''}
                        onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!formData.isFeatured}
                        onChange={e => setFormData(p => ({ ...p, isFeatured: e.target.checked }))} />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!formData.isActive}
                        onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />
                      <span className="text-sm font-medium">Active</span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg mt-3" disabled={saving}>
                    {saving ? <><span className="spinner spinner-sm" /> Saving…</> : (editId ? '💾 Update Scheme' : '➕ Create Scheme')}
                  </button>
                </form>
              </div>
            ) : (
              <button className="btn btn-primary mb-3" onClick={() => { setFormData(EMPTY_SCHEME); setEditId(null); setShowForm(true); }}>
                ➕ Add New Scheme
              </button>
            )}

            {/* Schemes table */}
            <div style={s.card}>
              <h3 style={{ marginBottom: '1rem' }}>All Schemes ({schemes.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr style={s.thead}>
                      {['Name','Category','Benefit','Status','Featured','Actions'].map(h =>
                        <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map(scheme => (
                      <tr key={scheme._id} style={s.tr}>
                        <td style={s.td}><strong>{scheme.name}</strong></td>
                        <td style={s.td}><span className="badge badge-primary">{scheme.category}</span></td>
                        <td style={s.td}>{scheme.benefitAmount || '—'}</td>
                        <td style={s.td}>
                          <span className={`badge ${scheme.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {scheme.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={s.td}>{scheme.isFeatured ? '⭐' : '—'}</td>
                        <td style={{ ...s.td, display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-sm btn-outline" onClick={() => startEdit(scheme)}>Edit</button>
                          <button className="btn btn-sm btn-ghost"  onClick={() => handleToggleScheme(scheme._id)}>
                            {scheme.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(scheme._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div style={s.card}>
            <h3 style={{ marginBottom: '1rem' }}>Registered Users ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    {['Name','Email','Role','Status','Joined','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={s.tr}>
                      <td style={s.td}>{user.name}</td>
                      <td style={s.td}>{user.email}</td>
                      <td style={s.td}><span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>{user.role}</span></td>
                      <td style={s.td}><span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={s.td}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={s.td}>
                        {user.role !== 'admin' && (
                          <button className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleUser(user._id)}>
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Categories Tab ── */}
        {tab === 'categories' && (
          <div style={s.card}>
            <h3 style={{ marginBottom: '1rem' }}>Categories ({categories.length})</h3>
            <div style={s.catCardsGrid}>
              {categories.map(cat => (
                <div key={cat._id} style={s.catCardAdmin}>
                  <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700 }}>{cat.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{cat.schemeCount} schemes</div>
                  <div className="badge badge-gray" style={{ marginTop: '0.4rem' }}>{cat.slug}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: '3rem' },
  header: { background: 'linear-gradient(135deg, #1a3a8f, #1a56db)', padding: '1.75rem 0', marginBottom: '2rem' },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  content: { maxWidth: '1100px' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 1.2rem', border: '1.5px solid var(--border)', borderRadius: '999px', background: '#fff', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray-700)', transition: 'all 0.2s' },
  tabActive: { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  card: { background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem' },
  catList: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  catRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  catBar: { flex: 1, height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' },
  catFill: { height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' },
  thead: { background: 'var(--gray-50)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--gray-500)', fontSize: '0.78rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  td: { padding: '0.75rem 1rem', verticalAlign: 'middle' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' },
  catCardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' },
  catCardAdmin: { background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' },
};

export default AdminDashboard;
