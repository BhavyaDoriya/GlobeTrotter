import type { Trip } from './types';

// ─── Rome Trip (Builder Board Demo) ──────────────────────────────────────────

export const ROME_TRIP: Trip = {
  id: 'trip-rome-001',
  userId: 'user-dev-b',
  name: 'Roman Holiday',
  description: 'A 4-day adventure through the Eternal City',
  startDate: '2029-11-18',
  endDate: '2029-11-21',
  isPublic: false,
  totalBudget: 1450,
  stops: [
    {
      id: 'stop-rome-001',
      tripId: 'trip-rome-001',
      city: {
        id: 'city-rome',
        name: 'Rome',
        country: 'Italy',
        region: 'Lazio',
        lat: 41.9028,
        lng: 12.4964,
        costIndex: 150,
        popularityScore: 98,
      },
      orderIndex: 0,
      arrivalDate: '2029-11-18',
      departureDate: '2029-11-21',
      scheduledActivities: [
        // ── Day 1: Sat 18 Nov ──────────────────────────────────────────────
        {
          id: 'sa-001', stopId: 'stop-rome-001', activityId: 'act-001',
          activity: { id: 'act-001', cityId: 'city-rome', name: 'Landing · Train Leonardo Express to city center', category: 'transport', costEstimate: 15, durationMinutes: 60 },
          scheduledDate: '2029-11-18', scheduledTime: '09:00',
        },
        {
          id: 'sa-002', stopId: 'stop-rome-001', activityId: 'act-002',
          activity: { id: 'act-002', cityId: 'city-rome', name: 'Check into hotel and settle in', category: 'accommodation', costEstimate: 120, durationMinutes: 120 },
          scheduledDate: '2029-11-18', scheduledTime: '11:00',
        },
        {
          id: 'sa-003', stopId: 'stop-rome-001', activityId: 'act-003',
          activity: { id: 'act-003', cityId: 'city-rome', name: 'Colosseum and Roman Forum Tour', category: 'sightseeing', costEstimate: 25, durationMinutes: 180 },
          scheduledDate: '2029-11-18', scheduledTime: '13:00',
        },
        {
          id: 'sa-004', stopId: 'stop-rome-001', activityId: 'act-004',
          activity: { id: 'act-004', cityId: 'city-rome', name: 'Explore Monti Neighborhood', category: 'sightseeing', costEstimate: 0, durationMinutes: 120 },
          scheduledDate: '2029-11-18', scheduledTime: '17:00',
        },

        // ── Day 2: Sun 19 Nov ──────────────────────────────────────────────
        {
          id: 'sa-005', stopId: 'stop-rome-001', activityId: 'act-005',
          activity: { id: 'act-005', cityId: 'city-rome', name: 'Vatican Museums and Sistine Chapel', category: 'sightseeing', costEstimate: 27, durationMinutes: 240 },
          scheduledDate: '2029-11-19', scheduledTime: '08:00',
        },
        {
          id: 'sa-006', stopId: 'stop-rome-001', activityId: 'act-006',
          activity: { id: 'act-006', cityId: 'city-rome', name: "St. Peter's Basilica and Square", category: 'sightseeing', costEstimate: 0, durationMinutes: 120 },
          scheduledDate: '2029-11-19', scheduledTime: '13:00',
        },
        {
          id: 'sa-007', stopId: 'stop-rome-001', activityId: 'act-007',
          activity: { id: 'act-007', cityId: 'city-rome', name: 'Dinner at Tonnarello', category: 'food', costEstimate: 45, durationMinutes: 120 },
          scheduledDate: '2029-11-19', scheduledTime: '19:00',
        },

        // ── Day 3: Mon 20 Nov ──────────────────────────────────────────────
        {
          id: 'sa-008', stopId: 'stop-rome-001', activityId: 'act-008',
          activity: { id: 'act-008', cityId: 'city-rome', name: 'Pantheon & Piazza della Rotonda', category: 'sightseeing', costEstimate: 5, durationMinutes: 120 },
          scheduledDate: '2029-11-20', scheduledTime: '08:00',
        },
        {
          id: 'sa-009', stopId: 'stop-rome-001', activityId: 'act-009',
          activity: { id: 'act-009', cityId: 'city-rome', name: "Campo de' Fiori and Lunch", category: 'food', costEstimate: 30, durationMinutes: 120 },
          scheduledDate: '2029-11-20', scheduledTime: '12:00',
        },
        {
          id: 'sa-010', stopId: 'stop-rome-001', activityId: 'act-010',
          activity: { id: 'act-010', cityId: 'city-rome', name: 'Spanish Steps and Shopping', category: 'shopping', costEstimate: 100, durationMinutes: 120 },
          scheduledDate: '2029-11-20', scheduledTime: '15:00',
        },
        {
          id: 'sa-011', stopId: 'stop-rome-001', activityId: 'act-011',
          activity: { id: 'act-011', cityId: 'city-rome', name: 'Dinner at Terrazza Monti — Rooftop Restaurant', category: 'food', costEstimate: 80, durationMinutes: 120 },
          scheduledDate: '2029-11-20', scheduledTime: '19:00',
        },

        // ── Day 4: Tue 21 Nov ──────────────────────────────────────────────
        {
          id: 'sa-012', stopId: 'stop-rome-001', activityId: 'act-012',
          activity: { id: 'act-012', cityId: 'city-rome', name: 'Galleria Borghese', category: 'sightseeing', costEstimate: 15, durationMinutes: 120 },
          scheduledDate: '2029-11-21', scheduledTime: '09:00',
        },
        {
          id: 'sa-013', stopId: 'stop-rome-001', activityId: 'act-013',
          activity: { id: 'act-013', cityId: 'city-rome', name: 'Villa Borghese Gardens stroll', category: 'sightseeing', costEstimate: 0, durationMinutes: 120 },
          scheduledDate: '2029-11-21', scheduledTime: '12:00',
        },
        {
          id: 'sa-014', stopId: 'stop-rome-001', activityId: 'act-014',
          activity: { id: 'act-014', cityId: 'city-rome', name: 'Exploring Testaccio Neighborhood', category: 'sightseeing', costEstimate: 20, durationMinutes: 180 },
          scheduledDate: '2029-11-21', scheduledTime: '15:00',
        },
        {
          id: 'sa-015', stopId: 'stop-rome-001', activityId: 'act-015',
          activity: { id: 'act-015', cityId: 'city-rome', name: 'Final shopping — Campo Marzio', category: 'shopping', costEstimate: 50, durationMinutes: 120 },
          scheduledDate: '2029-11-21', scheduledTime: '18:00',
        },
        {
          id: 'sa-016', stopId: 'stop-rome-001', activityId: 'act-016',
          activity: { id: 'act-016', cityId: 'city-rome', name: 'Transfer to Fiumicino Airport', category: 'transport', costEstimate: 15, durationMinutes: 60 },
          scheduledDate: '2029-11-21', scheduledTime: '20:00',
        },
      ],
    },
  ],
  budgetLines: [
    { id: 'bl-001', tripId: 'trip-rome-001', category: 'transport',  amount: 350 },
    { id: 'bl-002', tripId: 'trip-rome-001', category: 'stay',       amount: 600 },
    { id: 'bl-003', tripId: 'trip-rome-001', category: 'activities', amount: 200 },
    { id: 'bl-004', tripId: 'trip-rome-001', category: 'meals',      amount: 300 },
  ],
};

// ─── Singapore Trip (Timeline Viewer Demo) ────────────────────────────────────

export const SINGAPORE_TRIP: Trip = {
  id: 'trip-singapore-001',
  userId: 'user-dev-b',
  name: 'Singapore in a Day',
  description: 'Whirlwind tour of the Lion City',
  startDate: '2029-12-01',
  endDate: '2029-12-01',
  isPublic: true,
  totalBudget: 530,
  stops: [
    {
      id: 'stop-sg-001',
      tripId: 'trip-singapore-001',
      city: {
        id: 'city-singapore',
        name: 'Singapore',
        country: 'Singapore',
        lat: 1.3521,
        lng: 103.8198,
        costIndex: 200,
        popularityScore: 95,
      },
      orderIndex: 0,
      arrivalDate: '2029-12-01',
      departureDate: '2029-12-01',
      scheduledActivities: [
        {
          id: 'sa-sg-001', stopId: 'stop-sg-001', activityId: 'act-sg-001',
          activity: { id: 'act-sg-001', cityId: 'city-singapore', name: 'Merlion Park', category: 'sightseeing', description: 'Iconic symbol of Singapore', costEstimate: 0, durationMinutes: 60 },
          scheduledDate: '2029-12-01', scheduledTime: '10:00',
        },
        {
          id: 'sa-sg-002', stopId: 'stop-sg-001', activityId: 'act-sg-002',
          activity: { id: 'act-sg-002', cityId: 'city-singapore', name: 'Singapore Botanic Gardens', category: 'sightseeing', description: 'UNESCO World Heritage Site', costEstimate: 0, durationMinutes: 60 },
          scheduledDate: '2029-12-01', scheduledTime: '11:00',
        },
        {
          id: 'sa-sg-003', stopId: 'stop-sg-001', activityId: 'act-sg-003',
          activity: { id: 'act-sg-003', cityId: 'city-singapore', name: 'Clarke Quay', category: 'entertainment', description: 'Historic riverside quay with great food & nightlife', costEstimate: 40, durationMinutes: 60 },
          scheduledDate: '2029-12-01', scheduledTime: '12:00',
        },
        {
          id: 'sa-sg-004', stopId: 'stop-sg-001', activityId: 'act-sg-004',
          activity: { id: 'act-sg-004', cityId: 'city-singapore', name: 'Gardens by the Bay', category: 'sightseeing', description: 'Supertree Grove and Cloud Forest', costEstimate: 30, durationMinutes: 60 },
          scheduledDate: '2029-12-01', scheduledTime: '13:00',
        },
        {
          id: 'sa-sg-005', stopId: 'stop-sg-001', activityId: 'act-sg-005',
          activity: { id: 'act-sg-005', cityId: 'city-singapore', name: 'Sentosa Island', category: 'entertainment', description: 'Beach, Universal Studios & S.E.A. Aquarium', costEstimate: 80, durationMinutes: 60 },
          scheduledDate: '2029-12-01', scheduledTime: '14:00',
        },
      ],
    },
  ],
  budgetLines: [
    { id: 'bl-sg-001', tripId: 'trip-singapore-001', category: 'transport',  amount: 80  },
    { id: 'bl-sg-002', tripId: 'trip-singapore-001', category: 'stay',       amount: 200 },
    { id: 'bl-sg-003', tripId: 'trip-singapore-001', category: 'activities', amount: 150 },
    { id: 'bl-sg-004', tripId: 'trip-singapore-001', category: 'meals',      amount: 100 },
  ],
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const MOCK_TRIPS: Record<string, Trip> = {
  [ROME_TRIP.id]:      ROME_TRIP,
  [SINGAPORE_TRIP.id]: SINGAPORE_TRIP,
  'demo-trip-1':       ROME_TRIP,       // canonical demo alias
  'demo-trip-2':       SINGAPORE_TRIP,
};

/** Palette of activity categories available in the AddActivity drawer */
export const ACTIVITY_CATALOG = [
  { id: 'cat-transport',     category: 'transport'    as const, name: 'Flight / Train / Bus',        costEstimate: 50,  durationMinutes: 120 },
  { id: 'cat-hotel',        category: 'accommodation' as const, name: 'Hotel check-in',              costEstimate: 100, durationMinutes: 60  },
  { id: 'cat-museum',       category: 'sightseeing'   as const, name: 'Museum visit',                costEstimate: 20,  durationMinutes: 120 },
  { id: 'cat-landmark',     category: 'sightseeing'   as const, name: 'Landmark sightseeing',        costEstimate: 0,   durationMinutes: 90  },
  { id: 'cat-restaurant',   category: 'food'          as const, name: 'Restaurant dinner',           costEstimate: 40,  durationMinutes: 90  },
  { id: 'cat-streetfood',   category: 'food'          as const, name: 'Street food / market',        costEstimate: 15,  durationMinutes: 60  },
  { id: 'cat-shopping',     category: 'shopping'      as const, name: 'Shopping',                    costEstimate: 80,  durationMinutes: 120 },
  { id: 'cat-show',         category: 'entertainment' as const, name: 'Show / Concert',              costEstimate: 60,  durationMinutes: 180 },
  { id: 'cat-other',        category: 'other'         as const, name: 'Custom activity',             costEstimate: 0,   durationMinutes: 60  },
];
