import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Trip, StopActivity, DaySchedule } from './types';
import { MOCK_TRIPS } from './mock-data';

// ─── Store interface ──────────────────────────────────────────────────────────

interface ItineraryStore {
  trips: Record<string, Trip>;

  // ── Selectors ──────────────────────────────────────────────────────────────
  getTrip: (id: string) => Trip | undefined;
  getDaySchedules: (tripId: string) => DaySchedule[];
  getTotalActivities: (tripId: string) => number;
  getSpentTotal: (tripId: string) => number;

  // ── Mutations ──────────────────────────────────────────────────────────────
  /** Move an activity to a different date (cross-column drag). */
  moveActivity: (params: {
    activityId: string;
    toDate: string;
    beforeId?: string | null;
  }) => void;

  /** Reorder activities within the same date column. */
  reorderDayActivities: (params: {
    tripId: string;
    date: string;
    oldIndex: number;
    newIndex: number;
  }) => void;

  /** Add a new StopActivity to a stop/date. */
  addActivity: (params: { tripId: string; newSa: StopActivity }) => void;

  /** Remove an activity by id from any stop. */
  removeActivity: (params: { tripId: string; activityId: string }) => void;

  /** Update a budget line amount. */
  updateBudgetLine: (params: { tripId: string; category: string; amount: number }) => void;

  /** Set the overall trip total budget. */
  setTotalBudget: (params: { tripId: string; amount: number }) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  const e = new Date(end);
  while (d <= e) {
    dates.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function dayLabel(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useItineraryStore = create<ItineraryStore>()(
  immer((set, get) => ({
    trips: { ...MOCK_TRIPS },

    // ── Selectors ────────────────────────────────────────────────────────────

    getTrip: (id) => get().trips[id],

    getDaySchedules: (tripId) => {
      const trip = get().trips[tripId];
      if (!trip) return [];

      const allActivities = trip.stops.flatMap((s) => s.scheduledActivities);

      // Group by date preserving user drag order
      const byDate: Record<string, StopActivity[]> = {};
      for (const sa of allActivities) {
        (byDate[sa.scheduledDate] ??= []).push(sa);
      }

      // Cover all dates in trip range
      const dates = dateRange(trip.startDate, trip.endDate);

      return dates.map((date) => {
        const stop =
          trip.stops.find((s) => s.arrivalDate <= date && s.departureDate >= date) ??
          trip.stops[0];
        return {
          date,
          dayLabel: dayLabel(date),
          stopId: stop?.id ?? '',
          cityName: stop?.city.name ?? '',
          activities: byDate[date] ?? [],
        };
      });
    },

    getTotalActivities: (tripId) => {
      const trip = get().trips[tripId];
      return trip
        ? trip.stops.reduce((n, s) => n + s.scheduledActivities.length, 0)
        : 0;
    },

    getSpentTotal: (tripId) => {
      const trip = get().trips[tripId];
      if (!trip) return 0;
      return trip.stops
        .flatMap((s) => s.scheduledActivities)
        .reduce((n, sa) => n + (sa.actualCost ?? sa.activity.costEstimate ?? 0), 0);
    },

    // ── Mutations ────────────────────────────────────────────────────────────

    moveActivity: ({ activityId, toDate, beforeId }) => {
      set((state) => {
        for (const tripId of Object.keys(state.trips)) {
          const trip = state.trips[tripId];
          let found: StopActivity | null = null;

          // Remove from current position
          for (const stop of trip.stops) {
            const idx = stop.scheduledActivities.findIndex((sa) => sa.id === activityId);
            if (idx !== -1) {
              found = { ...stop.scheduledActivities[idx] };
              stop.scheduledActivities.splice(idx, 1);
              break;
            }
          }
          if (!found) continue;

          found.scheduledDate = toDate;

          // Insert into target stop
          const targetStop =
            trip.stops.find((s) => s.arrivalDate <= toDate && s.departureDate >= toDate) ??
            trip.stops[0];

          if (beforeId) {
            const idx = targetStop.scheduledActivities.findIndex((sa) => sa.id === beforeId);
            if (idx !== -1) {
              targetStop.scheduledActivities.splice(idx, 0, found);
            } else {
              targetStop.scheduledActivities.push(found);
            }
          } else {
            targetStop.scheduledActivities.push(found);
          }

          // Recalculate scheduledTimes for the target day so sequence reflects on View & Calendar!
          const updatedDay = targetStop.scheduledActivities.filter((sa) => sa.scheduledDate === toDate);
          let currentMinutes = 8 * 60;
          for (const sa of updatedDay) {
            const h = String(Math.floor(currentMinutes / 60)).padStart(2, '0');
            const m = String(currentMinutes % 60).padStart(2, '0');
            sa.scheduledTime = `${h}:${m}`;
            currentMinutes += (sa.activity.durationMinutes || 60);
          }
        }
      });
    },

    reorderDayActivities: ({ tripId, date, oldIndex, newIndex }) => {
      set((state) => {
        const trip = state.trips[tripId];
        if (!trip) return;

        for (const stop of trip.stops) {
          const dayItems = stop.scheduledActivities
            .map((sa, i) => ({ sa, i }))
            .filter(({ sa }) => sa.scheduledDate === date);

          if (dayItems.length === 0) continue;

          // Clamp indices
          const from = Math.max(0, Math.min(oldIndex, dayItems.length - 1));
          const to = Math.max(0, Math.min(newIndex, dayItems.length - 1));
          if (from === to) return;

          // Grab real array indices
          const realFrom = dayItems[from].i;
          const realTo = dayItems[to].i;

          const [item] = stop.scheduledActivities.splice(realFrom, 1);
          stop.scheduledActivities.splice(realTo, 0, item);

          // Update times in order so sequence reflects in Timeline View & Calendar
          const updatedDay = stop.scheduledActivities.filter((sa) => sa.scheduledDate === date);
          let currentMinutes = 8 * 60;
          for (const sa of updatedDay) {
            const h = String(Math.floor(currentMinutes / 60)).padStart(2, '0');
            const m = String(currentMinutes % 60).padStart(2, '0');
            sa.scheduledTime = `${h}:${m}`;
            currentMinutes += (sa.activity.durationMinutes || 60);
          }
        }
      });
    },

    addActivity: ({ tripId, newSa }) => {
      set((state) => {
        const trip = state.trips[tripId];
        if (!trip) return;
        const targetStop =
          trip.stops.find(
            (s) => s.arrivalDate <= newSa.scheduledDate && s.departureDate >= newSa.scheduledDate,
          ) ?? trip.stops[0];
        if (targetStop) targetStop.scheduledActivities.push(newSa);
      });
    },

    removeActivity: ({ tripId, activityId }) => {
      set((state) => {
        const trip = state.trips[tripId];
        if (!trip) return;
        for (const stop of trip.stops) {
          const idx = stop.scheduledActivities.findIndex((sa) => sa.id === activityId);
          if (idx !== -1) {
            stop.scheduledActivities.splice(idx, 1);
            break;
          }
        }
      });
    },

    updateBudgetLine: ({ tripId, category, amount }) => {
      set((state) => {
        const trip = state.trips[tripId];
        if (!trip) return;
        const line = trip.budgetLines.find((bl) => bl.category === category);
        if (line) {
          line.amount = amount;
        } else {
          trip.budgetLines.push({
            id: `bl-${Date.now()}`,
            tripId,
            category: category as any,
            amount,
          });
        }
      });
    },

    setTotalBudget: ({ tripId, amount }) => {
      set((state) => {
        const trip = state.trips[tripId];
        if (trip) trip.totalBudget = amount;
      });
    },
  })),
);
