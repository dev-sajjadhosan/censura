# Censura Backend Server

<div align="center">
  <h3>A scalable, production-ready NodeJS REST API built for Media Review & Streaming platforms.</h3>
</div>

<br />

## 📖 Overview

Censura is a high-performance backend server designed to handle complex media platform operations. Built with modern, type-safe technologies, it features a highly modular architecture that enables seamless scaling. The API powers everything from robust user authentication and media cataloging to community reactions (reviews/comments), personalized watchlists, and premium tier subscriptions.

## 🚀 Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) v20+
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (with `@prisma/adapter-pg`)
- **Authentication:** [Better-Auth](https://better-auth.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Payments & Subscriptions:** [Stripe](https://stripe.com/)
- **Mailing:** Nodemailer (with EJS templates)
- **Task Scheduling:** Node-cron

## ✨ Key Features

- **Modular Architecture:** Business logic is strictly separated into independent domains (Auth, User, Media, Genre, Reviews, Reaction, Watchlist, Subscription, Payment).
- **Advanced Query Builder:** A custom Prisma query builder class that dynamically handles searching, filtering, pagination, sorting, and field selection across complex database relations (including featured content filtering).
- **Type-Safe Validation:** Full Request validation (Body, Query, Params) using Zod schemas to ensure data integrity before it reaches the controllers.
- **Secure Authentication:** Cookie-based session management, OAuth support, and role-based access control (Admin vs User).
- **Payment Processing:** Integrated Stripe webhooks for secure, real-time subscription lifecycle management and payment tracking.
- **Automated Tasks:** Built-in cron jobs for handling subscription expirations and lifecycle emails.
- **Centralized Error Handling:** Global error catching middleware ensuring consistent API error formatting (`AppError`).
- **Interactive Mailing:** Responsive email templates with refined UI and interactive elements built with EJS.

## 📁 Project Structure

```text
prisma/
└── schema/               # Split Prisma schema files (modular architecture)
src/
├── app/
│   ├── build/            # Advanced utilities (e.g., QueryBuilder)
│   ├── config/           # Environment and App configuration
│   ├── error-helpers/    # Custom Error boundary classes 
│   ├── interfaces/       # Global TypeScript Interfaces
│   ├── lib/              # Core libraries (Prisma Client, Auth instance)
│   ├── middleware/       # Express middlewares (Zod validators, Auth guards)
│   ├── modules/          # Core Business Logic (Domain Driven)
│   │   ├── Auth/
│   │   ├── Genre/        # Genre management catalog
│   │   ├── Media/        # Movies, TV Shows, Episodes (Featured support)
│   │   ├── Payment/      # Stripe integration and payment processing
│   │   ├── Reaction/     # Comments, Likes
│   │   ├── Reviews/
│   │   ├── Subscription/
│   │   ├── User/
│   │   └── Watchlist/
│   ├── routes/           # Global application router
│   ├── shared/           # Common utilities (catchAsync, sendResponse)
│   ├── templates/        # EJS templates for responsive emails
│   └── utils/            # Helper functions / Cron job initialization
│   app.ts                # Express application bootstrap
│   index.ts              # Server entry point
```

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed to run the project locally:
- Node.js (v20+ recommended)
- PostgreSQL (or an external provider URL)
- Stripe CLI (for webhook testing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory. Check `.env.example` (if available) for required keys such as `DATABASE_URL`, `PORT`, `STRIPE_SECRET_KEY`, and `BETTER_AUTH_SECRET`.

4. **Initialize Database:**
   Push the schema to your database and generate the Prisma Client:
   ```bash
   npm run generate
   npm run push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The server will typically start on `http://localhost:5000` (or your defined port).*

### Helpful Commands

- `npm run studio`: Opens Prisma GUI to directly manage your database.
- `npm run build`: Compiles the TypeScript codebase into the production-ready `dist/` folder.
- `npm run stripe:webhook`: Forwards Stripe events to the local webhook endpoint.

## 🛡️ Best Practices Utilized

- **Zero-Trust Input:** Every payload is validated against strict Zod definitions.
- **Single Responsibility:** Controllers handle Http lifecycle; Services handle Business interactions; Routes manage routing.
- **No Emit on Error:** TypeScript is structurally enforcing no implicit `any` and compiling safely.

---
> Designed and built with ❤️ by MSH.
