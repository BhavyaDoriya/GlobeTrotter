# GlobeTrotter — 24hr Team Workflow (4 People)

Companion to `globetrotter-tech-stack.md`. This is the actual task breakdown, ownership,
handoff points, and git workflow — pin this somewhere everyone can see it.

---

## Roles at a Glance

| | Owns | Primary tech |
|---|---|---|
| **Person A** | Frontend — core flows (auth, dashboard, trip CRUD, profile) | Next.js, Tailwind, shadcn/ui, TanStack Query |
| **Person B** | Frontend — data-heavy screens (itinerary builder/view, budget, calendar, maps) | Next.js, Recharts, react-big-calendar, Mapbox GL |
| **Person C** | Backend — core domain (auth, trips, stops, activities, budget logic) | NestJS, Prisma, Postgres |
| **Person D** | Backend/infra — search, real-time, admin, DevOps | NestJS, pgvector, Redis, Socket.io, Docker, CI/CD, deploy |

Pair up naturally: **A↔C** are frontend/backend counterparts for the "core" flows, **B↔D** for the "advanced" flows. When you're blocked on the other side, that's who you sync with directly instead of waiting for a stand-up.

---

## Git Workflow

- Trunk-based: `main` stays deployable at all times.
- Branch per module: `feat/auth`, `feat/itinerary-builder`, `feat/search`, etc.
- Merge to `main` at least every 2 hours, even if incomplete — small PRs, fast reviews (one other person, 2-minute skim, not a full review).
- Whoever finishes a merge posts a one-line "what's now live" message to the team channel. This is your only process overhead — don't add more.
- `prisma/schema.prisma` is the one file everyone touches — **Person C owns merges to it**. If you need a field added, ping them rather than editing and creating a conflict.

---

## Hour-by-Hour

### Hours 0–2 — All Hands: Foundations
Everyone in the same room/call for this part, no exceptions.

- [ ] Repo scaffolded (Turborepo, `apps/web`, `apps/api`, `packages/shared-types`)
- [ ] `docker-compose.yml` up: Postgres + Redis running locally for everyone
- [ ] Prisma schema v1 committed (Person C drafts, everyone reviews live — this is the highest-cost mistake to fix later)
- [ ] `npx prisma migrate dev` run, seed script stubbed (even empty) so `apps/api` boots against a real DB
- [ ] Auth skeleton: register/login endpoints (C) + login/register pages (A) — get JWT-in-localStorage → protected route working end to end before splitting up. This is your integration lifeline for the rest of the day.
- [ ] Mapbox account created, API key in `.env.example`, confirmed it loads on a blank map component (B) — do this now, not at hour 18, because API key/billing setup is the classic silent time-sink

**Don't split up until the login→dashboard round trip works for real, through the real API.**

---

### Hours 2–14 — Parallel Build

#### Person A — Frontend Core
- Dashboard / Main Landing (Screen 3): recent trips, top regional cities, "Plan a Trip" CTA
- Create Trip form (Screen 4): name, dates, place autocomplete (uses B's Mapbox geocoding component once ready — stub with plain text input until then)
- My Trips listing (Screen 6): ongoing/upcoming/completed, using computed status from `Trip.startDate/endDate`
- User Profile (Screen 7): edit fields, preplanned/previous trip cards (reuses trip card component — build it here once, B reuses it)
- **Hands off to B:** shared `TripCard` component by ~hour 6

#### Person B — Frontend Data-Heavy
- Itinerary Builder (Screen 5): sections with date range + budget per section, "Add another Section"
- Itinerary View + Budget breakdown (Screen 9): day-by-day layout, Recharts pie/bar for cost breakdown
- Calendar view (Screen 11): month grid, trips rendered on their date ranges
- Mapbox integration: geocoding autocomplete (hand off to A early), route line on itinerary view, pins on city search results
- **Needs from C by ~hour 5:** `GET /trips/:id/stops` shape finalized, so the builder isn't guessing at response format

#### Person C — Backend Core
- Auth module: register, login, JWT + refresh token, guards, password hashing
- Trips module: CRUD, status computation (ongoing/upcoming/completed based on dates)
- Stops module: add/reorder/remove city stops within a trip
- Activities module: assign activities to a stop, scheduling
- Budget module: aggregate `BudgetLine` by category, per-trip and per-stop totals
- **Publishes early, changes rarely after:** OpenAPI/Swagger spec — this is what A and B build against, so lock response shapes as early as possible even if the implementation behind them is still rough

#### Person D — Backend/Infra + Advanced
- City/Activity search: Postgres full-text (`tsvector`) first — get this working before touching pgvector
- pgvector embeddings: batch script to embed seeded cities/activities, similarity search endpoint (this is a stretch goal — timebox it, see cut list)
- Community tab (Screen 10): Socket.io gateway, shared/public trip feed
- Admin dashboard (Screen 12): aggregation queries (top cities, top activities, user counts), role-guarded routes
- Sharing: public share-slug generation, unauthenticated `share/[slug]` endpoint
- Docker Compose finalized, GitHub Actions (lint + typecheck on PR), Railway/Fly.io project created and a "hello world" deploy verified **early** — don't discover deploy problems at hour 20

---

### Hours 14–18 — Integration (pair up: A+C, B+D)

- A+C: wire Dashboard/Trips/Profile to real endpoints, kill all mock data, fix response-shape mismatches
- B+D: wire itinerary builder/view/calendar to real endpoints; D seeds pgvector embeddings once the activity table has real rows from earlier seeding
- Whole team: run through the full user journey once — register → create trip → add stops/activities → view budget → see it on calendar → share it publicly. Note every rough edge, triage as fix-now vs. cut.

---

### Hours 18–21 — Polish & Demo-Proofing

- Loading/empty/error states on every screen (this is cheap and judges notice its absence immediately)
- Seed 3–4 fully-built demo trips with real-looking data — **never** type a trip live during the pitch
- Deploy final build, test the live URL from a phone on a different network
- A+B: visual pass — consistent spacing, one font scale, one color system
- C+D: check API error responses aren't leaking stack traces, basic rate limiting on public endpoints

---

### Hours 21–24 — Buffer + Pitch

- Fix whatever the deploy step broke (budget 45–60 min for this, it's rarely zero)
- Draft the architecture diagram slide (D leads, since they own the infra story)
- Assign pitch roles: who drives the demo, who narrates architecture, who fields Q&A on the data model
- One full dry run, timed

---

## Sync Points (don't skip these)

| Hour | What to check |
|---|---|
| 2 | Auth round trip works end-to-end through the real API |
| 5 | API response shapes for trips/stops locked (Swagger published) |
| 6 | Shared `TripCard` component exists, reusable |
| 8 | First deploy attempt done (even if broken) — surfaces infra problems early |
| 14 | Full integration pass starts — no more solo module work after this |
| 18 | Full user journey walked end-to-end by the whole team |
| 21 | Feature freeze — polish and bug-fix only from here |

---

## If Someone Finishes Early

Priority order for extra hands, regardless of role:
1. pgvector recommendations (if not done)
2. Socket.io live community feed (if not done)
3. Map route visualization on itinerary view
4. Test coverage on the budget calculation logic (it's the easiest thing to get subtly wrong, and judges may poke at the numbers)
5. Admin dashboard charts polish
