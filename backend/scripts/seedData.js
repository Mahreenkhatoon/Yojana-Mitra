/**
 * ─────────────────────────────────────────────────────────────
 *  Seed Script – Smart Government Schemes
 *  Run:  npm run seed   (from the backend/ folder)
 *
 *  NOTE: All scheme data is for DEMONSTRATION purposes only.
 *  Eligibility criteria and links are based on publicly
 *  available information but may not reflect the latest
 *  government guidelines. Always verify on official portals.
 * ─────────────────────────────────────────────────────────────
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const connectDB = require('../config/db');

const User     = require('../models/User');
const Scheme   = require('../models/Scheme');
const Category = require('../models/Category');

// ── Categories ─────────────────────────────────────────────────────────────────
const categories = [
  { name: 'Education',             slug: 'education',           icon: '🎓', color: '#1a56db', description: 'Scholarships, fellowships and educational support schemes' },
  { name: 'Agriculture',           slug: 'agriculture',         icon: '🌾', color: '#057a55', description: 'Schemes supporting farmers and agricultural activities' },
  { name: 'Employment',            slug: 'employment',          icon: '💼', color: '#c27803', description: 'Job creation, MGNREGA and employment-linked schemes' },
  { name: 'Women & Child Welfare', slug: 'women-child-welfare', icon: '👩‍👧', color: '#e74694', description: 'Schemes for women empowerment and child development' },
  { name: 'Health',                slug: 'health',              icon: '🏥', color: '#e02424', description: 'Health insurance, medical support and wellness schemes' },
  { name: 'Housing',               slug: 'housing',             icon: '🏠', color: '#7e3af2', description: 'Affordable housing and home construction assistance' },
  { name: 'Pension',               slug: 'pension',             icon: '👴', color: '#6b7280', description: 'Old-age pension and social security schemes' },
  { name: 'Financial Assistance',  slug: 'financial-assistance',icon: '💰', color: '#059669', description: 'Direct benefit transfer and financial aid schemes' },
  { name: 'Skill Development',     slug: 'skill-development',   icon: '🛠️', color: '#0694a2', description: 'Vocational training and skilling programmes' },
  { name: 'Entrepreneurship',      slug: 'entrepreneurship',    icon: '🚀', color: '#ff5a1f', description: 'Startup support, MUDRA loans and self-employment schemes' },
];

// ── Schemes ────────────────────────────────────────────────────────────────────
const schemes = [
  // ── PM-KISAN ────────────────────────────────────────────────────────────────
  {
    name       : 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'PM-KISAN provides income support of ₹6,000 per year to all land-holding farmer families across India in three equal instalments of ₹2,000.',
    objective  : 'To supplement the financial needs of farmers in procuring various inputs and to ensure their livelihood.',
    category   : 'Agriculture',
    ministry   : 'Ministry of Agriculture & Farmers Welfare',
    targetBeneficiaries: 'Small and marginal farmers with cultivable land',
    eligibilityCriteria: [
      { field: 'occupation', operator: 'in', value: ['farmer', 'agriculture'],     label: 'Occupation must be Farmer',                  fieldLabel: 'Occupation' },
      { field: 'landOwnership', operator: 'boolean', value: true,                  label: 'Must own agricultural land',                  fieldLabel: 'Land Ownership' },
      { field: 'income',     operator: 'lte', value: 200000,                       label: 'Annual family income ≤ ₹2,00,000',            fieldLabel: 'Annual Income' },
    ],
    eligibilitySummary: 'Farmers owning agricultural land with income up to ₹2 lakh per year',
    benefits      : ['₹6,000 per year in 3 instalments of ₹2,000', 'Direct credit to bank account (DBT)', 'No middlemen – direct benefit transfer'],
    benefitAmount : '₹6,000 per year',
    benefitType   : 'financial',
    documents     : ['Aadhaar Card', 'Land ownership records (Khasra/Khatauni)', 'Bank account details', 'Mobile number linked to Aadhaar'],
    applicationProcess: [
      'Visit the official PM-KISAN portal pmkisan.gov.in',
      'Click on "Farmers Corner" → "New Farmer Registration"',
      'Enter Aadhaar number and captcha',
      'Fill in personal and bank details',
      'Submit and note the registration number',
    ],
    officialWebsite : 'https://pmkisan.gov.in',
    applicationLink : 'https://pmkisan.gov.in/RegistrationForm.aspx',
    helplineNumber  : '155261 / 011-23381092',
    launchYear      : 2019,
    isFeatured      : true,
    states          : [],
    tags            : ['farmer', 'income support', 'direct benefit', 'dbt'],
  },

  // ── PMAY-G ──────────────────────────────────────────────────────────────────
  {
    name       : 'PMAY-G (Pradhan Mantri Awaas Yojana – Gramin)',
    description: 'PMAY-G aims to provide pucca houses with basic amenities to all houseless households and those living in kutcha/dilapidated houses in rural India.',
    objective  : 'Housing for All by 2024 – providing financial assistance to BPL families to construct pucca houses.',
    category   : 'Housing',
    ministry   : 'Ministry of Rural Development',
    targetBeneficiaries: 'BPL households in rural areas without a pucca house',
    eligibilityCriteria: [
      { field: 'location',  operator: 'eq',  value: 'rural',   label: 'Must reside in a rural area',               fieldLabel: 'Location' },
      { field: 'income',    operator: 'lte', value: 120000,    label: 'Annual income ≤ ₹1,20,000 (BPL threshold)', fieldLabel: 'Annual Income' },
      { field: 'category',  operator: 'in',  value: ['sc', 'st', 'obc', 'ews'], label: 'SC/ST/OBC/EWS category preferred', fieldLabel: 'Social Category' },
    ],
    eligibilitySummary: 'Rural BPL families without a pucca house, preferably SC/ST/OBC/EWS',
    benefits      : ['₹1,20,000 financial assistance in plains (₹1,30,000 in hilly/NE states)', 'MGNREGS convergence for 90–95 person-days of unskilled labour', 'Toilet construction support under SBM'],
    benefitAmount : '₹1,20,000 – ₹1,30,000',
    benefitType   : 'housing',
    documents     : ['Aadhaar Card', 'BPL certificate / SECC data', 'Bank account passbook', 'Land ownership or patta document', 'Photograph of existing dwelling'],
    applicationProcess: [
      'Contact your Gram Panchayat or Block Development Officer (BDO)',
      'Name must appear in the SECC-2011 data list',
      'Application through AwaasSoft or Gram Sabha recommendation',
      'House construction monitored through geotagged photos',
    ],
    officialWebsite : 'https://pmayg.nic.in',
    applicationLink : 'https://pmayg.nic.in',
    helplineNumber  : '1800-11-6446',
    launchYear      : 2016,
    isFeatured      : true,
    states          : [],
    tags            : ['housing', 'rural', 'bpl', 'pucca house'],
  },

  // ── Ayushman Bharat ─────────────────────────────────────────────────────────
  {
    name       : 'Ayushman Bharat – PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    description: 'World\'s largest health insurance scheme providing health cover of ₹5 lakh per family per year for secondary and tertiary hospitalisation to the bottom 40% of India\'s population.',
    objective  : 'To protect poor and vulnerable families against catastrophic health expenditure.',
    category   : 'Health',
    ministry   : 'Ministry of Health & Family Welfare / NHA',
    targetBeneficiaries: 'Poor and vulnerable families as per SECC database',
    eligibilityCriteria: [
      { field: 'income',    operator: 'lte', value: 250000,  label: 'Annual family income ≤ ₹2,50,000',       fieldLabel: 'Annual Income' },
      { field: 'category',  operator: 'in',  value: ['sc', 'st', 'obc', 'ews'], label: 'SC/ST/OBC/EWS or SECC-listed family preferred', fieldLabel: 'Social Category' },
    ],
    eligibilitySummary: 'Low-income families (SECC listed) with annual income up to ₹2.5 lakh',
    benefits      : ['₹5 lakh health cover per family per year', '1,929+ treatment packages covered', 'Cashless and paperless treatment at empanelled hospitals', 'Pre and post hospitalisation expenses covered'],
    benefitAmount : '₹5,00,000 per family per year',
    benefitType   : 'insurance',
    documents     : ['Aadhaar Card / Ration Card', 'PM-JAY family ID (from SECC list)', 'Caste certificate (if applicable)'],
    applicationProcess: [
      'Check eligibility at mera.pmjay.gov.in using mobile number or ration card',
      'Visit nearest Common Service Centre (CSC) or empanelled hospital',
      'Get Golden Card (Ayushman Card) issued',
      'Use card for cashless treatment at any empanelled hospital',
    ],
    officialWebsite : 'https://pmjay.gov.in',
    applicationLink : 'https://mera.pmjay.gov.in',
    helplineNumber  : '14555 / 1800-111-565',
    launchYear      : 2018,
    isFeatured      : true,
    states          : [],
    tags            : ['health insurance', 'hospital', 'cashless', 'poor families'],
  },

  // ── PM Mudra Yojana ─────────────────────────────────────────────────────────
  {
    name       : 'PM MUDRA Yojana (Pradhan Mantri Mudra Yojana)',
    description: 'PMMY provides collateral-free loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises through member lending institutions.',
    objective  : 'To fund the unfunded – extend affordable credit to micro-enterprises and self-employed individuals.',
    category   : 'Entrepreneurship',
    ministry   : 'Ministry of Finance / MUDRA',
    targetBeneficiaries: 'Small business owners, entrepreneurs, self-employed individuals',
    eligibilityCriteria: [
      { field: 'occupation', operator: 'in', value: ['self-employed', 'business', 'entrepreneur', 'shopkeeper', 'artisan', 'vendor'],
        label: 'Occupation: self-employed / business / entrepreneur', fieldLabel: 'Occupation' },
      { field: 'age',        operator: 'gte', value: 18,              label: 'Age ≥ 18 years',                    fieldLabel: 'Age' },
      { field: 'income',     operator: 'lte', value: 1500000,         label: 'Business income ≤ ₹15 lakh (micro enterprise threshold)', fieldLabel: 'Annual Income' },
    ],
    eligibilitySummary: 'Self-employed individuals and micro/small business owners aged 18+',
    benefits      : [
      'Shishu: loans up to ₹50,000',
      'Kishore: loans ₹50,001 – ₹5,00,000',
      'Tarun: loans ₹5,00,001 – ₹10,00,000',
      'No collateral required',
      'MUDRA Card for working capital needs',
    ],
    benefitAmount : 'Loans up to ₹10,00,000',
    benefitType   : 'loan',
    documents     : ['Aadhaar Card / PAN Card', 'Address proof', 'Business proof / registration', 'Bank statements (last 6 months)', 'Passport size photographs'],
    applicationProcess: [
      'Visit any public sector bank, regional rural bank, or MFI',
      'Fill MUDRA loan application form',
      'Submit required documents',
      'Bank appraises the loan application',
      'Loan disbursed with MUDRA Card',
    ],
    officialWebsite : 'https://www.mudra.org.in',
    applicationLink : 'https://www.mudra.org.in/Apply-for-loan',
    helplineNumber  : '1800-180-1111',
    launchYear      : 2015,
    isFeatured      : true,
    states          : [],
    tags            : ['loan', 'startup', 'small business', 'mudra', 'self employment'],
  },

  // ── National Scholarship Portal ─────────────────────────────────────────────
  {
    name       : 'National Scholarship Portal (NSP) – Central Sector Scheme',
    description: 'NSP is a centralised scholarship platform for pre-matric, post-matric and merit-cum-means scholarships for SC/ST/OBC/Minority students from central government schemes.',
    objective  : 'To ensure that deserving students from marginalised communities continue their education without financial barriers.',
    category   : 'Education',
    ministry   : 'Ministry of Education / Various Ministries',
    targetBeneficiaries: 'SC/ST/OBC/Minority students from Class 1 to PhD level',
    eligibilityCriteria: [
      { field: 'age',      operator: 'lte', value: 35,        label: 'Age ≤ 35 years',                                  fieldLabel: 'Age' },
      { field: 'income',   operator: 'lte', value: 250000,    label: 'Annual family income ≤ ₹2,50,000',               fieldLabel: 'Annual Income' },
      { field: 'category', operator: 'in',  value: ['sc', 'st', 'obc', 'ews'], label: 'Must belong to SC/ST/OBC/EWS category', fieldLabel: 'Social Category' },
      { field: 'occupation', operator: 'in', value: ['student'], label: 'Must be a student',                           fieldLabel: 'Occupation' },
    ],
    eligibilitySummary: 'SC/ST/OBC/EWS students aged ≤35 with family income below ₹2.5 lakh',
    benefits      : ['Pre-matric scholarship (Class 1-10)', 'Post-matric scholarship (Class 11 onwards)', 'Merit-cum-means scholarship', 'Covers tuition, maintenance and book allowances'],
    benefitAmount : 'Varies by scheme – ₹1,000 to ₹20,000+ per year',
    benefitType   : 'education',
    documents     : ['Aadhaar Card', 'Income certificate from competent authority', 'Caste/community certificate', 'Previous year mark sheet', 'Bank account details', 'Bonafide student certificate'],
    applicationProcess: [
      'Register at scholarships.gov.in',
      'Choose the appropriate scholarship scheme',
      'Fill online application with correct details',
      'Upload required documents',
      'Submit before deadline; institute verifies application',
      'Scholarship credited directly to bank account',
    ],
    officialWebsite : 'https://scholarships.gov.in',
    applicationLink : 'https://scholarships.gov.in/public/schemeAffiliation/schemeAffiliationNewSearch.action',
    helplineNumber  : '0120-6619540',
    launchYear      : 2015,
    isFeatured      : true,
    states          : [],
    tags            : ['scholarship', 'education', 'student', 'sc st obc', 'minority'],
  },

  // ── MGNREGA ─────────────────────────────────────────────────────────────────
  {
    name       : 'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)',
    description: 'MGNREGA guarantees 100 days of wage employment per year to rural households whose adult members volunteer to do unskilled manual work.',
    objective  : 'To enhance livelihood security in rural areas by providing at least 100 days of guaranteed wage employment per financial year.',
    category   : 'Employment',
    ministry   : 'Ministry of Rural Development',
    targetBeneficiaries: 'Adult members of rural households willing to do unskilled manual work',
    eligibilityCriteria: [
      { field: 'location', operator: 'eq',  value: 'rural', label: 'Must reside in a rural area',   fieldLabel: 'Location' },
      { field: 'age',      operator: 'gte', value: 18,      label: 'Age ≥ 18 years',                fieldLabel: 'Age' },
    ],
    eligibilitySummary: 'Rural residents aged 18+ who want unskilled manual employment',
    benefits      : ['Guaranteed 100 days of employment per household per year', 'Minimum wage payment (state-specific)', 'Unemployment allowance if work not provided', 'Work within 5 km radius of residence'],
    benefitAmount : '₹220 – ₹357 per day (state-wise wage rate)',
    benefitType   : 'employment',
    documents     : ['Aadhaar Card', 'Bank/Post office account details', 'Job Card (issued by Gram Panchayat)'],
    applicationProcess: [
      'Apply for Job Card at Gram Panchayat',
      'Job Card issued within 15 days of application',
      'Submit written application to Gram Panchayat demanding work',
      'Work provided within 15 days of demand',
      'Wages paid weekly through bank/post office account',
    ],
    officialWebsite : 'https://nrega.nic.in',
    applicationLink : 'https://nrega.nic.in',
    helplineNumber  : '1800-111-555',
    launchYear      : 2006,
    isFeatured      : false,
    states          : [],
    tags            : ['employment', 'rural', 'wage', 'unskilled labour', 'job guarantee'],
  },

  // ── Pradhan Mantri Jeevan Jyoti Bima ────────────────────────────────────────
  {
    name       : 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    description: 'PMJJBY is a renewable term life insurance scheme offering ₹2 lakh life cover for death due to any reason at a premium of only ₹436 per year.',
    objective  : 'To provide life insurance coverage to citizens, especially from low-income groups.',
    category   : 'Financial Assistance',
    ministry   : 'Ministry of Finance',
    targetBeneficiaries: 'Bank account holders aged 18–50 years',
    eligibilityCriteria: [
      { field: 'age',         operator: 'between', value: 18, valueMax: 50, label: 'Age must be between 18 and 50 years', fieldLabel: 'Age' },
      { field: 'bankAccount', operator: 'boolean', value: true,             label: 'Must have a bank account',            fieldLabel: 'Bank Account' },
    ],
    eligibilitySummary: 'Bank account holders aged 18–50 years',
    benefits      : ['₹2,00,000 life cover on death due to any reason', 'Annual premium of only ₹436', 'Auto-debit facility from savings account', 'Renewable annually'],
    benefitAmount : '₹2,00,000 life cover',
    benefitType   : 'insurance',
    documents     : ['Aadhaar Card', 'Bank account details', 'Consent-cum-declaration form'],
    applicationProcess: [
      'Visit your bank branch or log in to internet banking',
      'Fill PMJJBY enrolment form',
      'Provide Aadhaar as primary KYC',
      'Auto-debit of ₹436 premium from savings account on June 1 each year',
      'Certificate of insurance issued',
    ],
    officialWebsite : 'https://jansuraksha.gov.in',
    applicationLink : 'https://jansuraksha.gov.in/Forms-PMJJBY.aspx',
    helplineNumber  : '1800-180-1111',
    launchYear      : 2015,
    isFeatured      : false,
    states          : [],
    tags            : ['life insurance', 'low premium', 'jan suraksha'],
  },

  // ── PM Suraksha Bima Yojana ──────────────────────────────────────────────────
  {
    name       : 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    description: 'PMSBY is a government-backed accidental death and disability insurance scheme available to bank account holders at a yearly premium of just ₹20.',
    objective  : 'Provide affordable accidental insurance cover to the uninsured population.',
    category   : 'Financial Assistance',
    ministry   : 'Ministry of Finance',
    targetBeneficiaries: 'Bank account holders aged 18–70 years',
    eligibilityCriteria: [
      { field: 'age',         operator: 'between', value: 18, valueMax: 70, label: 'Age must be between 18 and 70 years', fieldLabel: 'Age' },
      { field: 'bankAccount', operator: 'boolean', value: true,             label: 'Must have a savings bank account',    fieldLabel: 'Bank Account' },
    ],
    eligibilitySummary: 'Bank account holders aged 18–70 years',
    benefits      : ['₹2,00,000 for accidental death or total disability', '₹1,00,000 for partial permanent disability', 'Premium: only ₹20 per year'],
    benefitAmount : '₹2,00,000 accidental cover',
    benefitType   : 'insurance',
    documents     : ['Aadhaar Card', 'Bank account details'],
    applicationProcess: [
      'Visit bank branch or enrol through internet/mobile banking',
      'Fill PMSBY enrolment form',
      'Premium auto-debited on June 1 each year',
    ],
    officialWebsite : 'https://jansuraksha.gov.in',
    applicationLink : 'https://jansuraksha.gov.in/Forms-PMSBY.aspx',
    helplineNumber  : '1800-180-1111',
    launchYear      : 2015,
    isFeatured      : false,
    states          : [],
    tags            : ['accident insurance', 'jan suraksha', 'low premium'],
  },

  // ── PM Kaushal Vikas Yojana ─────────────────────────────────────────────────
  {
    name       : 'PM Kaushal Vikas Yojana (PMKVY)',
    description: 'PMKVY is the flagship skill-development scheme of the Government of India providing industry-relevant skill training with certification and monetary reward to youth.',
    objective  : 'To enable a large number of Indian youth to take up industry-relevant skill training to find better livelihoods.',
    category   : 'Skill Development',
    ministry   : 'Ministry of Skill Development & Entrepreneurship',
    targetBeneficiaries: 'Unemployed youth and school/college dropouts aged 15–45',
    eligibilityCriteria: [
      { field: 'age',       operator: 'between', value: 15, valueMax: 45, label: 'Age must be between 15 and 45 years',      fieldLabel: 'Age' },
      { field: 'occupation', operator: 'in', value: ['unemployed', 'student', 'dropout'],
        label: 'Should be unemployed / student / school dropout',  fieldLabel: 'Occupation' },
    ],
    eligibilitySummary: 'Unemployed youth / students aged 15–45 seeking vocational training',
    benefits      : ['Free short-term skill training (3 months)', 'Government-recognised certification', 'Monetary reward up to ₹8,000', 'Placement assistance', 'RPL (Recognition of Prior Learning) for existing workers'],
    benefitAmount : 'Free training + ₹8,000 monetary reward',
    benefitType   : 'employment',
    documents     : ['Aadhaar Card', 'Bank account details', 'Educational certificates', 'Photograph'],
    applicationProcess: [
      'Visit pmkvyofficial.org and find a Training Centre near you',
      'Register online or walk into the nearest PMKVY Training Centre (TC)',
      'Choose a skill course from the approved list',
      'Complete the training programme',
      'Appear for assessment and receive certification',
      'Placement support provided post-certification',
    ],
    officialWebsite : 'https://www.pmkvyofficial.org',
    applicationLink : 'https://www.pmkvyofficial.org/find-a-training-centre',
    helplineNumber  : '1800-123-9626',
    launchYear      : 2015,
    isFeatured      : true,
    states          : [],
    tags            : ['skill training', 'youth', 'certification', 'employment', 'pmkvy'],
  },

  // ── Beti Bachao Beti Padhao ─────────────────────────────────────────────────
  {
    name       : 'Beti Bachao Beti Padhao (BBBP)',
    description: 'BBBP is a tri-ministerial campaign to address declining Child Sex Ratio (CSR) and related issues of women empowerment across India.',
    objective  : 'To prevent gender-biased sex-selective elimination and ensure the education and empowerment of the girl child.',
    category   : 'Women & Child Welfare',
    ministry   : 'Ministry of Women & Child Development / Health / Education',
    targetBeneficiaries: 'Girls below 10 years of age and their families',
    eligibilityCriteria: [
      { field: 'gender', operator: 'eq', value: 'female', label: 'Gender: Female',            fieldLabel: 'Gender' },
      { field: 'age',    operator: 'lte', value: 10,      label: 'Age ≤ 10 years (for girl)', fieldLabel: 'Age' },
    ],
    eligibilitySummary: 'Girl child below 10 years of age',
    benefits      : ['Sukanya Samriddhi Account with higher interest rates', 'Scholarships for girl students', 'Awareness campaigns for preventing female foeticide', 'Special incentives for enrolment in schools'],
    benefitAmount : 'Sukanya Samriddhi Yojana interest (currently ~8.2% p.a.)',
    benefitType   : 'financial',
    documents     : ['Birth certificate of girl child', 'Aadhaar Card of parents', 'Bank account in girl\'s name'],
    applicationProcess: [
      'Open a Sukanya Samriddhi Account at any post office or authorised bank',
      'Deposit minimum ₹250 per year (max ₹1,50,000 per year)',
      'Account matures when girl turns 21',
      'For other BBBP benefits, contact nearest Anganwadi Centre',
    ],
    officialWebsite : 'https://wcd.nic.in/bbbp-schemes',
    applicationLink : 'https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samridhi-Account.aspx',
    helplineNumber  : '1091 (Women Helpline)',
    launchYear      : 2015,
    isFeatured      : false,
    states          : [],
    tags            : ['girl child', 'women empowerment', 'sukanya samriddhi', 'education'],
  },

  // ── IGNOAPS ─────────────────────────────────────────────────────────────────
  {
    name       : 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    description: 'IGNOAPS provides monthly pension to BPL elderly persons aged 60 years and above as part of the National Social Assistance Programme (NSAP).',
    objective  : 'To provide social protection to BPL elderly citizens.',
    category   : 'Pension',
    ministry   : 'Ministry of Rural Development (NSAP)',
    targetBeneficiaries: 'BPL elderly persons aged 60 years and above',
    eligibilityCriteria: [
      { field: 'age',    operator: 'gte', value: 60,      label: 'Age ≥ 60 years',                      fieldLabel: 'Age' },
      { field: 'income', operator: 'lte', value: 100000,  label: 'Annual income ≤ ₹1,00,000 (BPL)',     fieldLabel: 'Annual Income' },
      { field: 'location', operator: 'in', value: ['rural', 'semi-urban'], label: 'Rural or semi-urban resident', fieldLabel: 'Location' },
    ],
    eligibilitySummary: 'BPL elderly (age ≥ 60) in rural/semi-urban areas with income below ₹1 lakh',
    benefits      : ['₹200 per month (age 60–79, Central share)', '₹500 per month (age 80+, Central share)', 'Additional amount from state government'],
    benefitAmount : '₹200–₹500 per month (Central share)',
    benefitType   : 'financial',
    documents     : ['Aadhaar Card', 'Age proof (birth certificate / school certificate)', 'BPL card / income certificate', 'Bank account details'],
    applicationProcess: [
      'Apply at Gram Panchayat or Block Development Office',
      'Submit required documents',
      'Application forwarded to District Welfare Officer',
      'Pension sanctioned and credited monthly to bank account',
    ],
    officialWebsite : 'https://nsap.nic.in',
    applicationLink : 'https://nsap.nic.in',
    helplineNumber  : '1800-111-555',
    launchYear      : 1995,
    isFeatured      : false,
    states          : [],
    tags            : ['pension', 'elderly', 'old age', 'bpl', 'nsap'],
  },

  // ── PM SVANidhi ─────────────────────────────────────────────────────────────
  {
    name       : 'PM SVANidhi (Street Vendor\'s AtmaNirbhar Nidhi)',
    description: 'PM SVANidhi provides affordable working capital loans to street vendors displaced by COVID-19 lockdowns, with credit history building and digital payment incentives.',
    objective  : 'To facilitate collateral-free working capital loans for street vendors to resume their livelihoods.',
    category   : 'Entrepreneurship',
    ministry   : 'Ministry of Housing & Urban Affairs',
    targetBeneficiaries: 'Street vendors in urban areas',
    eligibilityCriteria: [
      { field: 'location',   operator: 'in', value: ['urban', 'semi-urban'], label: 'Must be in urban/semi-urban area',              fieldLabel: 'Location' },
      { field: 'occupation', operator: 'in', value: ['vendor', 'street vendor', 'self-employed', 'business'],
        label: 'Must be a street vendor or self-employed', fieldLabel: 'Occupation' },
      { field: 'age',        operator: 'gte', value: 18,                    label: 'Age ≥ 18 years',                                fieldLabel: 'Age' },
    ],
    eligibilitySummary: 'Urban street vendors aged 18+ with vending certificate or letter of recommendation',
    benefits      : ['Initial loan of ₹10,000 (collateral-free)', 'Enhanced loan of ₹20,000 on timely repayment', 'Further ₹50,000 loan for regular repayers', 'Interest subsidy at 7%', '₹100/month digital transaction incentive'],
    benefitAmount : 'Loans: ₹10,000 → ₹20,000 → ₹50,000',
    benefitType   : 'loan',
    documents     : ['Aadhaar Card', 'Vending Certificate or letter of recommendation from ULB', 'Bank account details', 'Mobile number'],
    applicationProcess: [
      'Apply online at pmsvanidhi.mohua.gov.in',
      'Or visit nearest Common Service Centre / Bank branch',
      'Submit Aadhaar and vending certificate',
      'Loan processed within 30 days',
    ],
    officialWebsite : 'https://pmsvanidhi.mohua.gov.in',
    applicationLink : 'https://pmsvanidhi.mohua.gov.in/Schemes/ApplyLoan',
    helplineNumber  : '1800-11-1979',
    launchYear      : 2020,
    isFeatured      : false,
    states          : [],
    tags            : ['street vendor', 'urban', 'working capital', 'loan', 'covid relief'],
  },

  // ── Stand Up India ─────────────────────────────────────────────────────────
  {
    name       : 'Stand-Up India Scheme',
    description: 'Stand-Up India facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
    objective  : 'To leverage institutional credit for setting up greenfield enterprises in manufacturing, services, or trading sectors by SC/ST and women entrepreneurs.',
    category   : 'Entrepreneurship',
    ministry   : 'Ministry of Finance / SIDBI',
    targetBeneficiaries: 'SC/ST entrepreneurs and women entrepreneurs',
    eligibilityCriteria: [
      { field: 'age',       operator: 'gte', value: 18, label: 'Age ≥ 18 years',                          fieldLabel: 'Age' },
      {
        field    : 'category', operator: 'in',
        value    : ['sc', 'st'],
        label    : 'Must belong to SC/ST category (or be a woman entrepreneur)',
        fieldLabel: 'Social Category',
      },
    ],
    eligibilitySummary: 'SC/ST entrepreneurs or women aged 18+ for greenfield enterprise loans',
    benefits      : ['Composite loan ₹10 lakh to ₹1 crore', 'Covers 75% of project cost', 'Repayment tenure up to 7 years', 'Moratorium up to 18 months'],
    benefitAmount : '₹10 lakh to ₹1 crore',
    benefitType   : 'loan',
    documents     : ['Aadhaar / PAN Card', 'Caste certificate (for SC/ST)', 'Project report', 'Address and identity proof', 'Last 6 months bank statements'],
    applicationProcess: [
      'Apply online at standupmitra.in',
      'Or approach any scheduled commercial bank branch',
      'Submit business project report',
      'Bank appraises the project and sanctions loan',
    ],
    officialWebsite : 'https://www.standupmitra.in',
    applicationLink : 'https://www.standupmitra.in/Login/Register',
    helplineNumber  : '1800-180-1111',
    launchYear      : 2016,
    isFeatured      : false,
    states          : [],
    tags            : ['sc st', 'women', 'enterprise', 'greenfield', 'loan', 'bank'],
  },
];

// ── Main seeding function ──────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();
  console.log('\n🌱  Starting seed process...\n');

  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Scheme.deleteMany({}),
      Category.deleteMany({}),
    ]);
    console.log('🗑️   Cleared existing Users, Schemes and Categories.');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅  Inserted ${createdCategories.length} categories.`);

    // Create schemes
    const createdSchemes = await Scheme.create(schemes);
    console.log(`✅  Inserted ${createdSchemes.length} schemes.`);

    // Create admin account
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const salt = await bcrypt.genSalt(12);
    const hashedPwd = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name    : process.env.ADMIN_NAME  || 'Admin',
      email   : process.env.ADMIN_EMAIL || 'admin@smartgov.in',
      password: hashedPwd,
      role    : 'admin',
    });
    console.log(`✅  Admin account created: ${process.env.ADMIN_EMAIL || 'admin@smartgov.in'}`);

    console.log('\n🎉  Seeding complete!\n');
    console.log('──────────────────────────────────────────────────');
    console.log(`  Admin email    : ${process.env.ADMIN_EMAIL || 'admin@smartgov.in'}`);
    console.log(`  Admin password : ${adminPassword}`);
    console.log('──────────────────────────────────────────────────\n');
  } catch (err) {
    console.error('❌  Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
