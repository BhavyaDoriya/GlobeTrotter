/** Minimum realistic USD per person per day for each major city */
const CITY_THRESHOLDS: Record<string, number> = {
  'new york':    200,
  'new york city': 200,
  'nyc':         200,
  'paris':       180,
  'london':      200,
  'tokyo':       150,
  'dubai':       250,
  'singapore':   200,
  'sydney':      180,
  'rome':        150,
  'barcelona':   130,
  'amsterdam':   160,
  'zurich':      320,
  'oslo':        280,
  'copenhagen':  280,
  'stockholm':   250,
  'hong kong':   180,
  'seoul':       130,
  'bangkok':      80,
  'bali':         70,
  'istanbul':    100,
  'prague':      110,
  'vienna':      160,
  'berlin':      140,
  'munich':      160,
  'milan':       160,
  'madrid':      130,
  'lisbon':      110,
  'athens':      110,
  'cairo':        80,
  'marrakech':    90,
  'cape town':   100,
  'nairobi':      90,
  'mumbai':       60,
  'delhi':        55,
  'beijing':      90,
  'shanghai':    110,
  'toronto':     180,
  'vancouver':   180,
  'chicago':     160,
  'los angeles': 180,
  'miami':       170,
  'san francisco': 200,
  'default':     100,
};

export interface BudgetValidationResult {
  isFoolish: boolean;
  dailyBudget: number;
  suggestedMinBudget: number;
  minPerDay: number;
  cityName: string;
  /** How many times MORE the required budget exceeds what was entered (e.g. 8x) */
  foolishnessRatio: number;
}

/**
 * Checks whether the entered budget is unrealistically low for the destination.
 * Triggers the Morgott Easter egg when dailyBudget < 25% of city minimum.
 */
export function validateBudget(
  cityName: string,
  totalBudget: number,
  tripDays: number,
): BudgetValidationResult {
  const key = cityName.toLowerCase().trim();
  const minPerDay = CITY_THRESHOLDS[key] ?? CITY_THRESHOLDS['default'];
  const suggestedMinBudget = minPerDay * tripDays;
  const dailyBudget = tripDays > 0 ? totalBudget / tripDays : totalBudget;
  const isFoolish = dailyBudget < minPerDay * 0.25;
  const foolishnessRatio = suggestedMinBudget / Math.max(totalBudget, 1);

  return {
    isFoolish,
    dailyBudget,
    suggestedMinBudget,
    minPerDay,
    cityName,
    foolishnessRatio,
  };
}

export function getSuggestedMinBudget(cityName: string, tripDays: number): number {
  const key = cityName.toLowerCase().trim();
  const minPerDay = CITY_THRESHOLDS[key] ?? CITY_THRESHOLDS['default'];
  return minPerDay * tripDays;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
