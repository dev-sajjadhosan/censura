# 🎬 Movie & Series Rating Portal — Backend Blueprint

> **Stack:** Node.js · Express.js · Prisma ORM · PostgreSQL · JWT Auth · Stripe/SSLCommerz

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Entry point (listen)
│   │
│   ├── config/
│   │   ├── env.ts                # Typed env variables (dotenv)
│   │   ├── cors.ts               # CORS config
│   │   └── stripe.ts             # Stripe client init
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.validation.ts
│   │   │
│   │   ├── media/                # Movies & Series
│   │   │   ├── media.routes.ts
│   │   │   ├── media.controller.ts
│   │   │   ├── media.service.ts
│   │   │   └── media.validation.ts
│   │   │
│   │   ├── review/
│   │   │   ├── review.routes.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   └── review.validation.ts
│   │   │
│   │   ├── comment/
│   │   │   ├── comment.routes.ts
│   │   │   ├── comment.controller.ts
│   │   │   ├── comment.service.ts
│   │   │   └── comment.validation.ts
│   │   │
│   │   ├── watchlist/
│   │   │   ├── watchlist.routes.ts
│   │   │   ├── watchlist.controller.ts
│   │   │   └── watchlist.service.ts
│   │   │
│   │   ├── subscription/
│   │   │   ├── subscription.routes.ts
│   │   │   ├── subscription.controller.ts
│   │   │   └── subscription.service.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.routes.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # Verify JWT
│   │   ├── role.middleware.ts     # Role guard (admin/user)
│   │   ├── validate.middleware.ts # Zod schema validation
│   │   ├── error.middleware.ts    # Global error handler
│   │   └── notFound.middleware.ts # 404 handler
│   │
│   ├── utils/
│   │   ├── jwt.utils.ts           # Sign / verify tokens
│   │   ├── bcrypt.utils.ts        # Hash / compare passwords
│   │   ├── apiResponse.utils.ts   # Standardized response shape
│   │   ├── apiError.utils.ts      # Custom error class
│   │   ├── paginate.utils.ts      # Pagination helper
│   │   └── catchAsync.utils.ts    # Async error wrapper
│   │
│   ├── libs/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   └── stripe.ts              # Stripe instance
│   │
│   └── types/
│       ├── express.d.ts           # Extend Request with user
│       └── common.types.ts        # Shared TS types/interfaces
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                    # Seed admin + sample data
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔌 All API Routes

### 🔐 Auth  `/api/v1/auth`

| Method | Endpoint           | Access  | Description              |
|--------|--------------------|---------|--------------------------|
| POST   | `/register`        | Public  | Register new user        |
| POST   | `/login`           | Public  | Login, returns JWT       |
| POST   | `/forgot-password` | Public  | Send reset email         |
| POST   | `/reset-password`  | Public  | Reset with token         |
| GET    | `/me`              | Private | Get current user profile |
| POST   | `/logout`          | Private | Invalidate token         |
| POST   | `/refresh-token`   | Private | Refresh token            |
| GET    | `/google`          | Public  | Google login             |
| GET    | `/google/success`  | Public  | Google login success     |
| GET    | `/google/error`    | Public  | Google login error       |

---

### 👤 User  `/api/v1/users`

| Method | Endpoint       | Access | Description               |
|--------|----------------|--------|---------------------------|
| GET    | `/`            | Admin  | Get all users             |
| GET    | `/:id`         | Admin  | Get single user           |
| PATCH  | `/profile`     | User   | Update own profile        |
| DELETE | `/:id`         | Admin  | Delete user account       |
| PATCH  | `/:id/status`  | Admin  | Change user status        |

---

### 🎬 Media (Movies/Series)  `/api/v1/media`

| Method | Endpoint             | Access  | Description                      |
|--------|----------------------|---------|----------------------------------|
| GET    | `/`                  | Public  | Get all media (paginated+filter) |
| GET    | `/:id`               | Public  | Get single media details         |
| POST   | `/`                  | Admin   | Create new movie/series          |
| PATCH  | `/:id`               | Admin   | Update media entry               |
| DELETE | `/:id`               | Admin   | Delete media entry               |
| GET    | `/search`            | Public  | Search by title/genre/director   |
| GET    | `/trending`          | Public  | Top rated / trending             |
| GET    | `/editors-picks`     | Public  | Admin-curated list               |
| PATCH  | `/:id/editors-pick`  | Admin   | Toggle editor's pick             |

**Query params for `GET /`:**
```
?genre=Action
?platform=Netflix
?year=2023
?rating_min=7
?sort=top_rated | most_reviewed | latest
?page=1&limit=12
?type=movie | series
```

---

### ⭐ Reviews  `/api/v1/reviews` 

| Method | Endpoint              | Access  | Description                    |
|--------|-----------------------|---------|--------------------------------|
| GET    | `/`                   | Public  | Get all approved reviews       |
| GET    | `/:id`                | Public  | Get single review              |
| GET    | `/media/:mediaId`     | Public  | Reviews for a specific media   |
| POST   | `/`                   | User    | Submit a review                |
| PATCH  | `/:id`                | User    | Edit own unpublished review    |
| DELETE | `/:id`                | User    | Delete own unpublished review  |
| PATCH  | `/:id/status`         | Admin   | Approve/Unpublish review       |
| DELETE | `/:id/admin`          | Admin   | Delete any review              |

**POST /reviews body:**
```json
{
  "mediaId": "uuid",
  "rating": 8,
  "content": "Amazing film...",
  "tags": ["classic", "underrated"],
  "hasSpoiler": false
}
```

---

### 👍 Likes  `/api/v1/likes`

| Method | Endpoint              | Access | Description              |
|--------|-----------------------|--------|--------------------------|
| POST   | `/review/:reviewId`   | User   | Like a review            |
| DELETE | `/review/:reviewId`   | User   | Unlike a review          |

> One like per user per review — enforced at DB level (unique constraint).

---

### 💬 Comments  `/api/v1/comments`

| Method | Endpoint                    | Access | Description               |
|--------|-----------------------------|--------|---------------------------|
| GET    | `/review/:reviewId`         | Public | Get comments for review   |
| POST   | `/review/:reviewId`         | User   | Post a comment            |
| POST   | `/:commentId/reply`         | User   | Reply to a comment        |
| PATCH  | `/:id`                      | User   | Edit own comment          |
| DELETE | `/:id`                      | User   | Delete own comment        |
| DELETE | `/:id/admin`                | Admin  | Admin force delete        |

---

### 📋 Watchlist  `/api/v1/watchlist`

| Method | Endpoint       | Access | Description              |
|--------|----------------|--------|--------------------------|
| GET    | `/`            | User   | Get own watchlist        |
| POST   | `/:mediaId`    | User   | Add to watchlist         |
| DELETE | `/:mediaId`    | User   | Remove from watchlist    |

---

### 💳 Subscription  `/api/v1/subscription`

| Method | Endpoint                    | Access | Description                     |
|--------|-----------------------------|--------|---------------------------------|
| GET    | `/plans`                    | Public | Get available plans             |
| POST   | `/checkout`                 | User   | Create Stripe checkout session  |
| POST   | `/webhook`                  | Public | Stripe webhook handler          |
| GET    | `/status`                   | User   | Get own subscription status     |
| GET    | `/history`                  | User   | Get payment history             |

---

### 🛡️ Admin  `/api/v1/admin`

| Method | Endpoint              | Access | Description                     |
|--------|-----------------------|--------|---------------------------------|
| GET    | `/dashboard`          | Admin  | Stats overview                  |
| GET    | `/reviews/pending`    | Admin  | All pending reviews             |
| GET    | `/analytics/ratings`  | Admin  | Avg ratings per media           |
| GET    | `/analytics/sales`    | Admin  | Subscription revenue stats      |

---

## 🧱 Prisma Schema (Key Models)

```prisma
model User {
  id             String         @id @default(uuid())
  email          String         @unique
  password       String
  name           String
  role           Role           @default(USER)
  avatar         String?
  isActive       Boolean        @default(true)
  subscriptionId String?
  createdAt      DateTime       @default(now())

  reviews        Review[]
  comments       Comment[]
  likes          Like[]
  watchlist      Watchlist[]
  subscription   Subscription?
}

model Media {
  id              String      @id @default(uuid())
  title           String
  synopsis        String
  type            MediaType   // MOVIE | SERIES
  genre           String[]
  releaseYear     Int
  director        String
  cast            String[]
  platforms       String[]
  posterUrl       String?
  streamingLink   String?
  pricing         Pricing     @default(FREE) // FREE | PREMIUM
  isEditorsPick   Boolean     @default(false)
  createdAt       DateTime    @default(now())

  reviews         Review[]
  watchlists      Watchlist[]
}

model Review {
  id          String        @id @default(uuid())
  userId      String
  mediaId     String
  rating      Int           // 1-10
  content     String
  tags        String[]
  hasSpoiler  Boolean       @default(false)
  status      ReviewStatus  @default(PENDING) // PENDING | APPROVED | UNPUBLISHED
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user        User          @relation(fields: [userId], references: [id])
  media       Media         @relation(fields: [mediaId], references: [id])
  comments    Comment[]
  likes       Like[]
}

model Comment {
  id          String    @id @default(uuid())
  userId      String
  reviewId    String
  parentId    String?   // for nested replies
  content     String
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id])
  review      Review    @relation(fields: [reviewId], references: [id])
  parent      Comment?  @relation("replies", fields: [parentId], references: [id])
  replies     Comment[] @relation("replies")
}

model Like {
  id        String   @id @default(uuid())
  userId    String
  reviewId  String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  review    Review   @relation(fields: [reviewId], references: [id])

  @@unique([userId, reviewId]) // one like per user per review
}

model Watchlist {
  id        String   @id @default(uuid())
  userId    String
  mediaId   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  media     Media    @relation(fields: [mediaId], references: [id])

  @@unique([userId, mediaId])
}

model Subscription {
  id              String             @id @default(uuid())
  userId          String             @unique
  plan            SubscriptionPlan   // MONTHLY | YEARLY | FREE
  status          SubStatus          @default(ACTIVE) // ACTIVE | CANCELLED | EXPIRED
  stripeSessionId String?
  startDate       DateTime
  endDate         DateTime?
  createdAt       DateTime           @default(now())

  user            User               @relation(fields: [userId], references: [id])
}

enum Role           { USER ADMIN }
enum MediaType      { MOVIE SERIES }
enum Pricing        { FREE PREMIUM }
enum ReviewStatus   { PENDING APPROVED UNPUBLISHED }
enum SubscriptionPlan { FREE MONTHLY YEARLY }
enum SubStatus      { ACTIVE CANCELLED EXPIRED }
```

---

## 🛡️ Middlewares

### `auth.middleware.ts`
```ts
// Verifies JWT from Authorization: Bearer <token>
// Attaches decoded user to req.user
// Throws 401 if token missing or invalid
export const authenticate = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new ApiError(401, "Not authenticated");
  const decoded = verifyToken(token);
  req.user = decoded;
  next();
});
```

### `role.middleware.ts`
```ts
// Usage: authorize("ADMIN") or authorize("USER", "ADMIN")
export const authorize = (...roles: Role[]) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new ApiError(403, "Forbidden: insufficient permissions");
    next();
  };
```

### `validate.middleware.ts`
```ts
// Usage: validate(createReviewSchema)
// Uses Zod to validate req.body, throws 400 on failure
export const validate = (schema: ZodSchema) =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success)
      throw new ApiError(400, result.error.errors[0].message);
    req.body = result.data;
    next();
  };
```

### `error.middleware.ts`
```ts
// Catches all errors thrown in controllers
// Returns standardized JSON error response
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
```

---

## 🔧 Utils

### `apiResponse.utils.ts`
```ts
export class ApiResponse {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }
}
```

### `apiError.utils.ts`
```ts
export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

### `catchAsync.utils.ts`
```ts
// Wraps async controllers to catch thrown errors
export const catchAsync = (fn: AsyncHandler) =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

### `jwt.utils.ts`
```ts
export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
```

### `paginate.utils.ts`
```ts
// Pass to any Prisma findMany call
export const paginate = (page = 1, limit = 12) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export const paginateMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
```

### `bcrypt.utils.ts`
```ts
export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);
export const comparePassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);
```

---

## 📦 NPM Packages

### Core
```bash
express               # HTTP framework
@prisma/client        # DB ORM
prisma                # CLI for migrations
typescript            # TS support
ts-node               # Run TS directly
tsx                   # Fast TS execution
```

### Auth & Security
```bash
jsonwebtoken          # JWT sign/verify
bcryptjs              # Password hashing
helmet                # HTTP security headers
express-rate-limit    # Rate limiting
cors                  # CORS handling
```

### Validation
```bash
zod                   # Schema validation
```

### Payment
```bash
stripe                # Stripe SDK
```

### Utilities
```bash
dotenv                # Env variables
morgan                # HTTP request logger
uuid                  # Generate UUIDs (or use Prisma's default)
nodemailer            # Send emails (password reset)
```

### Dev
```bash
@types/express
@types/jsonwebtoken
@types/bcryptjs
@types/node
@types/morgan
nodemon
```

---

## 🔄 Shared Functions (Service Layer Patterns)

```ts
// In any service file — example: review.service.ts

// ✅ Get paginated approved reviews for a media
export const getReviewsByMedia = async (mediaId, page, limit) => {
  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where: { mediaId, status: "APPROVED" },
      include: { user: { select: { id, name, avatar } }, _count: { select: { likes: true, comments: true } } },
      ...paginate(page, limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where: { mediaId, status: "APPROVED" } }),
  ]);
  return { reviews, meta: paginateMeta(total, page, limit) };
};

// ✅ Ensure ownership before edit/delete
export const assertOwnership = (resourceUserId: string, requestUserId: string) => {
  if (resourceUserId !== requestUserId)
    throw new ApiError(403, "You don't own this resource");
};

// ✅ Ensure review is still editable (unpublished)
export const assertUnpublished = (status: ReviewStatus) => {
  if (status === "APPROVED")
    throw new ApiError(400, "Cannot edit an approved review");
};
```

---

## ⚙️ Environment Variables (`.env.example`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/movie_portal

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# Frontend
CLIENT_URL=http://localhost:3000
```

---

## 🚀 App Setup (`app.ts`)

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";

// Route imports
import authRoutes       from "./modules/auth/auth.routes";
import userRoutes       from "./modules/user/user.routes";
import mediaRoutes      from "./modules/media/media.routes";
import reviewRoutes     from "./modules/review/review.routes";
import commentRoutes    from "./modules/comment/comment.routes";
import likeRoutes       from "./modules/like/like.routes";
import watchlistRoutes  from "./modules/watchlist/watchlist.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";
import adminRoutes      from "./modules/admin/admin.routes";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/v1/auth",         authRoutes);
app.use("/api/v1/users",        userRoutes);
app.use("/api/v1/media",        mediaRoutes);
app.use("/api/v1/reviews",      reviewRoutes);
app.use("/api/v1/comments",     commentRoutes);
app.use("/api/v1/likes",        likeRoutes);
app.use("/api/v1/watchlist",    watchlistRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/admin",        adminRoutes);

// Error handlers (always last)
app.use(notFound);
app.use(errorHandler);

export default app;
```

---

## 📋 Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Setup DB
npx prisma migrate dev --name init

# 3. Seed admin account
npx ts-node prisma/seed.ts

# 4. Run dev server
npm run dev
```

---

## ✅ Route Protection Summary

| Route Type        | Middleware Chain                          |
|-------------------|-------------------------------------------|
| Public            | (none)                                    |
| Logged-in user    | `authenticate`                            |
| Admin only        | `authenticate` → `authorize("ADMIN")`     |
| User or Admin     | `authenticate` → `authorize("USER","ADMIN")` |
| With validation   | `validate(schema)` before controller      |

---

*Built for Assignment 5 — Movie & Series Rating Portal*
