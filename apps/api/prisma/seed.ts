import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GlobeTrotter database...');

  // ─────────────────────────────────────────────
  // CITIES
  // ─────────────────────────────────────────────
  const cities = await Promise.all([
    // Europe
    prisma.city.upsert({
      where: { id: 'city-paris' },
      update: {},
      create: {
        id: 'city-paris',
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        lat: 48.8566,
        lng: 2.3522,
        costIndex: 1.8,
        popularityScore: 98,
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      },
    }),
    prisma.city.upsert({
      where: { id: 'city-rome' },
      update: {},
      create: {
        id: 'city-rome',
        name: 'Rome',
        country: 'Italy',
        region: 'Europe',
        lat: 41.9028,
        lng: 12.4964,
        costIndex: 1.5,
        popularityScore: 95,
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      },
    }),
    prisma.city.upsert({
      where: { id: 'city-barcelona' },
      update: {},
      create: {
        id: 'city-barcelona',
        name: 'Barcelona',
        country: 'Spain',
        region: 'Europe',
        lat: 41.3851,
        lng: 2.1734,
        costIndex: 1.4,
        popularityScore: 92,
        imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
      },
    }),
    prisma.city.upsert({
      where: { id: 'city-amsterdam' },
      update: {},
      create: {
        id: 'city-amsterdam',
        name: 'Amsterdam',
        country: 'Netherlands',
        region: 'Europe',
        lat: 52.3676,
        lng: 4.9041,
        costIndex: 1.7,
        popularityScore: 90,
        imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
      },
    }),
    // Asia
    prisma.city.upsert({
      where: { id: 'city-tokyo' },
      update: {},
      create: {
        id: 'city-tokyo',
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        lat: 35.6762,
        lng: 139.6503,
        costIndex: 1.6,
        popularityScore: 97,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      },
    }),
    prisma.city.upsert({
      where: { id: 'city-bali' },
      update: {},
      create: {
        id: 'city-bali',
        name: 'Bali',
        country: 'Indonesia',
        region: 'Asia',
        lat: -8.3405,
        lng: 115.0920,
        costIndex: 0.7,
        popularityScore: 94,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      },
    }),
    prisma.city.upsert({
      where: { id: 'city-bangkok' },
      update: {},
      create: {
        id: 'city-bangkok',
        name: 'Bangkok',
        country: 'Thailand',
        region: 'Asia',
        lat: 13.7563,
        lng: 100.5018,
        costIndex: 0.8,
        popularityScore: 91,
        imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      },
    }),
    // Americas
    prisma.city.upsert({
      where: { id: 'city-new-york' },
      update: {},
      create: {
        id: 'city-new-york',
        name: 'New York',
        country: 'USA',
        region: 'Americas',
        lat: 40.7128,
        lng: -74.0060,
        costIndex: 2.1,
        popularityScore: 96,
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      },
    }),
    prisma.city.upsert({
      where: { id: 'city-rio' },
      update: {},
      create: {
        id: 'city-rio',
        name: 'Rio de Janeiro',
        country: 'Brazil',
        region: 'Americas',
        lat: -22.9068,
        lng: -43.1729,
        costIndex: 0.9,
        popularityScore: 88,
        imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
      },
    }),
    // Middle East
    prisma.city.upsert({
      where: { id: 'city-dubai' },
      update: {},
      create: {
        id: 'city-dubai',
        name: 'Dubai',
        country: 'UAE',
        region: 'Middle East',
        lat: 25.2048,
        lng: 55.2708,
        costIndex: 1.9,
        popularityScore: 93,
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      },
    }),
    // Africa
    prisma.city.upsert({
      where: { id: 'city-cape-town' },
      update: {},
      create: {
        id: 'city-cape-town',
        name: 'Cape Town',
        country: 'South Africa',
        region: 'Africa',
        lat: -33.9249,
        lng: 18.4241,
        costIndex: 0.8,
        popularityScore: 89,
        imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
      },
    }),
    // Oceania
    prisma.city.upsert({
      where: { id: 'city-sydney' },
      update: {},
      create: {
        id: 'city-sydney',
        name: 'Sydney',
        country: 'Australia',
        region: 'Oceania',
        lat: -33.8688,
        lng: 151.2093,
        costIndex: 1.9,
        popularityScore: 91,
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
      },
    }),
  ]);
  console.log(`✅ ${cities.length} cities seeded`);

  // ─────────────────────────────────────────────
  // ACTIVITIES
  // ─────────────────────────────────────────────
  const activities = await Promise.all([
    // Paris
    prisma.activity.upsert({
      where: { id: 'act-eiffel' },
      update: {},
      create: {
        id: 'act-eiffel',
        cityId: 'city-paris',
        name: 'Eiffel Tower Visit',
        category: 'Sightseeing',
        description: 'Skip the line tickets to the iconic Eiffel Tower with summit access.',
        costEstimate: 35,
        durationMinutes: 120,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-louvre' },
      update: {},
      create: {
        id: 'act-louvre',
        cityId: 'city-paris',
        name: 'Louvre Museum',
        category: 'Culture',
        description: 'World\'s largest art museum and home to the Mona Lisa.',
        costEstimate: 20,
        durationMinutes: 180,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-seine' },
      update: {},
      create: {
        id: 'act-seine',
        cityId: 'city-paris',
        name: 'Seine River Cruise',
        category: 'Experience',
        description: '1-hour scenic cruise along the Seine passing Notre Dame and more.',
        costEstimate: 18,
        durationMinutes: 60,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-paris-food' },
      update: {},
      create: {
        id: 'act-paris-food',
        cityId: 'city-paris',
        name: 'Montmartre Food Tour',
        category: 'Food',
        description: 'Guided walking tour through Montmartre sampling local delicacies.',
        costEstimate: 65,
        durationMinutes: 150,
      },
    }),
    // Rome
    prisma.activity.upsert({
      where: { id: 'act-colosseum' },
      update: {},
      create: {
        id: 'act-colosseum',
        cityId: 'city-rome',
        name: 'Colosseum & Roman Forum',
        category: 'Sightseeing',
        description: 'Skip-the-line access to the Colosseum, Roman Forum and Palatine Hill.',
        costEstimate: 28,
        durationMinutes: 180,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-vatican' },
      update: {},
      create: {
        id: 'act-vatican',
        cityId: 'city-rome',
        name: 'Vatican Museums & Sistine Chapel',
        category: 'Culture',
        description: 'Guided tour of the Vatican Museums with exclusive Sistine Chapel access.',
        costEstimate: 45,
        durationMinutes: 240,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-trevi' },
      update: {},
      create: {
        id: 'act-trevi',
        cityId: 'city-rome',
        name: 'Trevi Fountain & Gelato Walk',
        category: 'Experience',
        description: 'Self-guided walk to the Trevi Fountain with a stop at the best gelato spot.',
        costEstimate: 10,
        durationMinutes: 90,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-rome-pasta' },
      update: {},
      create: {
        id: 'act-rome-pasta',
        cityId: 'city-rome',
        name: 'Pasta Making Class',
        category: 'Food',
        description: 'Hands-on pasta and tiramisu making class with a local chef.',
        costEstimate: 75,
        durationMinutes: 180,
      },
    }),
    // Tokyo
    prisma.activity.upsert({
      where: { id: 'act-shibuya' },
      update: {},
      create: {
        id: 'act-shibuya',
        cityId: 'city-tokyo',
        name: 'Shibuya Crossing & Harajuku',
        category: 'Sightseeing',
        description: 'Visit the world\'s busiest pedestrian crossing and explore Harajuku\'s fashion streets.',
        costEstimate: 0,
        durationMinutes: 120,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-tsukiji' },
      update: {},
      create: {
        id: 'act-tsukiji',
        cityId: 'city-tokyo',
        name: 'Tsukiji Market Breakfast Tour',
        category: 'Food',
        description: 'Early morning tour of Tokyo\'s famous outer fish market with sushi breakfast.',
        costEstimate: 55,
        durationMinutes: 150,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-teamlab' },
      update: {},
      create: {
        id: 'act-teamlab',
        cityId: 'city-tokyo',
        name: 'teamLab Borderless',
        category: 'Experience',
        description: 'Immersive digital art museum — one of the most unique experiences in Tokyo.',
        costEstimate: 32,
        durationMinutes: 180,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-fuji' },
      update: {},
      create: {
        id: 'act-fuji',
        cityId: 'city-tokyo',
        name: 'Day Trip to Mt. Fuji',
        category: 'Adventure',
        description: 'Guided day trip to Mt. Fuji and the Fuji Five Lakes region.',
        costEstimate: 85,
        durationMinutes: 480,
      },
    }),
    // Bali
    prisma.activity.upsert({
      where: { id: 'act-ubud' },
      update: {},
      create: {
        id: 'act-ubud',
        cityId: 'city-bali',
        name: 'Ubud Monkey Forest & Rice Terraces',
        category: 'Nature',
        description: 'Visit the sacred Monkey Forest and the stunning Tegalalang rice terraces.',
        costEstimate: 20,
        durationMinutes: 240,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-bali-surf' },
      update: {},
      create: {
        id: 'act-bali-surf',
        cityId: 'city-bali',
        name: 'Surf Lesson at Kuta Beach',
        category: 'Adventure',
        description: 'Beginner surf lesson with certified instructor at Kuta Beach.',
        costEstimate: 35,
        durationMinutes: 120,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-bali-temple' },
      update: {},
      create: {
        id: 'act-bali-temple',
        cityId: 'city-bali',
        name: 'Tanah Lot Sunset Temple',
        category: 'Sightseeing',
        description: 'Watch the sunset over the iconic sea temple of Tanah Lot.',
        costEstimate: 8,
        durationMinutes: 90,
      },
    }),
    // Dubai
    prisma.activity.upsert({
      where: { id: 'act-burj' },
      update: {},
      create: {
        id: 'act-burj',
        cityId: 'city-dubai',
        name: 'Burj Khalifa At The Top',
        category: 'Sightseeing',
        description: 'Visit floors 124 & 125 of the world\'s tallest building.',
        costEstimate: 45,
        durationMinutes: 90,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-desert' },
      update: {},
      create: {
        id: 'act-desert',
        cityId: 'city-dubai',
        name: 'Desert Safari with BBQ Dinner',
        category: 'Adventure',
        description: 'Dune bashing, camel ride, and a BBQ dinner under the stars.',
        costEstimate: 90,
        durationMinutes: 360,
      },
    }),
    prisma.activity.upsert({
      where: { id: 'act-dubai-mall' },
      update: {},
      create: {
        id: 'act-dubai-mall',
        cityId: 'city-dubai',
        name: 'Dubai Mall & Fountain Show',
        category: 'Experience',
        description: 'Explore Dubai Mall and watch the spectacular Dubai Fountain show.',
        costEstimate: 0,
        durationMinutes: 180,
      },
    }),
  ]);
  console.log(`✅ ${activities.length} activities seeded`);

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  const userHash = await bcrypt.hash('Password123!', 10);

  const [admin, alice, bob] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@globetrotter.dev' },
      update: {},
      create: {
        email: 'admin@globetrotter.dev',
        passwordHash: adminHash,
        firstName: 'Admin',
        lastName: 'GlobeTrotter',
        role: 'ADMIN',
        city: 'San Francisco',
        country: 'USA',
      },
    }),
    prisma.user.upsert({
      where: { email: 'alice@demo.com' },
      update: {},
      create: {
        email: 'alice@demo.com',
        passwordHash: userHash,
        firstName: 'Alice',
        lastName: 'Wanderer',
        city: 'London',
        country: 'UK',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@demo.com' },
      update: {},
      create: {
        email: 'bob@demo.com',
        passwordHash: userHash,
        firstName: 'Bob',
        lastName: 'Explorer',
        city: 'Mumbai',
        country: 'India',
      },
    }),
  ]);
  console.log('✅ 3 users seeded (admin@globetrotter.dev / Admin1234!)');

  // ─────────────────────────────────────────────
  // DEMO TRIP 1 — COMPLETED (past dates)
  // Europe Classic — Paris + Rome
  // ─────────────────────────────────────────────
  const trip1 = await prisma.trip.upsert({
    where: { id: 'trip-europe-classic' },
    update: {},
    create: {
      id: 'trip-europe-classic',
      userId: alice.id,
      name: 'Europe Classic',
      description: 'Two weeks exploring the best of Paris and Rome.',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-14'),
      isPublic: true,
      shareSlug: 'europe-classic-alice',
    },
  });

  // Stops for trip 1
  const stop1Paris = await prisma.stop.upsert({
    where: { id: 'stop-t1-paris' },
    update: {},
    create: {
      id: 'stop-t1-paris',
      tripId: trip1.id,
      cityId: 'city-paris',
      orderIndex: 0,
      arrivalDate: new Date('2024-09-01'),
      departureDate: new Date('2024-09-07'),
    },
  });

  const stop1Rome = await prisma.stop.upsert({
    where: { id: 'stop-t1-rome' },
    update: {},
    create: {
      id: 'stop-t1-rome',
      tripId: trip1.id,
      cityId: 'city-rome',
      orderIndex: 1,
      arrivalDate: new Date('2024-09-07'),
      departureDate: new Date('2024-09-14'),
    },
  });

  // Activities for stop1Paris
  await Promise.all([
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-eiffel' },
      update: {},
      create: {
        id: 'sa-t1-eiffel',
        stopId: stop1Paris.id,
        activityId: 'act-eiffel',
        scheduledDate: new Date('2024-09-02'),
        scheduledTime: '10:00',
        actualCost: 35,
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-louvre' },
      update: {},
      create: {
        id: 'sa-t1-louvre',
        stopId: stop1Paris.id,
        activityId: 'act-louvre',
        scheduledDate: new Date('2024-09-03'),
        scheduledTime: '09:00',
        actualCost: 20,
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-seine' },
      update: {},
      create: {
        id: 'sa-t1-seine',
        stopId: stop1Paris.id,
        activityId: 'act-seine',
        scheduledDate: new Date('2024-09-04'),
        scheduledTime: '18:00',
        actualCost: 18,
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-paris-food' },
      update: {},
      create: {
        id: 'sa-t1-paris-food',
        stopId: stop1Paris.id,
        activityId: 'act-paris-food',
        scheduledDate: new Date('2024-09-05'),
        scheduledTime: '11:00',
        actualCost: 70,
      },
    }),
  ]);

  // Activities for stop1Rome
  await Promise.all([
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-colosseum' },
      update: {},
      create: {
        id: 'sa-t1-colosseum',
        stopId: stop1Rome.id,
        activityId: 'act-colosseum',
        scheduledDate: new Date('2024-09-08'),
        scheduledTime: '09:00',
        actualCost: 28,
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-vatican' },
      update: {},
      create: {
        id: 'sa-t1-vatican',
        stopId: stop1Rome.id,
        activityId: 'act-vatican',
        scheduledDate: new Date('2024-09-10'),
        scheduledTime: '08:00',
        actualCost: 45,
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t1-pasta' },
      update: {},
      create: {
        id: 'sa-t1-pasta',
        stopId: stop1Rome.id,
        activityId: 'act-rome-pasta',
        scheduledDate: new Date('2024-09-12'),
        scheduledTime: '14:00',
        actualCost: 75,
      },
    }),
  ]);

  // Budget lines for trip 1
  await Promise.all([
    prisma.budgetLine.upsert({
      where: { id: 'bl-t1-flight' },
      update: {},
      create: {
        id: 'bl-t1-flight',
        tripId: trip1.id,
        category: 'TRANSPORT',
        label: 'Return flights LHR → CDG → FCO → LHR',
        amount: 380,
      },
    }),
    prisma.budgetLine.upsert({
      where: { id: 'bl-t1-hotel-paris' },
      update: {},
      create: {
        id: 'bl-t1-hotel-paris',
        tripId: trip1.id,
        stopId: stop1Paris.id,
        category: 'STAY',
        label: 'Hotel in Le Marais (6 nights)',
        amount: 720,
      },
    }),
    prisma.budgetLine.upsert({
      where: { id: 'bl-t1-hotel-rome' },
      update: {},
      create: {
        id: 'bl-t1-hotel-rome',
        tripId: trip1.id,
        stopId: stop1Rome.id,
        category: 'STAY',
        label: 'Airbnb near Trastevere (7 nights)',
        amount: 630,
      },
    }),
  ]);

  console.log('✅ Trip 1 — Europe Classic (completed) seeded');

  // ─────────────────────────────────────────────
  // DEMO TRIP 2 — UPCOMING (future dates)
  // Tokyo & Bali Adventure — Bob
  // ─────────────────────────────────────────────
  const futureStart = new Date();
  futureStart.setMonth(futureStart.getMonth() + 2);
  const futureEnd = new Date(futureStart);
  futureEnd.setDate(futureEnd.getDate() + 14);

  const trip2 = await prisma.trip.upsert({
    where: { id: 'trip-asia-adventure' },
    update: {},
    create: {
      id: 'trip-asia-adventure',
      userId: bob.id,
      name: 'Asia Adventure',
      description: 'Tokyo for culture and technology, Bali for beaches and spirituality.',
      startDate: futureStart,
      endDate: futureEnd,
      isPublic: false,
    },
  });

  const tokyoStart = new Date(futureStart);
  const tokyoEnd = new Date(futureStart);
  tokyoEnd.setDate(tokyoEnd.getDate() + 7);

  const baliStart = new Date(tokyoEnd);
  const baliEnd = new Date(futureEnd);

  const stop2Tokyo = await prisma.stop.upsert({
    where: { id: 'stop-t2-tokyo' },
    update: {},
    create: {
      id: 'stop-t2-tokyo',
      tripId: trip2.id,
      cityId: 'city-tokyo',
      orderIndex: 0,
      arrivalDate: tokyoStart,
      departureDate: tokyoEnd,
    },
  });

  const stop2Bali = await prisma.stop.upsert({
    where: { id: 'stop-t2-bali' },
    update: {},
    create: {
      id: 'stop-t2-bali',
      tripId: trip2.id,
      cityId: 'city-bali',
      orderIndex: 1,
      arrivalDate: baliStart,
      departureDate: baliEnd,
    },
  });

  await Promise.all([
    prisma.stopActivity.upsert({
      where: { id: 'sa-t2-shibuya' },
      update: {},
      create: {
        id: 'sa-t2-shibuya',
        stopId: stop2Tokyo.id,
        activityId: 'act-shibuya',
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t2-teamlab' },
      update: {},
      create: {
        id: 'sa-t2-teamlab',
        stopId: stop2Tokyo.id,
        activityId: 'act-teamlab',
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t2-fuji' },
      update: {},
      create: {
        id: 'sa-t2-fuji',
        stopId: stop2Tokyo.id,
        activityId: 'act-fuji',
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t2-ubud' },
      update: {},
      create: {
        id: 'sa-t2-ubud',
        stopId: stop2Bali.id,
        activityId: 'act-ubud',
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t2-surf' },
      update: {},
      create: {
        id: 'sa-t2-surf',
        stopId: stop2Bali.id,
        activityId: 'act-bali-surf',
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t2-temple' },
      update: {},
      create: {
        id: 'sa-t2-temple',
        stopId: stop2Bali.id,
        activityId: 'act-bali-temple',
      },
    }),
  ]);

  await Promise.all([
    prisma.budgetLine.upsert({
      where: { id: 'bl-t2-flight' },
      update: {},
      create: {
        id: 'bl-t2-flight',
        tripId: trip2.id,
        category: 'TRANSPORT',
        label: 'Flights BOM → NRT → DPS → BOM',
        amount: 620,
      },
    }),
    prisma.budgetLine.upsert({
      where: { id: 'bl-t2-hotel-tokyo' },
      update: {},
      create: {
        id: 'bl-t2-hotel-tokyo',
        tripId: trip2.id,
        stopId: stop2Tokyo.id,
        category: 'STAY',
        label: 'Shinjuku hotel (7 nights)',
        amount: 840,
      },
    }),
    prisma.budgetLine.upsert({
      where: { id: 'bl-t2-villa-bali' },
      update: {},
      create: {
        id: 'bl-t2-villa-bali',
        tripId: trip2.id,
        stopId: stop2Bali.id,
        category: 'STAY',
        label: 'Private villa in Seminyak (7 nights)',
        amount: 490,
      },
    }),
  ]);

  console.log('✅ Trip 2 — Asia Adventure (upcoming) seeded');

  // ─────────────────────────────────────────────
  // DEMO TRIP 3 — ONGOING (today is inside dates)
  // Dubai Weekend — Alice
  // ─────────────────────────────────────────────
  const ongoingStart = new Date();
  ongoingStart.setDate(ongoingStart.getDate() - 2);
  const ongoingEnd = new Date();
  ongoingEnd.setDate(ongoingEnd.getDate() + 3);

  const trip3 = await prisma.trip.upsert({
    where: { id: 'trip-dubai-weekend' },
    update: {},
    create: {
      id: 'trip-dubai-weekend',
      userId: alice.id,
      name: 'Dubai Long Weekend',
      description: 'A 5-day luxury getaway to Dubai.',
      startDate: ongoingStart,
      endDate: ongoingEnd,
      isPublic: true,
      shareSlug: 'dubai-weekend-alice',
    },
  });

  const stop3Dubai = await prisma.stop.upsert({
    where: { id: 'stop-t3-dubai' },
    update: {},
    create: {
      id: 'stop-t3-dubai',
      tripId: trip3.id,
      cityId: 'city-dubai',
      orderIndex: 0,
      arrivalDate: ongoingStart,
      departureDate: ongoingEnd,
    },
  });

  await Promise.all([
    prisma.stopActivity.upsert({
      where: { id: 'sa-t3-burj' },
      update: {},
      create: {
        id: 'sa-t3-burj',
        stopId: stop3Dubai.id,
        activityId: 'act-burj',
        scheduledDate: new Date(ongoingStart.getTime() + 86400000),
        scheduledTime: '19:00',
        actualCost: 45,
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t3-desert' },
      update: {},
      create: {
        id: 'sa-t3-desert',
        stopId: stop3Dubai.id,
        activityId: 'act-desert',
        scheduledDate: new Date(ongoingStart.getTime() + 86400000 * 2),
        scheduledTime: '15:00',
      },
    }),
    prisma.stopActivity.upsert({
      where: { id: 'sa-t3-mall' },
      update: {},
      create: {
        id: 'sa-t3-mall',
        stopId: stop3Dubai.id,
        activityId: 'act-dubai-mall',
        scheduledDate: new Date(ongoingStart.getTime() + 86400000 * 3),
        scheduledTime: '11:00',
      },
    }),
  ]);

  await Promise.all([
    prisma.budgetLine.upsert({
      where: { id: 'bl-t3-flight' },
      update: {},
      create: {
        id: 'bl-t3-flight',
        tripId: trip3.id,
        category: 'TRANSPORT',
        label: 'Flights LHR → DXB → LHR',
        amount: 280,
      },
    }),
    prisma.budgetLine.upsert({
      where: { id: 'bl-t3-hotel' },
      update: {},
      create: {
        id: 'bl-t3-hotel',
        tripId: trip3.id,
        stopId: stop3Dubai.id,
        category: 'STAY',
        label: 'Downtown Dubai hotel (5 nights)',
        amount: 950,
      },
    }),
  ]);

  console.log('✅ Trip 3 — Dubai Long Weekend (ongoing) seeded');
  console.log('\n🎉 Seed complete! Demo accounts:');
  console.log('   admin@globetrotter.dev / Admin1234!');
  console.log('   alice@demo.com / Password123!');
  console.log('   bob@demo.com   / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
