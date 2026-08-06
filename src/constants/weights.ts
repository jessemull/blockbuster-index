export const SIGNAL_WEIGHTS = {
  AMAZON: 0.25,
  BLS_ECOMMERCE: 0.3333,
  BROADBAND: 0.1667,
  WALMART: 0.0833,
  CENSUS: 0.0833,
  BLS_PHYSICAL: 0.0833,
} as const;

export type SignalKey = keyof typeof SIGNAL_WEIGHTS;

export const SIGNAL_LABELS: Record<SignalKey, string> = {
  AMAZON: 'Amazon',
  BLS_ECOMMERCE: 'BLS E-commerce',
  BROADBAND: 'Broadband',
  WALMART: 'Walmart',
  CENSUS: 'Census',
  BLS_PHYSICAL: 'BLS Physical Retail',
};

/** Longer copy for Rankings (selector description) and Signals page. */
export const SIGNAL_DESCRIPTIONS: Record<SignalKey, string> = {
  AMAZON:
    'Amazon: Amazon job scraping with ninety day sliding window, normalized to population.',
  BLS_PHYSICAL:
    'BLS Physical Retail: Brick-and-mortar retail employment trends (1991–2024), z-score normalized. Inverted signal, declining physical retail results in a smaller e-commerce footprint.',
  BLS_ECOMMERCE:
    'BLS E-commerce: E-commerce and digital retail employment growth (1991–2024), z-score normalized.',
  CENSUS:
    'Census: Number of retail stores per state, normalized to population. Inverted signal, more retail stores results in a smaller e-commerce footprint.',
  BROADBAND: 'Broadband: Broadband access normalized to population.',
  WALMART:
    'Walmart: Number of brick-and-mortar Walmart jobs. Inverted signal, more walmart jobs results in a smaller e-commerce footprint.',
};

/** Public-facing blurbs on the Signals page (shorter than rankings copy). */
export const SIGNAL_SUMMARIES: Record<SignalKey, string> = {
  AMAZON:
    'Measures e-commerce adoption and digital retail presence by analyzing Amazon job posting patterns across all U.S. states.',
  BLS_PHYSICAL:
    'Analyzes brick-and-mortar retail employment trends using BLS QCEW data (1991–2024).',
  BLS_ECOMMERCE:
    'Measures e-commerce and digital retail employment growth using BLS QCEW data (1991–2024).',
  CENSUS:
    'Provides a measure of physical retail market maturity using U.S. Census Bureau data on retail establishments.',
  BROADBAND:
    'Measures the quality and reach of broadband infrastructure, a key enabler of digital commerce.',
  WALMART:
    'Tracks traditional retail employment patterns by monitoring Walmart job postings, offering insights into the balance between traditional and digital retail.',
};

export const SIGNAL_KEYS = Object.keys(SIGNAL_WEIGHTS) as SignalKey[];

export const INDEX_SIGNAL = {
  key: 'score',
  label: 'Blockbuster Index',
  description:
    'Blockbuster Index: Weighted combination of all signals, normalized to population.',
} as const;

/** Rankings dropdown options: overall index + each component signal. */
export const RANKING_SIGNAL_OPTIONS = [
  INDEX_SIGNAL,
  ...SIGNAL_KEYS.map((key) => ({
    key,
    label: SIGNAL_LABELS[key],
    description: SIGNAL_DESCRIPTIONS[key],
  })),
] as const;

export type RankingSignalKey = (typeof RANKING_SIGNAL_OPTIONS)[number]['key'];
