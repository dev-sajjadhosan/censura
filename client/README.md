# Censura Client (Next.js)

## 📝 Project description

Censura is the frontend component of a full-stack media review and subscription platform. It provides user portal interfaces for browsing media, authentication, reviews, watchlists, payments, and admin management.

## 🌐 Live URLs

- Client hosted URL: `https://your-client-url.example.com` (replace with real URL)
- Backend API URL: `https://your-api-url.example.com` (replace with real URL)

## ✨ Features

- User auth: login/register/verify/forgot password
- Media search, filter, sort, and listings
- Watchlist, favorites, and history tracking
- Review and reaction system (comments/likes)
- Admin management pages for content and users
- Subscription dashboard and payment flows
- Responsive UI with dark theme support

## �🚀 Project overview

Censura is a full-stack media and review platform with:
- user authentication (login/register/verify/forgot password)
- profiles and personalization (watchlist, reaction, subscription, payment)
- media browsing (discover, pagination, filtering, search, genres, platforms, sorting)
- admin portal for managing content and users
- realtime updates and rich UI interactions via `react-query`

The client app is built in Next.js 16 (app router) with TypeScript and Tailwind CSS.

## 🧩 Tech stack

- Next.js 16.2.1
- React 19.2.4
- TypeScript 5+
- Tailwind CSS 4 + `@tailwindcss/postcss`
- `@tanstack/react-query`, `react-table`, `react-form`
- `better-auth` for auth session management
- `axios` for HTTP calls to backend API
- `zod` for data validation (share schemas with backend)
- `sonner` for toast notifications
- `lucide-react` icons, `radix-ui` primitives
- `monaco-editor` for rich text/code editor (if used)

## 🗂️ Directory structure

```
app/
  - (auth-pages)/ - login/register/verify/logout etc
  - (common-pages)/ - home/explore/profile/media/subscription/etc
  - (admin-pages)/ - admin dashboard and controls
  - globals.css, layout.tsx, loading.tsx, error.tsx
components/
  - Modules/ (domain components)
  - Shared UI primitives and table utilities
  - Providers (theme+visibility wrappers)
lib/ - API client, access helpers, icons, utils
hooks/ - mobile breakpoint and datatable hooks
providers/ - react-query provider and theme provider
services/ - data services for admin/media/user/payment/reaction/etc
types/, utils/, zod/ - shared type and validation definitions
```

## 🔌 Client→Server integration

The frontend talks to the backend API in `server/` via REST. Core API endpoints include:
- `/auth` (login/register/refresh/verify)
- `/media` (list, details, rating, genres, platform)
- `/user` (profile, watchlist, favourites)
- `/reaction`, `/review`, `/subscription`, `/payment`

## 🛠️ Setup and local development

1. Clone repo and install dependencies:

```bash
cd client
npm install
```

2. Copy `.env.example` or `.env` with values (if exists).

3. Start dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## 🧪 Available scripts

- `npm run dev` - start dev server
- `npm run build` - build for production
- `npm run start` - run production server
- `npm run lint` - lint project

## 🛡️ Best practices implemented

- server state via `@tanstack/react-query`
- unambiguous data structures with TypeScript and Zod
- modular components and feature directories
- UI consistency through shared design system (shadcn/radix)
- client-side route guards and page-level auth

## 🕹️ Notes for contributors

- follow existing conventions in `components/Modules/*`
- add new UI behavior inside `hooks/` or `services/` helpers
- keep API requests in `services/*` and avoid mixing with UI components
- preserve accessibility in all form elements and modals

---

> Project created with Node.js + Next.js. Maintained by a full-stack team and ready for deployment on Vercel (client) + a Node server backend.
