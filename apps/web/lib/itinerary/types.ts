import { z } from 'zod';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const ActivityCategorySchema = z.enum([
  'transport',
  'accommodation',
  'sightseeing',
  'food',
  'shopping',
  'entertainment',
  'other',
]);
export type ActivityCategory = z.infer<typeof ActivityCategorySchema>;

export const BudgetCategorySchema = z.enum(['transport', 'stay', 'activities', 'meals']);
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

// ─── Core Entities ────────────────────────────────────────────────────────────

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  region: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  costIndex: z.number(), // min realistic USD per day
  popularityScore: z.number(),
});
export type City = z.infer<typeof CitySchema>;

export const ActivitySchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
  category: ActivityCategorySchema,
  description: z.string().optional(),
  costEstimate: z.number().default(0),
  durationMinutes: z.number().default(60),
  imageUrl: z.string().optional(),
});
export type Activity = z.infer<typeof ActivitySchema>;

export const StopActivitySchema = z.object({
  id: z.string(),
  stopId: z.string(),
  activityId: z.string(),
  activity: ActivitySchema,
  scheduledDate: z.string(), // YYYY-MM-DD
  scheduledTime: z.string(), // HH:MM
  actualCost: z.number().optional(),
});
export type StopActivity = z.infer<typeof StopActivitySchema>;

export const StopSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  city: CitySchema,
  orderIndex: z.number(),
  arrivalDate: z.string(),
  departureDate: z.string(),
  scheduledActivities: z.array(StopActivitySchema),
});
export type Stop = z.infer<typeof StopSchema>;

export const BudgetLineSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  category: BudgetCategorySchema,
  amount: z.number(),
  stopId: z.string().optional(),
});
export type BudgetLine = z.infer<typeof BudgetLineSchema>;

export const TripSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  coverPhotoUrl: z.string().optional(),
  isPublic: z.boolean().default(false),
  shareSlug: z.string().optional(),
  stops: z.array(StopSchema),
  budgetLines: z.array(BudgetLineSchema),
  totalBudget: z.number().default(0),
});
export type Trip = z.infer<typeof TripSchema>;

// ─── Builder-specific helpers ─────────────────────────────────────────────────

export type DaySchedule = {
  date: string;         // YYYY-MM-DD
  dayLabel: string;     // e.g. "Sat, 18 Nov"
  stopId: string;
  cityName: string;
  activities: StopActivity[];
};

// Category display metadata
export const CATEGORY_META: Record<
  ActivityCategory,
  { label: string; emoji: string; bgClass: string; dotColor: string; iconBg: string }
> = {
  transport:     { label: 'Transport',     emoji: '✈️',  bgClass: 'bg-orange-100 border-l-4 border-orange-300', dotColor: '#E77A64', iconBg: '#E77A64' },
  accommodation: { label: 'Accommodation', emoji: '🏨',  bgClass: 'bg-pink-100 border-l-4 border-pink-300',     dotColor: '#F9A8D4', iconBg: '#EC4899' },
  sightseeing:   { label: 'Sightseeing',   emoji: '🏛️',  bgClass: 'bg-teal-50 border-l-4 border-teal-300',     dotColor: '#8CBDB9', iconBg: '#8CBDB9' },
  food:          { label: 'Food & Drink',  emoji: '🍝',  bgClass: 'bg-green-100 border-l-4 border-green-300',  dotColor: '#86EFAC', iconBg: '#22C55E' },
  shopping:      { label: 'Shopping',      emoji: '🛍️',  bgClass: 'bg-yellow-100 border-l-4 border-yellow-300', dotColor: '#F6D267', iconBg: '#EAB308' },
  entertainment: { label: 'Entertainment', emoji: '🎭',  bgClass: 'bg-purple-100 border-l-4 border-purple-300', dotColor: '#C084FC', iconBg: '#A855F7' },
  other:         { label: 'Other',         emoji: '📍',  bgClass: 'bg-slate-100 border-l-4 border-slate-300',  dotColor: '#CBD5E1', iconBg: '#94A3B8' },
};

// Budget category display
export const BUDGET_CATEGORY_META: Record<
  BudgetCategory,
  { label: string; color: string; emoji: string }
> = {
  transport:  { label: 'Transport',   color: '#E77A64', emoji: '✈️' },
  stay:       { label: 'Stay',        color: '#8CBDB9', emoji: '🏨' },
  activities: { label: 'Activities',  color: '#F6D267', emoji: '🎟️' },
  meals:      { label: 'Meals',       color: '#86EFAC', emoji: '🍴' },
};
