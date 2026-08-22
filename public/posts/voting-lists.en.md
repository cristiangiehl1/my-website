## 📋 About the Project

Voting Lists is a full-featured system for creating and managing voting lists. Each user can create personalized lists, invite participants, register candidates (people, objects, movies, etc.), and track results in real time. Lists can have an expiration date or remain open indefinitely.

🎯 **Architecture and Approach**

The project was built with Next.js 16 (App Router), following a modern architecture with server components by default and TanStack Query for client-side state management. Authentication is handled via NextAuth.js with a JWT strategy, and the PostgreSQL database is accessed through Prisma ORM with support for both Neon and traditional PostgreSQL. The system has three route groups: a public landing page, authentication (login/register), and a protected area (dashboard, lists, voting).

🔧 **Key Differentiators**

- **Public and Private Lists:** Control over visibility and participation
- **Ranked Voting:** Support for multiple votes per list
- **Image Upload:** Cloudinary integration for candidate photo uploads
- **Real-Time Notifications:** Alerts about new votes and participants
- **Light/Dark Themes:** next-themes support

## ✨ Features

- 📝 **List Creation**: Create lists with a name, description, and optional expiration date
- 👥 **Email Invites**: Invite participants directly by email
- 🏆 **Candidate Registration**: Add people, objects, movies, or any item for voting
- ✅ **Restricted Voting**: Only invited participants can vote on private lists
- 📊 **Real-Time Results**: Rankings with percentages and statistics
- 🔗 **Public Lists**: Anyone can vote without needing an invitation
- 🌓 **Light/Dark Mode**: Adaptive interface with next-themes

## 🚀 Technologies Used

### Framework

- **Next.js 16** - React framework with App Router
- **TypeScript** - Static typing
- **React 19** - UI library

### Database

- **PostgreSQL** - Relational database
- **Prisma** - ORM with Neon and PostgreSQL support

### Authentication

- **NextAuth.js** - Authentication with credentials provider and JWT
- **bcryptjs** - Password hashing

### Frontend

- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - UI components (base-nova)
- **TanStack Query** - Client-side state management and caching
- **GSAP** - Scroll and entrance animations
- **Zod** - Schema validation (client and server)

### Infrastructure

- **Docker** - PostgreSQL database in a container
- **Cloudinary** - Image upload and management

## 📦 Project Structure

```
src/
├── app/
│   ├── (home)/          # Public landing page
│   ├── (auth)/          # Login, register, recovery
│   ├── (protected)/     # Dashboard and authenticated pages
│   ├── api/             # Route Handlers
│   └── globals.css      # Global Tailwind v4 styles
├── components/          # Shared components
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── queries/         # TanStack Query hooks (reads)
│   └── mutations/       # TanStack Query hooks (writes)
├── lib/
│   ├── repositories/    # Repository layer (Prisma)
│   ├── schemas/         # Domain-scoped Zod schemas
│   ├── auth.ts          # NextAuth configuration
│   ├── api-client.ts    # HTTP client for internal calls
│   └── query-keys.ts    # Centralized TanStack Query keys
├── emails/              # Email templates (React Email)
├── data/                # Static data
└── generated/
    └── prisma/          # Generated Prisma Client
```

## 🛠️ Installation and Setup

### Prerequisites

- Node.js (version 20 or higher)
- Docker (for local database)
- npm

### Step by Step

1. **Clone the repository**

```bash
git clone https://github.com/cristiangiehl1/voting-system.git
cd voting-system
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

3. **Start the database**

```bash
docker compose up -d
```

4. **Install dependencies and run migrations**

```bash
npm install
npm run db:migrate
npm run db:seed
```

5. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Test Data

The seed creates a demo user:

- **Email:** `demo@votinglists.app`
- **Password:** `demo123`

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. The schema includes models for users, lists, participants, candidates, votes, and notifications, with composite uniqueness constraints to ensure data integrity.

### Useful Commands

```bash
# Run migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## 🌐 Deploy

The project is configured for deployment on Vercel with PostgreSQL via Neon. The `npm run vercel-build` command runs `prisma db push` followed by `prisma generate` and `next build`.

### Manual Deploy

1. Configure environment variables on Vercel
2. Deploy

```bash
npx vercel --prod
```
