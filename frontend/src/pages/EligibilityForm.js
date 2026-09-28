import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eligibilityAPI } from '../services/api';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const OCCUPATIONS = [
  'Student','Farmer','Agriculture','Salaried Employee','Self-employed',
  'Business','Entrepreneur','Shopkeeper','Artisan','Vendor','Street Vendor',
  'Daily Wage Worker','Unemployed','Housewife','Retired','Other',
];

const EDUCATION = [
  'No Formal Education','Primary (up to 5th)','Middle (up to 8th)',
  'High School (10th)','Higher Secondary (12th)','Diploma/ITI',
  'Graduate','Post Graduate','Doctorate',
];

const SOCIAL_CATEGORIES = [
  { id: 'general', label: 'General', desc: 'Open category' },
  { id: 'obc',     label: 'OBC',     desc: 'Other Backward Classes' },
  { id: 'sc',      label: 'SC',      desc: 'Scheduled Caste' },
  { id: 'st',      label: 'ST',      desc: 'Scheduled Tribe' },
  { id: 'ews',     label: 'EWS',     desc: 'Economically Weaker Section' },
];

const initialForm = {
  dob: '',
  age: '',
  gender: '',
  state: '',
  income: '',
  occupation: '',
  category: '',
  location: '',
  disability: false,
  disabilityType: '',
  maritalStatus: '',
  educationLevel: '',
  familySize: '',
  landOwnership: false,
  bankAccount: true,
};

const calculateAge = (dob) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

const EligibilityForm = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'dob') {
      const computedAge = calculateAge(value);
      setForm((p) => ({ ...p, dob: value, age: computedAge === '' ? '' : String(computedAge) }));
      setErrors((p) => ({ ...p, dob: '', age: '' }));
      setApiErr('');
      return;
    }

    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiErr('');
  };

  const setManualField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiErr('');
  };

  const validate = () => {
    const e = {};
    if (!form.dob) {
      e.dob = 'Please enter your date of birth.';
    } else {
      const dobAge = calculateAge(form.dob);
      if (!dobAge || Number(dobAge) < 1 || Number(dobAge) > 120) {
        e.dob = 'Enter a valid date of birth.';
      } else {
        setForm((p) => ({ ...p, age: String(dobAge) }));
      }
    }

    if (!form.age || isNaN(form.age) || Number(form.age) < 1 || Number(form.age) > 120)
      e.age = 'Age could not be calculated from date of birth.';
    if (!form.gender)
      e.gender = 'Please select your gender.';
    if (!form.state)
      e.state = 'Please select your state/UT of residence.';
    if (form.income === '' || isNaN(form.income) || Number(form.income) < 0)
      e.income = 'Enter a valid annual household income (₹0 or greater).';
    if (!form.occupation)
      e.occupation = 'Please select your primary occupation.';
    if (!form.category)
      e.category = 'Please select your social category.';
    if (!form.location)
      e.location = 'Please select your area type.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setApiErr('');
    try {
      const profile = {
        ...form,
        age: Number(form.age),
        income: Number(form.income),
        familySize: form.familySize ? Number(form.familySize) : undefined,
        occupation: form.occupation.toLowerCase(),
      };
      const { data } = await eligibilityAPI.check(profile);
      sessionStorage.setItem('eligibilityResults', JSON.stringify(data));
      navigate('/results');
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Failed to analyze eligibility. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eligibility-page-container">
      {/* Header Banner */}
      <div className="checker-hero-banner">
        <div className="container">
          <div className="checker-header-inner">
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              🎯 Citizen Welfare Matcher
            </span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.5rem' }}>
              Check Your Scheme Eligibility
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.02rem', maxWidth: '640px' }}>
              Complete the quick questionnaire below to receive your personalized eligibility report with matched government benefits.
            </p>
          </div>
        </div>
      </div>

      <div className="container checker-main-grid">
        {/* Form Container */}
        <div className="form-card-container">
          {apiErr && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <span>⚠️</span>
              <div>{apiErr}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* ── SECTION 1: PERSONAL INFORMATION ── */}
            <div className="wizard-step-box">
              <div className="step-badge-row">
                <span className="step-circle-badge">1</span>
                <div>
                  <h3 className="step-group-title">Personal Profile</h3>
                  <p className="step-group-sub">Age, gender, and educational background</p>
                </div>
              </div>

              <div className="grid-2">
                {/* Date of Birth Input */}
                <div className="form-group">
                  <label className="form-label">
                    Date of Birth <span className="req">*</span>
                  </label>
                  <input
                    name="dob"
                    type="date"
                    className={`form-control ${errors.dob ? 'error' : ''}`}
                    value={form.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && <div className="form-error">⚠️ {errors.dob}</div>}
                </div>

                {/* Calculated Age Field */}
                <div className="form-group">
                  <label className="form-label">
                    Calculated Age <span className="req">*</span>
                  </label>
                  <input
                    name="age"
                    type="text"
                    className={`form-control ${errors.age ? 'error' : ''}`}
                    value={form.age}
                    readOnly
                    placeholder="Auto-calculated from DOB"
                  />
                  {errors.age && <div className="form-error">⚠️ {errors.age}</div>}
                </div>

                {/* Gender Selectable Buttons */}
                <div className="form-group">
                  <label className="form-label">
                    Gender <span className="req">*</span>
                  </label>
                  <div className="gender-btn-group">
                    {[
                      { id: 'male', label: '👨 Male' },
                      { id: 'female', label: '👩 Female' },
                      { id: 'other', label: '⚧ Other' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        className={`selector-pill-btn ${form.gender === g.id ? 'active' : ''}`}
                        onClick={() => setManualField('gender', g.id)}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <div className="form-error">⚠️ {errors.gender}</div>}
                </div>

                {/* Marital Status */}
                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="maritalStatus"
                    className="form-control"
                    value={form.maritalStatus}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Marital Status --</option>
                    <option value="single">Single / Unmarried</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced">Divorced / Separated</option>
                  </select>
                </div>

                {/* Education Level */}
                <div className="form-group">
                  <label className="form-label">Highest Education Level</label>
                  <select
                    name="educationLevel"
                    className="form-control"
                    value={form.educationLevel}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Education Level --</option>
                    {EDUCATION.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: LOCATION & DOMICILE ── */}
            <div className="wizard-step-box">
              <div className="step-badge-row">
                <span className="step-circle-badge">2</span>
                <div>
                  <h3 className="step-group-title">Location & Domicile</h3>
                  <p className="step-group-sub">State-specific guidelines & rural/urban criteria</p>
                </div>
              </div>

              <div className="grid-2">
                {/* State */}
                <div className="form-group">
                  <label className="form-label">
                    State / Union Territory of Residence <span className="req">*</span>
                  </label>
                  <select
                    name="state"
                    className={`form-control ${errors.state ? 'error' : ''}`}
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose Your State / UT --</option>
                    {STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.state && <div className="form-error">⚠️ {errors.state}</div>}
                </div>

                {/* Area Type (Rural / Urban) */}
                <div className="form-group">
                  <label className="form-label">
                    Area Type <span className="req">*</span>
                  </label>
                  <div className="gender-btn-group">
                    {[
                      { id: 'rural', label: '🌾 Rural / Village' },
                      { id: 'urban', label: '🏙️ Urban / City' },
                      { id: 'semi-urban', label: '🏘️ Semi-Urban' },
                    ].map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        className={`selector-pill-btn ${form.location === loc.id ? 'active' : ''}`}
                        onClick={() => setManualField('location', loc.id)}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                  {errors.location && <div className="form-error">⚠️ {errors.location}</div>}
                </div>
              </div>
            </div>

            {/* ── SECTION 3: FINANCIAL DETAILS ── */}
            <div className="wizard-step-box">
              <div className="step-badge-row">
                <span className="step-circle-badge">3</span>
                <div>
                  <h3 className="step-group-title">Household Financial Profile</h3>
                  <p className="step-group-sub">Annual income and asset ownership</p>
                </div>
              </div>

              <div className="grid-2">
                {/* Annual Income */}
                <div className="form-group">
                  <label className="form-label">
                    Total Annual Family Income (₹) <span className="req">*</span>
                  </label>
                  <div className="currency-input-wrap">
                    <span className="currency-symbol">₹</span>
                    <input
                      name="income"
                      type="number"
                      min="0"
                      className={`form-control ${errors.income ? 'error' : ''}`}
                      value={form.income}
                      onChange={handleChange}
                      placeholder="e.g. 150000"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                  <div className="form-hint">Combined annual income of your entire household</div>
                  {errors.income && <div className="form-error">⚠️ {errors.income}</div>}
                </div>

                {/* Family Size */}
                <div className="form-group">
                  <label className="form-label">Family Size (Members)</label>
                  <input
                    name="familySize"
                    type="number"
                    min="1"
                    max="25"
                    className="form-control"
                    value={form.familySize}
                    onChange={handleChange}
                    placeholder="e.g. 4"
                  />
                  <div className="form-hint">Number of dependent family members</div>
                </div>
              </div>

              {/* Toggles */}
              <div className="financial-toggles-grid">
                <label className={`toggle-option-box ${form.bankAccount ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    name="bankAccount"
                    checked={form.bankAccount}
                    onChange={handleChange}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--dark)' }}>
                      🏦 Active Bank Account (Aadhaar Seeded)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Required for Direct Benefit Transfer (DBT) subsidies
                    </div>
                  </div>
                </label>

                <label className={`toggle-option-box ${form.landOwnership ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    name="landOwnership"
                    checked={form.landOwnership}
                    onChange={handleChange}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--dark)' }}>
                      🌾 Agricultural Land Ownership
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Own cultivable agricultural land (PM-KISAN requirement)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* ── SECTION 4: SOCIAL CATEGORY & OCCUPATION ── */}
            <div className="wizard-step-box">
              <div className="step-badge-row">
                <span className="step-circle-badge">4</span>
                <div>
                  <h3 className="step-group-title">Social Category & Occupation</h3>
                  <p className="step-group-sub">Reservation and sector criteria</p>
                </div>
              </div>

              {/* Category Selector Cards */}
              <div className="form-group">
                <label className="form-label">
                  Social Category <span className="req">*</span>
                </label>
                <div className="social-category-grid">
                  {SOCIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-selector-card ${form.category === cat.id ? 'active' : ''}`}
                      onClick={() => setManualField('category', cat.id)}
                    >
                      <div className="cat-card-title">{cat.label}</div>
                      <div className="cat-card-desc">{cat.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.category && <div className="form-error">⚠️ {errors.category}</div>}
              </div>

              {/* Occupation */}
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">
                  Primary Occupation <span className="req">*</span>
                </label>
                <select
                  name="occupation"
                  className={`form-control ${errors.occupation ? 'error' : ''}`}
                  value={form.occupation}
                  onChange={handleChange}
                >
                  <option value="">-- Select Your Primary Occupation --</option>
                  {OCCUPATIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
                {errors.occupation && <div className="form-error">⚠️ {errors.occupation}</div>}
              </div>
            </div>

            {/* ── SECTION 5: SPECIAL ASSISTANCE (DISABILITY) ── */}
            <div className="wizard-step-box" style={{ borderBottom: 'none' }}>
              <div className="step-badge-row">
                <span className="step-circle-badge">5</span>
                <div>
                  <h3 className="step-group-title">Special Criteria</h3>
                  <p className="step-group-sub">Divyangjan / Disability welfare programs</p>
                </div>
              </div>

              <label className={`toggle-option-box ${form.disability ? 'active' : ''}`} style={{ marginBottom: form.disability ? '1rem' : '0' }}>
                <input
                  type="checkbox"
                  name="disability"
                  checked={form.disability}
                  onChange={handleChange}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--dark)' }}>
                    ♿ Person with Benchmark Disability (Divyangjan)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    40% or more disability certified by a medical board
                  </div>
                </div>
              </label>

              {form.disability && (
                <div className="form-group animate-fade-up">
                  <label className="form-label">Specify Nature of Disability</label>
                  <input
                    name="disabilityType"
                    type="text"
                    className="form-control"
                    value={form.disabilityType}
                    onChange={handleChange}
                    placeholder="e.g. Visual Impairment, Locomotor, Hearing, Cerebral Palsy"
                  />
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="form-submit-panel">
              <button
                type="submit"
                className="btn btn-primary btn-xl submit-btn-pulse"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-sm" />
                    <span>Analyzing 12+ Government Schemes...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span> Check My Eligibility Report
                  </>
                )}
              </button>
              <p className="submit-note-text">
                ⚡ Instant analysis. 100% Free. No registration required.
              </p>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Trust Tips */}
        <aside className="checker-sidebar-stack">
          {/* Privacy Guarantee */}
          <div className="checker-side-card">
            <div className="side-card-icon">🔒</div>
            <h4 className="side-card-title">Citizen Privacy Guarantee</h4>
            <p className="side-card-desc">
              Your personal information is evaluated securely inside your browser session to match guidelines. We never sell your data or share it with commercial advertisers.
            </p>
          </div>

          {/* Quick Accuracy Tips */}
          <div className="checker-side-card">
            <div className="side-card-icon">💡</div>
            <h4 className="side-card-title">Tips for Accurate Results</h4>
            <ul className="side-card-checklist">
              <li>
                <strong>Income:</strong> Enter the gross annual earnings of all family members combined.
              </li>
              <li>
                <strong>Caste / Category:</strong> Select strictly according to your government-issued certificate.
              </li>
              <li>
                <strong>Land Ownership:</strong> Check if you or your family holds agricultural land title (RoR/Patta).
              </li>
              <li>
                <strong>Area:</strong> Select Rural if your residence is under a Gram Panchayat.
              </li>
            </ul>
          </div>

          {/* Documents Readiness */}
          <div className="checker-side-card">
            <div className="side-card-icon">📋</div>
            <h4 className="side-card-title">Documents Usually Required</h4>
            <p className="side-card-desc" style={{ marginBottom: '0.6rem' }}>
              Keep these ready when applying on official government portals:
            </p>
            <div className="doc-pill-wrap">
              <span className="badge badge-gray">Aadhaar Card</span>
              <span className="badge badge-gray">Income Certificate</span>
              <span className="badge badge-gray">Caste Certificate</span>
              <span className="badge badge-gray">Bank Passbook</span>
              <span className="badge badge-gray">Domicile Certificate</span>
            </div>
          </div>

          {/* Need Help link */}
          <div className="checker-side-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>📞</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>National Portal Helpline</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>1800-11-0031</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Toll-Free • Monday to Friday (9 AM - 6 PM)</div>
          </div>
        </aside>
      </div>

      {/* Scoped CSS for Eligibility Form */}
      <style>{`
        .eligibility-page-container {
          background: #f8fafc;
          min-height: 100vh;
          padding-bottom: 4.5rem;
        }
        .checker-hero-banner {
          background: radial-gradient(circle at 75% 25%, #1e40af 0%, #172554 60%, #0a1128 100%);
          padding: 3.5rem 0 2.5rem;
          color: #ffffff;
          margin-bottom: 2rem;
        }
        .checker-main-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2.25rem;
          align-items: start;
        }
        .form-card-container {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
          padding: 2.25rem;
        }
        .wizard-step-box {
          padding-bottom: 1.75rem;
          margin-bottom: 1.75rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .step-badge-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.35rem;
        }
        .step-circle-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
        }
        .step-group-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--dark);
          line-height: 1.2;
        }
        .step-group-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .gender-btn-group {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .selector-pill-btn {
          flex: 1;
          min-width: 90px;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          background: #ffffff;
          color: #334155;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          text-align: center;
        }
        .selector-pill-btn:hover {
          border-color: var(--primary);
          background: #eff6ff;
        }
        .selector-pill-btn.active {
          border-color: var(--primary);
          background: #eff6ff;
          color: var(--primary);
          font-weight: 700;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .currency-input-wrap {
          position: relative;
        }
        .currency-symbol {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 700;
          color: #64748b;
          font-size: 1.05rem;
        }
        .financial-toggles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .toggle-option-box {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: #f8fafc;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.18s;
        }
        .toggle-option-box:hover {
          background: #f1f5f9;
        }
        .toggle-option-box.active {
          background: #eff6ff;
          border-color: #bfdbfe;
        }
        .toggle-option-box input {
          margin-top: 3px;
          width: 17px;
          height: 17px;
          accent-color: var(--primary);
        }
        .social-category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 0.6rem;
        }
        .category-selector-card {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          background: #ffffff;
          padding: 0.75rem 0.5rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.18s;
        }
        .category-selector-card:hover {
          border-color: var(--primary);
          background: #eff6ff;
        }
        .category-selector-card.active {
          border-color: var(--primary);
          background: #eff6ff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .cat-card-title {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--dark);
          margin-bottom: 0.2rem;
        }
        .category-selector-card.active .cat-card-title {
          color: var(--primary);
        }
        .cat-card-desc {
          font-size: 0.7rem;
          color: #64748b;
          line-height: 1.2;
        }
        .form-submit-panel {
          text-align: center;
          margin-top: 2.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .submit-btn-pulse {
          min-width: 280px;
          justify-content: center;
          box-shadow: 0 8px 24px -4px rgba(37, 99, 235, 0.4);
        }
        .submit-note-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.75rem;
        }
        .checker-sidebar-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: sticky;
          top: 90px;
        }
        .checker-side-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.35rem;
          box-shadow: var(--shadow-xs);
        }
        .side-card-icon {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
        }
        .side-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.4rem;
        }
        .side-card-desc {
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.6;
        }
        .side-card-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.5;
        }
        .side-card-checklist strong {
          color: var(--dark);
        }
        .doc-pill-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        @media (max-width: 960px) {
          .checker-main-grid {
            grid-template-columns: 1fr;
          }
          .checker-sidebar-stack {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default EligibilityForm;
