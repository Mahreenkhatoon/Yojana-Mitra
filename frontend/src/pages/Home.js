import React from 'react';
import { useNavigate } from 'react-router-dom';

const quickTags = ['Farmers', 'Student', 'Health', 'Housing', 'Women', 'Pension'];

const features = [
  { icon: '⚡', title: 'Instant Eligibility Match', text: 'Check your profile against welfare schemes in seconds.' },
  { icon: '🔒', title: 'Safe & Secure', text: 'Your details stay private and are used only for matching.' },
  { icon: '📄', title: 'Document Guidance', text: 'Know exactly which papers you will need before applying.' },
];

const popularSchemes = [
  { name: 'PM Kisan', sector: 'Agriculture', amount: '₹6,000/year', badge: 'High match' },
  { name: 'Ayushman Bharat', sector: 'Health', amount: '₹5 Lakh cover', badge: 'Popular' },
  { name: 'Scholarship Portal', sector: 'Education', amount: 'Tuition support', badge: 'Student friendly' },
];

const steps = [
  { number: '01', title: 'Create your profile', text: 'Enter your basic details and scheme preferences.' },
  { number: '02', title: 'Smart matching', text: 'Our rules engine compares your profile against each scheme.' },
  { number: '03', title: 'Review results', text: 'View eligible, partially eligible, and ineligible schemes.' },
  { number: '04', title: 'Apply directly', text: 'Open official portals with verified links and steps.' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="yojana-home">
      <section className="hero-band">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="mini-pill">🇮🇳 Trusted Government Support</span>
            <h1>
              Find the right government benefits <span>for your life.</span>
            </h1>
            <p>
              YojanaMitra helps Indian citizens discover welfare schemes, check eligibility,
              and apply with confidence using verified public information.
            </p>

            <div className="search-box">
              <span>🔎</span>
              <input type="text" placeholder="Search by scheme, benefit, or category" />
              <button type="button" onClick={() => navigate('/eligibility')}>Check Now</button>
            </div>

            <div className="tag-row">
              {quickTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="cta-row">
              <button type="button" className="primary-btn" onClick={() => navigate('/eligibility')}>Check My Eligibility</button>
              <button type="button" className="ghost-btn" onClick={() => navigate('/schemes')}>Browse All Schemes</button>
            </div>
          </div>

        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div><strong>1200+</strong><span>Citizen matches</span></div>
          <div><strong>50+</strong><span>Welfare schemes</span></div>
          <div><strong>24/7</strong><span>Eligibility checks</span></div>
          <div><strong>100%</strong><span>Free access</span></div>
        </div>
      </section>

      <section className="features-section container">
        <div className="section-heading">
          <span className="eyebrow">Why people trust YojanaMitra</span>
          <h2>Everything you need to discover benefits with clarity</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">How it works</span>
            <h2>Simple steps to unlock your eligible benefits</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="schemes-section container">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Popular schemes</span>
            <h2>Most searched opportunities</h2>
          </div>
          <button type="button" className="ghost-btn dark" onClick={() => navigate('/schemes')}>View all schemes</button>
        </div>

        <div className="scheme-grid">
          {popularSchemes.map((scheme) => (
            <div className="scheme-card" key={scheme.name}>
              <div className="scheme-badge">{scheme.badge}</div>
              <h3>{scheme.name}</h3>
              <div className="scheme-meta">{scheme.sector}</div>
              <div className="scheme-amount">{scheme.amount}</div>
              <button>View details</button>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .yojana-home {
          background: linear-gradient(180deg, #f3f7ff 0%, #ffffff 28%, #f8fafc 100%);
          color: #0f172a;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .hero-band {
          background: radial-gradient(circle at top left, #dbeafe 0%, #eff6ff 20%, #0f172a 55%, #050b18 100%);
          padding: 72px 0 36px;
          position: relative;
          overflow: hidden;
        }

        .hero-band::before {
          content: "";
          position: absolute;
          inset: auto -60px -90px auto;
          width: 360px;
          height: 360px;
          background: rgba(96, 165, 250, 0.18);
          border-radius: 50%;
          filter: blur(20px);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 28px;
          position: relative;
          z-index: 1;
        }

        .hero-copy {
          padding: 18px 0;
          text-align: center;
        }

        .mini-pill {
          display: inline-flex;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          color: #dbeafe;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .hero-copy h1 {
          font-size: clamp(2.6rem, 4vw, 4.4rem);
          line-height: 1.04;
          color: #fff;
          margin: 0 0 18px;
          letter-spacing: -0.05em;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-copy h1 span {
          color: #7dd3fc;
        }

        .hero-copy p {
          color: rgba(255,255,255,0.82);
          font-size: 1.05rem;
          line-height: 1.75;
          max-width: 560px;
          margin: 0 auto 24px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(148,163,184,0.2);
          border-radius: 16px;
          padding: 8px 10px 8px 16px;
          max-width: 620px;
          margin: 0 auto;
          box-shadow: 0 18px 34px rgba(15,23,42,0.12);
        }

        .search-box span {
          font-size: 1.15rem;
        }

        .search-box input {
          border: none;
          background: transparent;
          flex: 1;
          font-size: 1rem;
          color: #0f172a;
          outline: none;
        }

        .search-box button,
        .primary-btn,
        .ghost-btn,
        .scheme-card button {
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .search-box button,
        .primary-btn {
          background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
          color: #fff;
          padding: 14px 22px;
          border-radius: 12px;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(14,165,233,0.28);
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
          justify-content: center;
        }

        .tag-row span {
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 28px;
          justify-content: center;
        }

        .ghost-btn {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.24);
          padding: 14px 22px;
          border-radius: 12px;
          font-weight: 700;
        }

        .ghost-btn.dark {
          background: #fff;
          color: #0f172a;
          border-color: #e2e8f0;
        }

        .stats-strip {
          background: #fff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 18px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(140px, 1fr));
          gap: 18px;
        }

        .stats-grid > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 12px;
        }

        .stats-grid strong {
          font-size: clamp(1.5rem, 2vw, 2rem);
          color: #0f172a;
        }

        .stats-grid span {
          color: #64748b;
          font-size: 0.82rem;
          margin-top: 4px;
        }

        .section-heading {
          margin-bottom: 28px;
        }

        .section-heading.center {
          text-align: center;
        }

        .section-heading.split {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
        }

        .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 800;
          color: #2563eb;
        }

        .eyebrow.light {
          color: #bae6fd;
        }

        .section-heading h2 {
          font-size: clamp(2rem, 2.6vw, 2.8rem);
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin: 10px 0 0;
          color: #0f172a;
        }

        .features-section,
        .schemes-section,
        .steps-section {
          padding: 84px 0;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(220px, 1fr));
          gap: 22px;
        }

        .feature-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 26px 22px;
          box-shadow: 0 12px 26px rgba(15,23,42,0.04);
        }

        .feature-icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 1.6rem;
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
          margin-bottom: 18px;
        }

        .feature-card h3 {
          margin: 0 0 10px;
          font-size: 1.2rem;
          color: #0f172a;
        }

        .feature-card p {
          margin: 0;
          color: #475569;
          line-height: 1.7;
        }

        .steps-section {
          background: linear-gradient(180deg, #eef6ff 0%, #f8fbff 100%);
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(210px, 1fr));
          gap: 18px;
        }

        .step-card {
          position: relative;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px 20px 18px;
          box-shadow: 0 10px 28px rgba(15,23,42,0.04);
        }

        .step-number {
          position: absolute;
          top: 14px;
          right: 18px;
          font-size: 2.2rem;
          font-weight: 900;
          color: rgba(37,99,235,0.12);
          line-height: 1;
        }

        .step-card h3 {
          font-size: 1.12rem;
          margin: 34px 0 10px;
          color: #0f172a;
        }

        .step-card p {
          margin: 0;
          color: #475569;
          line-height: 1.7;
          font-size: 0.9rem;
        }

        .scheme-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(220px, 1fr));
          gap: 20px;
        }

        .scheme-card {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 12px 26px rgba(15,23,42,0.04);
        }

        .scheme-badge {
          display: inline-flex;
          background: #ecfeff;
          color: #0f766e;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .scheme-card h3 {
          margin: 0 0 8px;
          font-size: 1.3rem;
          color: #0f172a;
        }

        .scheme-meta {
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 10px;
        }

        .scheme-amount {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 18px;
        }

        .scheme-card button {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 700;
        }

        .search-box button:hover,
        .primary-btn:hover,
        .ghost-btn:hover,
        .scheme-card button:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 980px) {
          .hero-grid,
          .feature-grid,
          .steps-grid,
          .scheme-grid,
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hero-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .stats-grid,
          .feature-grid,
          .steps-grid,
          .scheme-grid {
            grid-template-columns: 1fr;
          }

          .search-box {
            flex-direction: column;
            align-items: stretch;
            padding: 12px;
          }

          .search-box button,
          .primary-btn,
          .ghost-btn {
            width: 100%;
          }

          .cta-row {
            flex-direction: column;
          }

          .section-heading.split {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
