# GlobeTrotter API — How to Test Everything

Complete guide to get the API running and verify every endpoint works.

---

## Step 1 — Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) → sign in → **New Project**
2. Name: `globetrotter` | Set a strong DB password | Choose nearest region
3. Wait ~2 min for provisioning
4. Go to **Settings → Database → Connection string → URI tab**
5. Copy the URI and paste into `apps/api/.env`:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres"
   ```

---

## Step 2 — Run the Migration

Open terminal in `apps/api/`:

```bash
npx prisma migrate dev --name init
```

Expected output:
```
✓ Generated Prisma Client
✓ Your database is now in sync with your schema.
```

Verify tables in Supabase Dashboard → **Table Editor** — you should see:
`User`, `RefreshToken`, `Trip`, `Stop`, `City`, `Activity`, `StopActivity`, `BudgetLine`

---

## Step 3 — Run the Seed

```bash
npx prisma db seed
```

Expected output:
```
🌱 Seeding GlobeTrotter database...
✅ 12 cities seeded
✅ 17 activities seeded
✅ 3 users seeded (admin@globetrotter.dev / Admin1234!)
✅ Trip 1 — Europe Classic (completed) seeded
✅ Trip 2 — Asia Adventure (upcoming) seeded
✅ Trip 3 — Dubai Long Weekend (ongoing) seeded

🎉 Seed complete! Demo accounts:
   admin@globetrotter.dev / Admin1234!
   alice@demo.com / Password123!
   bob@demo.com   / Password123!
```

---

## Step 4 — Start the API

```bash
pnpm run dev
```

Expected output:
```
🌍 API running    → http://localhost:4000
📄 Swagger docs  → http://localhost:4000/api/docs
```

---

## Step 5 — Test via Swagger UI

Open **http://localhost:4000/api/docs** in your browser.

You will see 6 tag groups: `auth`, `users`, `trips`, `stops`, `activities`, `budget`

---

## Testing Flow (do in this order)

### 5.1 — Register a user

**POST /api/auth/register**

Click → Try it out → Execute with:
```json
{
  "email": "test@test.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

Expected response `201`:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "...",
    "email": "test@test.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER"
  }
}
```

✅ Check: NO `passwordHash` in the response

---

### 5.2 — Authorize in Swagger

1. Copy the `accessToken` from the register response
2. Click the **Authorize** button (top right in Swagger)
3. Paste the token → click Authorize → Close

All protected endpoints now work.

---

### 5.3 — Login with the same account

**POST /api/auth/login**
```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

Expected: same shape as register — `accessToken`, `refreshToken`, `user` with `email: "test@test.com"`

---

### 5.4 — Get current user

**GET /api/auth/me**

Expected: the same user you registered — `email: "test@test.com"`, no `passwordHash`

---

### 5.5 — Try the seeded demo accounts (optional)

The seed script created 3 accounts you can also log in with:

```json
{ "email": "alice@demo.com", "password": "Password123!" }
{ "email": "bob@demo.com",   "password": "Password123!" }
{ "email": "admin@globetrotter.dev", "password": "Admin1234!" }
```

Login as Alice, authorize with her token, then call **GET /api/trips** — you'll see her 2 pre-built trips (Europe Classic + Dubai Long Weekend).

---

### 5.5 — Get all trips

**GET /api/trips**

Expected: Alice's 2 trips — `Europe Classic` (completed) and `Dubai Long Weekend` (ongoing)

Check the `status` field on each:
- Europe Classic → `"completed"`
- Dubai Long Weekend → `"ongoing"`

---

### 5.6 — Get full trip detail

**GET /api/trips/{id}**

Use the `id` from Europe Classic in the previous response.

Expected response includes:
```json
{
  "id": "trip-europe-classic",
  "name": "Europe Classic",
  "status": "completed",
  "totalEstimatedCost": 1941,
  "stops": [
    {
      "city": { "name": "Paris", "country": "France" },
      "stopActivities": [ ... ]
    },
    {
      "city": { "name": "Rome", "country": "Italy" },
      "stopActivities": [ ... ]
    }
  ]
}
```

---

### 5.7 — Create a new trip

**POST /api/trips**
```json
{
  "name": "Weekend in Amsterdam",
  "description": "Canals and museums",
  "startDate": "2026-10-01T00:00:00.000Z",
  "endDate": "2026-10-04T00:00:00.000Z"
}
```

Expected: Trip created with `status: "upcoming"`, `stopsCount: 0`

---

### 5.8 — Add a stop to the trip

**POST /api/trips/{id}/stops**

Use the new trip's `id`. Use `city-amsterdam` as cityId.
```json
{
  "cityId": "city-amsterdam",
  "arrivalDate": "2026-10-01T00:00:00.000Z",
  "departureDate": "2026-10-04T00:00:00.000Z"
}
```

Expected: Stop created with `orderIndex: 0`, city details populated

---

### 5.9 — Assign an activity to the stop

**POST /api/stops/{stopId}/activities**

Use the stop's `id` from the previous response.
```json
{
  "activityId": "act-eiffel",
  "scheduledDate": "2026-10-02T00:00:00.000Z",
  "scheduledTime": "10:00"
}
```

> Note: `act-eiffel` is a Paris activity assigned to an Amsterdam stop — that's fine for testing. In the real app, Person B filters activities by city.

Expected: StopActivity created with `activity` details populated

---

### 5.10 — Get budget breakdown

**GET /api/trips/{id}/budget**

Use the Europe Classic trip id.

Expected response shape:
```json
{
  "totalEstimatedCost": 1941,
  "totalActualCost": 1671,
  "averageCostPerDay": 138.64,
  "byCategory": [
    { "category": "TRANSPORT", "estimated": 380, "actual": 380 },
    { "category": "STAY", "estimated": 1350, "actual": 1350 },
    { "category": "ACTIVITIES", "estimated": 211, "actual": 271 },
    { "category": "MEALS", "estimated": 0, "actual": 0 },
    { "category": "OTHER", "estimated": 0, "actual": 0 }
  ],
  "byStop": [ ... ],
  "isOverBudget": false,
  "overBudgetDays": []
}
```

---

### 5.11 — Add a manual budget line

**POST /api/trips/{id}/budget/lines**
```json
{
  "category": "TRANSPORT",
  "label": "Train Amsterdam Centraal → Schiphol",
  "amount": 12.50
}
```

Expected: BudgetLine created. Call `GET /budget` again — `totalEstimatedCost` should increase by 12.50.

---

### 5.12 — Reorder stops

**POST /api/trips/{id}/stops/reorder**

First get a trip with 2+ stops (add another stop to your test trip). Then:
```json
{
  "stops": [
    { "id": "stop-id-1", "orderIndex": 1 },
    { "id": "stop-id-2", "orderIndex": 0 }
  ]
}
```

Expected: Both stops returned with swapped orderIndex values, updated atomically.

---

### 5.13 — Update user profile

**PATCH /api/users/me**
```json
{
  "city": "Amsterdam",
  "country": "Netherlands"
}
```

Expected: Updated user profile returned

---

### 5.14 — Refresh token

**POST /api/auth/refresh**

Use the `refreshToken` from your login response:
```json
{
  "refreshToken": "eyJ..."
}
```

Expected: New `accessToken`

---

### 5.15 — Logout

**POST /api/auth/logout**
```json
{
  "refreshToken": "eyJ..."
}
```

Expected: 200 OK

Now try **POST /api/auth/refresh** with the same token → should return 401 (token deleted from DB).

---

## Error Response Checks

These verify the global exception filter works (no stack traces):

| Test | Expected |
|---|---|
| POST /auth/register with existing email | `{ "statusCode": 409, "message": "Email already registered" }` |
| GET /trips/fake-id | `{ "statusCode": 404, "message": "Trip not found" }` |
| GET /trips (no token) | `{ "statusCode": 401, "message": "Unauthorized" }` |
| POST /trips with missing `name` | `{ "statusCode": 400, "message": [...validation errors] }` |

✅ None of these should contain `stack`, `trace`, or internal file paths.

---

## Prisma Studio (Visual DB Check)

```bash
cd apps/api
npx prisma studio
```

Opens at **http://localhost:5555**

Check:
- **City** — 12 rows
- **Activity** — 17 rows
- **User** — 3 rows (admin, alice, bob)
- **Trip** — 3 rows
- **Stop** — 5 rows (2 for Europe Classic, 2 for Asia, 1 for Dubai)
- **StopActivity** — 13+ rows
- **BudgetLine** — 6+ rows

---

## Quick Endpoint Reference

```
# Auth (no token needed)
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

# Auth (token required)
GET    /api/auth/me
POST   /api/auth/logout

# Users
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me

# Trips
GET    /api/trips
POST   /api/trips
GET    /api/trips/:id
PATCH  /api/trips/:id
DELETE /api/trips/:id
GET    /api/trips/:id/summary

# Stops
POST   /api/trips/:tripId/stops
POST   /api/trips/:tripId/stops/reorder
PATCH  /api/trips/:tripId/stops/:stopId
DELETE /api/trips/:tripId/stops/:stopId

# Activities
POST   /api/stops/:stopId/activities
PATCH  /api/stops/:stopId/activities/:stopActivityId
DELETE /api/stops/:stopId/activities/:stopActivityId

# Budget
GET    /api/trips/:tripId/budget
POST   /api/trips/:tripId/budget/lines
DELETE /api/trips/:tripId/budget/lines/:lineId
```

---

## Demo Accounts (after seed)

| Email | Password | Role |
|---|---|---|
| admin@globetrotter.dev | Admin1234! | ADMIN |
| alice@demo.com | Password123! | USER |
| bob@demo.com | Password123! | USER |

---

## All Tasks Complete ✅

| Task | Done |
|---|---|
| 1 — Supabase setup | Manual (need your URL) |
| 2 — Prisma schema + migration | ✅ Schema written, run `npx prisma migrate dev --name init` |
| 3 — Seed stub → full seed | ✅ |
| 4 — Common module | ✅ |
| 5 — Auth module | ✅ |
| 6 — Users module | ✅ |
| 7 — Trips module | ✅ |
| 8 — Stops module | ✅ |
| 9 — Activities module | ✅ |
| 10 — Budget module | ✅ |
| 11 — Full seed data | ✅ |
| 12 — Swagger polish | ✅ |
| 13 — Shared types package | ✅ |
| 14 — Testing guide | ✅ This file |
