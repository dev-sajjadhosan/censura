# Censura Backend Server

## 📝 Project description

Backend API for the Censura media review and subscription platform. Handles auth, media data, reviews, subscriptions, payments (Stripe), and notification workflows.

## 🌐 Live URLs

- API Base URL: `https://your-api-url.example.com` (replace with real URL)
- Docs (if available): `https://your-api-url.example.com/docs`

## ✨ Features

- User auth via Better-Auth API (register/login/logout/verify)
- Role-based admin/user permissions
- Media catalog endpoints (search/filter/pagination)
- Genre and platform taxonomy
- Reviews and reactions CRUD
- Watchlist management
- Stripe subscription lifecycle (webhooks, renewals, cancellations)
- Scheduled cron tasks for token cleanup and subscription expiry
- Email templates via Nodemailer + EJS

## 🧩 Tech stack

- Node.js 20+
- TypeScript 5+
- Express 5
- Prisma ORM + PostgreSQL
- Stripe for payments / webhooks
- Better-Auth session management
- Zod input validation
- Nodemailer + EJS for transactional emails
- node-cron for scheduled tasks

## 🗂️ Repo layout

```
prisma/
  schema/
  migrations/

src/
  app/
    config/
    error-helpers/
    interfaces/
    lib/
    middleware/
    modules/
      Auth/
      User/
      Media/
      Genre/
      Subscription/
      Payment/
      Reaction/
      Reviews/
      Watchlist/
    routes/
    shared/
    templates/
    utils/
  app.ts
  server.ts

prisma.config.ts
.env
package.json
```

## ⚙️ Installation

```bash
cd server
npm install
```

Create `.env` with values for:
- `DATABASE_URL`
- `PORT` (default 5000)
- `BETTER_AUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- SMTP vars for email (e.g., `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`)

Then run:

```bash
npm run generate
npm run push
npm run dev
```

## 📦 Available scripts

- `npm run dev` — start with tsx watch
- `npm run build` — compile with tsup + Prisma generate
- `npm run start` — run built production server
- `npm run migrate` — prisma migrate dev
- `npm run reset` — prisma migrate reset (dev only)
- `npm run studio` — open Prisma Studio
- `npm run stripe:webhook` — run Stripe test webhook listener

## 🔌 API endpoints (main)

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/verify`
- `GET/PUT /user/profile`, `/user/watchlist` etc
- `GET /media`, `GET /media/:id`, `POST /media` (admin)
- `GET /genre`, `GET /platform`
- `POST /review`, `GET /review/:mediaId`
- `POST /reaction`, `GET /reaction/:mediaId`
- `POST /subscription`, `GET /subscription/status`
- `POST /webhook` (Stripe event handling)

## ✅ Quality and safety

- Request schema validation at middleware layer (Zod)
- Centralized error handler (`globalErrorHandler`)
- Auth guard middleware for protected and admin routes
- Clear response wrapper (sendRes)
- Cron jobs for subscription expiration and reminder emails

## 🛠️ Notes for contributors

- New domain features go into `src/app/modules/<Domain>/`
- Keep business logic in services, controllers handle http + parse
- Reuse shared functions in `src/app/shared` and `src/app/utils`
- Sync frontend `client/services` endpoint changes with backend route updates

---

> Backend README prepared for onboarding and deployment. 

