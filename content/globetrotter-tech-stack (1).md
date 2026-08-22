[text](globetrotter-tech-stack.md)# GlobeTrotter — 24hr Hackathon Architecture & Tech Stack

**Goal:** Maximize "technical depth" judging score without blowing your 24-hour budget.
Everything below is production-grade tech, chosen because it's *fast to wire up* AND
*defensible in a judge Q&A* — no infra you can't finish configuring.

---

## 1. The Stack

| Layer | Choice | Why this over the "obvious" pick |
|---|---|---|
| Monorepo | **Turborepo + pnpm workspaces** | Shared TypeScript types between FE/BE = one source of truth, no drift, fast incremental builds |
| Frontend | **Next.js 15 (App Router) + TypeScript** | SSR for the shared/public itinerary pages (SEO-able, fast), RSC for data-heavy screens |
| UI | **Tailwind CSS + shadcn/ui** | Judge-visible polish without hand-rolling components |
| Charts/Calendar | **Recharts** (budget breakdown) + **FullCalendar** or **react-big-calendar** (Screen 11) | Both drop-in, both look legit in a demo |
| State/data | **TanStack Query** (server cache) + **Zustand** (light client state) | Avoids Redux boilerplate you don't have time for |
| Backend | **NestJS + TypeScript** | Modular architecture (controllers/services/repositories, DI, guards) — this is the single biggest "architecture depth" signal you can show in 24h |
| API style | **REST + auto-generated OpenAPI/Swagger** | GraphQL is a nice-to-have flex *only* if your backend dev is already fluent — don't learn it tonight |
| Database | **PostgreSQL + Prisma ORM** | Prisma migrations = visible schema history for judges; Postgres handles everything below natively |
| Search | **Postgres full-text search (`tsvector`) + `pg_trgm`** for city/activity search | Zero extra infra vs. standing up Elasticsearch |
| Semantic search / recs | **`pgvector` extension** for city/activity embeddings | This is your "technical depth" flex — vector search *inside* Postgres, no separate vector DB service, still sounds advanced in a demo |
| Cache | **Redis** | Popular-cities cache, rate limiting, session store |
| Maps | **Mapbox GL JS** via `react-map-gl`, + **Mapbox Geocoding API** for city autocomplete | Vector maps (smooth pan/zoom, looks premium in a demo), free tier is generous, and the same Geocoding API gives you city autocomplete + lat/lng for free — kills two birds: no custom city list to build, and `City.lat/lng` gets populated automatically |
| Real-time | **Socket.io** | Live updates on the Community tab / collaborative itinerary editing |
| Background jobs | **BullMQ (Redis-backed)** | Async budget recalculation, "trip shared" notifications — shows you understand sync vs async workloads |
| Auth | **Passport.js (JWT + refresh tokens)** inside NestJS, role guard for `user` vs `admin` | Powers Screen 12 (admin dashboard) access control cleanly |
| Validation | **Zod**, shared between FE forms and BE DTOs | One schema, two consumers — another "we thought about this" signal |
| Containerization | **Docker Compose** (postgres, redis, api, web) | Local dev parity + you can show a `docker-compose up` one-liner in the demo |
| Deploy | **Vercel** (frontend) + **Railway or Fly.io** (API + Postgres + Redis) | Fastest path to a live URL, which matters more than you'd think for judging |
| CI | **GitHub Actions**: lint + typecheck + `prisma migrate deploy` on push | Even a 2-job pipeline reads as "engineering maturity" |

---

## 2. Where Maps Actually Show Up

Your mockups don't draw a dedicated map screen, but three places clearly need one — worth calling out explicitly so nobody builds a text-only version by accident:

1. **"Select a Place" field on Create Trip (Screen 4):** Mapbox Geocoding autocomplete instead of a plain text input — type "Par" → get "Paris, France" with lat/lng attached. This is the single highest-leverage map integration: it's low effort and it's the first thing judges type into.
2. **City Search results (Screen 8):** small embedded map with pins for the returned cities, synced with the list — classic "this feels like a real product" touch.
3. **Itinerary View (Screen 9) / Calendar (Screen 11):** a route line connecting the trip's stops in order, using each `Stop`'s city coordinates — this is what actually sells "multi-city trip visualization" in 10 seconds of demo time.

**Fallback if Mapbox API key setup eats time:** `react-leaflet` + OpenStreetMap tiles, zero API key required, slightly less polished but never blocks on network/auth issues mid-demo. Decide which one at hour 0, not hour 20.

---

## 3. Monorepo Structure

```
globetrotter/
├── apps/
│   ├── web/                      # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/login/
│   │   │   ├── (auth)/register/
│   │   │   ├── (dashboard)/trips/
│   │   │   ├── (dashboard)/trips/[id]/build/      # itinerary builder
│   │   │   ├── (dashboard)/trips/[id]/view/        # itinerary view + budget
│   │   │   ├── (dashboard)/trips/[id]/calendar/
│   │   │   ├── (dashboard)/search/cities/
│   │   │   ├── (dashboard)/search/activities/
│   │   │   ├── (dashboard)/community/
│   │   │   ├── (dashboard)/profile/
│   │   │   ├── admin/                              # role-gated
│   │   │   └── share/[slug]/                       # public, no auth
│   │   ├── components/
│   │   ├── lib/                  # api client, query hooks
│   │   └── styles/
│   │
│   └── api/                      # NestJS backend
│       ├── src/
│       │   ├── auth/             # login, register, guards, strategies
│       │   ├── users/
│       │   ├── trips/
│       │   ├── stops/
│       │   ├── activities/
│       │   ├── cities/           # search + pgvector recs
│       │   ├── budget/           # cost breakdown logic
│       │   ├── sharing/          # public share links
│       │   ├── admin/            # analytics endpoints
│       │   ├── notifications/    # BullMQ processors
│       │   ├── common/           # guards, interceptors, filters
│       │   └── main.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
│
├── packages/
│   ├── shared-types/              # Zod schemas + inferred TS types, used by both apps
│   ├── ui/                        # shared shadcn component wrappers (optional)
│   └── config/                    # eslint/tsconfig base configs
│
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 4. Core Data Model (Postgres, via Prisma)

This is what actually earns "well-designed relational database" points — get this right first, everything else builds on it.

```
User (id, email, passwordHash, firstName, lastName, city, country, role[user|admin], createdAt)

Trip (id, userId→User, name, description, startDate, endDate, coverPhotoUrl, isPublic, shareSlug, createdAt)

Stop (id, tripId→Trip, cityId→City, orderIndex, arrivalDate, departureDate)
   -- one row per city in a multi-city trip, ordered

City (id, name, country, region, lat, lng, costIndex, popularityScore, embedding vector(1536))

Activity (id, cityId→City, name, category, description, costEstimate, durationMinutes, imageUrl, embedding vector(1536))

StopActivity (id, stopId→Stop, activityId→Activity, scheduledDate, scheduledTime, actualCost)
   -- join table: which activities are scheduled at which stop

BudgetLine (id, tripId→Trip, category[transport|stay|activities|meals], amount, stopId?→Stop)

SharedTripView (id, tripId→Trip, viewerFingerprint, viewedAt)  -- optional, for share analytics
```

Indexes worth adding (mention these explicitly in your demo — judges notice):
- `tsvector` GIN index on `City.name` + `Activity.name/description` for search
- `pg_trgm` index for fuzzy/typo-tolerant search
- `ivfflat` index on the `embedding` columns for fast pgvector similarity search
- Composite index on `(tripId, orderIndex)` for stop ordering

---

## 5. Mapping Screens → Modules

| Screen (from your mockup) | Frontend route | Backend module |
|---|---|---|
| 1–2 Login/Register | `(auth)/*` | `auth`, `users` |
| 3 Main Landing | `(dashboard)/page.tsx` | `trips` (recent), `cities` (top regional) |
| 4 Create Trip | `(dashboard)/trips/new` | `trips` |
| 5 Build Itinerary (sections) | `trips/[id]/build` | `stops`, `stopActivity` |
| 6 Trip Listing (ongoing/upcoming/completed) | `(dashboard)/trips` | `trips` (computed status) |
| 7 User Profile | `(dashboard)/profile` | `users` |
| 8 Activity/City Search | `search/cities`, `search/activities` | `cities`, `activities` (full-text + pgvector) |
| 9 Itinerary + Budget | `trips/[id]/view` | `stops`, `budget` |
| 10 Community tab | `(dashboard)/community` | `sharing` + Socket.io gateway |
| 11 Calendar view | `trips/[id]/calendar` | `stops` (date-grouped) |
| 12 Admin dashboard | `admin/*` | `admin` (role-guarded aggregation queries) |
| Shared public view | `share/[slug]` | `sharing` (public, unauthenticated) |

---

## 6. 24-Hour Timeline

**Hours 0–2 — Foundations (whole team together)**
- Repo scaffold (Turborepo, both apps boot)
- Prisma schema finalized + first migration + seed script (fake cities/activities so search/UI never looks empty)
- Docker Compose up, Postgres + Redis running
- Auth working end-to-end (register → login → JWT stored → protected route)

**Hours 2–14 — Parallel build (split by module ownership)**
- **Dev A (FE core):** Dashboard, Create Trip, Trip Listing, Profile
- **Dev B (FE data-heavy):** Itinerary builder, itinerary view + budget charts, calendar
- **Dev C (BE core):** trips/stops/activities CRUD, budget calculation logic
- **Dev D (BE infra):** city/activity search (full-text first, pgvector once seeded), Socket.io community feed, admin aggregation endpoints, deploy pipeline

**Hours 14–18 — Integration**
- Wire FE to real API everywhere (kill mock data)
- Sharing/public view + share-slug generation
- Seed pgvector embeddings for cities/activities (batch script, run once)

**Hours 18–21 — Polish & demo-proofing**
- Empty states, loading states, error boundaries
- Seed realistic demo data (3–4 pre-built trips so you're not typing live)
- Deploy to Vercel + Railway, verify the live URL works on someone else's wifi

**Hours 21–24 — Buffer + pitch prep**
- Fix whatever breaks on deploy (something always does)
- Prepare the architecture diagram slide + 60-second "why these choices" talking points
- Rehearse the demo path once, end to end

---

## 7. Talking Points for Judges (technical depth angle)

- "Types flow from a single Zod schema through the API DTOs into the frontend forms — no drift between what the backend validates and what the frontend sends."
- "Search is full-text + trigram for typo tolerance, and city/activity recommendations use pgvector embeddings — semantic search without a separate vector database."
- "Budget recalculation runs async via a Redis-backed queue, so editing an itinerary never blocks on a heavy aggregation."
- "Role-based guards separate the admin analytics module from user-facing routes at the framework level, not just the UI."
- "Everything runs from one `docker-compose up` for local dev parity with what's deployed."

---

## 8. Cuts if you're behind schedule (in priority order to drop)

1. Socket.io real-time (fall back to polling/refresh)
2. pgvector recommendations (fall back to full-text search only)
3. BullMQ background jobs (do budget calc synchronously)
4. Admin dashboard charts (ship as a simple table)
5. Public share page styling (functional > pretty)

Never cut: auth, the core Trip→Stop→Activity data model, and the itinerary builder — that's the heart of the pitch.
