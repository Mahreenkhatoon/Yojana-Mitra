import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { schemesAPI, categoriesAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';

const BENEFIT_TYPES = [
  { id: 'financial',   label: 'Financial Grant' },
  { id: 'subsidy',     label: 'Subsidy' },
  { id: 'loan',        label: 'Low-Interest Loan' },
  { id: 'insurance',   label: 'Insurance Cover' },
  { id: 'education',   label: 'Scholarship / Education' },
  { id: 'housing',     label: 'Housing Allotment' },
  { id: 'employment',  label: 'Employment Guarantee' },
  { id: 'health',      label: 'Healthcare Benefit' },
  { id: 'other',       label: 'Other Assistance' },
];

const Explore = () => {
  const { isAuth } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes,    setSchemes]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [savedIds,   setSavedIds]   = useState(new Set());
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pages,      setPages]      = useState(1);

  const [search,      setSearch]      = useState(searchParams.get('search') || '');
  const [category,    setCategory]    = useState(searchParams.get('category') || '');
  const [benefitType, setBenefitType] = useState(searchParams.get('benefitType') || '');
  const [sort,        setSort]        = useState('-viewCount');

  const loadSchemes = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 9, sort };
      if (search)      params.search      = search;
      if (category)    params.category    = category;
      if (benefitType) params.benefitType = benefitType;

      const { data } = await schemesAPI.getAll(params);
      setSchemes(data.schemes || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(p);
    } catch (err) {
      console.error('Failed to load schemes:', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, benefitType, sort]);

  useEffect(() => {
    loadSchemes(1);
  }, [loadSchemes]);

  useEffect(() => {
    categoriesAPI
      .getAll()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuth) {
      userAPI
        .getSaved()
        .then(({ data }) => {
          const ids = new Set(data.savedSchemes?.map((s) => s.scheme?._id) || []);
          setSavedIds(ids);
        })
        .catch(() => {});
    }
  }, [isAuth]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search, category, benefitType });
    loadSchemes(1);
  };

  const handleSave = async (id) => {
    if (!isAuth) return;
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

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBenefitType('');
    setSearchParams({});
  };

  const hasFilters = Boolean(search || category || benefitType);

  return (
    <div className="explore-page-wrapper">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="explore-hero-banner">
        <div className="container">
          <div className="banner-content">
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              🏛️ Central & State Schemes Repository
            </span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', marginBottom: '0.5rem' }}>
              Explore Government Schemes
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', maxWidth: '620px' }}>
              Browse through verified Indian welfare schemes across 10 vital sectors. Filter by target category, benefit type, or ministry.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Search Bar Strip */}
        <form onSubmit={handleSearch} className="explore-search-bar">
          <div className="search-field-box">
            <span style={{ fontSize: '1.2rem', color: '#64748b' }}>🔍</span>
            <input
              type="text"
              className="explore-search-input"
              placeholder="Search by scheme name, ministry, objective, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
            Search Schemes
          </button>
        </form>

        {/* Main Grid: Filters + Cards */}
        <div className="explore-layout-grid">
          {/* Filters Sidebar */}
          <aside className="explore-sidebar">
            <div className="filter-card-box">
              <div className="filter-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  <span>🗂️</span> Filter Schemes
                </div>
                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="clear-all-link">
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="filter-group-item">
                <label className="filter-group-label">Category</label>
                <div className="chips-scroller">
                  <button
                    type="button"
                    onClick={() => setCategory('')}
                    className={`category-chip-btn ${category === '' ? 'active' : ''}`}
                  >
                    <span>All Sectors</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`category-chip-btn ${category === cat.name ? 'active' : ''}`}
                    >
                      <span>{cat.icon} {cat.name}</span>
                      <span className="chip-count">({cat.schemeCount || 0})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefit Type Filter */}
              <div className="filter-group-item">
                <label className="filter-group-label">Benefit Nature</label>
                <div className="chips-scroller">
                  <button
                    type="button"
                    onClick={() => setBenefitType('')}
                    className={`category-chip-btn ${benefitType === '' ? 'active' : ''}`}
                  >
                    All Types
                  </button>
                  {BENEFIT_TYPES.map((bt) => (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setBenefitType(bt.id)}
                      className={`category-chip-btn ${benefitType === bt.id ? 'active' : ''}`}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting Filter */}
              <div className="filter-group-item">
                <label className="filter-group-label">Sort Results By</label>
                <select
                  className="form-control"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-viewCount">🔥 Most Popular / Viewed</option>
                  <option value="-createdAt">✨ Newest / Recently Added</option>
                  <option value="name">🔤 Scheme Name (A–Z)</option>
                  <option value="-name">🔤 Scheme Name (Z–A)</option>
                </select>
              </div>

              {/* Quick Eligibility Callout in Sidebar */}
              <div className="sidebar-eligibility-promo">
                <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🎯</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a', marginBottom: '0.3rem' }}>
                  Want Personalised Results?
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.8rem' }}>
                  Enter your age, income, and category to see which schemes you qualify for.
                </p>
                <Link to="/eligibility" className="btn btn-primary btn-sm btn-full">
                  Check Eligibility <span>→</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Scheme Cards Feed */}
          <main className="explore-main-content">
            {/* Header info bar */}
            <div className="results-status-bar">
              <div style={{ fontWeight: 700, color: 'var(--dark)', fontSize: '0.95rem' }}>
                {loading ? (
                  'Searching repository...'
                ) : (
                  <span>
                    Showing <strong style={{ color: 'var(--primary)' }}>{total}</strong> verified scheme{total !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Active Filter Tags */}
              {hasFilters && (
                <div className="active-tag-pills">
                  {category && (
                    <span className="active-filter-badge">
                      Category: {category}
                      <button type="button" onClick={() => setCategory('')}>✕</button>
                    </span>
                  )}
                  {benefitType && (
                    <span className="active-filter-badge">
                      Type: {benefitType}
                      <button type="button" onClick={() => setBenefitType('')}>✕</button>
                    </span>
                  )}
                  {search && (
                    <span className="active-filter-badge">
                      "{search}"
                      <button type="button" onClick={() => setSearch('')}>✕</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="loading-center" style={{ minHeight: '380px' }}>
                <div className="spinner spinner-lg" />
                <p className="text-muted text-sm font-medium">Fetching schemes matching your filters...</p>
              </div>
            ) : schemes.length === 0 ? (
              <div className="empty-schemes-box">
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔍</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Schemes Found</h3>
                <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                  No schemes matched your exact combination of keywords and filters. Try clearing some filters or searching for terms like "Farmer", "Scholarship", or "Health".
                </p>
                <button type="button" onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="schemes-cards-grid">
                  {schemes.map((scheme) => (
                    <SchemeCard
                      key={scheme._id}
                      scheme={scheme}
                      saved={savedIds.has(scheme._id)}
                      onSave={handleSave}
                      onUnsave={handleUnsave}
                      showSave={isAuth}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="pagination-bar">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={page <= 1}
                      onClick={() => loadSchemes(page - 1)}
                    >
                      ← Previous
                    </button>
                    <div className="page-numbers-wrap">
                      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`page-num-btn ${p === page ? 'active' : ''}`}
                          onClick={() => loadSchemes(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={page >= pages}
                      onClick={() => loadSchemes(page + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Scoped CSS for Explore Page */}
      <style>{`
        .explore-page-wrapper {
          background: #f8fafc;
          min-height: 100vh;
        }
        .explore-hero-banner {
          background: radial-gradient(circle at 75% 30%, #1e40af 0%, #172554 60%, #0a1128 100%);
          padding: 3rem 0;
          margin-bottom: -1.75rem;
          color: #ffffff;
        }
        .explore-search-bar {
          background: #ffffff;
          padding: 0.6rem;
          border-radius: var(--radius);
          box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.1);
          border: 1px solid var(--border);
          display: flex;
          gap: 0.6rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 10;
        }
        .search-field-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
          padding: 0 0.8rem;
        }
        .explore-search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: var(--dark);
          outline: none;
        }
        .clear-search-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.2rem;
        }
        .clear-search-btn:hover {
          color: var(--dark);
        }
        .explore-layout-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: start;
        }
        .filter-card-box {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-xs);
          position: sticky;
          top: 90px;
        }
        .filter-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.25rem;
        }
        .clear-all-link {
          background: none;
          border: none;
          color: var(--danger);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .filter-group-item {
          margin-bottom: 1.35rem;
        }
        .filter-group-label {
          display: block;
          font-size: 0.76rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }
        .chips-scroller {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.3rem;
        }
        .category-chip-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.45rem 0.75rem;
          font-size: 0.82rem;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .category-chip-btn:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: var(--primary);
        }
        .category-chip-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 700;
        }
        .category-chip-btn.active .chip-count {
          color: rgba(255, 255, 255, 0.85);
        }
        .chip-count {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .sidebar-eligibility-promo {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-sm);
          padding: 1.1rem;
          margin-top: 1rem;
          text-align: center;
        }
        .results-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .active-tag-pills {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .active-filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: var(--radius-full);
          padding: 0.25rem 0.65rem;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .active-filter-badge button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 0.75rem;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .schemes-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.5rem;
        }
        .empty-schemes-box {
          background: #ffffff;
          border: 1.5px dashed var(--border);
          border-radius: var(--radius);
          padding: 4rem 2rem;
          text-align: center;
        }
        .pagination-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.6rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }
        .page-numbers-wrap {
          display: flex;
          gap: 0.3rem;
        }
        .page-num-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid var(--border);
          background: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
        }
        .page-num-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .page-num-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }
        @media (max-width: 900px) {
          .explore-layout-grid {
            grid-template-columns: 1fr;
          }
          .filter-card-box {
            position: static;
          }
          .explore-search-bar {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Explore;
