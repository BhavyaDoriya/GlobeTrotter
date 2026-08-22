# 🌍 GlobeTrotter — The Interactive Travel Scrapbook & Itinerary Planner

> *"Travel isn't about rigid itineraries; it's about the stories, memories, and scrapbooks we craft along the way."*

Welcome to **GlobeTrotter**, a modern web application that transforms travel planning from boring spreadsheets into an interactive, visual scrapbook experience. Built with **Next.js 15, React 19, Tailwind CSS, Zustand, @dnd-kit, and ElevenLabs AI Voice Synthesis**, GlobeTrotter combines artistic scrapbook aesthetics with seamless drag-and-drop itinerary building and intelligent budget validation.

---

## 🎨 Design Philosophy & Visual Aesthetic

GlobeTrotter is designed around a **Scrapbook Aesthetic** — moving away from sterile corporate UI into a warm, tactile design system:
* **Typography**: Elegant `Playfair Display` serif headers paired with clean `Inter` body text.
* **Curated Color Palette**: Soft sage backdrop (`#E5F0EF`), deep teal headers (`#4A7C77`), warm coral highlights (`#E77A64`), and golden yellow badges (`#F6D267`).
* **Tactile Craft Details**: Polaroid photo cards with messy tape accents, subtle topography flight-path background artwork, and floating vector line icons (`Compass`, `Camera`, `Navigation`).

---

## 🤝 Collaborative Teamwork & Architecture

GlobeTrotter was forged through close collaboration between four developers during an intensive 24-hour hackathon. Each engineer owned a core module to craft a cohesive end-to-end travel platform:

### 🛠️ Bhavya Doriya — Frontend Core Architect
* **Dashboard & Travel Log**: Built the main landing page (`/`) and My Travel Log dashboard (`/trips`), featuring interactive travel cards and floating call-to-action buttons.
* **Draft Your Adventure Notepad**: Designed the creative `/trips/new` notepad form with 3D binder clips, compass stickers, and staggered Polaroid inspiration corkboards.
* **Design System Tokens**: Established core CSS scrapbook variables, color tokens, typography, and card classes used across all views.

### ⚙️ Shubhra-jyoti — Frontend Systems & AI Specialist
* **Live Drag-and-Drop Builder**: Engineered the multi-column itinerary board using `@dnd-kit`, enabling smooth cross-column dragging of activity cards between dates.
* **Chronological Time Persistence**: Implemented Zustand state mutations that recalculate start times dynamically so user drag order stays preserved across **Builder**, **Viewer**, and **Calendar** screens.
* **Multi-Row Long-Trip Layout**: Resolved off-screen scrolling for long multi-week trips by building an adaptive multi-row grid (`flex-wrap`) with quick **Week Filter Tabs** (`W1`, `W2`, `W3`).
* **Time-Collision Protection**: Built custom in-drawer validation preventing users from accidentally scheduling two events at the exact same start time.
* **Morgott AI Voice Integration**: Built the ElevenLabs text-to-speech API proxy and Easter Egg modal (*"Put these foolish ambitions to rest!"*) with instant zero-delay Web Speech API fallback.

### 🔌 Manthan Shah — Backend Core Lead
* **NestJS Microservices Architecture**: Engineered the modular NestJS backend architecture using controllers, services, repositories, and role guards.
* **PostgreSQL & Prisma ORM**: Designed the core relational schema (`User`, `Trip`, `Stop`, `City`, `Activity`, `StopActivity`, `BudgetLine`) with migration history.
* **CRUD & Budget API Services**: Implemented backend business logic for trips, stops, activity scheduling, and cost breakdown calculations.

### 🚀 Krish Patel — Systems & AI Infrastructure Lead
* **Vector Search & Semantic Recs**: Integrated `pgvector` semantic similarity search inside PostgreSQL for city and activity recommendations.
* **Redis, BullMQ & Socket.io**: Configured Redis caching for popular destinations, BullMQ async queues for budget recalculations, and Socket.io gateway for live community feeds.
* **Docker & Deployment Pipeline**: Set up Docker Compose local environment parity (`web`, `api`, `postgres`, `redis`) and automated CI/CD deployment pipelines on Vercel and Railway.

---

## ✨ Key Features

### 1. 📔 Interactive Scrapbook Dashboard
View all upcoming and past journeys in a scrapbook grid with trip dates, activity badges, and destination previews.

### 2. 🗓️ Drag-and-Drop Itinerary Builder (`/build`)
* Drag activity cards across different date columns with smooth CSS transitions.
* Add custom activities (Transport, Stay, Sightseeing, Food, Shopping, Show) via slide-out drawers.
* Edit activity details, start times, durations, and costs inline with instant updates.

### 3. 🗂️ Multi-Row Grid & Week Filtering
* 30-day trips automatically wrap across rows, allowing natural vertical scrolling down the page.
* Filter long trips by week tabs (`All Days`, `Week 1`, `Week 2`, `Week 3`) for effortless navigation.

### 4. ⏱️ Real-Time Time-Collision Protection
* Prevents scheduling two activities at the exact same time on a single day.
* Highlights conflicts with a red warning banner and disables submit buttons until resolved.

### 5. 💰 Real-Time Budget Intelligence & Morgott Voice Easter Egg
* Recharts pie chart breakdown analyzing spending across Transport, Stay, Activities, and Meals.
* City Cost Index Engine comparing daily budget against real-world thresholds (Paris, Tokyo, New York, Rome, Zurich).
* **Morgott Audio Folly Warning**: If a user sets an unrealistically low budget (e.g., $20/day in Paris), an Elden Ring-inspired warning modal triggers accompanied by an ElevenLabs AI audio voice line:  
  > *"PUT THESE FOOLISH AMBITIONS TO REST! Return when you have gathered more gold, lest you perish in the streets of your folly."*

### 6. 💾 Client Storage Persistence
* Powered by Zustand `persist` middleware, all created trips, drag order reassignments, and activity updates are automatically saved to `localStorage` and persist across browser reloads.

---

## 🚀 Local Installation & Setup

Follow these steps to run GlobeTrotter locally on your machine:

### 1. Prerequisites
* **Node.js**: `v18.0.0` or higher
* **Package Manager**: `npm` or `pnpm`

### 2. Clone the Repository
```bash
git clone https://github.com/YourOrganization/GlobeTrotter.git
cd GlobeTrotter
```

### 3. Install Dependencies
```bash
# Install root and workspace dependencies
npm install
```

### 4. Environment Variables Setup
Create a `.env.local` file inside `apps/web/`:

```bash
# Location: apps/web/.env.local

# Optional: ElevenLabs AI Voice Key (Server Proxy)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_MORGOTT_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

*(Note: If no ElevenLabs API key is provided, the application automatically uses the built-in browser Web Speech API as an instant fallback!)*

### 5. Launch the Development Server
```bash
# Run Next.js development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to start exploring!

---

## 📖 How to Use GlobeTrotter

### Step 1: Draft Your Journey
1. On the home page, click the floating **"+ Plan a Trip"** button.
2. Fill out the **Notepad Form**: Journey Name, Destination, Takeoff/Return Dates, and Target Budget.
3. Click **Build Itinerary ✨** to generate your live trip board.

### Step 2: Customize Your Activities
1. Click **"+ Add Activity"** on any date column to choose from preset templates or enter custom details.
2. Drag activities between date columns to reschedule them. Start times automatically adjust sequentially!
3. Click the **Pencil ✏️** icon on any card to edit times, costs, or categories.

### Step 3: View Timeline & Budget Analytics
1. Switch to the **Viewer** tab to see your daily schedule in a sequential timeline.
2. Review your spending breakdown chart. If your daily budget falls below the city's minimum threshold, prepare for Morgott's audio warning!
3. Switch to the **Calendar** tab for a month-at-a-glance overview.

---

## 🌐 Production Deployment

GlobeTrotter is optimized for zero-config deployment on **Vercel**:

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com).
3. Set the Root Directory to `apps/web`.
4. Add environment variables (`ELEVENLABS_API_KEY`) in the Vercel project settings.
5. Click **Deploy**!

---

## 👥 The Development Team

GlobeTrotter was engineered with passion by a dedicated team of builders:

| Member | Role | What They Built | GitHub |
| :--- | :--- | :--- | :--- |
| **Bhavya Doriya** | Lead Frontend Architect | Designed the scrapbook visual design system, travel log dashboard, and creative trip notebook forms. | [@BhavyaDoriya](https://github.com/BhavyaDoriya) |
| **Shubhra-jyoti** | Frontend Systems & AI Engineer | Engineered the live drag-and-drop itinerary builder, time-collision validation, and ElevenLabs AI voice warnings. | [@Shubhra-jyoti](https://github.com/Shubhra-jyoti) |
| **Manthan Shah** | Backend Core Lead | Architected the NestJS microservices backend, PostgreSQL database schema, and trip CRUD API endpoints. | [@Manthanshah1406](https://github.com/Manthanshah1406) |
| **Krish Patel** | Systems & AI Infra Lead | Built the `pgvector` semantic city search engine, Redis BullMQ queues, live Socket.io feed, and deployment pipelines. | [@KrishPatel](https://github.com/KrishPatel) |

---

<p center>
Crafted with ❤️ and ☕ for travel lovers worldwide.
</p>
