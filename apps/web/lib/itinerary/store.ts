import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
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

  /** Add a new activity to a specific stop date. */
  addActivity: (params: { tripId: string; newSa: StopActivity }) => void;

  /** Edit an existing activity's details. */
  updateActivity: (params: {
    tripId: string;
    activityId: string;
    name?: string;
    category?: any;
    scheduledTime?: string;
    durationMinutes?: number;
    costEstimate?: number;
  }) => void;

  /** Remove an activity by id from any stop. */
  removeActivity: (params: { tripId: string; activityId: string }) => void;

  /** Update a budget line amount. */
  updateBudgetLine: (params: { tripId: string; category: string; amount: number }) => void;

  /** Set the overall trip total budget. */
  setTotalBudget: (params: { tripId: string; amount: number }) => void;

  /** Create a new custom trip. Returns new trip id. */
  createTrip: (params: {
    name: string;
    cityName: string;
    startDate: string;
    endDate: string;
    totalBudget?: number;
  }) => string;

  /** Inject a trip from the API into the store */
  setTrip: (trip: any) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let d = new Date(start);
  let e = new Date(end);

  if (isNaN(d.getTime())) d = new Date();
  if (isNaN(e.getTime())) {
    e = new Date(d);
    e.setDate(e.getDate() + 3);
  }

  if (d > e) {
    const temp = d;
    d = e;
    e = temp;
  }

  let count = 0;
  while (d <= e && count < 60) {
    dates.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
    count++;
  }

  if (dates.length === 0) {
    dates.push(new Date().toISOString().split('T')[0]);
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

function reassignSequentialTimes(activities: StopActivity[]): void {
  let startHour = 9;
  let startMinute = 0;

  for (let i = 0; i < activities.length; i++) {
    const hh = String(startHour).padStart(2, '0');
    const mm = String(startMinute).padStart(2, '0');
    activities[i].scheduledTime = `${hh}:${mm}`;

    const duration = activities[i].activity?.durationMinutes || 60;
    startMinute += duration;
    if (startMinute >= 60) {
      startHour += Math.floor(startMinute / 60);
      startMinute = startMinute % 60;
    }
  }
}

// ─── Store Implementation with Persistence ────────────────────────────────────

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    immer((set, get) => ({
      trips: {},

      // ── Selectors ────────────────────────────────────────────────────────────

      getTrip: (id: string) => {
        const state = get();
        return state.trips[id];
      },

      getDaySchedules: (tripId: string) => {
        const trip = get().getTrip(tripId);
        if (!trip) return [];

        const dates = dateRange(trip.startDate, trip.endDate);

        const allActivities: StopActivity[] = [];
        for (const stop of trip.stops) {
          allActivities.push(...stop.scheduledActivities);
        }

        return dates.map((date) => {
          const dayActs = allActivities.filter((sa) => sa.scheduledDate === date);
          // Find the stop that covers this date
          const activeStop = trip.stops.find(s => date >= s.arrivalDate && date <= s.departureDate) || trip.stops[0];
          
          return {
            date,
            dayLabel: dayLabel(date),
            stopId: activeStop?.id || '',
            cityName: activeStop?.city.name || 'Unknown',
            activities: dayActs,
          };
        });
      },

      getTotalActivities: (tripId: string) => {
        const trip = get().getTrip(tripId);
        if (!trip) return 0;
        return trip.stops.reduce((acc, stop) => acc + stop.scheduledActivities.length, 0);
      },

      getSpentTotal: (tripId: string) => {
        const trip = get().getTrip(tripId);
        if (!trip) return 0;
        return trip.stops.reduce((acc, stop) => {
          return (
            acc +
            stop.scheduledActivities.reduce(
              (sum, sa) => sum + (sa.activity.costEstimate || 0),
              0,
            )
          );
        }, 0);
      },

      // ── Mutations ────────────────────────────────────────────────────────────

      moveActivity: ({ activityId, toDate, beforeId }) => {
        set((state) => {
          let foundSa: StopActivity | null = null;

          for (const tripId of Object.keys(state.trips)) {
            const trip = state.trips[tripId];
            for (const stop of trip.stops) {
              const idx = stop.scheduledActivities.findIndex((a) => a.id === activityId);
              if (idx !== -1) {
                [foundSa] = stop.scheduledActivities.splice(idx, 1);
                break;
              }
            }
            if (foundSa) break;
          }

          if (!foundSa) return;

          foundSa.scheduledDate = toDate;

          let targetTripId: string | null = null;
          let targetStop = null;

          for (const tId of Object.keys(state.trips)) {
            const trip = state.trips[tId];
            const stop = trip.stops.find(
              (s) => s.arrivalDate <= toDate && s.departureDate >= toDate,
            );
            if (stop) {
              targetTripId = tId;
              targetStop = stop;
              break;
            }
          }

          if (!targetStop) {
            const firstTrip = Object.values(state.trips)[0];
            targetStop = firstTrip?.stops[0];
          }

          if (!targetStop) return;

          foundSa.stopId = targetStop.id;

          const destActs = targetStop.scheduledActivities.filter(
            (sa) => sa.scheduledDate === toDate,
          );

          if (beforeId) {
            const beforeIdx = destActs.findIndex((sa) => sa.id === beforeId);
            const globalBeforeIdx = targetStop.scheduledActivities.findIndex(
              (sa) => sa.id === beforeId,
            );
            if (globalBeforeIdx !== -1) {
              targetStop.scheduledActivities.splice(globalBeforeIdx, 0, foundSa);
            } else {
              targetStop.scheduledActivities.push(foundSa);
            }
          } else {
            targetStop.scheduledActivities.push(foundSa);
          }

          const updatedDayActs = targetStop.scheduledActivities.filter(
            (sa) => sa.scheduledDate === toDate,
          );
          reassignSequentialTimes(updatedDayActs);
        });
      },

      reorderDayActivities: ({ tripId, date, oldIndex, newIndex }) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (!trip) return;

          for (const stop of trip.stops) {
            const dayActs = stop.scheduledActivities.filter((sa) => sa.scheduledDate === date);

            if (
              oldIndex >= 0 &&
              oldIndex < dayActs.length &&
              newIndex >= 0 &&
              newIndex < dayActs.length
            ) {
              const [movedItem] = dayActs.splice(oldIndex, 1);
              dayActs.splice(newIndex, 0, movedItem);

              reassignSequentialTimes(dayActs);

              const otherDateActs = stop.scheduledActivities.filter(
                (sa) => sa.scheduledDate !== date,
              );
              stop.scheduledActivities = [...otherDateActs, ...dayActs];
              break;
            }
          }
        });
      },

      addActivity: ({ tripId, newSa }) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (!trip) return;

          let targetStop = trip.stops.find((s) => s.id === newSa.stopId);
          if (!targetStop && trip.stops.length > 0) {
            targetStop = trip.stops[0];
          }
          if (!targetStop) return;

          targetStop.scheduledActivities.push(newSa);
        });
      },

      updateActivity: ({
        tripId,
        activityId,
        name,
        category,
        scheduledTime,
        durationMinutes,
        costEstimate,
      }) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (!trip) return;
          for (const stop of trip.stops) {
            const sa = stop.scheduledActivities.find((a) => a.id === activityId);
            if (sa) {
              if (name !== undefined) sa.activity.name = name;
              if (category !== undefined) sa.activity.category = category;
              if (scheduledTime !== undefined) sa.scheduledTime = scheduledTime;
              if (durationMinutes !== undefined) sa.activity.durationMinutes = durationMinutes;
              if (costEstimate !== undefined) sa.activity.costEstimate = costEstimate;
              break;
            }
          }
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

      createTrip: ({ name, cityName, startDate, endDate, totalBudget = 1000 }) => {
        const id = `trip-${Date.now()}`;
        const stopId = `stop-${Date.now()}`;
        const cityId = `city-${cityName.toLowerCase().replace(/\s+/g, '-')}`;

        let s = startDate;
        let e = endDate;
        if (new Date(s) > new Date(e)) {
          s = endDate;
          e = startDate;
        }

        const newTrip: Trip = {
          id,
          userId: 'user-dev-b',
          name,
          description: `Adventure in ${cityName}`,
          startDate: s,
          endDate: e,
          isPublic: false,
          totalBudget,
          stops: [
            {
              id: stopId,
              tripId: id,
              city: {
                id: cityId,
                name: cityName,
                country: 'Destination',
                lat: 40.7128,
                lng: -74.0060,
                costIndex: 120,
                popularityScore: 90,
              },
              orderIndex: 0,
              arrivalDate: s,
              departureDate: e,
              scheduledActivities: [],
            },
          ],
          budgetLines: [
            { id: `bl-1-${id}`, tripId: id, category: 'transport', amount: 300 },
            { id: `bl-2-${id}`, tripId: id, category: 'stay', amount: 400 },
            { id: `bl-3-${id}`, tripId: id, category: 'activities', amount: 150 },
            { id: `bl-4-${id}`, tripId: id, category: 'meals', amount: 150 },
          ],
        };

        set((state) => {
          state.trips[id] = newTrip;
        });

        return id;
      },
      setTrip: (trip) => {
        set((state) => {
          // Normalize the backend API data to match the expected Trip type format
          state.trips[trip.id] = {
            ...trip,
            // Convert the stopActivities from NestJS to the format DayColumn expects
            stops: trip.stops?.map((stop: any) => ({
              ...stop,
              scheduledActivities: stop.stopActivities || []
            })) || []
          };
        });
      },

    })),
    {
      name: 'globetrotter-itinerary-store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
    },
  ),
);
