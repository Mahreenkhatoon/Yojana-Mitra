/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║          Smart Eligibility Engine  v1.0                 ║
 * ║  Compares a user profile against scheme rule sets and   ║
 * ║  produces a detailed, human-readable match report.      ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Supported operators
 * ───────────────────
 *  lte      – profile[field] <= value
 *  gte      – profile[field] >= value
 *  lt       – profile[field] <  value
 *  gt       – profile[field] >  value
 *  eq       – profile[field] == value  (case-insensitive string)
 *  ne       – profile[field] != value
 *  in       – profile[field] is in value[]
 *  nin      – profile[field] is NOT in value[]
 *  between  – value <= profile[field] <= valueMax
 *  boolean  – Boolean(profile[field]) === Boolean(value)
 */

const normalizeText = (value = '') =>
  String(value).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const occupationFilters = {
  student: {
    positive: ['student', 'scholarship', 'education', 'school', 'college', 'university', 'youth', 'skill', 'training'],
    negative: ['farmer', 'kisan', 'agriculture', 'pension', 'old age', 'housing', 'health', 'women welfare'],
  },
  farmer: {
    positive: ['farmer', 'kisan', 'agriculture', 'cultivator', 'landowner'],
    negative: ['student', 'scholarship', 'education', 'college', 'school'],
  },
};

const isRelevantToOccupation = (scheme, occupation) => {
  const normalizedOccupation = normalizeText(occupation);
  if (!normalizedOccupation || !scheme) return true;

  const occupationRules = occupationFilters[normalizedOccupation];
  if (!occupationRules) return true;

  const searchableText = normalizeText([
    scheme.name,
    scheme.category,
    scheme.description,
    scheme.objective,
    scheme.targetBeneficiaries,
    scheme.tags?.join(' '),
    (scheme.eligibilityCriteria || []).map((rule) => `${rule.label || ''} ${rule.fieldLabel || ''}`).join(' '),
  ].join(' '));

  if (!searchableText) return true;

  const hasPositive = occupationRules.positive.some((term) => searchableText.includes(term));
  const hasNegative = occupationRules.negative.some((term) => searchableText.includes(term));

  if (hasPositive) return true;
  if (hasNegative && !hasPositive) return false;
  return true;
};

// ── Evaluate one rule ─────────────────────────────────────────────────────────
const evaluateRule = (rule, profile) => {
  const { field, operator, value, valueMax, label, fieldLabel } = rule;
  const raw = profile[field];

  // Field absent / empty → unknown (not a hard disqualifier)
  if (raw === undefined || raw === null || raw === '') {
    return { passed: null, message: `ℹ️  ${fieldLabel}: information not provided` };
  }

  let passed = false;
  const num  = Number(raw);
  const str  = String(raw).toLowerCase();

  switch (operator) {
    case 'lte'    : passed = num  <= Number(value);   break;
    case 'gte'    : passed = num  >= Number(value);   break;
    case 'lt'     : passed = num  <  Number(value);   break;
    case 'gt'     : passed = num  >  Number(value);   break;
    case 'eq'     : passed = str  === String(value).toLowerCase(); break;
    case 'ne'     : passed = str  !== String(value).toLowerCase(); break;
    case 'in'     :
      passed = Array.isArray(value) &&
               value.map(v => String(v).toLowerCase()).includes(str);
      break;
    case 'nin'    :
      passed = Array.isArray(value) &&
               !value.map(v => String(v).toLowerCase()).includes(str);
      break;
    case 'between':
      passed = num >= Number(value) && num <= Number(valueMax);
      break;
    case 'boolean':
      passed = Boolean(raw) === Boolean(value);
      break;
    default:
      passed = false;
  }

  return {
    passed,
    message: passed ? `✅ ${label}` : `❌ ${label}`,
  };
};

// ── Status helper ─────────────────────────────────────────────────────────────
const deriveStatus = (yesCount, noCount, totalRules) => {
  if (totalRules === 0)    return 'eligible';      // no rules = open to all
  if (noCount === 0)       return 'eligible';
  if (noCount > 0 && yesCount > 0) return 'partial';
  return 'not_eligible';
};

// ── Summary sentence ──────────────────────────────────────────────────────────
const makeSummary = (status, yes, no, name) => {
  if (status === 'eligible')
    return `You meet all ${yes} eligibility condition${yes !== 1 ? 's' : ''} for "${name}".`;
  if (status === 'partial')
    return `You meet ${yes} of ${yes + no} condition${yes + no !== 1 ? 's' : ''} for "${name}". ${no} condition${no !== 1 ? 's' : ''} not satisfied.`;
  return `You do not satisfy ${no} required condition${no !== 1 ? 's' : ''} for "${name}".`;
};

// ── Main export: match all schemes against a profile ─────────────────────────
const matchSchemes = (schemes, profile) => {
  const results = [];

  for (const scheme of schemes) {
    const ruleResults = [];
    let yes = 0, no = 0;

    for (const rule of scheme.eligibilityCriteria) {
      const result = evaluateRule(rule, profile);
      ruleResults.push({ ...rule.toObject?.() ?? rule, ...result });
      if (result.passed === true)  yes++;
      else if (result.passed === false) no++;
    }

    const totalRules = scheme.eligibilityCriteria.length;
    const relevantToOccupation = isRelevantToOccupation(scheme, profile.occupation);
    const forcedNotEligible = profile.occupation && !relevantToOccupation;

    let status = deriveStatus(yes, no, totalRules);
    let score = totalRules > 0 ? Math.round((yes / (yes + no || 1)) * 100) : 100;
    let summary = makeSummary(status, yes, no, scheme.name);

    if (forcedNotEligible) {
      status = 'not_eligible';
      score = 0;
      summary = `This scheme is not relevant for your occupation profile (${profile.occupation}).`;
      ruleResults.push({
        field: 'occupation',
        fieldLabel: 'Occupation Match',
        label: `Occupation must be relevant to ${scheme.name}`,
        passed: false,
        message: `❌ This scheme is not relevant for a ${profile.occupation} profile.`,
      });
    }

    results.push({
      scheme: {
        _id             : scheme._id,
        name            : scheme.name,
        slug            : scheme.slug,
        description     : scheme.description,
        category        : scheme.category,
        ministry        : scheme.ministry,
        benefits        : scheme.benefits,
        benefitAmount   : scheme.benefitAmount,
        benefitType     : scheme.benefitType,
        documents       : scheme.documents,
        officialWebsite : scheme.officialWebsite,
        applicationLink : scheme.applicationLink,
        isFeatured      : scheme.isFeatured,
        helplineNumber  : scheme.helplineNumber,
      },
      status,
      score,
      eligibleCount    : yes,
      notEligibleCount : no + (forcedNotEligible ? 1 : 0),
      totalRules: totalRules + (forcedNotEligible ? 1 : 0),
      ruleResults,
      summary,
    });
  }

  // Sort: eligible → partial → not_eligible, then by score desc within each group
  const ORDER = { eligible: 0, partial: 1, not_eligible: 2 };
  results.sort((a, b) => {
    const d = ORDER[a.status] - ORDER[b.status];
    return d !== 0 ? d : b.score - a.score;
  });

  return results;
};

module.exports = { matchSchemes, evaluateRule };
