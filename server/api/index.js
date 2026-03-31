var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/generated/prisma/enums.ts
var Role = {
  USER: "USER",
  ADMIN: "ADMIN"
};
var ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  UNPUBLISHED: "UNPUBLISHED"
};
var SubscriptionPlan = {
  FREE: "FREE",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY"
};
var SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  PAST_DUE: "PAST_DUE"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  PENDING: "PENDING",
  UNVERIFIED: "UNVERIFIED",
  DELETED: "DELETED"
};
var MediaPurchaseType = {
  RENTAL: "RENTAL",
  BUY: "BUY"
};
var MediaPurchaseStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
};

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "FRONTEND_URL",
    "BETTER_AUTH_URL",
    "SERVER_URL",
    "BETTER_AUTH_SECRET",
    "DATABASE_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "DEFAULT_ADMIN_GMAIL",
    "DEFAULT_ADMIN_PASSWORD"
  ];
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
  return {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    SERVER_URL: process.env.SERVER_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      API_KEY: process.env.CLOUDINARY_API_KEY,
      API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    DEFAULT_ADMIN_GMAIL: process.env.DEFAULT_ADMIN_GMAIL,
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  deletedAt     DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admin")\n}\n\nmodel Comment {\n  id        String        @id @default(uuid())\n  userId    String\n  reviewId  String\n  parentId  String? // for nested replies\n  content   String\n  createdAt DateTime      @default(now())\n  status    CommentStatus @default(APPROVED)\n\n  user    User      @relation(fields: [userId], references: [id])\n  review  Review    @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  parent  Comment?  @relation("replies", fields: [parentId], references: [id])\n  replies Comment[] @relation("replies")\n\n  mediaId String\n  media   Media  @relation(fields: [mediaId], references: [id])\n  likes   Like[]\n\n  // @@unique([userId, reviewId])\n  @@index([userId])\n  @@index([reviewId])\n  @@index([parentId])\n  @@map("comment")\n}\n\nmodel Like {\n  id        String   @id @default(uuid())\n  type      LikeType\n  userId    String\n  reviewId  String?\n  createdAt DateTime @default(now())\n\n  user      User     @relation(fields: [userId], references: [id])\n  review    Review?  @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  mediaId   String\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  commentId String?\n  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, reviewId, commentId]) // one like per user per review\n  @@index([userId])\n  @@index([reviewId])\n  @@map("like")\n}\n\nenum Role {\n  USER\n  ADMIN\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n  DRAMA\n  ANIME\n  CARTOON\n  SHORT_FILM\n  DOCUMENTARY\n  TV_SHOW\n  WEB_SERIES\n  REALITY_SHOW\n  TALK_SHOW\n  GAME_SHOW\n  NEWS_CHANNEL\n  SPORTS_CHANNEL\n  MUSIC_CHANNEL\n  KIDS_CHANNEL\n  LIFESTYLE_CHANNEL\n  TRAVEL_CHANNEL\n  FOOD_CHANNEL\n}\n\nenum Pricing {\n  FREE\n  PREMIUM\n  RENTAL\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  UNPUBLISHED\n}\n\nenum SubscriptionPlan {\n  FREE\n  MONTHLY\n  YEARLY\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n  PAST_DUE\n}\n\nenum SubStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n}\n\nenum UserStatus {\n  ACTIVE // default\n  BLOCKED // suspended indefinitely\n  PENDING // if new admin or moderator not approved by admin\n  UNVERIFIED // if email not verified\n  DELETED // soft delete\n}\n\nenum CommentStatus {\n  PENDING\n  APPROVED\n  UNPUBLISHED\n  REJECTED\n  BLOCKED\n}\n\nenum LikeType {\n  LIKE\n  HEART\n  CRY\n  LAUGH\n  DISLIKE\n}\n\nenum PurchaseType {\n  BUY\n  RENT\n}\n\nenum RentalStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum MediaPurchaseType {\n  RENTAL\n  BUY\n}\n\nenum MediaPurchaseStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nmodel Genre {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  slug        String  @unique\n  description String?\n  image       String?\n\n  isPublished Boolean @default(true)\n  isFeatured  Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  media Media[] @relation("MediaGenres")\n\n  @@index([name])\n  @@index([isPublished])\n  @@index([isFeatured])\n  @@map("genres")\n}\n\nmodel Media {\n  id             String   @id @default(uuid())\n  title          String\n  slug           String   @unique\n  type           String\n  synopsis       String   @db.Text\n  releaseYear    Int\n  director       String\n  posterUrl      String?\n  backdropUrl    String?\n  trailerUrl     String?\n  streamingUrl   String?\n  rentalPrice    Decimal? @db.Decimal(10, 2)\n  buyPrice       Decimal? @db.Decimal(10, 2)\n  runtimeMinutes Int?\n  seasons        Int?\n  pricing        Pricing  @default(FREE)\n  isPublished    Boolean  @default(true)\n  isFeatured     Boolean  @default(false)\n  avgRating      Float?\n  reviewCount    Int      @default(0)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  genres         Genre[]         @relation("MediaGenres")\n  platforms      MediaPlatform[]\n  reviews        Review[]\n  watchlistItems Watchlist[] // Need to match Watchlist model relations\n\n  viewCount Int             @default(0)\n  likes     Like[]\n  comments  Comment[]\n  bookmarks Bookmark[]\n  favorites Favorite[]\n  purchases MediaPurchase[]\n  cast      CastMember[]\n  rentals   Rental[]\n\n  @@unique([title, releaseYear])\n  @@index([title])\n  @@index([type])\n  @@index([releaseYear])\n  @@index([director])\n  @@index([pricing])\n  @@index([isFeatured])\n  @@index([createdAt])\n  @@index([viewCount])\n  @@map("media")\n}\n\nmodel CastMember {\n  id      String  @id @default(uuid())\n  name    String\n  role    String\n  image   String?\n  mediaId String\n  media   Media   @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@map("cast_members")\n}\n\nmodel MediaPlatform {\n  id         String   @id @default(uuid())\n  mediaId    String\n  media      Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  platformId String\n  platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)\n\n  @@unique([mediaId, platformId])\n  @@index([mediaId])\n  @@index([platformId])\n  @@map("media_platforms")\n}\n\nmodel MediaPurchase {\n  id              String              @id @default(uuid())\n  userId          String\n  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)\n  mediaId         String\n  media           Media               @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  type            MediaPurchaseType   @default(RENTAL)\n  status          MediaPurchaseStatus @default(ACTIVE)\n  price           Decimal             @db.Decimal(10, 2)\n  expiresAt       DateTime? // null = permanent (BUY), set = rental\n  stripePaymentId String?\n  createdAt       DateTime            @default(now())\n  updatedAt       DateTime            @updatedAt\n  payment         Payment?            @relation(fields: [paymentId], references: [id])\n  paymentId       String?\n\n  @@unique([userId, mediaId, type])\n  @@index([userId])\n  @@index([mediaId])\n  @@index([expiresAt])\n  @@map("media_purchases")\n}\n\nmodel Payment {\n  id              String       @id @default(uuid())\n  subscriptionId  String\n  subscription    Subscription @relation(fields: [subscriptionId], references: [id])\n  amount          Float\n  currency        String       @default("usd")\n  stripePaymentId String?      @unique\n  status          String\n\n  createdAt      DateTime        @default(now())\n  rental         Rental?         @relation(fields: [rentalId], references: [id])\n  rentalId       String?\n  mediaPurchases MediaPurchase[]\n\n  @@index([subscriptionId])\n  @@index([status])\n  @@index([createdAt])\n  @@map("payments")\n}\n\nmodel Platform {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  slug        String   @unique\n  description String?\n  icon        String?\n  url         String?\n  type        String?\n  isFeatured  Boolean  @default(false)\n  isPublished Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  mediaPlatforms MediaPlatform[]\n\n  @@map("platforms")\n}\n\nmodel Profile {\n  id     String @id @default(uuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  name       String?\n  email      String?\n  image      String?\n  bio        String?\n  avatar     String?\n  coverImage String?\n\n  favorite Favorite[]\n  bookmark Bookmark[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("profile")\n}\n\nmodel Bookmark {\n  id      String @id @default(uuid())\n  userId  String\n  user    User   @relation(fields: [userId], references: [id])\n  mediaId String\n  media   Media  @relation(fields: [mediaId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  profileId String?\n\n  @@index([userId])\n  @@map("bookmark")\n}\n\nmodel Favorite {\n  id      String @id @default(uuid())\n  userId  String\n  user    User   @relation(fields: [userId], references: [id])\n  mediaId String\n  media   Media  @relation(fields: [mediaId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  profileId String?\n\n  @@index([userId])\n  @@map("favorite")\n}\n\nmodel Rental {\n  id        String       @id @default(uuid())\n  userId    String\n  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  mediaId   String\n  media     Media        @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  status    RentalStatus @default(ACTIVE)\n  expiresAt DateTime\n  price     Decimal      @db.Decimal(10, 2)\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n  payments  Payment[]\n\n  @@unique([userId, mediaId])\n  @@index([userId])\n  @@index([mediaId])\n  @@index([expiresAt])\n  @@map("rentals")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  userId     String\n  mediaId    String\n  rating     Int // 1-10\n  content    String\n  tags       String[]\n  hasSpoiler Boolean      @default(false)\n  status     ReviewStatus @default(UNPUBLISHED) // PENDING | APPROVED | UNPUBLISHED\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n\n  user     User      @relation(fields: [userId], references: [id])\n  media    Media     @relation(fields: [mediaId], references: [id])\n  comments Comment[]\n  likes    Like[]\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("review")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subscription {\n  id                 String             @id @default(uuid())\n  userId             String             @unique\n  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  plan               SubscriptionPlan   @default(FREE)\n  status             SubscriptionStatus @default(ACTIVE)\n  stripeCustomerId   String?            @unique\n  stripePriceId      String?\n  currentPeriodStart DateTime?\n  currentPeriodEnd   DateTime?\n  cancelAtPeriodEnd  Boolean            @default(false)\n  createdAt          DateTime           @default(now())\n  updatedAt          DateTime           @updatedAt\n\n  payments Payment[]\n\n  @@index([userId])\n  @@index([plan])\n  @@index([status])\n  @@index([currentPeriodEnd])\n  @@map("subscriptions")\n}\n\nmodel User {\n  id                 String     @id\n  name               String\n  email              String\n  emailVerified      Boolean    @default(false)\n  image              String?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n  role               Role       @default(USER)\n  status             UserStatus @default(UNVERIFIED)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n\n  sessions Session[]\n  accounts Account[]\n\n  comments     Comment[]\n  likes        Like[]\n  reviews      Review[]\n  subscription Subscription?\n  watchlists   Watchlist[]\n  profile      Profile?\n  bookmarks    Bookmark[]\n  favorites    Favorite[]\n  admin        Admin?\n  purchases    MediaPurchase[]\n  rentals      Rental[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Watchlist {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n\n  user  User  @relation(fields: [userId], references: [id])\n  media Media @relation(fields: [mediaId], references: [id])\n\n  @@unique([userId, mediaId])\n  @@index([userId])\n  @@index([mediaId])\n  @@map("watchlist")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"CommentStatus"},{"name":"user","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"review","kind":"object","type":"Review","relationName":"CommentToReview"},{"name":"parent","kind":"object","type":"Comment","relationName":"replies"},{"name":"replies","kind":"object","type":"Comment","relationName":"replies"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"CommentToMedia"},{"name":"likes","kind":"object","type":"Like","relationName":"CommentToLike"}],"dbName":"comment"},"Like":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"LikeType"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"LikeToUser"},{"name":"review","kind":"object","type":"Review","relationName":"LikeToReview"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"LikeToMedia"},{"name":"commentId","kind":"scalar","type":"String"},{"name":"comment","kind":"object","type":"Comment","relationName":"CommentToLike"}],"dbName":"like"},"Genre":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"media","kind":"object","type":"Media","relationName":"MediaGenres"}],"dbName":"genres"},"Media":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"synopsis","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int"},{"name":"director","kind":"scalar","type":"String"},{"name":"posterUrl","kind":"scalar","type":"String"},{"name":"backdropUrl","kind":"scalar","type":"String"},{"name":"trailerUrl","kind":"scalar","type":"String"},{"name":"streamingUrl","kind":"scalar","type":"String"},{"name":"rentalPrice","kind":"scalar","type":"Decimal"},{"name":"buyPrice","kind":"scalar","type":"Decimal"},{"name":"runtimeMinutes","kind":"scalar","type":"Int"},{"name":"seasons","kind":"scalar","type":"Int"},{"name":"pricing","kind":"enum","type":"Pricing"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"reviewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"genres","kind":"object","type":"Genre","relationName":"MediaGenres"},{"name":"platforms","kind":"object","type":"MediaPlatform","relationName":"MediaToMediaPlatform"},{"name":"reviews","kind":"object","type":"Review","relationName":"MediaToReview"},{"name":"watchlistItems","kind":"object","type":"Watchlist","relationName":"MediaToWatchlist"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToMedia"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToMedia"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToMedia"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToMedia"},{"name":"purchases","kind":"object","type":"MediaPurchase","relationName":"MediaToMediaPurchase"},{"name":"cast","kind":"object","type":"CastMember","relationName":"CastMemberToMedia"},{"name":"rentals","kind":"object","type":"Rental","relationName":"MediaToRental"}],"dbName":"media"},"CastMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"CastMemberToMedia"}],"dbName":"cast_members"},"MediaPlatform":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToMediaPlatform"},{"name":"platformId","kind":"scalar","type":"String"},{"name":"platform","kind":"object","type":"Platform","relationName":"MediaPlatformToPlatform"}],"dbName":"media_platforms"},"MediaPurchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"MediaPurchaseToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToMediaPurchase"},{"name":"type","kind":"enum","type":"MediaPurchaseType"},{"name":"status","kind":"enum","type":"MediaPurchaseStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"MediaPurchaseToPayment"},{"name":"paymentId","kind":"scalar","type":"String"}],"dbName":"media_purchases"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"rental","kind":"object","type":"Rental","relationName":"PaymentToRental"},{"name":"rentalId","kind":"scalar","type":"String"},{"name":"mediaPurchases","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToPayment"}],"dbName":"payments"},"Platform":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mediaPlatforms","kind":"object","type":"MediaPlatform","relationName":"MediaPlatformToPlatform"}],"dbName":"platforms"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"favorite","kind":"object","type":"Favorite","relationName":"FavoriteToProfile"},{"name":"bookmark","kind":"object","type":"Bookmark","relationName":"BookmarkToProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"profile"},"Bookmark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BookmarkToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"BookmarkToMedia"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profile","kind":"object","type":"Profile","relationName":"BookmarkToProfile"},{"name":"profileId","kind":"scalar","type":"String"}],"dbName":"bookmark"},"Favorite":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"FavoriteToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"FavoriteToMedia"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profile","kind":"object","type":"Profile","relationName":"FavoriteToProfile"},{"name":"profileId","kind":"scalar","type":"String"}],"dbName":"favorite"},"Rental":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"RentalToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRental"},{"name":"status","kind":"enum","type":"RentalStatus"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToRental"}],"dbName":"rentals"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"content","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"hasSpoiler","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToReview"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToReview"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToReview"}],"dbName":"review"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripePriceId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"watchlists","kind":"object","type":"Watchlist","relationName":"UserToWatchlist"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToUser"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"purchases","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToUser"},{"name":"rentals","kind":"object","type":"Rental","relationName":"RentalToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Watchlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchlist"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToWatchlist"}],"dbName":"watchlist"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","media","_count","genres","mediaPlatforms","platform","platforms","reviews","watchlistItems","review","comment","likes","comments","profile","favorite","bookmark","bookmarks","favorites","payments","subscription","rental","mediaPurchases","payment","purchases","cast","rentals","parent","replies","watchlists","admin","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","Like.findUnique","Like.findUniqueOrThrow","Like.findFirst","Like.findFirstOrThrow","Like.findMany","Like.createOne","Like.createMany","Like.createManyAndReturn","Like.updateOne","Like.updateMany","Like.updateManyAndReturn","Like.upsertOne","Like.deleteOne","Like.deleteMany","Like.groupBy","Like.aggregate","Genre.findUnique","Genre.findUniqueOrThrow","Genre.findFirst","Genre.findFirstOrThrow","Genre.findMany","Genre.createOne","Genre.createMany","Genre.createManyAndReturn","Genre.updateOne","Genre.updateMany","Genre.updateManyAndReturn","Genre.upsertOne","Genre.deleteOne","Genre.deleteMany","Genre.groupBy","Genre.aggregate","Media.findUnique","Media.findUniqueOrThrow","Media.findFirst","Media.findFirstOrThrow","Media.findMany","Media.createOne","Media.createMany","Media.createManyAndReturn","Media.updateOne","Media.updateMany","Media.updateManyAndReturn","Media.upsertOne","Media.deleteOne","Media.deleteMany","_avg","_sum","Media.groupBy","Media.aggregate","CastMember.findUnique","CastMember.findUniqueOrThrow","CastMember.findFirst","CastMember.findFirstOrThrow","CastMember.findMany","CastMember.createOne","CastMember.createMany","CastMember.createManyAndReturn","CastMember.updateOne","CastMember.updateMany","CastMember.updateManyAndReturn","CastMember.upsertOne","CastMember.deleteOne","CastMember.deleteMany","CastMember.groupBy","CastMember.aggregate","MediaPlatform.findUnique","MediaPlatform.findUniqueOrThrow","MediaPlatform.findFirst","MediaPlatform.findFirstOrThrow","MediaPlatform.findMany","MediaPlatform.createOne","MediaPlatform.createMany","MediaPlatform.createManyAndReturn","MediaPlatform.updateOne","MediaPlatform.updateMany","MediaPlatform.updateManyAndReturn","MediaPlatform.upsertOne","MediaPlatform.deleteOne","MediaPlatform.deleteMany","MediaPlatform.groupBy","MediaPlatform.aggregate","MediaPurchase.findUnique","MediaPurchase.findUniqueOrThrow","MediaPurchase.findFirst","MediaPurchase.findFirstOrThrow","MediaPurchase.findMany","MediaPurchase.createOne","MediaPurchase.createMany","MediaPurchase.createManyAndReturn","MediaPurchase.updateOne","MediaPurchase.updateMany","MediaPurchase.updateManyAndReturn","MediaPurchase.upsertOne","MediaPurchase.deleteOne","MediaPurchase.deleteMany","MediaPurchase.groupBy","MediaPurchase.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Platform.findUnique","Platform.findUniqueOrThrow","Platform.findFirst","Platform.findFirstOrThrow","Platform.findMany","Platform.createOne","Platform.createMany","Platform.createManyAndReturn","Platform.updateOne","Platform.updateMany","Platform.updateManyAndReturn","Platform.upsertOne","Platform.deleteOne","Platform.deleteMany","Platform.groupBy","Platform.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Bookmark.findUnique","Bookmark.findUniqueOrThrow","Bookmark.findFirst","Bookmark.findFirstOrThrow","Bookmark.findMany","Bookmark.createOne","Bookmark.createMany","Bookmark.createManyAndReturn","Bookmark.updateOne","Bookmark.updateMany","Bookmark.updateManyAndReturn","Bookmark.upsertOne","Bookmark.deleteOne","Bookmark.deleteMany","Bookmark.groupBy","Bookmark.aggregate","Favorite.findUnique","Favorite.findUniqueOrThrow","Favorite.findFirst","Favorite.findFirstOrThrow","Favorite.findMany","Favorite.createOne","Favorite.createMany","Favorite.createManyAndReturn","Favorite.updateOne","Favorite.updateMany","Favorite.updateManyAndReturn","Favorite.upsertOne","Favorite.deleteOne","Favorite.deleteMany","Favorite.groupBy","Favorite.aggregate","Rental.findUnique","Rental.findUniqueOrThrow","Rental.findFirst","Rental.findFirstOrThrow","Rental.findMany","Rental.createOne","Rental.createMany","Rental.createManyAndReturn","Rental.updateOne","Rental.updateMany","Rental.updateManyAndReturn","Rental.upsertOne","Rental.deleteOne","Rental.deleteMany","Rental.groupBy","Rental.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Watchlist.findUnique","Watchlist.findUniqueOrThrow","Watchlist.findFirst","Watchlist.findFirstOrThrow","Watchlist.findMany","Watchlist.createOne","Watchlist.createMany","Watchlist.createManyAndReturn","Watchlist.updateOne","Watchlist.updateMany","Watchlist.updateManyAndReturn","Watchlist.upsertOne","Watchlist.deleteOne","Watchlist.deleteMany","Watchlist.groupBy","Watchlist.aggregate","AND","OR","NOT","id","userId","mediaId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","identifier","value","expiresAt","updatedAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","Role","role","UserStatus","status","needPasswordChange","isDeleted","deletedAt","every","some","none","SubscriptionPlan","plan","SubscriptionStatus","stripeCustomerId","stripePriceId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","rating","content","tags","hasSpoiler","ReviewStatus","has","hasEvery","hasSome","RentalStatus","price","profileId","bio","avatar","coverImage","slug","description","icon","url","type","isFeatured","isPublished","subscriptionId","amount","currency","stripePaymentId","rentalId","MediaPurchaseType","MediaPurchaseStatus","paymentId","platformId","title","synopsis","releaseYear","director","posterUrl","backdropUrl","trailerUrl","streamingUrl","rentalPrice","buyPrice","runtimeMinutes","seasons","Pricing","pricing","avgRating","reviewCount","viewCount","LikeType","reviewId","commentId","parentId","CommentStatus","profilePhoto","contactNumber","userId_mediaId","userId_mediaId_type","userId_reviewId_commentId","mediaId_platformId","title_releaseYear","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "qQy9AdACDgMAAKIFACD7AgAA3AUAMPwCAABvABD9AgAA3AUAMP4CAQAAAAH_AgEAAAABgQNAAPEEACGQA0AA8QQAIZ0DAQDwBAAhngMBAAAAAaYDIACGBQAhpwNAAIoFACHnAwEAhwUAIegDAQCHBQAhAQAAAAEAIAwDAACiBQAg-wIAAIkGADD8AgAAAwAQ_QIAAIkGADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGPA0AA8QQAIZADQADxBAAhmgMBAPAEACGbAwEAhwUAIZwDAQCHBQAhAwMAAPkIACCbAwAAlgYAIJwDAACWBgAgDAMAAKIFACD7AgAAiQYAMPwCAAADABD9AgAAiQYAMP4CAQAAAAH_AgEA8AQAIYEDQADxBAAhjwNAAPEEACGQA0AA8QQAIZoDAQAAAAGbAwEAhwUAIZwDAQCHBQAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACiBQAg-wIAAIgGADD8AgAABwAQ_QIAAIgGADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZEDAQDwBAAhkgMBAPAEACGTAwEAhwUAIZQDAQCHBQAhlQMBAIcFACGWA0AAigUAIZcDQACKBQAhmAMBAIcFACGZAwEAhwUAIQgDAAD5CAAgkwMAAJYGACCUAwAAlgYAIJUDAACWBgAglgMAAJYGACCXAwAAlgYAIJgDAACWBgAgmQMAAJYGACARAwAAogUAIPsCAACIBgAw_AIAAAcAEP0CAACIBgAw_gIBAAAAAf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZEDAQDwBAAhkgMBAPAEACGTAwEAhwUAIZQDAQCHBQAhlQMBAIcFACGWA0AAigUAIZcDQACKBQAhmAMBAIcFACGZAwEAhwUAIQMAAAAHACABAAAIADACAAAJACARAwAAogUAIAYAAOEFACAOAACHBgAgEAAAjgUAIB8AAPIFACAgAACNBQAg-wIAAIUGADD8AgAACwAQ_QIAAIUGADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIaQDAACGBucDIrQDAQDwBAAh4wMBAPAEACHlAwEAhwUAIQcDAAD5CAAgBgAA3goAIA4AAOEKACAQAADqCAAgHwAA4goAICAAAOkIACDlAwAAlgYAIBEDAACiBQAgBgAA4QUAIA4AAIcGACAQAACOBQAgHwAA8gUAICAAAI0FACD7AgAAhQYAMPwCAAALABD9AgAAhQYAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGkAwAAhgbnAyK0AwEA8AQAIeMDAQDwBAAh5QMBAIcFACEDAAAACwAgAQAADAAwAgAADQAgDQYAAIQGACD7AgAAgwYAMPwCAAAPABD9AgAAgwYAMP4CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZ0DAQDwBAAhoAMBAIcFACHBAwEA8AQAIcIDAQCHBQAhxgMgAIYFACHHAyAAhgUAIQMGAADmCgAgoAMAAJYGACDCAwAAlgYAIA0GAACEBgAg-wIAAIMGADD8AgAADwAQ_QIAAIMGADD-AgEAAAABgQNAAPEEACGQA0AA8QQAIZ0DAQAAAAGgAwEAhwUAIcEDAQAAAAHCAwEAhwUAIcYDIACGBQAhxwMgAIYFACEDAAAADwAgAQAAEAAwAgAAEQAgJQgAAIEGACALAAC5BQAgDAAAjwUAIA0AAJEFACAQAACOBQAgEQAAjQUAIBUAAJMFACAWAACUBQAgHAAAlgUAIB0AAIIGACAeAACXBQAg-wIAAPwFADD8AgAAEwAQ_QIAAPwFADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACHBAwEA8AQAIcUDAQDwBAAhxgMgAIYFACHHAyAAhgUAIdEDAQDwBAAh0gMBAPAEACHTAwIA9gUAIdQDAQDwBAAh1QMBAIcFACHWAwEAhwUAIdcDAQCHBQAh2AMBAIcFACHZAxAA_QUAIdoDEAD9BQAh2wMCAP4FACHcAwIA_gUAId4DAAD_Bd4DIt8DCACABgAh4AMCAPYFACHhAwIA9gUAIRQIAADkCgAgCwAApwkAIAwAAOsIACANAADtCAAgEAAA6ggAIBEAAOkIACAVAADvCAAgFgAA8AgAIBwAAPIIACAdAADlCgAgHgAA8wgAINUDAACWBgAg1gMAAJYGACDXAwAAlgYAINgDAACWBgAg2QMAAJYGACDaAwAAlgYAINsDAACWBgAg3AMAAJYGACDfAwAAlgYAICYIAACBBgAgCwAAuQUAIAwAAI8FACANAACRBQAgEAAAjgUAIBEAAI0FACAVAACTBQAgFgAAlAUAIBwAAJYFACAdAACCBgAgHgAAlwUAIPsCAAD8BQAw_AIAABMAEP0CAAD8BQAw_gIBAAAAAYEDQADxBAAhkANAAPEEACHBAwEAAAABxQMBAPAEACHGAyAAhgUAIccDIACGBQAh0QMBAPAEACHSAwEA8AQAIdMDAgD2BQAh1AMBAPAEACHVAwEAhwUAIdYDAQCHBQAh1wMBAIcFACHYAwEAhwUAIdkDEAD9BQAh2gMQAP0FACHbAwIA_gUAIdwDAgD-BQAh3gMAAP8F3gMi3wMIAIAGACHgAwIA9gUAIeEDAgD2BQAh7QMAAPsFACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABMAIAgGAADhBQAgCgAA-gUAIPsCAAD5BQAw_AIAABgAEP0CAAD5BQAw_gIBAPAEACGAAwEA8AQAIdADAQDwBAAhAgYAAN4KACAKAADjCgAgCQYAAOEFACAKAAD6BQAg-wIAAPkFADD8AgAAGAAQ_QIAAPkFADD-AgEAAAABgAMBAPAEACHQAwEA8AQAIewDAAD4BQAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACABAAAAGAAgEQMAAKIFACAGAADhBQAgEAAAjgUAIBEAAI0FACD7AgAA9QUAMPwCAAAeABD9AgAA9QUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAA9wW4AyKzAwIA9gUAIbQDAQDwBAAhtQMAAKYFACC2AyAAhgUAIQQDAAD5CAAgBgAA3goAIBAAAOoIACARAADpCAAgEQMAAKIFACAGAADhBQAgEAAAjgUAIBEAAI0FACD7AgAA9QUAMPwCAAAeABD9AgAA9QUAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGQA0AA8QQAIaQDAAD3BbgDIrMDAgD2BQAhtAMBAPAEACG1AwAApgUAILYDIACGBQAhAwAAAB4AIAEAAB8AMAIAACAAIAkDAACiBQAgBgAA4QUAIPsCAAD0BQAw_AIAACIAEP0CAAD0BQAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACECAwAA-QgAIAYAAN4KACAKAwAAogUAIAYAAOEFACD7AgAA9AUAMPwCAAAiABD9AgAA9AUAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACHpAwAA8wUAIAMAAAAiACABAAAjADACAAAkACAOAwAAogUAIAYAAOEFACAOAADxBQAgDwAA8gUAIPsCAADvBQAw_AIAACYAEP0CAADvBQAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACHFAwAA8AXjAyLjAwEAhwUAIeQDAQCHBQAhBgMAAPkIACAGAADeCgAgDgAA4QoAIA8AAOIKACDjAwAAlgYAIOQDAACWBgAgDwMAAKIFACAGAADhBQAgDgAA8QUAIA8AAPIFACD7AgAA7wUAMPwCAAAmABD9AgAA7wUAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACHFAwAA8AXjAyLjAwEAhwUAIeQDAQCHBQAh6wMAAO4FACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAAB4AIAEAAAALACADAAAACwAgAQAADAAwAgAADQAgDAMAAKIFACAGAADhBQAgEgAAkgUAIPsCAADtBQAw_AIAAC0AEP0CAADtBQAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGQA0AA8QQAIb0DAQCHBQAhBAMAAPkIACAGAADeCgAgEgAA7ggAIL0DAACWBgAgDAMAAKIFACAGAADhBQAgEgAAkgUAIPsCAADtBQAw_AIAAC0AEP0CAADtBQAw_gIBAAAAAf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIZADQADxBAAhvQMBAIcFACEDAAAALQAgAQAALgAwAgAALwAgEAMAAKIFACATAACUBQAgFAAAkwUAIPsCAAC2BQAw_AIAADEAEP0CAAC2BQAw_gIBAPAEACH_AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEAhwUAIZ4DAQCHBQAhoAMBAIcFACG-AwEAhwUAIb8DAQCHBQAhwAMBAIcFACEBAAAAMQAgDAMAAKIFACAGAADhBQAgEgAAkgUAIPsCAADsBQAw_AIAADMAEP0CAADsBQAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGQA0AA8QQAIb0DAQCHBQAhBAMAAPkIACAGAADeCgAgEgAA7ggAIL0DAACWBgAgDAMAAKIFACAGAADhBQAgEgAAkgUAIPsCAADsBQAw_AIAADMAEP0CAADsBQAw_gIBAAAAAf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIZADQADxBAAhvQMBAIcFACEDAAAAMwAgAQAANAAwAgAANQAgAQAAADEAIAMAAAAtACABAAAuADACAAAvACABAAAAMwAgAQAAAC0AIAMAAAAzACABAAA0ADACAAA1ACARAwAAogUAIAYAAOEFACAbAADrBQAg-wIAAOgFADD8AgAAPAAQ_QIAAOgFADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIY8DQACKBQAhkANAAPEEACGkAwAA6gXPAyK8AxAA4AUAIcUDAADpBc4DIssDAQCHBQAhzwMBAIcFACEGAwAA-QgAIAYAAN4KACAbAADgCgAgjwMAAJYGACDLAwAAlgYAIM8DAACWBgAgEgMAAKIFACAGAADhBQAgGwAA6wUAIPsCAADoBQAw_AIAADwAEP0CAADoBQAw_gIBAAAAAf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIY8DQACKBQAhkANAAPEEACGkAwAA6gXPAyK8AxAA4AUAIcUDAADpBc4DIssDAQCHBQAhzwMBAIcFACHqAwAA5wUAIAMAAAA8ACABAAA9ADACAAA-ACAOGAAA5QUAIBkAAOYFACAaAACWBQAg-wIAAOMFADD8AgAAQAAQ_QIAAOMFADD-AgEA8AQAIYEDQADxBAAhpAMBAPAEACHIAwEA8AQAIckDCADkBQAhygMBAPAEACHLAwEAhwUAIcwDAQCHBQAhAQAAAEAAIAUYAADsCAAgGQAA3woAIBoAAPIIACDLAwAAlgYAIMwDAACWBgAgDhgAAOUFACAZAADmBQAgGgAAlgUAIPsCAADjBQAw_AIAAEAAEP0CAADjBQAw_gIBAAAAAYEDQADxBAAhpAMBAPAEACHIAwEA8AQAIckDCADkBQAhygMBAPAEACHLAwEAAAABzAMBAIcFACEDAAAAQAAgAQAAQgAwAgAAQwAgAQAAAEAAIA4DAACiBQAgBgAA4QUAIBcAAKMFACD7AgAA3gUAMPwCAABGABD9AgAA3gUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhjwNAAPEEACGQA0AA8QQAIaQDAADfBbwDIrwDEADgBQAhAQAAAEYAIAMAAABAACABAABCADACAABDACABAAAAQAAgAwAAADwAIAEAAD0AMAIAAD4AIAEAAAA8ACAJBgAA4QUAIPsCAADiBQAw_AIAAEwAEP0CAADiBQAw_gIBAPAEACGAAwEA8AQAIZ0DAQDwBAAhoAMBAIcFACGiAwEA8AQAIQIGAADeCgAgoAMAAJYGACAJBgAA4QUAIPsCAADiBQAw_AIAAEwAEP0CAADiBQAw_gIBAAAAAYADAQDwBAAhnQMBAPAEACGgAwEAhwUAIaIDAQDwBAAhAwAAAEwAIAEAAE0AMAIAAE4AIAMDAAD5CAAgBgAA3goAIBcAAPoIACAPAwAAogUAIAYAAOEFACAXAACjBQAg-wIAAN4FADD8AgAARgAQ_QIAAN4FADD-AgEAAAAB_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhjwNAAPEEACGQA0AA8QQAIaQDAADfBbwDIrwDEADgBQAh6QMAAN0FACADAAAARgAgAQAAUAAwAgAAUQAgAQAAAA8AIAEAAAAYACABAAAAHgAgAQAAACIAIAEAAAAmACABAAAACwAgAQAAAC0AIAEAAAAzACABAAAAPAAgAQAAAEwAIAEAAABGACADAAAACwAgAQAADAAwAgAADQAgAwAAACYAIAEAACcAMAIAACgAIAEAAAALACABAAAAJgAgAQAAAAsAIAMAAAALACABAAAMADACAAANACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAAAsAIAEAAAAmACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAB4AIAEAAB8AMAIAACAAIBADAACiBQAgFwAAowUAIPsCAACfBQAw_AIAAGkAEP0CAACfBQAw_gIBAPAEACH_AgEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAAoQWuAyKsAwAAoAWsAyKuAwEAhwUAIa8DAQCHBQAhsANAAIoFACGxA0AAigUAIbIDIACGBQAhAQAAAGkAIAMAAAAiACABAAAjADACAAAkACABAAAAMQAgAwAAAC0AIAEAAC4AMAIAAC8AIAMAAAAzACABAAA0ADACAAA1ACAOAwAAogUAIPsCAADcBQAw_AIAAG8AEP0CAADcBQAw_gIBAPAEACH_AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEA8AQAIZ4DAQDwBAAhpgMgAIYFACGnA0AAigUAIecDAQCHBQAh6AMBAIcFACEBAAAAbwAgAwAAADwAIAEAAD0AMAIAAD4AIAMAAABGACABAABQADACAABRACABAAAAAwAgAQAAAAcAIAEAAAALACABAAAAJgAgAQAAAB4AIAEAAAAiACABAAAALQAgAQAAADMAIAEAAAA8ACABAAAARgAgAQAAAAEAIAQDAAD5CAAgpwMAAJYGACDnAwAAlgYAIOgDAACWBgAgAwAAAG8AIAEAAH4AMAIAAAEAIAMAAABvACABAAB-ADACAAABACADAAAAbwAgAQAAfgAwAgAAAQAgCwMAAN0KACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGmAyAAAAABpwNAAAAAAecDAQAAAAHoAwEAAAABASgAAIIBACAK_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAZ0DAQAAAAGeAwEAAAABpgMgAAAAAacDQAAAAAHnAwEAAAAB6AMBAAAAAQEoAACEAQAwASgAAIQBADALAwAA3AoAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIaYDIACmBgAhpwNAAJsGACHnAwEAmgYAIegDAQCaBgAhAgAAAAEAICgAAIcBACAK_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAjQYAIZ4DAQCNBgAhpgMgAKYGACGnA0AAmwYAIecDAQCaBgAh6AMBAJoGACECAAAAbwAgKAAAiQEAIAIAAABvACAoAACJAQAgAwAAAAEAIC8AAIIBACAwAACHAQAgAQAAAAEAIAEAAABvACAGBwAA2QoAIDUAANsKACA2AADaCgAgpwMAAJYGACDnAwAAlgYAIOgDAACWBgAgDfsCAADbBQAw_AIAAJABABD9AgAA2wUAMP4CAQDnBAAh_wIBAOcEACGBA0AA6AQAIZADQADoBAAhnQMBAOcEACGeAwEA5wQAIaYDIAD8BAAhpwNAAPQEACHnAwEA8wQAIegDAQDzBAAhAwAAAG8AIAEAAI8BADA0AACQAQAgAwAAAG8AIAEAAH4AMAIAAAEAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgDgMAAKQIACAGAACnCAAgDgAApQgAIBAAAKgIACAfAACqCAAgIAAApggAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGkAwAAAOcDArQDAQAAAAHjAwEAAAAB5QMBAAAAAQEoAACYAQAgCP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGkAwAAAOcDArQDAQAAAAHjAwEAAAAB5QMBAAAAAQEoAACaAQAwASgAAJoBADABAAAACwAgDgMAAIoIACAGAACNCAAgDgAAoggAIBAAAI4IACAfAACLCAAgIAAAjAgAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhpAMAAIgI5wMitAMBAI0GACHjAwEAjQYAIeUDAQCaBgAhAgAAAA0AICgAAJ4BACAI_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGkAwAAiAjnAyK0AwEAjQYAIeMDAQCNBgAh5QMBAJoGACECAAAACwAgKAAAoAEAIAIAAAALACAoAACgAQAgAQAAAAsAIAMAAAANACAvAACYAQAgMAAAngEAIAEAAAANACABAAAACwAgBAcAANYKACA1AADYCgAgNgAA1woAIOUDAACWBgAgC_sCAADXBQAw_AIAAKgBABD9AgAA1wUAMP4CAQDnBAAh_wIBAOcEACGAAwEA5wQAIYEDQADoBAAhpAMAANgF5wMitAMBAOcEACHjAwEA5wQAIeUDAQDzBAAhAwAAAAsAIAEAAKcBADA0AACoAQAgAwAAAAsAIAEAAAwAMAIAAA0AIAEAAAAoACABAAAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgCwMAAPsHACAGAAD8BwAgDgAAmQgAIA8AAP0HACD-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABxQMAAADjAwLjAwEAAAAB5AMBAAAAAQEoAACwAQAgB_4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAHFAwAAAOMDAuMDAQAAAAHkAwEAAAABASgAALIBADABKAAAsgEAMAEAAAAeACABAAAACwAgCwMAAPcHACAGAAD4BwAgDgAAlwgAIA8AAPkHACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIcUDAAD1B-MDIuMDAQCaBgAh5AMBAJoGACECAAAAKAAgKAAAtwEAIAf-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIcUDAAD1B-MDIuMDAQCaBgAh5AMBAJoGACECAAAAJgAgKAAAuQEAIAIAAAAmACAoAAC5AQAgAQAAAB4AIAEAAAALACADAAAAKAAgLwAAsAEAIDAAALcBACABAAAAKAAgAQAAACYAIAUHAADTCgAgNQAA1QoAIDYAANQKACDjAwAAlgYAIOQDAACWBgAgCvsCAADTBQAw_AIAAMIBABD9AgAA0wUAMP4CAQDnBAAh_wIBAOcEACGAAwEA5wQAIYEDQADoBAAhxQMAANQF4wMi4wMBAPMEACHkAwEA8wQAIQMAAAAmACABAADBAQAwNAAAwgEAIAMAAAAmACABAAAnADACAAAoACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAoGAADSCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAaADAQAAAAHBAwEAAAABwgMBAAAAAcYDIAAAAAHHAyAAAAABASgAAMoBACAJ_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAaADAQAAAAHBAwEAAAABwgMBAAAAAcYDIAAAAAHHAyAAAAABASgAAMwBADABKAAAzAEAMAoGAADGCgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGgAwEAmgYAIcEDAQCNBgAhwgMBAJoGACHGAyAApgYAIccDIACmBgAhAgAAABEAICgAAM8BACAJ_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGgAwEAmgYAIcEDAQCNBgAhwgMBAJoGACHGAyAApgYAIccDIACmBgAhAgAAAA8AICgAANEBACACAAAADwAgKAAA0QEAIAMAAAARACAvAADKAQAgMAAAzwEAIAEAAAARACABAAAADwAgBQcAAMMKACA1AADFCgAgNgAAxAoAIKADAACWBgAgwgMAAJYGACAM-wIAANIFADD8AgAA2AEAEP0CAADSBQAw_gIBAOcEACGBA0AA6AQAIZADQADoBAAhnQMBAOcEACGgAwEA8wQAIcEDAQDnBAAhwgMBAPMEACHGAyAA_AQAIccDIAD8BAAhAwAAAA8AIAEAANcBADA0AADYAQAgAwAAAA8AIAEAABAAMAIAABEAIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgIggAALgKACALAAC5CgAgDAAAugoAIA0AALsKACAQAAC8CgAgEQAAvQoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABASgAAOABACAX_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABASgAAOIBADABKAAA4gEAMCIIAADFCQAgCwAAxgkAIAwAAMcJACANAADICQAgEAAAyQkAIBEAAMoJACAVAADLCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgHgAAzwkAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhAgAAABUAICgAAOUBACAX_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACECAAAAEwAgKAAA5wEAIAIAAAATACAoAADnAQAgAwAAABUAIC8AAOABACAwAADlAQAgAQAAABUAIAEAAAATACAOBwAAvAkAIDUAAL8JACA2AAC-CQAgdwAAvQkAIHgAAMAJACDVAwAAlgYAINYDAACWBgAg1wMAAJYGACDYAwAAlgYAINkDAACWBgAg2gMAAJYGACDbAwAAlgYAINwDAACWBgAg3wMAAJYGACAa-wIAAMYFADD8AgAA7gEAEP0CAADGBQAw_gIBAOcEACGBA0AA6AQAIZADQADoBAAhwQMBAOcEACHFAwEA5wQAIcYDIAD8BAAhxwMgAPwEACHRAwEA5wQAIdIDAQDnBAAh0wMCAKUFACHUAwEA5wQAIdUDAQDzBAAh1gMBAPMEACHXAwEA8wQAIdgDAQDzBAAh2QMQAMcFACHaAxAAxwUAIdsDAgDIBQAh3AMCAMgFACHeAwAAyQXeAyLfAwgAygUAIeADAgClBQAh4QMCAKUFACEDAAAAEwAgAQAA7QEAMDQAAO4BACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAAE4AIAEAAABOACADAAAATAAgAQAATQAwAgAATgAgAwAAAEwAIAEAAE0AMAIAAE4AIAMAAABMACABAABNADACAABOACAGBgAAuwkAIP4CAQAAAAGAAwEAAAABnQMBAAAAAaADAQAAAAGiAwEAAAABASgAAPYBACAF_gIBAAAAAYADAQAAAAGdAwEAAAABoAMBAAAAAaIDAQAAAAEBKAAA-AEAMAEoAAD4AQAwBgYAALoJACD-AgEAjQYAIYADAQCNBgAhnQMBAI0GACGgAwEAmgYAIaIDAQCNBgAhAgAAAE4AICgAAPsBACAF_gIBAI0GACGAAwEAjQYAIZ0DAQCNBgAhoAMBAJoGACGiAwEAjQYAIQIAAABMACAoAAD9AQAgAgAAAEwAICgAAP0BACADAAAATgAgLwAA9gEAIDAAAPsBACABAAAATgAgAQAAAEwAIAQHAAC3CQAgNQAAuQkAIDYAALgJACCgAwAAlgYAIAj7AgAAxQUAMPwCAACEAgAQ_QIAAMUFADD-AgEA5wQAIYADAQDnBAAhnQMBAOcEACGgAwEA8wQAIaIDAQDnBAAhAwAAAEwAIAEAAIMCADA0AACEAgAgAwAAAEwAIAEAAE0AMAIAAE4AIAEAAAAaACABAAAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgBQYAAKUJACAKAAC2CQAg_gIBAAAAAYADAQAAAAHQAwEAAAABASgAAIwCACAD_gIBAAAAAYADAQAAAAHQAwEAAAABASgAAI4CADABKAAAjgIAMAUGAACjCQAgCgAAtQkAIP4CAQCNBgAhgAMBAI0GACHQAwEAjQYAIQIAAAAaACAoAACRAgAgA_4CAQCNBgAhgAMBAI0GACHQAwEAjQYAIQIAAAAYACAoAACTAgAgAgAAABgAICgAAJMCACADAAAAGgAgLwAAjAIAIDAAAJECACABAAAAGgAgAQAAABgAIAMHAACyCQAgNQAAtAkAIDYAALMJACAG-wIAAMQFADD8AgAAmgIAEP0CAADEBQAw_gIBAOcEACGAAwEA5wQAIdADAQDnBAAhAwAAABgAIAEAAJkCADA0AACaAgAgAwAAABgAIAEAABkAMAIAABoAIAEAAAA-ACABAAAAPgAgAwAAADwAIAEAAD0AMAIAAD4AIAMAAAA8ACABAAA9ADACAAA-ACADAAAAPAAgAQAAPQAwAgAAPgAgDgMAAOMGACAGAADkBgAgGwAA9QYAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAzwMCvAMQAAAAAcUDAAAAzgMCywMBAAAAAc8DAQAAAAEBKAAAogIAIAv-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAAM8DArwDEAAAAAHFAwAAAM4DAssDAQAAAAHPAwEAAAABASgAAKQCADABKAAApAIAMAEAAABAACAOAwAA4AYAIAYAAOEGACAbAADzBgAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGPA0AAmwYAIZADQACOBgAhpAMAAN4GzwMivAMQAMEGACHFAwAA3QbOAyLLAwEAmgYAIc8DAQCaBgAhAgAAAD4AICgAAKgCACAL_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGPA0AAmwYAIZADQACOBgAhpAMAAN4GzwMivAMQAMEGACHFAwAA3QbOAyLLAwEAmgYAIc8DAQCaBgAhAgAAADwAICgAAKoCACACAAAAPAAgKAAAqgIAIAEAAABAACADAAAAPgAgLwAAogIAIDAAAKgCACABAAAAPgAgAQAAADwAIAgHAACtCQAgNQAAsAkAIDYAAK8JACB3AACuCQAgeAAAsQkAII8DAACWBgAgywMAAJYGACDPAwAAlgYAIA77AgAAvQUAMPwCAACyAgAQ_QIAAL0FADD-AgEA5wQAIf8CAQDnBAAhgAMBAOcEACGBA0AA6AQAIY8DQAD0BAAhkANAAOgEACGkAwAAvwXPAyK8AxAArgUAIcUDAAC-Bc4DIssDAQDzBAAhzwMBAPMEACEDAAAAPAAgAQAAsQIAMDQAALICACADAAAAPAAgAQAAPQAwAgAAPgAgAQAAAEMAIAEAAABDACADAAAAQAAgAQAAQgAwAgAAQwAgAwAAAEAAIAEAAEIAMAIAAEMAIAMAAABAACABAABCADACAABDACALGAAA5gYAIBkAANgHACAaAADnBgAg_gIBAAAAAYEDQAAAAAGkAwEAAAAByAMBAAAAAckDCAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAEBKAAAugIAIAj-AgEAAAABgQNAAAAAAaQDAQAAAAHIAwEAAAAByQMIAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAQEoAAC8AgAwASgAALwCADABAAAARgAgCxgAANEGACAZAADWBwAgGgAA0gYAIP4CAQCNBgAhgQNAAI4GACGkAwEAjQYAIcgDAQCNBgAhyQMIAM8GACHKAwEAjQYAIcsDAQCaBgAhzAMBAJoGACECAAAAQwAgKAAAwAIAIAj-AgEAjQYAIYEDQACOBgAhpAMBAI0GACHIAwEAjQYAIckDCADPBgAhygMBAI0GACHLAwEAmgYAIcwDAQCaBgAhAgAAAEAAICgAAMICACACAAAAQAAgKAAAwgIAIAEAAABGACADAAAAQwAgLwAAugIAIDAAAMACACABAAAAQwAgAQAAAEAAIAcHAACoCQAgNQAAqwkAIDYAAKoJACB3AACpCQAgeAAArAkAIMsDAACWBgAgzAMAAJYGACAL-wIAALoFADD8AgAAygIAEP0CAAC6BQAw_gIBAOcEACGBA0AA6AQAIaQDAQDnBAAhyAMBAOcEACHJAwgAuwUAIcoDAQDnBAAhywMBAPMEACHMAwEA8wQAIQMAAABAACABAADJAgAwNAAAygIAIAMAAABAACABAABCADACAABDACAPCQAAuQUAIPsCAAC4BQAw_AIAANACABD9AgAAuAUAMP4CAQAAAAGBA0AA8QQAIZADQADxBAAhnQMBAAAAAcEDAQAAAAHCAwEAhwUAIcMDAQCHBQAhxAMBAIcFACHFAwEAhwUAIcYDIACGBQAhxwMgAIYFACEBAAAAzQIAIAEAAADNAgAgDwkAALkFACD7AgAAuAUAMPwCAADQAgAQ_QIAALgFADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEA8AQAIcEDAQDwBAAhwgMBAIcFACHDAwEAhwUAIcQDAQCHBQAhxQMBAIcFACHGAyAAhgUAIccDIACGBQAhBQkAAKcJACDCAwAAlgYAIMMDAACWBgAgxAMAAJYGACDFAwAAlgYAIAMAAADQAgAgAQAA0QIAMAIAAM0CACADAAAA0AIAIAEAANECADACAADNAgAgAwAAANACACABAADRAgAwAgAAzQIAIAwJAACmCQAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAcEDAQAAAAHCAwEAAAABwwMBAAAAAcQDAQAAAAHFAwEAAAABxgMgAAAAAccDIAAAAAEBKAAA1QIAIAv-AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABwQMBAAAAAcIDAQAAAAHDAwEAAAABxAMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAQEoAADXAgAwASgAANcCADAMCQAAlwkAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCNBgAhwQMBAI0GACHCAwEAmgYAIcMDAQCaBgAhxAMBAJoGACHFAwEAmgYAIcYDIACmBgAhxwMgAKYGACECAAAAzQIAICgAANoCACAL_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACHBAwEAjQYAIcIDAQCaBgAhwwMBAJoGACHEAwEAmgYAIcUDAQCaBgAhxgMgAKYGACHHAyAApgYAIQIAAADQAgAgKAAA3AIAIAIAAADQAgAgKAAA3AIAIAMAAADNAgAgLwAA1QIAIDAAANoCACABAAAAzQIAIAEAAADQAgAgBwcAAJQJACA1AACWCQAgNgAAlQkAIMIDAACWBgAgwwMAAJYGACDEAwAAlgYAIMUDAACWBgAgDvsCAAC3BQAw_AIAAOMCABD9AgAAtwUAMP4CAQDnBAAhgQNAAOgEACGQA0AA6AQAIZ0DAQDnBAAhwQMBAOcEACHCAwEA8wQAIcMDAQDzBAAhxAMBAPMEACHFAwEA8wQAIcYDIAD8BAAhxwMgAPwEACEDAAAA0AIAIAEAAOICADA0AADjAgAgAwAAANACACABAADRAgAwAgAAzQIAIBADAACiBQAgEwAAlAUAIBQAAJMFACD7AgAAtgUAMPwCAAAxABD9AgAAtgUAMP4CAQAAAAH_AgEAAAABgQNAAPEEACGQA0AA8QQAIZ0DAQCHBQAhngMBAIcFACGgAwEAhwUAIb4DAQCHBQAhvwMBAIcFACHAAwEAhwUAIQEAAADmAgAgAQAAAOYCACAJAwAA-QgAIBMAAPAIACAUAADvCAAgnQMAAJYGACCeAwAAlgYAIKADAACWBgAgvgMAAJYGACC_AwAAlgYAIMADAACWBgAgAwAAADEAIAEAAOkCADACAADmAgAgAwAAADEAIAEAAOkCADACAADmAgAgAwAAADEAIAEAAOkCADACAADmAgAgDQMAAJMJACATAAC4BwAgFAAAuQcAIP4CAQAAAAH_AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABngMBAAAAAaADAQAAAAG-AwEAAAABvwMBAAAAAcADAQAAAAEBKAAA7QIAIAr-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGgAwEAAAABvgMBAAAAAb8DAQAAAAHAAwEAAAABASgAAO8CADABKAAA7wIAMA0DAACSCQAgEwAAoAcAIBQAAKEHACD-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCaBgAhngMBAJoGACGgAwEAmgYAIb4DAQCaBgAhvwMBAJoGACHAAwEAmgYAIQIAAADmAgAgKAAA8gIAIAr-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCaBgAhngMBAJoGACGgAwEAmgYAIb4DAQCaBgAhvwMBAJoGACHAAwEAmgYAIQIAAAAxACAoAAD0AgAgAgAAADEAICgAAPQCACADAAAA5gIAIC8AAO0CACAwAADyAgAgAQAAAOYCACABAAAAMQAgCQcAAI8JACA1AACRCQAgNgAAkAkAIJ0DAACWBgAgngMAAJYGACCgAwAAlgYAIL4DAACWBgAgvwMAAJYGACDAAwAAlgYAIA37AgAAtQUAMPwCAAD7AgAQ_QIAALUFADD-AgEA5wQAIf8CAQDnBAAhgQNAAOgEACGQA0AA6AQAIZ0DAQDzBAAhngMBAPMEACGgAwEA8wQAIb4DAQDzBAAhvwMBAPMEACHAAwEA8wQAIQMAAAAxACABAAD6AgAwNAAA-wIAIAMAAAAxACABAADpAgAwAgAA5gIAIAEAAAAvACABAAAALwAgAwAAAC0AIAEAAC4AMAIAAC8AIAMAAAAtACABAAAuADACAAAvACADAAAALQAgAQAALgAwAgAALwAgCQMAAKwHACAGAACZBwAgEgAAmgcAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQEoAACDAwAgBv4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQEoAACFAwAwASgAAIUDADABAAAAMQAgCQMAAKoHACAGAACWBwAgEgAAlwcAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQIAAAAvACAoAACJAwAgBv4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQIAAAAtACAoAACLAwAgAgAAAC0AICgAAIsDACABAAAAMQAgAwAAAC8AIC8AAIMDACAwAACJAwAgAQAAAC8AIAEAAAAtACAEBwAAjAkAIDUAAI4JACA2AACNCQAgvQMAAJYGACAJ-wIAALQFADD8AgAAkwMAEP0CAAC0BQAw_gIBAOcEACH_AgEA5wQAIYADAQDnBAAhgQNAAOgEACGQA0AA6AQAIb0DAQDzBAAhAwAAAC0AIAEAAJIDADA0AACTAwAgAwAAAC0AIAEAAC4AMAIAAC8AIAEAAAA1ACABAAAANQAgAwAAADMAIAEAADQAMAIAADUAIAMAAAAzACABAAA0ADACAAA1ACADAAAAMwAgAQAANAAwAgAANQAgCQMAALcHACAGAACJBwAgEgAAigcAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQEoAACbAwAgBv4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQEoAACdAwAwASgAAJ0DADABAAAAMQAgCQMAALUHACAGAACGBwAgEgAAhwcAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQIAAAA1ACAoAAChAwAgBv4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQIAAAAzACAoAACjAwAgAgAAADMAICgAAKMDACABAAAAMQAgAwAAADUAIC8AAJsDACAwAAChAwAgAQAAADUAIAEAAAAzACAEBwAAiQkAIDUAAIsJACA2AACKCQAgvQMAAJYGACAJ-wIAALMFADD8AgAAqwMAEP0CAACzBQAw_gIBAOcEACH_AgEA5wQAIYADAQDnBAAhgQNAAOgEACGQA0AA6AQAIb0DAQDzBAAhAwAAADMAIAEAAKoDADA0AACrAwAgAwAAADMAIAEAADQAMAIAADUAIAEAAABRACABAAAAUQAgAwAAAEYAIAEAAFAAMAIAAFEAIAMAAABGACABAABQADACAABRACADAAAARgAgAQAAUAAwAgAAUQAgCwMAAIgJACAGAADpBgAgFwAA6gYAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAvAMCvAMQAAAAAQEoAACzAwAgCP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAvAMCvAMQAAAAAQEoAAC1AwAwASgAALUDADALAwAAhwkAIAYAAMMGACAXAADEBgAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGPA0AAjgYAIZADQACOBgAhpAMAAMAGvAMivAMQAMEGACECAAAAUQAgKAAAuAMAIAj-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIY8DQACOBgAhkANAAI4GACGkAwAAwAa8AyK8AxAAwQYAIQIAAABGACAoAAC6AwAgAgAAAEYAICgAALoDACADAAAAUQAgLwAAswMAIDAAALgDACABAAAAUQAgAQAAAEYAIAUHAACCCQAgNQAAhQkAIDYAAIQJACB3AACDCQAgeAAAhgkAIAv7AgAArAUAMPwCAADBAwAQ_QIAAKwFADD-AgEA5wQAIf8CAQDnBAAhgAMBAOcEACGBA0AA6AQAIY8DQADoBAAhkANAAOgEACGkAwAArQW8AyK8AxAArgUAIQMAAABGACABAADAAwAwNAAAwQMAIAMAAABGACABAABQADACAABRACABAAAAIAAgAQAAACAAIAMAAAAeACABAAAfADACAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIA4DAACBCQAgBgAArQgAIBAAAK8IACARAACuCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAGkAwAAALgDArMDAgAAAAG0AwEAAAABtQMAAKwIACC2AyAAAAABASgAAMkDACAK_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAGkAwAAALgDArMDAgAAAAG0AwEAAAABtQMAAKwIACC2AyAAAAABASgAAMsDADABKAAAywMAMA4DAACACQAgBgAA6AcAIBAAAOoHACARAADpBwAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGQA0AAjgYAIaQDAADmB7gDIrMDAgDkBwAhtAMBAI0GACG1AwAA5QcAILYDIACmBgAhAgAAACAAICgAAM4DACAK_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGQA0AAjgYAIaQDAADmB7gDIrMDAgDkBwAhtAMBAI0GACG1AwAA5QcAILYDIACmBgAhAgAAAB4AICgAANADACACAAAAHgAgKAAA0AMAIAMAAAAgACAvAADJAwAgMAAAzgMAIAEAAAAgACABAAAAHgAgBQcAAPsIACA1AAD-CAAgNgAA_QgAIHcAAPwIACB4AAD_CAAgDfsCAACkBQAw_AIAANcDABD9AgAApAUAMP4CAQDnBAAh_wIBAOcEACGAAwEA5wQAIYEDQADoBAAhkANAAOgEACGkAwAApwW4AyKzAwIApQUAIbQDAQDnBAAhtQMAAKYFACC2AyAA_AQAIQMAAAAeACABAADWAwAwNAAA1wMAIAMAAAAeACABAAAfADACAAAgACAQAwAAogUAIBcAAKMFACD7AgAAnwUAMPwCAABpABD9AgAAnwUAMP4CAQAAAAH_AgEAAAABgQNAAPEEACGQA0AA8QQAIaQDAAChBa4DIqwDAACgBawDIq4DAQAAAAGvAwEAhwUAIbADQACKBQAhsQNAAIoFACGyAyAAhgUAIQEAAADaAwAgAQAAANoDACAGAwAA-QgAIBcAAPoIACCuAwAAlgYAIK8DAACWBgAgsAMAAJYGACCxAwAAlgYAIAMAAABpACABAADdAwAwAgAA2gMAIAMAAABpACABAADdAwAwAgAA2gMAIAMAAABpACABAADdAwAwAgAA2gMAIA0DAAD4CAAgFwAA2QcAIP4CAQAAAAH_AgEAAAABgQNAAAAAAZADQAAAAAGkAwAAAK4DAqwDAAAArAMCrgMBAAAAAa8DAQAAAAGwA0AAAAABsQNAAAAAAbIDIAAAAAEBKAAA4QMAIAv-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABpAMAAACuAwKsAwAAAKwDAq4DAQAAAAGvAwEAAAABsANAAAAAAbEDQAAAAAGyAyAAAAABASgAAOMDADABKAAA4wMAMA0DAAD3CAAgFwAAzQcAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIZADQACOBgAhpAMAAMwHrgMirAMAAMsHrAMirgMBAJoGACGvAwEAmgYAIbADQACbBgAhsQNAAJsGACGyAyAApgYAIQIAAADaAwAgKAAA5gMAIAv-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIaQDAADMB64DIqwDAADLB6wDIq4DAQCaBgAhrwMBAJoGACGwA0AAmwYAIbEDQACbBgAhsgMgAKYGACECAAAAaQAgKAAA6AMAIAIAAABpACAoAADoAwAgAwAAANoDACAvAADhAwAgMAAA5gMAIAEAAADaAwAgAQAAAGkAIAcHAAD0CAAgNQAA9ggAIDYAAPUIACCuAwAAlgYAIK8DAACWBgAgsAMAAJYGACCxAwAAlgYAIA77AgAAmAUAMPwCAADvAwAQ_QIAAJgFADD-AgEA5wQAIf8CAQDnBAAhgQNAAOgEACGQA0AA6AQAIaQDAACaBa4DIqwDAACZBawDIq4DAQDzBAAhrwMBAPMEACGwA0AA9AQAIbEDQAD0BAAhsgMgAPwEACEDAAAAaQAgAQAA7gMAMDQAAO8DACADAAAAaQAgAQAA3QMAMAIAANoDACAcBAAAiwUAIAUAAIwFACAMAACPBQAgEAAAjgUAIBEAAI0FACASAACSBQAgFQAAkwUAIBYAAJQFACAYAACQBQAgHAAAlgUAIB4AAJcFACAhAACRBQAgIgAAlQUAIPsCAACFBQAw_AIAAPUDABD9AgAAhQUAMP4CAQAAAAGBA0AA8QQAIZADQADxBAAhnQMBAPAEACGeAwEAAAABnwMgAIYFACGgAwEAhwUAIaIDAACIBaIDIqQDAACJBaQDIqUDIACGBQAhpgMgAIYFACGnA0AAigUAIQEAAADyAwAgAQAAAPIDACAcBAAAiwUAIAUAAIwFACAMAACPBQAgEAAAjgUAIBEAAI0FACASAACSBQAgFQAAkwUAIBYAAJQFACAYAACQBQAgHAAAlgUAIB4AAJcFACAhAACRBQAgIgAAlQUAIPsCAACFBQAw_AIAAPUDABD9AgAAhQUAMP4CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZ0DAQDwBAAhngMBAPAEACGfAyAAhgUAIaADAQCHBQAhogMAAIgFogMipAMAAIkFpAMipQMgAIYFACGmAyAAhgUAIacDQACKBQAhDwQAAOcIACAFAADoCAAgDAAA6wgAIBAAAOoIACARAADpCAAgEgAA7ggAIBUAAO8IACAWAADwCAAgGAAA7AgAIBwAAPIIACAeAADzCAAgIQAA7QgAICIAAPEIACCgAwAAlgYAIKcDAACWBgAgAwAAAPUDACABAAD2AwAwAgAA8gMAIAMAAAD1AwAgAQAA9gMAMAIAAPIDACADAAAA9QMAIAEAAPYDADACAADyAwAgGQQAANoIACAFAADbCAAgDAAA3ggAIBAAAN0IACARAADcCAAgEgAA4QgAIBUAAOIIACAWAADjCAAgGAAA3wgAIBwAAOUIACAeAADmCAAgIQAA4AgAICIAAOQIACD-AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABngMBAAAAAZ8DIAAAAAGgAwEAAAABogMAAACiAwKkAwAAAKQDAqUDIAAAAAGmAyAAAAABpwNAAAAAAQEoAAD6AwAgDP4CAQAAAAGBA0AAAAABkANAAAAAAZ0DAQAAAAGeAwEAAAABnwMgAAAAAaADAQAAAAGiAwAAAKIDAqQDAAAApAMCpQMgAAAAAaYDIAAAAAGnA0AAAAABASgAAPwDADABKAAA_AMAMBkEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACECAAAA8gMAICgAAP8DACAM_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACECAAAA9QMAICgAAIEEACACAAAA9QMAICgAAIEEACADAAAA8gMAIC8AAPoDACAwAAD_AwAgAQAAAPIDACABAAAA9QMAIAUHAACjBgAgNQAApQYAIDYAAKQGACCgAwAAlgYAIKcDAACWBgAgD_sCAAD7BAAw_AIAAIgEABD9AgAA-wQAMP4CAQDnBAAhgQNAAOgEACGQA0AA6AQAIZ0DAQDnBAAhngMBAOcEACGfAyAA_AQAIaADAQDzBAAhogMAAP0EogMipAMAAP4EpAMipQMgAPwEACGmAyAA_AQAIacDQAD0BAAhAwAAAPUDACABAACHBAAwNAAAiAQAIAMAAAD1AwAgAQAA9gMAMAIAAPIDACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAACiBgAg_gIBAAAAAf8CAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGaAwEAAAABmwMBAAAAAZwDAQAAAAEBKAAAkAQAIAj-AgEAAAAB_wIBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAZoDAQAAAAGbAwEAAAABnAMBAAAAAQEoAACSBAAwASgAAJIEADAJAwAAoQYAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIY8DQACOBgAhkANAAI4GACGaAwEAjQYAIZsDAQCaBgAhnAMBAJoGACECAAAABQAgKAAAlQQAIAj-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGPA0AAjgYAIZADQACOBgAhmgMBAI0GACGbAwEAmgYAIZwDAQCaBgAhAgAAAAMAICgAAJcEACACAAAAAwAgKAAAlwQAIAMAAAAFACAvAACQBAAgMAAAlQQAIAEAAAAFACABAAAAAwAgBQcAAJ4GACA1AACgBgAgNgAAnwYAIJsDAACWBgAgnAMAAJYGACAL-wIAAPoEADD8AgAAngQAEP0CAAD6BAAw_gIBAOcEACH_AgEA5wQAIYEDQADoBAAhjwNAAOgEACGQA0AA6AQAIZoDAQDnBAAhmwMBAPMEACGcAwEA8wQAIQMAAAADACABAACdBAAwNAAAngQAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAACdBgAg_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAZEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgNAAAAAAZcDQAAAAAGYAwEAAAABmQMBAAAAAQEoAACmBAAgDf4CAQAAAAH_AgEAAAABgQNAAAAAAZADQAAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDQAAAAAGXA0AAAAABmAMBAAAAAZkDAQAAAAEBKAAAqAQAMAEoAACoBAAwDgMAAJwGACD-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZEDAQCNBgAhkgMBAI0GACGTAwEAmgYAIZQDAQCaBgAhlQMBAJoGACGWA0AAmwYAIZcDQACbBgAhmAMBAJoGACGZAwEAmgYAIQIAAAAJACAoAACrBAAgDf4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIZADQACOBgAhkQMBAI0GACGSAwEAjQYAIZMDAQCaBgAhlAMBAJoGACGVAwEAmgYAIZYDQACbBgAhlwNAAJsGACGYAwEAmgYAIZkDAQCaBgAhAgAAAAcAICgAAK0EACACAAAABwAgKAAArQQAIAMAAAAJACAvAACmBAAgMAAAqwQAIAEAAAAJACABAAAABwAgCgcAAJcGACA1AACZBgAgNgAAmAYAIJMDAACWBgAglAMAAJYGACCVAwAAlgYAIJYDAACWBgAglwMAAJYGACCYAwAAlgYAIJkDAACWBgAgEPsCAADyBAAw_AIAALQEABD9AgAA8gQAMP4CAQDnBAAh_wIBAOcEACGBA0AA6AQAIZADQADoBAAhkQMBAOcEACGSAwEA5wQAIZMDAQDzBAAhlAMBAPMEACGVAwEA8wQAIZYDQAD0BAAhlwNAAPQEACGYAwEA8wQAIZkDAQDzBAAhAwAAAAcAIAEAALMEADA0AAC0BAAgAwAAAAcAIAEAAAgAMAIAAAkAIAn7AgAA7wQAMPwCAAC6BAAQ_QIAAO8EADD-AgEAAAABgQNAAPEEACGNAwEA8AQAIY4DAQDwBAAhjwNAAPEEACGQA0AA8QQAIQEAAAC3BAAgAQAAALcEACAJ-wIAAO8EADD8AgAAugQAEP0CAADvBAAw_gIBAPAEACGBA0AA8QQAIY0DAQDwBAAhjgMBAPAEACGPA0AA8QQAIZADQADxBAAhAAMAAAC6BAAgAQAAuwQAMAIAALcEACADAAAAugQAIAEAALsEADACAAC3BAAgAwAAALoEACABAAC7BAAwAgAAtwQAIAb-AgEAAAABgQNAAAAAAY0DAQAAAAGOAwEAAAABjwNAAAAAAZADQAAAAAEBKAAAvwQAIAb-AgEAAAABgQNAAAAAAY0DAQAAAAGOAwEAAAABjwNAAAAAAZADQAAAAAEBKAAAwQQAMAEoAADBBAAwBv4CAQCNBgAhgQNAAI4GACGNAwEAjQYAIY4DAQCNBgAhjwNAAI4GACGQA0AAjgYAIQIAAAC3BAAgKAAAxAQAIAb-AgEAjQYAIYEDQACOBgAhjQMBAI0GACGOAwEAjQYAIY8DQACOBgAhkANAAI4GACECAAAAugQAICgAAMYEACACAAAAugQAICgAAMYEACADAAAAtwQAIC8AAL8EACAwAADEBAAgAQAAALcEACABAAAAugQAIAMHAACTBgAgNQAAlQYAIDYAAJQGACAJ-wIAAO4EADD8AgAAzQQAEP0CAADuBAAw_gIBAOcEACGBA0AA6AQAIY0DAQDnBAAhjgMBAOcEACGPA0AA6AQAIZADQADoBAAhAwAAALoEACABAADMBAAwNAAAzQQAIAMAAAC6BAAgAQAAuwQAMAIAALcEACABAAAAJAAgAQAAACQAIAMAAAAiACABAAAjADACAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAYDAACRBgAgBgAAkgYAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAEBKAAA1QQAIAT-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABASgAANcEADABKAAA1wQAMAYDAACPBgAgBgAAkAYAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhAgAAACQAICgAANoEACAE_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACECAAAAIgAgKAAA3AQAIAIAAAAiACAoAADcBAAgAwAAACQAIC8AANUEACAwAADaBAAgAQAAACQAIAEAAAAiACADBwAAigYAIDUAAIwGACA2AACLBgAgB_sCAADmBAAw_AIAAOMEABD9AgAA5gQAMP4CAQDnBAAh_wIBAOcEACGAAwEA5wQAIYEDQADoBAAhAwAAACIAIAEAAOIEADA0AADjBAAgAwAAACIAIAEAACMAMAIAACQAIAf7AgAA5gQAMPwCAADjBAAQ_QIAAOYEADD-AgEA5wQAIf8CAQDnBAAhgAMBAOcEACGBA0AA6AQAIQ4HAADqBAAgNQAA7QQAIDYAAO0EACCCAwEAAAABgwMBAAAABIQDAQAAAASFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAOwEACGKAwEAAAABiwMBAAAAAYwDAQAAAAELBwAA6gQAIDUAAOsEACA2AADrBAAgggNAAAAAAYMDQAAAAASEA0AAAAAEhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAAAAAAYkDQADpBAAhCwcAAOoEACA1AADrBAAgNgAA6wQAIIIDQAAAAAGDA0AAAAAEhANAAAAABIUDQAAAAAGGA0AAAAABhwNAAAAAAYgDQAAAAAGJA0AA6QQAIQiCAwIAAAABgwMCAAAABIQDAgAAAASFAwIAAAABhgMCAAAAAYcDAgAAAAGIAwIAAAABiQMCAOoEACEIggNAAAAAAYMDQAAAAASEA0AAAAAEhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAAAAAAYkDQADrBAAhDgcAAOoEACA1AADtBAAgNgAA7QQAIIIDAQAAAAGDAwEAAAAEhAMBAAAABIUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEA7AQAIYoDAQAAAAGLAwEAAAABjAMBAAAAAQuCAwEAAAABgwMBAAAABIQDAQAAAASFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAO0EACGKAwEAAAABiwMBAAAAAYwDAQAAAAEJ-wIAAO4EADD8AgAAzQQAEP0CAADuBAAw_gIBAOcEACGBA0AA6AQAIY0DAQDnBAAhjgMBAOcEACGPA0AA6AQAIZADQADoBAAhCfsCAADvBAAw_AIAALoEABD9AgAA7wQAMP4CAQDwBAAhgQNAAPEEACGNAwEA8AQAIY4DAQDwBAAhjwNAAPEEACGQA0AA8QQAIQuCAwEAAAABgwMBAAAABIQDAQAAAASFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAO0EACGKAwEAAAABiwMBAAAAAYwDAQAAAAEIggNAAAAAAYMDQAAAAASEA0AAAAAEhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAAAAAAYkDQADrBAAhEPsCAADyBAAw_AIAALQEABD9AgAA8gQAMP4CAQDnBAAh_wIBAOcEACGBA0AA6AQAIZADQADoBAAhkQMBAOcEACGSAwEA5wQAIZMDAQDzBAAhlAMBAPMEACGVAwEA8wQAIZYDQAD0BAAhlwNAAPQEACGYAwEA8wQAIZkDAQDzBAAhDgcAAPYEACA1AAD5BAAgNgAA-QQAIIIDAQAAAAGDAwEAAAAFhAMBAAAABYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEA-AQAIYoDAQAAAAGLAwEAAAABjAMBAAAAAQsHAAD2BAAgNQAA9wQAIDYAAPcEACCCA0AAAAABgwNAAAAABYQDQAAAAAWFA0AAAAABhgNAAAAAAYcDQAAAAAGIA0AAAAABiQNAAPUEACELBwAA9gQAIDUAAPcEACA2AAD3BAAgggNAAAAAAYMDQAAAAAWEA0AAAAAFhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAAAAAAYkDQAD1BAAhCIIDAgAAAAGDAwIAAAAFhAMCAAAABYUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgAAAAGJAwIA9gQAIQiCA0AAAAABgwNAAAAABYQDQAAAAAWFA0AAAAABhgNAAAAAAYcDQAAAAAGIA0AAAAABiQNAAPcEACEOBwAA9gQAIDUAAPkEACA2AAD5BAAgggMBAAAAAYMDAQAAAAWEAwEAAAAFhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAYkDAQD4BAAhigMBAAAAAYsDAQAAAAGMAwEAAAABC4IDAQAAAAGDAwEAAAAFhAMBAAAABYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEA-QQAIYoDAQAAAAGLAwEAAAABjAMBAAAAAQv7AgAA-gQAMPwCAACeBAAQ_QIAAPoEADD-AgEA5wQAIf8CAQDnBAAhgQNAAOgEACGPA0AA6AQAIZADQADoBAAhmgMBAOcEACGbAwEA8wQAIZwDAQDzBAAhD_sCAAD7BAAw_AIAAIgEABD9AgAA-wQAMP4CAQDnBAAhgQNAAOgEACGQA0AA6AQAIZ0DAQDnBAAhngMBAOcEACGfAyAA_AQAIaADAQDzBAAhogMAAP0EogMipAMAAP4EpAMipQMgAPwEACGmAyAA_AQAIacDQAD0BAAhBQcAAOoEACA1AACEBQAgNgAAhAUAIIIDIAAAAAGJAyAAgwUAIQcHAADqBAAgNQAAggUAIDYAAIIFACCCAwAAAKIDAoMDAAAAogMIhAMAAACiAwiJAwAAgQWiAyIHBwAA6gQAIDUAAIAFACA2AACABQAgggMAAACkAwKDAwAAAKQDCIQDAAAApAMIiQMAAP8EpAMiBwcAAOoEACA1AACABQAgNgAAgAUAIIIDAAAApAMCgwMAAACkAwiEAwAAAKQDCIkDAAD_BKQDIgSCAwAAAKQDAoMDAAAApAMIhAMAAACkAwiJAwAAgAWkAyIHBwAA6gQAIDUAAIIFACA2AACCBQAgggMAAACiAwKDAwAAAKIDCIQDAAAAogMIiQMAAIEFogMiBIIDAAAAogMCgwMAAACiAwiEAwAAAKIDCIkDAACCBaIDIgUHAADqBAAgNQAAhAUAIDYAAIQFACCCAyAAAAABiQMgAIMFACECggMgAAAAAYkDIACEBQAhHAQAAIsFACAFAACMBQAgDAAAjwUAIBAAAI4FACARAACNBQAgEgAAkgUAIBUAAJMFACAWAACUBQAgGAAAkAUAIBwAAJYFACAeAACXBQAgIQAAkQUAICIAAJUFACD7AgAAhQUAMPwCAAD1AwAQ_QIAAIUFADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEA8AQAIZ4DAQDwBAAhnwMgAIYFACGgAwEAhwUAIaIDAACIBaIDIqQDAACJBaQDIqUDIACGBQAhpgMgAIYFACGnA0AAigUAIQKCAyAAAAABiQMgAIQFACELggMBAAAAAYMDAQAAAAWEAwEAAAAFhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAYkDAQD5BAAhigMBAAAAAYsDAQAAAAGMAwEAAAABBIIDAAAAogMCgwMAAACiAwiEAwAAAKIDCIkDAACCBaIDIgSCAwAAAKQDAoMDAAAApAMIhAMAAACkAwiJAwAAgAWkAyIIggNAAAAAAYMDQAAAAAWEA0AAAAAFhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAAAAAAYkDQAD3BAAhA6gDAAADACCpAwAAAwAgqgMAAAMAIAOoAwAABwAgqQMAAAcAIKoDAAAHACADqAMAAAsAIKkDAAALACCqAwAACwAgA6gDAAAmACCpAwAAJgAgqgMAACYAIAOoAwAAHgAgqQMAAB4AIKoDAAAeACASAwAAogUAIBcAAKMFACD7AgAAnwUAMPwCAABpABD9AgAAnwUAMP4CAQDwBAAh_wIBAPAEACGBA0AA8QQAIZADQADxBAAhpAMAAKEFrgMirAMAAKAFrAMirgMBAIcFACGvAwEAhwUAIbADQACKBQAhsQNAAIoFACGyAyAAhgUAIe4DAABpACDvAwAAaQAgA6gDAAAiACCpAwAAIgAgqgMAACIAIBIDAACiBQAgEwAAlAUAIBQAAJMFACD7AgAAtgUAMPwCAAAxABD9AgAAtgUAMP4CAQDwBAAh_wIBAPAEACGBA0AA8QQAIZADQADxBAAhnQMBAIcFACGeAwEAhwUAIaADAQCHBQAhvgMBAIcFACG_AwEAhwUAIcADAQCHBQAh7gMAADEAIO8DAAAxACADqAMAAC0AIKkDAAAtACCqAwAALQAgA6gDAAAzACCpAwAAMwAgqgMAADMAIBADAACiBQAg-wIAANwFADD8AgAAbwAQ_QIAANwFADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZ0DAQDwBAAhngMBAPAEACGmAyAAhgUAIacDQACKBQAh5wMBAIcFACHoAwEAhwUAIe4DAABvACDvAwAAbwAgA6gDAAA8ACCpAwAAPAAgqgMAADwAIAOoAwAARgAgqQMAAEYAIKoDAABGACAO-wIAAJgFADD8AgAA7wMAEP0CAACYBQAw_gIBAOcEACH_AgEA5wQAIYEDQADoBAAhkANAAOgEACGkAwAAmgWuAyKsAwAAmQWsAyKuAwEA8wQAIa8DAQDzBAAhsANAAPQEACGxA0AA9AQAIbIDIAD8BAAhBwcAAOoEACA1AACeBQAgNgAAngUAIIIDAAAArAMCgwMAAACsAwiEAwAAAKwDCIkDAACdBawDIgcHAADqBAAgNQAAnAUAIDYAAJwFACCCAwAAAK4DAoMDAAAArgMIhAMAAACuAwiJAwAAmwWuAyIHBwAA6gQAIDUAAJwFACA2AACcBQAgggMAAACuAwKDAwAAAK4DCIQDAAAArgMIiQMAAJsFrgMiBIIDAAAArgMCgwMAAACuAwiEAwAAAK4DCIkDAACcBa4DIgcHAADqBAAgNQAAngUAIDYAAJ4FACCCAwAAAKwDAoMDAAAArAMIhAMAAACsAwiJAwAAnQWsAyIEggMAAACsAwKDAwAAAKwDCIQDAAAArAMIiQMAAJ4FrAMiEAMAAKIFACAXAACjBQAg-wIAAJ8FADD8AgAAaQAQ_QIAAJ8FADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIaQDAAChBa4DIqwDAACgBawDIq4DAQCHBQAhrwMBAIcFACGwA0AAigUAIbEDQACKBQAhsgMgAIYFACEEggMAAACsAwKDAwAAAKwDCIQDAAAArAMIiQMAAJ4FrAMiBIIDAAAArgMCgwMAAACuAwiEAwAAAK4DCIkDAACcBa4DIh4EAACLBQAgBQAAjAUAIAwAAI8FACAQAACOBQAgEQAAjQUAIBIAAJIFACAVAACTBQAgFgAAlAUAIBgAAJAFACAcAACWBQAgHgAAlwUAICEAAJEFACAiAACVBQAg-wIAAIUFADD8AgAA9QMAEP0CAACFBQAw_gIBAPAEACGBA0AA8QQAIZADQADxBAAhnQMBAPAEACGeAwEA8AQAIZ8DIACGBQAhoAMBAIcFACGiAwAAiAWiAyKkAwAAiQWkAyKlAyAAhgUAIaYDIACGBQAhpwNAAIoFACHuAwAA9QMAIO8DAAD1AwAgA6gDAABAACCpAwAAQAAgqgMAAEAAIA37AgAApAUAMPwCAADXAwAQ_QIAAKQFADD-AgEA5wQAIf8CAQDnBAAhgAMBAOcEACGBA0AA6AQAIZADQADoBAAhpAMAAKcFuAMiswMCAKUFACG0AwEA5wQAIbUDAACmBQAgtgMgAPwEACENBwAA6gQAIDUAAOoEACA2AADqBAAgdwAAqwUAIHgAAOoEACCCAwIAAAABgwMCAAAABIQDAgAAAASFAwIAAAABhgMCAAAAAYcDAgAAAAGIAwIAAAABiQMCAKoFACEEggMBAAAABbgDAQAAAAG5AwEAAAAEugMBAAAABAcHAADqBAAgNQAAqQUAIDYAAKkFACCCAwAAALgDAoMDAAAAuAMIhAMAAAC4AwiJAwAAqAW4AyIHBwAA6gQAIDUAAKkFACA2AACpBQAgggMAAAC4AwKDAwAAALgDCIQDAAAAuAMIiQMAAKgFuAMiBIIDAAAAuAMCgwMAAAC4AwiEAwAAALgDCIkDAACpBbgDIg0HAADqBAAgNQAA6gQAIDYAAOoEACB3AACrBQAgeAAA6gQAIIIDAgAAAAGDAwIAAAAEhAMCAAAABIUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgAAAAGJAwIAqgUAIQiCAwgAAAABgwMIAAAABIQDCAAAAASFAwgAAAABhgMIAAAAAYcDCAAAAAGIAwgAAAABiQMIAKsFACEL-wIAAKwFADD8AgAAwQMAEP0CAACsBQAw_gIBAOcEACH_AgEA5wQAIYADAQDnBAAhgQNAAOgEACGPA0AA6AQAIZADQADoBAAhpAMAAK0FvAMivAMQAK4FACEHBwAA6gQAIDUAALIFACA2AACyBQAgggMAAAC8AwKDAwAAALwDCIQDAAAAvAMIiQMAALEFvAMiDQcAAOoEACA1AACwBQAgNgAAsAUAIHcAALAFACB4AACwBQAgggMQAAAAAYMDEAAAAASEAxAAAAAEhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAAAAAYkDEACvBQAhDQcAAOoEACA1AACwBQAgNgAAsAUAIHcAALAFACB4AACwBQAgggMQAAAAAYMDEAAAAASEAxAAAAAEhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAAAAAYkDEACvBQAhCIIDEAAAAAGDAxAAAAAEhAMQAAAABIUDEAAAAAGGAxAAAAABhwMQAAAAAYgDEAAAAAGJAxAAsAUAIQcHAADqBAAgNQAAsgUAIDYAALIFACCCAwAAALwDAoMDAAAAvAMIhAMAAAC8AwiJAwAAsQW8AyIEggMAAAC8AwKDAwAAALwDCIQDAAAAvAMIiQMAALIFvAMiCfsCAACzBQAw_AIAAKsDABD9AgAAswUAMP4CAQDnBAAh_wIBAOcEACGAAwEA5wQAIYEDQADoBAAhkANAAOgEACG9AwEA8wQAIQn7AgAAtAUAMPwCAACTAwAQ_QIAALQFADD-AgEA5wQAIf8CAQDnBAAhgAMBAOcEACGBA0AA6AQAIZADQADoBAAhvQMBAPMEACEN-wIAALUFADD8AgAA-wIAEP0CAAC1BQAw_gIBAOcEACH_AgEA5wQAIYEDQADoBAAhkANAAOgEACGdAwEA8wQAIZ4DAQDzBAAhoAMBAPMEACG-AwEA8wQAIb8DAQDzBAAhwAMBAPMEACEQAwAAogUAIBMAAJQFACAUAACTBQAg-wIAALYFADD8AgAAMQAQ_QIAALYFADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZ0DAQCHBQAhngMBAIcFACGgAwEAhwUAIb4DAQCHBQAhvwMBAIcFACHAAwEAhwUAIQ77AgAAtwUAMPwCAADjAgAQ_QIAALcFADD-AgEA5wQAIYEDQADoBAAhkANAAOgEACGdAwEA5wQAIcEDAQDnBAAhwgMBAPMEACHDAwEA8wQAIcQDAQDzBAAhxQMBAPMEACHGAyAA_AQAIccDIAD8BAAhDwkAALkFACD7AgAAuAUAMPwCAADQAgAQ_QIAALgFADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEA8AQAIcEDAQDwBAAhwgMBAIcFACHDAwEAhwUAIcQDAQCHBQAhxQMBAIcFACHGAyAAhgUAIccDIACGBQAhA6gDAAAYACCpAwAAGAAgqgMAABgAIAv7AgAAugUAMPwCAADKAgAQ_QIAALoFADD-AgEA5wQAIYEDQADoBAAhpAMBAOcEACHIAwEA5wQAIckDCAC7BQAhygMBAOcEACHLAwEA8wQAIcwDAQDzBAAhDQcAAOoEACA1AACrBQAgNgAAqwUAIHcAAKsFACB4AACrBQAgggMIAAAAAYMDCAAAAASEAwgAAAAEhQMIAAAAAYYDCAAAAAGHAwgAAAABiAMIAAAAAYkDCAC8BQAhDQcAAOoEACA1AACrBQAgNgAAqwUAIHcAAKsFACB4AACrBQAgggMIAAAAAYMDCAAAAASEAwgAAAAEhQMIAAAAAYYDCAAAAAGHAwgAAAABiAMIAAAAAYkDCAC8BQAhDvsCAAC9BQAw_AIAALICABD9AgAAvQUAMP4CAQDnBAAh_wIBAOcEACGAAwEA5wQAIYEDQADoBAAhjwNAAPQEACGQA0AA6AQAIaQDAAC_Bc8DIrwDEACuBQAhxQMAAL4FzgMiywMBAPMEACHPAwEA8wQAIQcHAADqBAAgNQAAwwUAIDYAAMMFACCCAwAAAM4DAoMDAAAAzgMIhAMAAADOAwiJAwAAwgXOAyIHBwAA6gQAIDUAAMEFACA2AADBBQAgggMAAADPAwKDAwAAAM8DCIQDAAAAzwMIiQMAAMAFzwMiBwcAAOoEACA1AADBBQAgNgAAwQUAIIIDAAAAzwMCgwMAAADPAwiEAwAAAM8DCIkDAADABc8DIgSCAwAAAM8DAoMDAAAAzwMIhAMAAADPAwiJAwAAwQXPAyIHBwAA6gQAIDUAAMMFACA2AADDBQAgggMAAADOAwKDAwAAAM4DCIQDAAAAzgMIiQMAAMIFzgMiBIIDAAAAzgMCgwMAAADOAwiEAwAAAM4DCIkDAADDBc4DIgb7AgAAxAUAMPwCAACaAgAQ_QIAAMQFADD-AgEA5wQAIYADAQDnBAAh0AMBAOcEACEI-wIAAMUFADD8AgAAhAIAEP0CAADFBQAw_gIBAOcEACGAAwEA5wQAIZ0DAQDnBAAhoAMBAPMEACGiAwEA5wQAIRr7AgAAxgUAMPwCAADuAQAQ_QIAAMYFADD-AgEA5wQAIYEDQADoBAAhkANAAOgEACHBAwEA5wQAIcUDAQDnBAAhxgMgAPwEACHHAyAA_AQAIdEDAQDnBAAh0gMBAOcEACHTAwIApQUAIdQDAQDnBAAh1QMBAPMEACHWAwEA8wQAIdcDAQDzBAAh2AMBAPMEACHZAxAAxwUAIdoDEADHBQAh2wMCAMgFACHcAwIAyAUAId4DAADJBd4DIt8DCADKBQAh4AMCAKUFACHhAwIApQUAIQ0HAAD2BAAgNQAA0QUAIDYAANEFACB3AADRBQAgeAAA0QUAIIIDEAAAAAGDAxAAAAAFhAMQAAAABYUDEAAAAAGGAxAAAAABhwMQAAAAAYgDEAAAAAGJAxAA0AUAIQ0HAAD2BAAgNQAA9gQAIDYAAPYEACB3AADMBQAgeAAA9gQAIIIDAgAAAAGDAwIAAAAFhAMCAAAABYUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgAAAAGJAwIAzwUAIQcHAADqBAAgNQAAzgUAIDYAAM4FACCCAwAAAN4DAoMDAAAA3gMIhAMAAADeAwiJAwAAzQXeAyINBwAA9gQAIDUAAMwFACA2AADMBQAgdwAAzAUAIHgAAMwFACCCAwgAAAABgwMIAAAABYQDCAAAAAWFAwgAAAABhgMIAAAAAYcDCAAAAAGIAwgAAAABiQMIAMsFACENBwAA9gQAIDUAAMwFACA2AADMBQAgdwAAzAUAIHgAAMwFACCCAwgAAAABgwMIAAAABYQDCAAAAAWFAwgAAAABhgMIAAAAAYcDCAAAAAGIAwgAAAABiQMIAMsFACEIggMIAAAAAYMDCAAAAAWEAwgAAAAFhQMIAAAAAYYDCAAAAAGHAwgAAAABiAMIAAAAAYkDCADMBQAhBwcAAOoEACA1AADOBQAgNgAAzgUAIIIDAAAA3gMCgwMAAADeAwiEAwAAAN4DCIkDAADNBd4DIgSCAwAAAN4DAoMDAAAA3gMIhAMAAADeAwiJAwAAzgXeAyINBwAA9gQAIDUAAPYEACA2AAD2BAAgdwAAzAUAIHgAAPYEACCCAwIAAAABgwMCAAAABYQDAgAAAAWFAwIAAAABhgMCAAAAAYcDAgAAAAGIAwIAAAABiQMCAM8FACENBwAA9gQAIDUAANEFACA2AADRBQAgdwAA0QUAIHgAANEFACCCAxAAAAABgwMQAAAABYQDEAAAAAWFAxAAAAABhgMQAAAAAYcDEAAAAAGIAxAAAAABiQMQANAFACEIggMQAAAAAYMDEAAAAAWEAxAAAAAFhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAAAAAYkDEADRBQAhDPsCAADSBQAw_AIAANgBABD9AgAA0gUAMP4CAQDnBAAhgQNAAOgEACGQA0AA6AQAIZ0DAQDnBAAhoAMBAPMEACHBAwEA5wQAIcIDAQDzBAAhxgMgAPwEACHHAyAA_AQAIQr7AgAA0wUAMPwCAADCAQAQ_QIAANMFADD-AgEA5wQAIf8CAQDnBAAhgAMBAOcEACGBA0AA6AQAIcUDAADUBeMDIuMDAQDzBAAh5AMBAPMEACEHBwAA6gQAIDUAANYFACA2AADWBQAgggMAAADjAwKDAwAAAOMDCIQDAAAA4wMIiQMAANUF4wMiBwcAAOoEACA1AADWBQAgNgAA1gUAIIIDAAAA4wMCgwMAAADjAwiEAwAAAOMDCIkDAADVBeMDIgSCAwAAAOMDAoMDAAAA4wMIhAMAAADjAwiJAwAA1gXjAyIL-wIAANcFADD8AgAAqAEAEP0CAADXBQAw_gIBAOcEACH_AgEA5wQAIYADAQDnBAAhgQNAAOgEACGkAwAA2AXnAyK0AwEA5wQAIeMDAQDnBAAh5QMBAPMEACEHBwAA6gQAIDUAANoFACA2AADaBQAgggMAAADnAwKDAwAAAOcDCIQDAAAA5wMIiQMAANkF5wMiBwcAAOoEACA1AADaBQAgNgAA2gUAIIIDAAAA5wMCgwMAAADnAwiEAwAAAOcDCIkDAADZBecDIgSCAwAAAOcDAoMDAAAA5wMIhAMAAADnAwiJAwAA2gXnAyIN-wIAANsFADD8AgAAkAEAEP0CAADbBQAw_gIBAOcEACH_AgEA5wQAIYEDQADoBAAhkANAAOgEACGdAwEA5wQAIZ4DAQDnBAAhpgMgAPwEACGnA0AA9AQAIecDAQDzBAAh6AMBAPMEACEOAwAAogUAIPsCAADcBQAw_AIAAG8AEP0CAADcBQAw_gIBAPAEACH_AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEA8AQAIZ4DAQDwBAAhpgMgAIYFACGnA0AAigUAIecDAQCHBQAh6AMBAIcFACEC_wIBAAAAAYADAQAAAAEOAwAAogUAIAYAAOEFACAXAACjBQAg-wIAAN4FADD8AgAARgAQ_QIAAN4FADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIY8DQADxBAAhkANAAPEEACGkAwAA3wW8AyK8AxAA4AUAIQSCAwAAALwDAoMDAAAAvAMIhAMAAAC8AwiJAwAAsgW8AyIIggMQAAAAAYMDEAAAAASEAxAAAAAEhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAAAAAYkDEACwBQAhJwgAAIEGACALAAC5BQAgDAAAjwUAIA0AAJEFACAQAACOBQAgEQAAjQUAIBUAAJMFACAWAACUBQAgHAAAlgUAIB0AAIIGACAeAACXBQAg-wIAAPwFADD8AgAAEwAQ_QIAAPwFADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACHBAwEA8AQAIcUDAQDwBAAhxgMgAIYFACHHAyAAhgUAIdEDAQDwBAAh0gMBAPAEACHTAwIA9gUAIdQDAQDwBAAh1QMBAIcFACHWAwEAhwUAIdcDAQCHBQAh2AMBAIcFACHZAxAA_QUAIdoDEAD9BQAh2wMCAP4FACHcAwIA_gUAId4DAAD_Bd4DIt8DCACABgAh4AMCAPYFACHhAwIA9gUAIe4DAAATACDvAwAAEwAgCQYAAOEFACD7AgAA4gUAMPwCAABMABD9AgAA4gUAMP4CAQDwBAAhgAMBAPAEACGdAwEA8AQAIaADAQCHBQAhogMBAPAEACEOGAAA5QUAIBkAAOYFACAaAACWBQAg-wIAAOMFADD8AgAAQAAQ_QIAAOMFADD-AgEA8AQAIYEDQADxBAAhpAMBAPAEACHIAwEA8AQAIckDCADkBQAhygMBAPAEACHLAwEAhwUAIcwDAQCHBQAhCIIDCAAAAAGDAwgAAAAEhAMIAAAABIUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCAAAAAGJAwgAqwUAIRIDAACiBQAgFwAAowUAIPsCAACfBQAw_AIAAGkAEP0CAACfBQAw_gIBAPAEACH_AgEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAAoQWuAyKsAwAAoAWsAyKuAwEAhwUAIa8DAQCHBQAhsANAAIoFACGxA0AAigUAIbIDIACGBQAh7gMAAGkAIO8DAABpACAQAwAAogUAIAYAAOEFACAXAACjBQAg-wIAAN4FADD8AgAARgAQ_QIAAN4FADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIY8DQADxBAAhkANAAPEEACGkAwAA3wW8AyK8AxAA4AUAIe4DAABGACDvAwAARgAgA_8CAQAAAAGAAwEAAAABxQMAAADOAwIRAwAAogUAIAYAAOEFACAbAADrBQAg-wIAAOgFADD8AgAAPAAQ_QIAAOgFADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIY8DQACKBQAhkANAAPEEACGkAwAA6gXPAyK8AxAA4AUAIcUDAADpBc4DIssDAQCHBQAhzwMBAIcFACEEggMAAADOAwKDAwAAAM4DCIQDAAAAzgMIiQMAAMMFzgMiBIIDAAAAzwMCgwMAAADPAwiEAwAAAM8DCIkDAADBBc8DIhAYAADlBQAgGQAA5gUAIBoAAJYFACD7AgAA4wUAMPwCAABAABD9AgAA4wUAMP4CAQDwBAAhgQNAAPEEACGkAwEA8AQAIcgDAQDwBAAhyQMIAOQFACHKAwEA8AQAIcsDAQCHBQAhzAMBAIcFACHuAwAAQAAg7wMAAEAAIAwDAACiBQAgBgAA4QUAIBIAAJIFACD7AgAA7AUAMPwCAAAzABD9AgAA7AUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACG9AwEAhwUAIQwDAACiBQAgBgAA4QUAIBIAAJIFACD7AgAA7QUAMPwCAAAtABD9AgAA7QUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACG9AwEAhwUAIQP_AgEAAAAB4wMBAAAAAeQDAQAAAAEOAwAAogUAIAYAAOEFACAOAADxBQAgDwAA8gUAIPsCAADvBQAw_AIAACYAEP0CAADvBQAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACHFAwAA8AXjAyLjAwEAhwUAIeQDAQCHBQAhBIIDAAAA4wMCgwMAAADjAwiEAwAAAOMDCIkDAADWBeMDIhMDAACiBQAgBgAA4QUAIBAAAI4FACARAACNBQAg-wIAAPUFADD8AgAAHgAQ_QIAAPUFADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIZADQADxBAAhpAMAAPcFuAMiswMCAPYFACG0AwEA8AQAIbUDAACmBQAgtgMgAIYFACHuAwAAHgAg7wMAAB4AIBMDAACiBQAgBgAA4QUAIA4AAIcGACAQAACOBQAgHwAA8gUAICAAAI0FACD7AgAAhQYAMPwCAAALABD9AgAAhQYAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhpAMAAIYG5wMitAMBAPAEACHjAwEA8AQAIeUDAQCHBQAh7gMAAAsAIO8DAAALACAC_wIBAAAAAYADAQAAAAEJAwAAogUAIAYAAOEFACD7AgAA9AUAMPwCAAAiABD9AgAA9AUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhEQMAAKIFACAGAADhBQAgEAAAjgUAIBEAAI0FACD7AgAA9QUAMPwCAAAeABD9AgAA9QUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAA9wW4AyKzAwIA9gUAIbQDAQDwBAAhtQMAAKYFACC2AyAAhgUAIQiCAwIAAAABgwMCAAAABIQDAgAAAASFAwIAAAABhgMCAAAAAYcDAgAAAAGIAwIAAAABiQMCAOoEACEEggMAAAC4AwKDAwAAALgDCIQDAAAAuAMIiQMAAKkFuAMiAoADAQAAAAHQAwEAAAABCAYAAOEFACAKAAD6BQAg-wIAAPkFADD8AgAAGAAQ_QIAAPkFADD-AgEA8AQAIYADAQDwBAAh0AMBAPAEACERCQAAuQUAIPsCAAC4BQAw_AIAANACABD9AgAAuAUAMP4CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZ0DAQDwBAAhwQMBAPAEACHCAwEAhwUAIcMDAQCHBQAhxAMBAIcFACHFAwEAhwUAIcYDIACGBQAhxwMgAIYFACHuAwAA0AIAIO8DAADQAgAgAtEDAQAAAAHTAwIAAAABJQgAAIEGACALAAC5BQAgDAAAjwUAIA0AAJEFACAQAACOBQAgEQAAjQUAIBUAAJMFACAWAACUBQAgHAAAlgUAIB0AAIIGACAeAACXBQAg-wIAAPwFADD8AgAAEwAQ_QIAAPwFADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACHBAwEA8AQAIcUDAQDwBAAhxgMgAIYFACHHAyAAhgUAIdEDAQDwBAAh0gMBAPAEACHTAwIA9gUAIdQDAQDwBAAh1QMBAIcFACHWAwEAhwUAIdcDAQCHBQAh2AMBAIcFACHZAxAA_QUAIdoDEAD9BQAh2wMCAP4FACHcAwIA_gUAId4DAAD_Bd4DIt8DCACABgAh4AMCAPYFACHhAwIA9gUAIQiCAxAAAAABgwMQAAAABYQDEAAAAAWFAxAAAAABhgMQAAAAAYcDEAAAAAGIAxAAAAABiQMQANEFACEIggMCAAAAAYMDAgAAAAWEAwIAAAAFhQMCAAAAAYYDAgAAAAGHAwIAAAABiAMCAAAAAYkDAgD2BAAhBIIDAAAA3gMCgwMAAADeAwiEAwAAAN4DCIkDAADOBd4DIgiCAwgAAAABgwMIAAAABYQDCAAAAAWFAwgAAAABhgMIAAAAAYcDCAAAAAGIAwgAAAABiQMIAMwFACEDqAMAAA8AIKkDAAAPACCqAwAADwAgA6gDAABMACCpAwAATAAgqgMAAEwAIA0GAACEBgAg-wIAAIMGADD8AgAADwAQ_QIAAIMGADD-AgEA8AQAIYEDQADxBAAhkANAAPEEACGdAwEA8AQAIaADAQCHBQAhwQMBAPAEACHCAwEAhwUAIcYDIACGBQAhxwMgAIYFACEDqAMAABMAIKkDAAATACCqAwAAEwAgEQMAAKIFACAGAADhBQAgDgAAhwYAIBAAAI4FACAfAADyBQAgIAAAjQUAIPsCAACFBgAw_AIAAAsAEP0CAACFBgAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGkAwAAhgbnAyK0AwEA8AQAIeMDAQDwBAAh5QMBAIcFACEEggMAAADnAwKDAwAAAOcDCIQDAAAA5wMIiQMAANoF5wMiEwMAAKIFACAGAADhBQAgEAAAjgUAIBEAAI0FACD7AgAA9QUAMPwCAAAeABD9AgAA9QUAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAA9wW4AyKzAwIA9gUAIbQDAQDwBAAhtQMAAKYFACC2AyAAhgUAIe4DAAAeACDvAwAAHgAgEQMAAKIFACD7AgAAiAYAMPwCAAAHABD9AgAAiAYAMP4CAQDwBAAh_wIBAPAEACGBA0AA8QQAIZADQADxBAAhkQMBAPAEACGSAwEA8AQAIZMDAQCHBQAhlAMBAIcFACGVAwEAhwUAIZYDQACKBQAhlwNAAIoFACGYAwEAhwUAIZkDAQCHBQAhDAMAAKIFACD7AgAAiQYAMPwCAAADABD9AgAAiQYAMP4CAQDwBAAh_wIBAPAEACGBA0AA8QQAIY8DQADxBAAhkANAAPEEACGaAwEA8AQAIZsDAQCHBQAhnAMBAIcFACEAAAAB8wMBAAAAAQHzA0AAAAABBS8AAKIMACAwAACoDAAg8AMAAKMMACDxAwAApwwAIPYDAADyAwAgBS8AAKAMACAwAAClDAAg8AMAAKEMACDxAwAApAwAIPYDAAAVACADLwAAogwAIPADAACjDAAg9gMAAPIDACADLwAAoAwAIPADAAChDAAg9gMAABUAIAAAAAAAAAAB8wMBAAAAAQHzA0AAAAABBS8AAJsMACAwAACeDAAg8AMAAJwMACDxAwAAnQwAIPYDAADyAwAgAy8AAJsMACDwAwAAnAwAIPYDAADyAwAgAAAABS8AAJYMACAwAACZDAAg8AMAAJcMACDxAwAAmAwAIPYDAADyAwAgAy8AAJYMACDwAwAAlwwAIPYDAADyAwAgAAAAAfMDIAAAAAEB8wMAAACiAwIB8wMAAACkAwILLwAAzggAMDAAANMIADDwAwAAzwgAMPEDAADQCAAw8gMAANEIACDzAwAA0ggAMPQDAADSCAAw9QMAANIIADD2AwAA0ggAMPcDAADUCAAw-AMAANUIADALLwAAwggAMDAAAMcIADDwAwAAwwgAMPEDAADECAAw8gMAAMUIACDzAwAAxggAMPQDAADGCAAw9QMAAMYIADD2AwAAxggAMPcDAADICAAw-AMAAMkIADALLwAAuQgAMDAAAL0IADDwAwAAuggAMPEDAAC7CAAw8gMAALwIACDzAwAAgggAMPQDAACCCAAw9QMAAIIIADD2AwAAgggAMPcDAAC-CAAw-AMAAIUIADALLwAAsAgAMDAAALQIADDwAwAAsQgAMPEDAACyCAAw8gMAALMIACDzAwAA7wcAMPQDAADvBwAw9QMAAO8HADD2AwAA7wcAMPcDAAC1CAAw-AMAAPIHADALLwAA2gcAMDAAAN8HADDwAwAA2wcAMPEDAADcBwAw8gMAAN0HACDzAwAA3gcAMPQDAADeBwAw9QMAAN4HADD2AwAA3gcAMPcDAADgBwAw-AMAAOEHADAHLwAAxgcAIDAAAMkHACDwAwAAxwcAIPEDAADIBwAg9AMAAGkAIPUDAABpACD2AwAA2gMAIAsvAAC6BwAwMAAAvwcAMPADAAC7BwAw8QMAALwHADDyAwAAvQcAIPMDAAC-BwAw9AMAAL4HADD1AwAAvgcAMPYDAAC-BwAw9wMAAMAHADD4AwAAwQcAMAcvAACbBwAgMAAAngcAIPADAACcBwAg8QMAAJ0HACD0AwAAMQAg9QMAADEAIPYDAADmAgAgCy8AAIsHADAwAACQBwAw8AMAAIwHADDxAwAAjQcAMPIDAACOBwAg8wMAAI8HADD0AwAAjwcAMPUDAACPBwAw9gMAAI8HADD3AwAAkQcAMPgDAACSBwAwCy8AAPsGADAwAACABwAw8AMAAPwGADDxAwAA_QYAMPIDAAD-BgAg8wMAAP8GADD0AwAA_wYAMPUDAAD_BgAw9gMAAP8GADD3AwAAgQcAMPgDAACCBwAwBy8AAPYGACAwAAD5BgAg8AMAAPcGACDxAwAA-AYAIPQDAABvACD1AwAAbwAg9gMAAAEAIAsvAADrBgAwMAAA7wYAMPADAADsBgAw8QMAAO0GADDyAwAA7gYAIPMDAADXBgAw9AMAANcGADD1AwAA1wYAMPYDAADXBgAw9wMAAPAGADD4AwAA2gYAMAsvAAC2BgAwMAAAuwYAMPADAAC3BgAw8QMAALgGADDyAwAAuQYAIPMDAAC6BgAw9AMAALoGADD1AwAAugYAMPYDAAC6BgAw9wMAALwGADD4AwAAvQYAMAkGAADpBgAgFwAA6gYAIP4CAQAAAAGAAwEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABpAMAAAC8AwK8AxAAAAABAgAAAFEAIC8AAOgGACADAAAAUQAgLwAA6AYAIDAAAMIGACABKAAAlQwAMA8DAACiBQAgBgAA4QUAIBcAAKMFACD7AgAA3gUAMPwCAABGABD9AgAA3gUAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGPA0AA8QQAIZADQADxBAAhpAMAAN8FvAMivAMQAOAFACHpAwAA3QUAIAIAAABRACAoAADCBgAgAgAAAL4GACAoAAC_BgAgC_sCAAC9BgAw_AIAAL4GABD9AgAAvQYAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhjwNAAPEEACGQA0AA8QQAIaQDAADfBbwDIrwDEADgBQAhC_sCAAC9BgAw_AIAAL4GABD9AgAAvQYAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhjwNAAPEEACGQA0AA8QQAIaQDAADfBbwDIrwDEADgBQAhB_4CAQCNBgAhgAMBAI0GACGBA0AAjgYAIY8DQACOBgAhkANAAI4GACGkAwAAwAa8AyK8AxAAwQYAIQHzAwAAALwDAgXzAxAAAAAB-QMQAAAAAfoDEAAAAAH7AxAAAAAB_AMQAAAAAQkGAADDBgAgFwAAxAYAIP4CAQCNBgAhgAMBAI0GACGBA0AAjgYAIY8DQACOBgAhkANAAI4GACGkAwAAwAa8AyK8AxAAwQYAIQUvAAD_CwAgMAAAkwwAIPADAACADAAg8QMAAJIMACD2AwAAFQAgCy8AAMUGADAwAADKBgAw8AMAAMYGADDxAwAAxwYAMPIDAADIBgAg8wMAAMkGADD0AwAAyQYAMPUDAADJBgAw9gMAAMkGADD3AwAAywYAMPgDAADMBgAwCRgAAOYGACAaAADnBgAg_gIBAAAAAYEDQAAAAAGkAwEAAAAByAMBAAAAAckDCAAAAAHKAwEAAAABywMBAAAAAQIAAABDACAvAADlBgAgAwAAAEMAIC8AAOUGACAwAADQBgAgASgAAJEMADAOGAAA5QUAIBkAAOYFACAaAACWBQAg-wIAAOMFADD8AgAAQAAQ_QIAAOMFADD-AgEAAAABgQNAAPEEACGkAwEA8AQAIcgDAQDwBAAhyQMIAOQFACHKAwEA8AQAIcsDAQAAAAHMAwEAhwUAIQIAAABDACAoAADQBgAgAgAAAM0GACAoAADOBgAgC_sCAADMBgAw_AIAAM0GABD9AgAAzAYAMP4CAQDwBAAhgQNAAPEEACGkAwEA8AQAIcgDAQDwBAAhyQMIAOQFACHKAwEA8AQAIcsDAQCHBQAhzAMBAIcFACEL-wIAAMwGADD8AgAAzQYAEP0CAADMBgAw_gIBAPAEACGBA0AA8QQAIaQDAQDwBAAhyAMBAPAEACHJAwgA5AUAIcoDAQDwBAAhywMBAIcFACHMAwEAhwUAIQf-AgEAjQYAIYEDQACOBgAhpAMBAI0GACHIAwEAjQYAIckDCADPBgAhygMBAI0GACHLAwEAmgYAIQXzAwgAAAAB-QMIAAAAAfoDCAAAAAH7AwgAAAAB_AMIAAAAAQkYAADRBgAgGgAA0gYAIP4CAQCNBgAhgQNAAI4GACGkAwEAjQYAIcgDAQCNBgAhyQMIAM8GACHKAwEAjQYAIcsDAQCaBgAhBS8AAIEMACAwAACPDAAg8AMAAIIMACDxAwAAjgwAIPYDAADaAwAgCy8AANMGADAwAADYBgAw8AMAANQGADDxAwAA1QYAMPIDAADWBgAg8wMAANcGADD0AwAA1wYAMPUDAADXBgAw9gMAANcGADD3AwAA2QYAMPgDAADaBgAwDAMAAOMGACAGAADkBgAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABpAMAAADPAwK8AxAAAAABxQMAAADOAwLLAwEAAAABAgAAAD4AIC8AAOIGACADAAAAPgAgLwAA4gYAIDAAAN8GACABKAAAjQwAMBIDAACiBQAgBgAA4QUAIBsAAOsFACD7AgAA6AUAMPwCAAA8ABD9AgAA6AUAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGPA0AAigUAIZADQADxBAAhpAMAAOoFzwMivAMQAOAFACHFAwAA6QXOAyLLAwEAhwUAIc8DAQCHBQAh6gMAAOcFACACAAAAPgAgKAAA3wYAIAIAAADbBgAgKAAA3AYAIA77AgAA2gYAMPwCAADbBgAQ_QIAANoGADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIY8DQACKBQAhkANAAPEEACGkAwAA6gXPAyK8AxAA4AUAIcUDAADpBc4DIssDAQCHBQAhzwMBAIcFACEO-wIAANoGADD8AgAA2wYAEP0CAADaBgAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGPA0AAigUAIZADQADxBAAhpAMAAOoFzwMivAMQAOAFACHFAwAA6QXOAyLLAwEAhwUAIc8DAQCHBQAhCv4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhjwNAAJsGACGQA0AAjgYAIaQDAADeBs8DIrwDEADBBgAhxQMAAN0GzgMiywMBAJoGACEB8wMAAADOAwIB8wMAAADPAwIMAwAA4AYAIAYAAOEGACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIY8DQACbBgAhkANAAI4GACGkAwAA3gbPAyK8AxAAwQYAIcUDAADdBs4DIssDAQCaBgAhBS8AAIUMACAwAACLDAAg8AMAAIYMACDxAwAAigwAIPYDAADyAwAgBS8AAIMMACAwAACIDAAg8AMAAIQMACDxAwAAhwwAIPYDAAAVACAMAwAA4wYAIAYAAOQGACD-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAAM8DArwDEAAAAAHFAwAAAM4DAssDAQAAAAEDLwAAhQwAIPADAACGDAAg9gMAAPIDACADLwAAgwwAIPADAACEDAAg9gMAABUAIAkYAADmBgAgGgAA5wYAIP4CAQAAAAGBA0AAAAABpAMBAAAAAcgDAQAAAAHJAwgAAAABygMBAAAAAcsDAQAAAAEDLwAAgQwAIPADAACCDAAg9gMAANoDACAELwAA0wYAMPADAADUBgAw8gMAANYGACD2AwAA1wYAMAkGAADpBgAgFwAA6gYAIP4CAQAAAAGAAwEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABpAMAAAC8AwK8AxAAAAABAy8AAP8LACDwAwAAgAwAIPYDAAAVACAELwAAxQYAMPADAADGBgAw8gMAAMgGACD2AwAAyQYAMAwGAADkBgAgGwAA9QYAIP4CAQAAAAGAAwEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABpAMAAADPAwK8AxAAAAABxQMAAADOAwLLAwEAAAABzwMBAAAAAQIAAAA-ACAvAAD0BgAgAwAAAD4AIC8AAPQGACAwAADyBgAgASgAAP4LADACAAAAPgAgKAAA8gYAIAIAAADbBgAgKAAA8QYAIAr-AgEAjQYAIYADAQCNBgAhgQNAAI4GACGPA0AAmwYAIZADQACOBgAhpAMAAN4GzwMivAMQAMEGACHFAwAA3QbOAyLLAwEAmgYAIc8DAQCaBgAhDAYAAOEGACAbAADzBgAg_gIBAI0GACGAAwEAjQYAIYEDQACOBgAhjwNAAJsGACGQA0AAjgYAIaQDAADeBs8DIrwDEADBBgAhxQMAAN0GzgMiywMBAJoGACHPAwEAmgYAIQcvAAD5CwAgMAAA_AsAIPADAAD6CwAg8QMAAPsLACD0AwAAQAAg9QMAAEAAIPYDAABDACAMBgAA5AYAIBsAAPUGACD-AgEAAAABgAMBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAzwMCvAMQAAAAAcUDAAAAzgMCywMBAAAAAc8DAQAAAAEDLwAA-QsAIPADAAD6CwAg9gMAAEMAIAn-AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABngMBAAAAAaYDIAAAAAGnA0AAAAAB5wMBAAAAAegDAQAAAAECAAAAAQAgLwAA9gYAIAMAAABvACAvAAD2BgAgMAAA-gYAIAsAAABvACAoAAD6BgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIaYDIACmBgAhpwNAAJsGACHnAwEAmgYAIegDAQCaBgAhCf4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCNBgAhngMBAI0GACGmAyAApgYAIacDQACbBgAh5wMBAJoGACHoAwEAmgYAIQcGAACJBwAgEgAAigcAIP4CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAG9AwEAAAABAgAAADUAIC8AAIgHACADAAAANQAgLwAAiAcAIDAAAIUHACABKAAA-AsAMAwDAACiBQAgBgAA4QUAIBIAAJIFACD7AgAA7AUAMPwCAAAzABD9AgAA7AUAMP4CAQAAAAH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGQA0AA8QQAIb0DAQCHBQAhAgAAADUAICgAAIUHACACAAAAgwcAICgAAIQHACAJ-wIAAIIHADD8AgAAgwcAEP0CAACCBwAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGQA0AA8QQAIb0DAQCHBQAhCfsCAACCBwAw_AIAAIMHABD9AgAAggcAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACG9AwEAhwUAIQX-AgEAjQYAIYADAQCNBgAhgQNAAI4GACGQA0AAjgYAIb0DAQCaBgAhBwYAAIYHACASAACHBwAg_gIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQUvAADwCwAgMAAA9gsAIPADAADxCwAg8QMAAPULACD2AwAAFQAgBy8AAO4LACAwAADzCwAg8AMAAO8LACDxAwAA8gsAIPQDAAAxACD1AwAAMQAg9gMAAOYCACAHBgAAiQcAIBIAAIoHACD-AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQMvAADwCwAg8AMAAPELACD2AwAAFQAgAy8AAO4LACDwAwAA7wsAIPYDAADmAgAgBwYAAJkHACASAACaBwAg_gIBAAAAAYADAQAAAAGBA0AAAAABkANAAAAAAb0DAQAAAAECAAAALwAgLwAAmAcAIAMAAAAvACAvAACYBwAgMAAAlQcAIAEoAADtCwAwDAMAAKIFACAGAADhBQAgEgAAkgUAIPsCAADtBQAw_AIAAC0AEP0CAADtBQAw_gIBAAAAAf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIZADQADxBAAhvQMBAIcFACECAAAALwAgKAAAlQcAIAIAAACTBwAgKAAAlAcAIAn7AgAAkgcAMPwCAACTBwAQ_QIAAJIHADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIZADQADxBAAhvQMBAIcFACEJ-wIAAJIHADD8AgAAkwcAEP0CAACSBwAw_gIBAPAEACH_AgEA8AQAIYADAQDwBAAhgQNAAPEEACGQA0AA8QQAIb0DAQCHBQAhBf4CAQCNBgAhgAMBAI0GACGBA0AAjgYAIZADQACOBgAhvQMBAJoGACEHBgAAlgcAIBIAAJcHACD-AgEAjQYAIYADAQCNBgAhgQNAAI4GACGQA0AAjgYAIb0DAQCaBgAhBS8AAOULACAwAADrCwAg8AMAAOYLACDxAwAA6gsAIPYDAAAVACAHLwAA4wsAIDAAAOgLACDwAwAA5AsAIPEDAADnCwAg9AMAADEAIPUDAAAxACD2AwAA5gIAIAcGAACZBwAgEgAAmgcAIP4CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAG9AwEAAAABAy8AAOULACDwAwAA5gsAIPYDAAAVACADLwAA4wsAIPADAADkCwAg9gMAAOYCACALEwAAuAcAIBQAALkHACD-AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABngMBAAAAAaADAQAAAAG-AwEAAAABvwMBAAAAAcADAQAAAAECAAAA5gIAIC8AAJsHACADAAAAMQAgLwAAmwcAIDAAAJ8HACANAAAAMQAgEwAAoAcAIBQAAKEHACAoAACfBwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAJoGACGeAwEAmgYAIaADAQCaBgAhvgMBAJoGACG_AwEAmgYAIcADAQCaBgAhCxMAAKAHACAUAAChBwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAJoGACGeAwEAmgYAIaADAQCaBgAhvgMBAJoGACG_AwEAmgYAIcADAQCaBgAhCy8AAK0HADAwAACxBwAw8AMAAK4HADDxAwAArwcAMPIDAACwBwAg8wMAAP8GADD0AwAA_wYAMPUDAAD_BgAw9gMAAP8GADD3AwAAsgcAMPgDAACCBwAwCy8AAKIHADAwAACmBwAw8AMAAKMHADDxAwAApAcAMPIDAAClBwAg8wMAAI8HADD0AwAAjwcAMPUDAACPBwAw9gMAAI8HADD3AwAApwcAMPgDAACSBwAwBwMAAKwHACAGAACZBwAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAECAAAALwAgLwAAqwcAIAMAAAAvACAvAACrBwAgMAAAqQcAIAEoAADiCwAwAgAAAC8AICgAAKkHACACAAAAkwcAICgAAKgHACAF_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGQA0AAjgYAIQcDAACqBwAgBgAAlgcAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACEFLwAA3QsAIDAAAOALACDwAwAA3gsAIPEDAADfCwAg9gMAAPIDACAHAwAArAcAIAYAAJkHACD-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABkANAAAAAAQMvAADdCwAg8AMAAN4LACD2AwAA8gMAIAcDAAC3BwAgBgAAiQcAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABAgAAADUAIC8AALYHACADAAAANQAgLwAAtgcAIDAAALQHACABKAAA3AsAMAIAAAA1ACAoAAC0BwAgAgAAAIMHACAoAACzBwAgBf4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACEHAwAAtQcAIAYAAIYHACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIZADQACOBgAhBS8AANcLACAwAADaCwAg8AMAANgLACDxAwAA2QsAIPYDAADyAwAgBwMAALcHACAGAACJBwAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAEDLwAA1wsAIPADAADYCwAg9gMAAPIDACAELwAArQcAMPADAACuBwAw8gMAALAHACD2AwAA_wYAMAQvAACiBwAw8AMAAKMHADDyAwAApQcAIPYDAACPBwAwBAYAAJIGACD-AgEAAAABgAMBAAAAAYEDQAAAAAECAAAAJAAgLwAAxQcAIAMAAAAkACAvAADFBwAgMAAAxAcAIAEoAADWCwAwCgMAAKIFACAGAADhBQAg-wIAAPQFADD8AgAAIgAQ_QIAAPQFADD-AgEAAAAB_wIBAPAEACGAAwEA8AQAIYEDQADxBAAh6QMAAPMFACACAAAAJAAgKAAAxAcAIAIAAADCBwAgKAAAwwcAIAf7AgAAwQcAMPwCAADCBwAQ_QIAAMEHADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIQf7AgAAwQcAMPwCAADCBwAQ_QIAAMEHADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIQP-AgEAjQYAIYADAQCNBgAhgQNAAI4GACEEBgAAkAYAIP4CAQCNBgAhgAMBAI0GACGBA0AAjgYAIQQGAACSBgAg_gIBAAAAAYADAQAAAAGBA0AAAAABCxcAANkHACD-AgEAAAABgQNAAAAAAZADQAAAAAGkAwAAAK4DAqwDAAAArAMCrgMBAAAAAa8DAQAAAAGwA0AAAAABsQNAAAAAAbIDIAAAAAECAAAA2gMAIC8AAMYHACADAAAAaQAgLwAAxgcAIDAAAMoHACANAAAAaQAgFwAAzQcAICgAAMoHACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAAzAeuAyKsAwAAywesAyKuAwEAmgYAIa8DAQCaBgAhsANAAJsGACGxA0AAmwYAIbIDIACmBgAhCxcAAM0HACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAAzAeuAyKsAwAAywesAyKuAwEAmgYAIa8DAQCaBgAhsANAAJsGACGxA0AAmwYAIbIDIACmBgAhAfMDAAAArAMCAfMDAAAArgMCCy8AAM4HADAwAADSBwAw8AMAAM8HADDxAwAA0AcAMPIDAADRBwAg8wMAAMkGADD0AwAAyQYAMPUDAADJBgAw9gMAAMkGADD3AwAA0wcAMPgDAADMBgAwCRkAANgHACAaAADnBgAg_gIBAAAAAYEDQAAAAAGkAwEAAAAByQMIAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAQIAAABDACAvAADXBwAgAwAAAEMAIC8AANcHACAwAADVBwAgASgAANULADACAAAAQwAgKAAA1QcAIAIAAADNBgAgKAAA1AcAIAf-AgEAjQYAIYEDQACOBgAhpAMBAI0GACHJAwgAzwYAIcoDAQCNBgAhywMBAJoGACHMAwEAmgYAIQkZAADWBwAgGgAA0gYAIP4CAQCNBgAhgQNAAI4GACGkAwEAjQYAIckDCADPBgAhygMBAI0GACHLAwEAmgYAIcwDAQCaBgAhBy8AANALACAwAADTCwAg8AMAANELACDxAwAA0gsAIPQDAABGACD1AwAARgAg9gMAAFEAIAkZAADYBwAgGgAA5wYAIP4CAQAAAAGBA0AAAAABpAMBAAAAAckDCAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAEDLwAA0AsAIPADAADRCwAg9gMAAFEAIAQvAADOBwAw8AMAAM8HADDyAwAA0QcAIPYDAADJBgAwDAYAAK0IACAQAACvCAAgEQAArggAIP4CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAGkAwAAALgDArMDAgAAAAG0AwEAAAABtQMAAKwIACC2AyAAAAABAgAAACAAIC8AAKsIACADAAAAIAAgLwAAqwgAIDAAAOcHACABKAAAzwsAMBEDAACiBQAgBgAA4QUAIBAAAI4FACARAACNBQAg-wIAAPUFADD8AgAAHgAQ_QIAAPUFADD-AgEAAAAB_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAA9wW4AyKzAwIA9gUAIbQDAQDwBAAhtQMAAKYFACC2AyAAhgUAIQIAAAAgACAoAADnBwAgAgAAAOIHACAoAADjBwAgDfsCAADhBwAw_AIAAOIHABD9AgAA4QcAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhkANAAPEEACGkAwAA9wW4AyKzAwIA9gUAIbQDAQDwBAAhtQMAAKYFACC2AyAAhgUAIQ37AgAA4QcAMPwCAADiBwAQ_QIAAOEHADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIZADQADxBAAhpAMAAPcFuAMiswMCAPYFACG0AwEA8AQAIbUDAACmBQAgtgMgAIYFACEJ_gIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAA5ge4AyKzAwIA5AcAIbQDAQCNBgAhtQMAAOUHACC2AyAApgYAIQXzAwIAAAAB-QMCAAAAAfoDAgAAAAH7AwIAAAAB_AMCAAAAAQLzAwEAAAAE_QMBAAAABQHzAwAAALgDAgwGAADoBwAgEAAA6gcAIBEAAOkHACD-AgEAjQYAIYADAQCNBgAhgQNAAI4GACGQA0AAjgYAIaQDAADmB7gDIrMDAgDkBwAhtAMBAI0GACG1AwAA5QcAILYDIACmBgAhBS8AAJ4LACAwAADNCwAg8AMAAJ8LACDxAwAAzAsAIPYDAAAVACALLwAA_gcAMDAAAIMIADDwAwAA_wcAMPEDAACACAAw8gMAAIEIACDzAwAAgggAMPQDAACCCAAw9QMAAIIIADD2AwAAgggAMPcDAACECAAw-AMAAIUIADALLwAA6wcAMDAAAPAHADDwAwAA7AcAMPEDAADtBwAw8gMAAO4HACDzAwAA7wcAMPQDAADvBwAw9QMAAO8HADD2AwAA7wcAMPcDAADxBwAw-AMAAPIHADAJAwAA-wcAIAYAAPwHACAPAAD9BwAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAcUDAAAA4wMC5AMBAAAAAQIAAAAoACAvAAD6BwAgAwAAACgAIC8AAPoHACAwAAD2BwAgASgAAMsLADAPAwAAogUAIAYAAOEFACAOAADxBQAgDwAA8gUAIPsCAADvBQAw_AIAACYAEP0CAADvBQAw_gIBAAAAAf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIcUDAADwBeMDIuMDAQCHBQAh5AMBAIcFACHrAwAA7gUAIAIAAAAoACAoAAD2BwAgAgAAAPMHACAoAAD0BwAgCvsCAADyBwAw_AIAAPMHABD9AgAA8gcAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhxQMAAPAF4wMi4wMBAIcFACHkAwEAhwUAIQr7AgAA8gcAMPwCAADzBwAQ_QIAAPIHADD-AgEA8AQAIf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIcUDAADwBeMDIuMDAQCHBQAh5AMBAIcFACEG_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACHFAwAA9QfjAyLkAwEAmgYAIQHzAwAAAOMDAgkDAAD3BwAgBgAA-AcAIA8AAPkHACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIcUDAAD1B-MDIuQDAQCaBgAhBS8AAMALACAwAADJCwAg8AMAAMELACDxAwAAyAsAIPYDAADyAwAgBS8AAL4LACAwAADGCwAg8AMAAL8LACDxAwAAxQsAIPYDAAAVACAHLwAAvAsAIDAAAMMLACDwAwAAvQsAIPEDAADCCwAg9AMAAAsAIPUDAAALACD2AwAADQAgCQMAAPsHACAGAAD8BwAgDwAA_QcAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAHFAwAAAOMDAuQDAQAAAAEDLwAAwAsAIPADAADBCwAg9gMAAPIDACADLwAAvgsAIPADAAC_CwAg9gMAABUAIAMvAAC8CwAg8AMAAL0LACD2AwAADQAgDAMAAKQIACAGAACnCAAgEAAAqAgAIB8AAKoIACAgAACmCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeUDAQAAAAECAAAADQAgLwAAqQgAIAMAAAANACAvAACpCAAgMAAAiQgAIAEoAAC7CwAwEQMAAKIFACAGAADhBQAgDgAAhwYAIBAAAI4FACAfAADyBQAgIAAAjQUAIPsCAACFBgAw_AIAAAsAEP0CAACFBgAw_gIBAAAAAf8CAQDwBAAhgAMBAPAEACGBA0AA8QQAIaQDAACGBucDIrQDAQDwBAAh4wMBAPAEACHlAwEAhwUAIQIAAAANACAoAACJCAAgAgAAAIYIACAoAACHCAAgC_sCAACFCAAw_AIAAIYIABD9AgAAhQgAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhpAMAAIYG5wMitAMBAPAEACHjAwEA8AQAIeUDAQCHBQAhC_sCAACFCAAw_AIAAIYIABD9AgAAhQgAMP4CAQDwBAAh_wIBAPAEACGAAwEA8AQAIYEDQADxBAAhpAMAAIYG5wMitAMBAPAEACHjAwEA8AQAIeUDAQCHBQAhB_4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhpAMAAIgI5wMitAMBAI0GACHlAwEAmgYAIQHzAwAAAOcDAgwDAACKCAAgBgAAjQgAIBAAAI4IACAfAACLCAAgIAAAjAgAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhpAMAAIgI5wMitAMBAI0GACHlAwEAmgYAIQUvAACmCwAgMAAAuQsAIPADAACnCwAg8QMAALgLACD2AwAA8gMAIAcvAACgCwAgMAAAtgsAIPADAAChCwAg8QMAALULACD0AwAACwAg9QMAAAsAIPYDAAANACALLwAAmggAMDAAAJ4IADDwAwAAmwgAMPEDAACcCAAw8gMAAJ0IACDzAwAAgggAMPQDAACCCAAw9QMAAIIIADD2AwAAgggAMPcDAACfCAAw-AMAAIUIADAFLwAAogsAIDAAALMLACDwAwAAowsAIPEDAACyCwAg9gMAABUAIAsvAACPCAAwMAAAkwgAMPADAACQCAAw8QMAAJEIADDyAwAAkggAIPMDAADvBwAw9AMAAO8HADD1AwAA7wcAMPYDAADvBwAw9wMAAJQIADD4AwAA8gcAMAkDAAD7BwAgBgAA_AcAIA4AAJkIACD-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABxQMAAADjAwLjAwEAAAABAgAAACgAIC8AAJgIACADAAAAKAAgLwAAmAgAIDAAAJYIACABKAAAsQsAMAIAAAAoACAoAACWCAAgAgAAAPMHACAoAACVCAAgBv4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhxQMAAPUH4wMi4wMBAJoGACEJAwAA9wcAIAYAAPgHACAOAACXCAAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACHFAwAA9QfjAyLjAwEAmgYAIQcvAACsCwAgMAAArwsAIPADAACtCwAg8QMAAK4LACD0AwAAHgAg9QMAAB4AIPYDAAAgACAJAwAA-wcAIAYAAPwHACAOAACZCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAQMvAACsCwAg8AMAAK0LACD2AwAAIAAgDAMAAKQIACAGAACnCAAgDgAApQgAIBAAAKgIACAgAACmCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeMDAQAAAAECAAAADQAgLwAAowgAIAMAAAANACAvAACjCAAgMAAAoQgAIAEoAACrCwAwAgAAAA0AICgAAKEIACACAAAAhggAICgAAKAIACAH_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGkAwAAiAjnAyK0AwEAjQYAIeMDAQCNBgAhDAMAAIoIACAGAACNCAAgDgAAoggAIBAAAI4IACAgAACMCAAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGkAwAAiAjnAyK0AwEAjQYAIeMDAQCNBgAhBS8AAKQLACAwAACpCwAg8AMAAKULACDxAwAAqAsAIPYDAAAgACAMAwAApAgAIAYAAKcIACAOAAClCAAgEAAAqAgAICAAAKYIACD-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABpAMAAADnAwK0AwEAAAAB4wMBAAAAAQMvAACmCwAg8AMAAKcLACD2AwAA8gMAIAMvAACkCwAg8AMAAKULACD2AwAAIAAgBC8AAJoIADDwAwAAmwgAMPIDAACdCAAg9gMAAIIIADADLwAAogsAIPADAACjCwAg9gMAABUAIAQvAACPCAAw8AMAAJAIADDyAwAAkggAIPYDAADvBwAwDAMAAKQIACAGAACnCAAgEAAAqAgAIB8AAKoIACAgAACmCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeUDAQAAAAEDLwAAoAsAIPADAAChCwAg9gMAAA0AIAwGAACtCAAgEAAArwgAIBEAAK4IACD-AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABpAMAAAC4AwKzAwIAAAABtAMBAAAAAbUDAACsCAAgtgMgAAAAAQHzAwEAAAAEAy8AAJ4LACDwAwAAnwsAIPYDAAAVACAELwAA_gcAMPADAAD_BwAw8gMAAIEIACD2AwAAgggAMAQvAADrBwAw8AMAAOwHADDyAwAA7gcAIPYDAADvBwAwCQYAAPwHACAOAACZCAAgDwAA_QcAIP4CAQAAAAGAAwEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAeQDAQAAAAECAAAAKAAgLwAAuAgAIAMAAAAoACAvAAC4CAAgMAAAtwgAIAEoAACdCwAwAgAAACgAICgAALcIACACAAAA8wcAICgAALYIACAG_gIBAI0GACGAAwEAjQYAIYEDQACOBgAhxQMAAPUH4wMi4wMBAJoGACHkAwEAmgYAIQkGAAD4BwAgDgAAlwgAIA8AAPkHACD-AgEAjQYAIYADAQCNBgAhgQNAAI4GACHFAwAA9QfjAyLjAwEAmgYAIeQDAQCaBgAhCQYAAPwHACAOAACZCAAgDwAA_QcAIP4CAQAAAAGAAwEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAeQDAQAAAAEMBgAApwgAIA4AAKUIACAQAACoCAAgHwAAqggAICAAAKYIACD-AgEAAAABgAMBAAAAAYEDQAAAAAGkAwAAAOcDArQDAQAAAAHjAwEAAAAB5QMBAAAAAQIAAAANACAvAADBCAAgAwAAAA0AIC8AAMEIACAwAADACAAgASgAAJwLADACAAAADQAgKAAAwAgAIAIAAACGCAAgKAAAvwgAIAf-AgEAjQYAIYADAQCNBgAhgQNAAI4GACGkAwAAiAjnAyK0AwEAjQYAIeMDAQCNBgAh5QMBAJoGACEMBgAAjQgAIA4AAKIIACAQAACOCAAgHwAAiwgAICAAAIwIACD-AgEAjQYAIYADAQCNBgAhgQNAAI4GACGkAwAAiAjnAyK0AwEAjQYAIeMDAQCNBgAh5QMBAJoGACEMBgAApwgAIA4AAKUIACAQAACoCAAgHwAAqggAICAAAKYIACD-AgEAAAABgAMBAAAAAYEDQAAAAAGkAwAAAOcDArQDAQAAAAHjAwEAAAAB5QMBAAAAAQz-AgEAAAABgQNAAAAAAZADQAAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDQAAAAAGXA0AAAAABmAMBAAAAAZkDAQAAAAECAAAACQAgLwAAzQgAIAMAAAAJACAvAADNCAAgMAAAzAgAIAEoAACbCwAwEQMAAKIFACD7AgAAiAYAMPwCAAAHABD9AgAAiAYAMP4CAQAAAAH_AgEA8AQAIYEDQADxBAAhkANAAPEEACGRAwEA8AQAIZIDAQDwBAAhkwMBAIcFACGUAwEAhwUAIZUDAQCHBQAhlgNAAIoFACGXA0AAigUAIZgDAQCHBQAhmQMBAIcFACECAAAACQAgKAAAzAgAIAIAAADKCAAgKAAAywgAIBD7AgAAyQgAMPwCAADKCAAQ_QIAAMkIADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZEDAQDwBAAhkgMBAPAEACGTAwEAhwUAIZQDAQCHBQAhlQMBAIcFACGWA0AAigUAIZcDQACKBQAhmAMBAIcFACGZAwEAhwUAIRD7AgAAyQgAMPwCAADKCAAQ_QIAAMkIADD-AgEA8AQAIf8CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZEDAQDwBAAhkgMBAPAEACGTAwEAhwUAIZQDAQCHBQAhlQMBAIcFACGWA0AAigUAIZcDQACKBQAhmAMBAIcFACGZAwEAhwUAIQz-AgEAjQYAIYEDQACOBgAhkANAAI4GACGRAwEAjQYAIZIDAQCNBgAhkwMBAJoGACGUAwEAmgYAIZUDAQCaBgAhlgNAAJsGACGXA0AAmwYAIZgDAQCaBgAhmQMBAJoGACEM_gIBAI0GACGBA0AAjgYAIZADQACOBgAhkQMBAI0GACGSAwEAjQYAIZMDAQCaBgAhlAMBAJoGACGVAwEAmgYAIZYDQACbBgAhlwNAAJsGACGYAwEAmgYAIZkDAQCaBgAhDP4CAQAAAAGBA0AAAAABkANAAAAAAZEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgNAAAAAAZcDQAAAAAGYAwEAAAABmQMBAAAAAQf-AgEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABmgMBAAAAAZsDAQAAAAGcAwEAAAABAgAAAAUAIC8AANkIACADAAAABQAgLwAA2QgAIDAAANgIACABKAAAmgsAMAwDAACiBQAg-wIAAIkGADD8AgAAAwAQ_QIAAIkGADD-AgEAAAAB_wIBAPAEACGBA0AA8QQAIY8DQADxBAAhkANAAPEEACGaAwEAAAABmwMBAIcFACGcAwEAhwUAIQIAAAAFACAoAADYCAAgAgAAANYIACAoAADXCAAgC_sCAADVCAAw_AIAANYIABD9AgAA1QgAMP4CAQDwBAAh_wIBAPAEACGBA0AA8QQAIY8DQADxBAAhkANAAPEEACGaAwEA8AQAIZsDAQCHBQAhnAMBAIcFACEL-wIAANUIADD8AgAA1ggAEP0CAADVCAAw_gIBAPAEACH_AgEA8AQAIYEDQADxBAAhjwNAAPEEACGQA0AA8QQAIZoDAQDwBAAhmwMBAIcFACGcAwEAhwUAIQf-AgEAjQYAIYEDQACOBgAhjwNAAI4GACGQA0AAjgYAIZoDAQCNBgAhmwMBAJoGACGcAwEAmgYAIQf-AgEAjQYAIYEDQACOBgAhjwNAAI4GACGQA0AAjgYAIZoDAQCNBgAhmwMBAJoGACGcAwEAmgYAIQf-AgEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABmgMBAAAAAZsDAQAAAAGcAwEAAAABBC8AAM4IADDwAwAAzwgAMPIDAADRCAAg9gMAANIIADAELwAAwggAMPADAADDCAAw8gMAAMUIACD2AwAAxggAMAQvAAC5CAAw8AMAALoIADDyAwAAvAgAIPYDAACCCAAwBC8AALAIADDwAwAAsQgAMPIDAACzCAAg9gMAAO8HADAELwAA2gcAMPADAADbBwAw8gMAAN0HACD2AwAA3gcAMAMvAADGBwAg8AMAAMcHACD2AwAA2gMAIAQvAAC6BwAw8AMAALsHADDyAwAAvQcAIPYDAAC-BwAwAy8AAJsHACDwAwAAnAcAIPYDAADmAgAgBC8AAIsHADDwAwAAjAcAMPIDAACOBwAg9gMAAI8HADAELwAA-wYAMPADAAD8BgAw8gMAAP4GACD2AwAA_wYAMAMvAAD2BgAg8AMAAPcGACD2AwAAAQAgBC8AAOsGADDwAwAA7AYAMPIDAADuBgAg9gMAANcGADAELwAAtgYAMPADAAC3BgAw8gMAALkGACD2AwAAugYAMAAAAAAABgMAAPkIACAXAAD6CAAgrgMAAJYGACCvAwAAlgYAILADAACWBgAgsQMAAJYGACAACQMAAPkIACATAADwCAAgFAAA7wgAIJ0DAACWBgAgngMAAJYGACCgAwAAlgYAIL4DAACWBgAgvwMAAJYGACDAAwAAlgYAIAAABAMAAPkIACCnAwAAlgYAIOcDAACWBgAg6AMAAJYGACAAAAAAAAUvAACVCwAgMAAAmAsAIPADAACWCwAg8QMAAJcLACD2AwAA8gMAIAMvAACVCwAg8AMAAJYLACD2AwAA8gMAIA8EAADnCAAgBQAA6AgAIAwAAOsIACAQAADqCAAgEQAA6QgAIBIAAO4IACAVAADvCAAgFgAA8AgAIBgAAOwIACAcAADyCAAgHgAA8wgAICEAAO0IACAiAADxCAAgoAMAAJYGACCnAwAAlgYAIAAAAAAAAAUvAACQCwAgMAAAkwsAIPADAACRCwAg8QMAAJILACD2AwAA8gMAIAMvAACQCwAg8AMAAJELACD2AwAA8gMAIAAAAAAABS8AAIsLACAwAACOCwAg8AMAAIwLACDxAwAAjQsAIPYDAADyAwAgAy8AAIsLACDwAwAAjAsAIPYDAADyAwAgAAAAAAAAAAAABS8AAIYLACAwAACJCwAg8AMAAIcLACDxAwAAiAsAIPYDAADyAwAgAy8AAIYLACDwAwAAhwsAIPYDAADyAwAgAAAACy8AAJgJADAwAACdCQAw8AMAAJkJADDxAwAAmgkAMPIDAACbCQAg8wMAAJwJADD0AwAAnAkAMPUDAACcCQAw9gMAAJwJADD3AwAAngkAMPgDAACfCQAwAwYAAKUJACD-AgEAAAABgAMBAAAAAQIAAAAaACAvAACkCQAgAwAAABoAIC8AAKQJACAwAACiCQAgASgAAIULADAJBgAA4QUAIAoAAPoFACD7AgAA-QUAMPwCAAAYABD9AgAA-QUAMP4CAQAAAAGAAwEA8AQAIdADAQDwBAAh7AMAAPgFACACAAAAGgAgKAAAogkAIAIAAACgCQAgKAAAoQkAIAb7AgAAnwkAMPwCAACgCQAQ_QIAAJ8JADD-AgEA8AQAIYADAQDwBAAh0AMBAPAEACEG-wIAAJ8JADD8AgAAoAkAEP0CAACfCQAw_gIBAPAEACGAAwEA8AQAIdADAQDwBAAhAv4CAQCNBgAhgAMBAI0GACEDBgAAowkAIP4CAQCNBgAhgAMBAI0GACEFLwAAgAsAIDAAAIMLACDwAwAAgQsAIPEDAACCCwAg9gMAABUAIAMGAAClCQAg_gIBAAAAAYADAQAAAAEDLwAAgAsAIPADAACBCwAg9gMAABUAIAQvAACYCQAw8AMAAJkJADDyAwAAmwkAIPYDAACcCQAwAAAAAAAAAAAAAAAAAAAFLwAA-woAIDAAAP4KACDwAwAA_AoAIPEDAAD9CgAg9gMAAM0CACADLwAA-woAIPADAAD8CgAg9gMAAM0CACAAAAAFLwAA9goAIDAAAPkKACDwAwAA9woAIPEDAAD4CgAg9gMAABUAIAMvAAD2CgAg8AMAAPcKACD2AwAAFQAgAAAAAAAF8wMQAAAAAfkDEAAAAAH6AxAAAAAB-wMQAAAAAfwDEAAAAAEF8wMCAAAAAfkDAgAAAAH6AwIAAAAB-wMCAAAAAfwDAgAAAAEB8wMAAADeAwIF8wMIAAAAAfkDCAAAAAH6AwgAAAAB-wMIAAAAAfwDCAAAAAEKLwAArQoAMDAAALEKADDwAwAArgoAMPEDAACvCgAw8wMAALAKADD0AwAAsAoAMPUDAACwCgAw9gMAALAKADD3AwAAsgoAMPgDAACzCgAwCy8AAKQKADAwAACoCgAw8AMAAKUKADDxAwAApgoAMPIDAACnCgAg8wMAAJwJADD0AwAAnAkAMPUDAACcCQAw9gMAAJwJADD3AwAAqQoAMPgDAACfCQAwCy8AAJsKADAwAACfCgAw8AMAAJwKADDxAwAAnQoAMPIDAACeCgAg8wMAAN4HADD0AwAA3gcAMPUDAADeBwAw9gMAAN4HADD3AwAAoAoAMPgDAADhBwAwCy8AAJIKADAwAACWCgAw8AMAAJMKADDxAwAAlAoAMPIDAACVCgAg8wMAAL4HADD0AwAAvgcAMPUDAAC-BwAw9gMAAL4HADD3AwAAlwoAMPgDAADBBwAwCy8AAIkKADAwAACNCgAw8AMAAIoKADDxAwAAiwoAMPIDAACMCgAg8wMAAO8HADD0AwAA7wcAMPUDAADvBwAw9gMAAO8HADD3AwAAjgoAMPgDAADyBwAwCy8AAIAKADAwAACECgAw8AMAAIEKADDxAwAAggoAMPIDAACDCgAg8wMAAIIIADD0AwAAgggAMPUDAACCCAAw9gMAAIIIADD3AwAAhQoAMPgDAACFCAAwCy8AAPcJADAwAAD7CQAw8AMAAPgJADDxAwAA-QkAMPIDAAD6CQAg8wMAAI8HADD0AwAAjwcAMPUDAACPBwAw9gMAAI8HADD3AwAA_AkAMPgDAACSBwAwCy8AAO4JADAwAADyCQAw8AMAAO8JADDxAwAA8AkAMPIDAADxCQAg8wMAAP8GADD0AwAA_wYAMPUDAAD_BgAw9gMAAP8GADD3AwAA8wkAMPgDAACCBwAwCy8AAOUJADAwAADpCQAw8AMAAOYJADDxAwAA5wkAMPIDAADoCQAg8wMAANcGADD0AwAA1wYAMPUDAADXBgAw9gMAANcGADD3AwAA6gkAMPgDAADaBgAwCy8AANkJADAwAADeCQAw8AMAANoJADDxAwAA2wkAMPIDAADcCQAg8wMAAN0JADD0AwAA3QkAMPUDAADdCQAw9gMAAN0JADD3AwAA3wkAMPgDAADgCQAwCy8AANAJADAwAADUCQAw8AMAANEJADDxAwAA0gkAMPIDAADTCQAg8wMAALoGADD0AwAAugYAMPUDAAC6BgAw9gMAALoGADD3AwAA1QkAMPgDAAC9BgAwCQMAAIgJACAXAADqBgAg_gIBAAAAAf8CAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAALwDArwDEAAAAAECAAAAUQAgLwAA2AkAIAMAAABRACAvAADYCQAgMAAA1wkAIAEoAAD1CgAwAgAAAFEAICgAANcJACACAAAAvgYAICgAANYJACAH_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhjwNAAI4GACGQA0AAjgYAIaQDAADABrwDIrwDEADBBgAhCQMAAIcJACAXAADEBgAg_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhjwNAAI4GACGQA0AAjgYAIaQDAADABrwDIrwDEADBBgAhCQMAAIgJACAXAADqBgAg_gIBAAAAAf8CAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAALwDArwDEAAAAAEE_gIBAAAAAZ0DAQAAAAGgAwEAAAABogMBAAAAAQIAAABOACAvAADkCQAgAwAAAE4AIC8AAOQJACAwAADjCQAgASgAAPQKADAJBgAA4QUAIPsCAADiBQAw_AIAAEwAEP0CAADiBQAw_gIBAAAAAYADAQDwBAAhnQMBAPAEACGgAwEAhwUAIaIDAQDwBAAhAgAAAE4AICgAAOMJACACAAAA4QkAICgAAOIJACAI-wIAAOAJADD8AgAA4QkAEP0CAADgCQAw_gIBAPAEACGAAwEA8AQAIZ0DAQDwBAAhoAMBAIcFACGiAwEA8AQAIQj7AgAA4AkAMPwCAADhCQAQ_QIAAOAJADD-AgEA8AQAIYADAQDwBAAhnQMBAPAEACGgAwEAhwUAIaIDAQDwBAAhBP4CAQCNBgAhnQMBAI0GACGgAwEAmgYAIaIDAQCNBgAhBP4CAQCNBgAhnQMBAI0GACGgAwEAmgYAIaIDAQCNBgAhBP4CAQAAAAGdAwEAAAABoAMBAAAAAaIDAQAAAAEMAwAA4wYAIBsAAPUGACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAzwMCvAMQAAAAAcUDAAAAzgMCywMBAAAAAc8DAQAAAAECAAAAPgAgLwAA7QkAIAMAAAA-ACAvAADtCQAgMAAA7AkAIAEoAADzCgAwAgAAAD4AICgAAOwJACACAAAA2wYAICgAAOsJACAK_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhjwNAAJsGACGQA0AAjgYAIaQDAADeBs8DIrwDEADBBgAhxQMAAN0GzgMiywMBAJoGACHPAwEAmgYAIQwDAADgBgAgGwAA8wYAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIY8DQACbBgAhkANAAI4GACGkAwAA3gbPAyK8AxAAwQYAIcUDAADdBs4DIssDAQCaBgAhzwMBAJoGACEMAwAA4wYAIBsAAPUGACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAzwMCvAMQAAAAAcUDAAAAzgMCywMBAAAAAc8DAQAAAAEHAwAAtwcAIBIAAIoHACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQIAAAA1ACAvAAD2CQAgAwAAADUAIC8AAPYJACAwAAD1CQAgASgAAPIKADACAAAANQAgKAAA9QkAIAIAAACDBwAgKAAA9AkAIAX-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIb0DAQCaBgAhBwMAALUHACASAACHBwAg_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQcDAAC3BwAgEgAAigcAIP4CAQAAAAH_AgEAAAABgQNAAAAAAZADQAAAAAG9AwEAAAABBwMAAKwHACASAACaBwAg_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAb0DAQAAAAECAAAALwAgLwAA_wkAIAMAAAAvACAvAAD_CQAgMAAA_gkAIAEoAADxCgAwAgAAAC8AICgAAP4JACACAAAAkwcAICgAAP0JACAF_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhkANAAI4GACG9AwEAmgYAIQcDAACqBwAgEgAAlwcAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIZADQACOBgAhvQMBAJoGACEHAwAArAcAIBIAAJoHACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQwDAACkCAAgDgAApQgAIBAAAKgIACAfAACqCAAgIAAApggAIP4CAQAAAAH_AgEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeMDAQAAAAHlAwEAAAABAgAAAA0AIC8AAIgKACADAAAADQAgLwAAiAoAIDAAAIcKACABKAAA8AoAMAIAAAANACAoAACHCgAgAgAAAIYIACAoAACGCgAgB_4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIaQDAACICOcDIrQDAQCNBgAh4wMBAI0GACHlAwEAmgYAIQwDAACKCAAgDgAAoggAIBAAAI4IACAfAACLCAAgIAAAjAgAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIaQDAACICOcDIrQDAQCNBgAh4wMBAI0GACHlAwEAmgYAIQwDAACkCAAgDgAApQgAIBAAAKgIACAfAACqCAAgIAAApggAIP4CAQAAAAH_AgEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeMDAQAAAAHlAwEAAAABCQMAAPsHACAOAACZCAAgDwAA_QcAIP4CAQAAAAH_AgEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAeQDAQAAAAECAAAAKAAgLwAAkQoAIAMAAAAoACAvAACRCgAgMAAAkAoAIAEoAADvCgAwAgAAACgAICgAAJAKACACAAAA8wcAICgAAI8KACAG_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhxQMAAPUH4wMi4wMBAJoGACHkAwEAmgYAIQkDAAD3BwAgDgAAlwgAIA8AAPkHACD-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACHFAwAA9QfjAyLjAwEAmgYAIeQDAQCaBgAhCQMAAPsHACAOAACZCAAgDwAA_QcAIP4CAQAAAAH_AgEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAeQDAQAAAAEEAwAAkQYAIP4CAQAAAAH_AgEAAAABgQNAAAAAAQIAAAAkACAvAACaCgAgAwAAACQAIC8AAJoKACAwAACZCgAgASgAAO4KADACAAAAJAAgKAAAmQoAIAIAAADCBwAgKAAAmAoAIAP-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACEEAwAAjwYAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIQQDAACRBgAg_gIBAAAAAf8CAQAAAAGBA0AAAAABDAMAAIEJACAQAACvCAAgEQAArggAIP4CAQAAAAH_AgEAAAABgQNAAAAAAZADQAAAAAGkAwAAALgDArMDAgAAAAG0AwEAAAABtQMAAKwIACC2AyAAAAABAgAAACAAIC8AAKMKACADAAAAIAAgLwAAowoAIDAAAKIKACABKAAA7QoAMAIAAAAgACAoAACiCgAgAgAAAOIHACAoAAChCgAgCf4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIZADQACOBgAhpAMAAOYHuAMiswMCAOQHACG0AwEAjQYAIbUDAADlBwAgtgMgAKYGACEMAwAAgAkAIBAAAOoHACARAADpBwAg_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAA5ge4AyKzAwIA5AcAIbQDAQCNBgAhtQMAAOUHACC2AyAApgYAIQwDAACBCQAgEAAArwgAIBEAAK4IACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABpAMAAAC4AwKzAwIAAAABtAMBAAAAAbUDAACsCAAgtgMgAAAAAQMKAAC2CQAg_gIBAAAAAdADAQAAAAECAAAAGgAgLwAArAoAIAMAAAAaACAvAACsCgAgMAAAqwoAIAEoAADsCgAwAgAAABoAICgAAKsKACACAAAAoAkAICgAAKoKACAC_gIBAI0GACHQAwEAjQYAIQMKAAC1CQAg_gIBAI0GACHQAwEAjQYAIQMKAAC2CQAg_gIBAAAAAdADAQAAAAEJ_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAaADAQAAAAHBAwEAAAABwgMBAAAAAcYDIAAAAAHHAyAAAAABAgAAABEAIC8AALcKACADAAAAEQAgLwAAtwoAIDAAALYKACANBgAAhAYAIPsCAACDBgAw_AIAAA8AEP0CAACDBgAw_gIBAAAAAYEDQADxBAAhkANAAPEEACGdAwEAAAABoAMBAIcFACHBAwEAAAABwgMBAIcFACHGAyAAhgUAIccDIACGBQAhAgAAABEAICgAALYKACACAAAAtAoAICgAALUKACAM-wIAALMKADD8AgAAtAoAEP0CAACzCgAw_gIBAPAEACGBA0AA8QQAIZADQADxBAAhnQMBAPAEACGgAwEAhwUAIcEDAQDwBAAhwgMBAIcFACHGAyAAhgUAIccDIACGBQAhDPsCAACzCgAw_AIAALQKABD9AgAAswoAMP4CAQDwBAAhgQNAAPEEACGQA0AA8QQAIZ0DAQDwBAAhoAMBAIcFACHBAwEA8AQAIcIDAQCHBQAhxgMgAIYFACHHAyAAhgUAIQn-AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAjQYAIaADAQCaBgAhwQMBAI0GACHCAwEAmgYAIcYDIACmBgAhxwMgAKYGACEJ_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGgAwEAmgYAIcEDAQCNBgAhwgMBAJoGACHGAyAApgYAIccDIACmBgAhCf4CAQAAAAGBA0AAAAABkANAAAAAAZ0DAQAAAAGgAwEAAAABwQMBAAAAAcIDAQAAAAHGAyAAAAABxwMgAAAAAQMvAACtCgAw8AMAAK4KADD2AwAAsAoAMAQvAACkCgAw8AMAAKUKADDyAwAApwoAIPYDAACcCQAwBC8AAJsKADDwAwAAnAoAMPIDAACeCgAg9gMAAN4HADAELwAAkgoAMPADAACTCgAw8gMAAJUKACD2AwAAvgcAMAQvAACJCgAw8AMAAIoKADDyAwAAjAoAIPYDAADvBwAwBC8AAIAKADDwAwAAgQoAMPIDAACDCgAg9gMAAIIIADAELwAA9wkAMPADAAD4CQAw8gMAAPoJACD2AwAAjwcAMAQvAADuCQAw8AMAAO8JADDyAwAA8QkAIPYDAAD_BgAwBC8AAOUJADDwAwAA5gkAMPIDAADoCQAg9gMAANcGADAELwAA2QkAMPADAADaCQAw8gMAANwJACD2AwAA3QkAMAQvAADQCQAw8AMAANEJADDyAwAA0wkAIPYDAAC6BgAwAAAACi8AAMcKADAwAADLCgAw8AMAAMgKADDxAwAAyQoAMPMDAADKCgAw9AMAAMoKADD1AwAAygoAMPYDAADKCgAw9wMAAMwKADD4AwAAzQoAMCELAAC5CgAgDAAAugoAIA0AALsKACAQAAC8CgAgEQAAvQoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AANEKACADAAAAFQAgLwAA0QoAIDAAANAKACAmCAAAgQYAIAsAALkFACAMAACPBQAgDQAAkQUAIBAAAI4FACARAACNBQAgFQAAkwUAIBYAAJQFACAcAACWBQAgHQAAggYAIB4AAJcFACD7AgAA_AUAMPwCAAATABD9AgAA_AUAMP4CAQAAAAGBA0AA8QQAIZADQADxBAAhwQMBAAAAAcUDAQDwBAAhxgMgAIYFACHHAyAAhgUAIdEDAQDwBAAh0gMBAPAEACHTAwIA9gUAIdQDAQDwBAAh1QMBAIcFACHWAwEAhwUAIdcDAQCHBQAh2AMBAIcFACHZAxAA_QUAIdoDEAD9BQAh2wMCAP4FACHcAwIA_gUAId4DAAD_Bd4DIt8DCACABgAh4AMCAPYFACHhAwIA9gUAIe0DAAD7BQAgAgAAABUAICgAANAKACACAAAAzgoAICgAAM8KACAa-wIAAM0KADD8AgAAzgoAEP0CAADNCgAw_gIBAPAEACGBA0AA8QQAIZADQADxBAAhwQMBAPAEACHFAwEA8AQAIcYDIACGBQAhxwMgAIYFACHRAwEA8AQAIdIDAQDwBAAh0wMCAPYFACHUAwEA8AQAIdUDAQCHBQAh1gMBAIcFACHXAwEAhwUAIdgDAQCHBQAh2QMQAP0FACHaAxAA_QUAIdsDAgD-BQAh3AMCAP4FACHeAwAA_wXeAyLfAwgAgAYAIeADAgD2BQAh4QMCAPYFACEa-wIAAM0KADD8AgAAzgoAEP0CAADNCgAw_gIBAPAEACGBA0AA8QQAIZADQADxBAAhwQMBAPAEACHFAwEA8AQAIcYDIACGBQAhxwMgAIYFACHRAwEA8AQAIdIDAQDwBAAh0wMCAPYFACHUAwEA8AQAIdUDAQCHBQAh1gMBAIcFACHXAwEAhwUAIdgDAQCHBQAh2QMQAP0FACHaAxAA_QUAIdsDAgD-BQAh3AMCAP4FACHeAwAA_wXeAyLfAwgAgAYAIeADAgD2BQAh4QMCAPYFACEX_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEhCwAAxgkAIAwAAMcJACANAADICQAgEAAAyQkAIBEAAMoJACAVAADLCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgHgAAzwkAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhIQsAALkKACAMAAC6CgAgDQAAuwoAIBAAALwKACARAAC9CgAgFQAAvgoAIBYAAL8KACAcAADACgAgHQAAwQoAIB4AAMIKACD-AgEAAAABgQNAAAAAAZADQAAAAAHBAwEAAAABxQMBAAAAAcYDIAAAAAHHAyAAAAAB0QMBAAAAAdIDAQAAAAHTAwIAAAAB1AMBAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAxAAAAAB2gMQAAAAAdsDAgAAAAHcAwIAAAAB3gMAAADeAwLfAwgAAAAB4AMCAAAAAeEDAgAAAAEDLwAAxwoAMPADAADICgAw9gMAAMoKADAAAAAAAAAAAAAFLwAA5woAIDAAAOoKACDwAwAA6AoAIPEDAADpCgAg9gMAAPIDACADLwAA5woAIPADAADoCgAg9gMAAPIDACAUCAAA5AoAIAsAAKcJACAMAADrCAAgDQAA7QgAIBAAAOoIACARAADpCAAgFQAA7wgAIBYAAPAIACAcAADyCAAgHQAA5QoAIB4AAPMIACDVAwAAlgYAINYDAACWBgAg1wMAAJYGACDYAwAAlgYAINkDAACWBgAg2gMAAJYGACDbAwAAlgYAINwDAACWBgAg3wMAAJYGACADAwAA-QgAIAYAAN4KACAXAAD6CAAgBRgAAOwIACAZAADfCgAgGgAA8ggAIMsDAACWBgAgzAMAAJYGACAEAwAA-QgAIAYAAN4KACAQAADqCAAgEQAA6QgAIAcDAAD5CAAgBgAA3goAIA4AAOEKACAQAADqCAAgHwAA4goAICAAAOkIACDlAwAAlgYAIAUJAACnCQAgwgMAAJYGACDDAwAAlgYAIMQDAACWBgAgxQMAAJYGACAAAAAYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFQAA4ggAIBYAAOMIACAYAADfCAAgHAAA5QgAIB4AAOYIACAhAADgCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAOcKACADAAAA9QMAIC8AAOcKACAwAADrCgAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAoAADrCgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHAAAtAYAIB4AALUGACAhAACvBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEC_gIBAAAAAdADAQAAAAEJ_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAaQDAAAAuAMCswMCAAAAAbQDAQAAAAG1AwAArAgAILYDIAAAAAED_gIBAAAAAf8CAQAAAAGBA0AAAAABBv4CAQAAAAH_AgEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAeQDAQAAAAEH_gIBAAAAAf8CAQAAAAGBA0AAAAABpAMAAADnAwK0AwEAAAAB4wMBAAAAAeUDAQAAAAEF_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAb0DAQAAAAEF_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAb0DAQAAAAEK_gIBAAAAAf8CAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAAM8DArwDEAAAAAHFAwAAAM4DAssDAQAAAAHPAwEAAAABBP4CAQAAAAGdAwEAAAABoAMBAAAAAaIDAQAAAAEH_gIBAAAAAf8CAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAALwDArwDEAAAAAEhCAAAuAoAIAsAALkKACAMAAC6CgAgDQAAuwoAIBAAALwKACARAAC9CgAgFQAAvgoAIBYAAL8KACAcAADACgAgHgAAwgoAIP4CAQAAAAGBA0AAAAABkANAAAAAAcEDAQAAAAHFAwEAAAABxgMgAAAAAccDIAAAAAHRAwEAAAAB0gMBAAAAAdMDAgAAAAHUAwEAAAAB1QMBAAAAAdYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDEAAAAAHaAxAAAAAB2wMCAAAAAdwDAgAAAAHeAwAAAN4DAt8DCAAAAAHgAwIAAAAB4QMCAAAAAQIAAAAVACAvAAD2CgAgAwAAABMAIC8AAPYKACAwAAD6CgAgIwAAABMAIAgAAMUJACALAADGCQAgDAAAxwkAIA0AAMgJACAQAADJCQAgEQAAygkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB4AAM8JACAoAAD6CgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEhCAAAxQkAIAsAAMYJACAMAADHCQAgDQAAyAkAIBAAAMkJACARAADKCQAgFQAAywkAIBYAAMwJACAcAADNCQAgHgAAzwkAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhC_4CAQAAAAGBA0AAAAABkANAAAAAAZ0DAQAAAAHBAwEAAAABwgMBAAAAAcMDAQAAAAHEAwEAAAABxQMBAAAAAcYDIAAAAAHHAyAAAAABAgAAAM0CACAvAAD7CgAgAwAAANACACAvAAD7CgAgMAAA_woAIA0AAADQAgAgKAAA_woAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCNBgAhwQMBAI0GACHCAwEAmgYAIcMDAQCaBgAhxAMBAJoGACHFAwEAmgYAIcYDIACmBgAhxwMgAKYGACEL_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACHBAwEAjQYAIcIDAQCaBgAhwwMBAJoGACHEAwEAmgYAIcUDAQCaBgAhxgMgAKYGACHHAyAApgYAISEIAAC4CgAgDAAAugoAIA0AALsKACAQAAC8CgAgEQAAvQoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AAIALACADAAAAEwAgLwAAgAsAIDAAAIQLACAjAAAAEwAgCAAAxQkAIAwAAMcJACANAADICQAgEAAAyQkAIBEAAMoJACAVAADLCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgHgAAzwkAICgAAIQLACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAISEIAADFCQAgDAAAxwkAIA0AAMgJACAQAADJCQAgEQAAygkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB0AAM4JACAeAADPCQAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEC_gIBAAAAAYADAQAAAAEYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACAVAADiCAAgFgAA4wgAIBgAAN8IACAcAADlCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAIYLACADAAAA9QMAIC8AAIYLACAwAACKCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBUAALEGACAWAACyBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACAoAACKCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFQAA4ggAIBYAAOMIACAYAADfCAAgHAAA5QgAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAIsLACADAAAA9QMAIC8AAIsLACAwAACPCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgIQAArwYAICIAALMGACAoAACPCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHAAAtAYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAA2ggAIAUAANsIACAQAADdCAAgEQAA3AgAIBIAAOEIACAVAADiCAAgFgAA4wgAIBgAAN8IACAcAADlCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAJALACADAAAA9QMAIC8AAJALACAwAACUCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIBAAAKwGACARAACrBgAgEgAAsAYAIBUAALEGACAWAACyBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACAoAACUCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFQAA4ggAIBYAAOMIACAcAADlCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAJULACADAAAA9QMAIC8AAJULACAwAACZCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACAoAACZCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEH_gIBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAZoDAQAAAAGbAwEAAAABnAMBAAAAAQz-AgEAAAABgQNAAAAAAZADQAAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDQAAAAAGXA0AAAAABmAMBAAAAAZkDAQAAAAEH_gIBAAAAAYADAQAAAAGBA0AAAAABpAMAAADnAwK0AwEAAAAB4wMBAAAAAeUDAQAAAAEG_gIBAAAAAYADAQAAAAGBA0AAAAABxQMAAADjAwLjAwEAAAAB5AMBAAAAASEIAAC4CgAgCwAAuQoAIA0AALsKACAQAAC8CgAgEQAAvQoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AAJ4LACANAwAApAgAIAYAAKcIACAOAAClCAAgEAAAqAgAIB8AAKoIACD-AgEAAAAB_wIBAAAAAYADAQAAAAGBA0AAAAABpAMAAADnAwK0AwEAAAAB4wMBAAAAAeUDAQAAAAECAAAADQAgLwAAoAsAICEIAAC4CgAgCwAAuQoAIAwAALoKACANAAC7CgAgEAAAvAoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AAKILACANAwAAgQkAIAYAAK0IACAQAACvCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAGkAwAAALgDArMDAgAAAAG0AwEAAAABtQMAAKwIACC2AyAAAAABAgAAACAAIC8AAKQLACAYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBIAAOEIACAVAADiCAAgFgAA4wgAIBgAAN8IACAcAADlCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAKYLACADAAAAHgAgLwAApAsAIDAAAKoLACAPAAAAHgAgAwAAgAkAIAYAAOgHACAQAADqBwAgKAAAqgsAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAA5ge4AyKzAwIA5AcAIbQDAQCNBgAhtQMAAOUHACC2AyAApgYAIQ0DAACACQAgBgAA6AcAIBAAAOoHACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIZADQACOBgAhpAMAAOYHuAMiswMCAOQHACG0AwEAjQYAIbUDAADlBwAgtgMgAKYGACEH_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeMDAQAAAAENAwAAgQkAIAYAAK0IACARAACuCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAGkAwAAALgDArMDAgAAAAG0AwEAAAABtQMAAKwIACC2AyAAAAABAgAAACAAIC8AAKwLACADAAAAHgAgLwAArAsAIDAAALALACAPAAAAHgAgAwAAgAkAIAYAAOgHACARAADpBwAgKAAAsAsAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAA5ge4AyKzAwIA5AcAIbQDAQCNBgAhtQMAAOUHACC2AyAApgYAIQ0DAACACQAgBgAA6AcAIBEAAOkHACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIZADQACOBgAhpAMAAOYHuAMiswMCAOQHACG0AwEAjQYAIbUDAADlBwAgtgMgAKYGACEG_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAcUDAAAA4wMC4wMBAAAAAQMAAAATACAvAACiCwAgMAAAtAsAICMAAAATACAIAADFCQAgCwAAxgkAIAwAAMcJACANAADICQAgEAAAyQkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB0AAM4JACAeAADPCQAgKAAAtAsAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhIQgAAMUJACALAADGCQAgDAAAxwkAIA0AAMgJACAQAADJCQAgFQAAywkAIBYAAMwJACAcAADNCQAgHQAAzgkAIB4AAM8JACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAIQMAAAALACAvAACgCwAgMAAAtwsAIA8AAAALACADAACKCAAgBgAAjQgAIA4AAKIIACAQAACOCAAgHwAAiwgAICgAALcLACD-AgEAjQYAIf8CAQCNBgAhgAMBAI0GACGBA0AAjgYAIaQDAACICOcDIrQDAQCNBgAh4wMBAI0GACHlAwEAmgYAIQ0DAACKCAAgBgAAjQgAIA4AAKIIACAQAACOCAAgHwAAiwgAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhpAMAAIgI5wMitAMBAI0GACHjAwEAjQYAIeUDAQCaBgAhAwAAAPUDACAvAACmCwAgMAAAugsAIBoAAAD1AwAgBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAgKAAAugsAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCNBgAhngMBAI0GACGfAyAApgYAIaADAQCaBgAhogMAAKcGogMipAMAAKgGpAMipQMgAKYGACGmAyAApgYAIacDQACbBgAhGAQAAKkGACAFAACqBgAgDAAArQYAIBAAAKwGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHAAAtAYAIB4AALUGACAhAACvBgAgIgAAswYAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCNBgAhngMBAI0GACGfAyAApgYAIaADAQCaBgAhogMAAKcGogMipAMAAKgGpAMipQMgAKYGACGmAyAApgYAIacDQACbBgAhB_4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGkAwAAAOcDArQDAQAAAAHlAwEAAAABDQMAAKQIACAGAACnCAAgDgAApQgAIB8AAKoIACAgAACmCAAg_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAaQDAAAA5wMCtAMBAAAAAeMDAQAAAAHlAwEAAAABAgAAAA0AIC8AALwLACAhCAAAuAoAIAsAALkKACAMAAC6CgAgDQAAuwoAIBEAAL0KACAVAAC-CgAgFgAAvwoAIBwAAMAKACAdAADBCgAgHgAAwgoAIP4CAQAAAAGBA0AAAAABkANAAAAAAcEDAQAAAAHFAwEAAAABxgMgAAAAAccDIAAAAAHRAwEAAAAB0gMBAAAAAdMDAgAAAAHUAwEAAAAB1QMBAAAAAdYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDEAAAAAHaAxAAAAAB2wMCAAAAAdwDAgAAAAHeAwAAAN4DAt8DCAAAAAHgAwIAAAAB4QMCAAAAAQIAAAAVACAvAAC-CwAgGAQAANoIACAFAADbCAAgDAAA3ggAIBEAANwIACASAADhCAAgFQAA4ggAIBYAAOMIACAYAADfCAAgHAAA5QgAIB4AAOYIACAhAADgCAAgIgAA5AgAIP4CAQAAAAGBA0AAAAABkANAAAAAAZ0DAQAAAAGeAwEAAAABnwMgAAAAAaADAQAAAAGiAwAAAKIDAqQDAAAApAMCpQMgAAAAAaYDIAAAAAGnA0AAAAABAgAAAPIDACAvAADACwAgAwAAAAsAIC8AALwLACAwAADECwAgDwAAAAsAIAMAAIoIACAGAACNCAAgDgAAoggAIB8AAIsIACAgAACMCAAgKAAAxAsAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhpAMAAIgI5wMitAMBAI0GACHjAwEAjQYAIeUDAQCaBgAhDQMAAIoIACAGAACNCAAgDgAAoggAIB8AAIsIACAgAACMCAAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGkAwAAiAjnAyK0AwEAjQYAIeMDAQCNBgAh5QMBAJoGACEDAAAAEwAgLwAAvgsAIDAAAMcLACAjAAAAEwAgCAAAxQkAIAsAAMYJACAMAADHCQAgDQAAyAkAIBEAAMoJACAVAADLCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgHgAAzwkAICgAAMcLACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAISEIAADFCQAgCwAAxgkAIAwAAMcJACANAADICQAgEQAAygkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB0AAM4JACAeAADPCQAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEDAAAA9QMAIC8AAMALACAwAADKCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACARAACrBgAgEgAAsAYAIBUAALEGACAWAACyBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACAoAADKCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEG_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAcUDAAAA4wMC5AMBAAAAAQMAAAATACAvAACeCwAgMAAAzgsAICMAAAATACAIAADFCQAgCwAAxgkAIA0AAMgJACAQAADJCQAgEQAAygkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB0AAM4JACAeAADPCQAgKAAAzgsAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhIQgAAMUJACALAADGCQAgDQAAyAkAIBAAAMkJACARAADKCQAgFQAAywkAIBYAAMwJACAcAADNCQAgHQAAzgkAIB4AAM8JACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAIQn-AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABpAMAAAC4AwKzAwIAAAABtAMBAAAAAbUDAACsCAAgtgMgAAAAAQoDAACICQAgBgAA6QYAIP4CAQAAAAH_AgEAAAABgAMBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAvAMCvAMQAAAAAQIAAABRACAvAADQCwAgAwAAAEYAIC8AANALACAwAADUCwAgDAAAAEYAIAMAAIcJACAGAADDBgAgKAAA1AsAIP4CAQCNBgAh_wIBAI0GACGAAwEAjQYAIYEDQACOBgAhjwNAAI4GACGQA0AAjgYAIaQDAADABrwDIrwDEADBBgAhCgMAAIcJACAGAADDBgAg_gIBAI0GACH_AgEAjQYAIYADAQCNBgAhgQNAAI4GACGPA0AAjgYAIZADQACOBgAhpAMAAMAGvAMivAMQAMEGACEH_gIBAAAAAYEDQAAAAAGkAwEAAAAByQMIAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAQP-AgEAAAABgAMBAAAAAYEDQAAAAAEYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFQAA4ggAIBgAAN8IACAcAADlCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AANcLACADAAAA9QMAIC8AANcLACAwAADbCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACAoAADbCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEF_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAEYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFgAA4wgAIBgAAN8IACAcAADlCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAN0LACADAAAA9QMAIC8AAN0LACAwAADhCwAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAWAACyBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACAoAADhCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEF_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAEMAwAAkwkAIBMAALgHACD-AgEAAAAB_wIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGgAwEAAAABvgMBAAAAAb8DAQAAAAHAAwEAAAABAgAAAOYCACAvAADjCwAgIQgAALgKACALAAC5CgAgDAAAugoAIA0AALsKACAQAAC8CgAgEQAAvQoAIBYAAL8KACAcAADACgAgHQAAwQoAIB4AAMIKACD-AgEAAAABgQNAAAAAAZADQAAAAAHBAwEAAAABxQMBAAAAAcYDIAAAAAHHAyAAAAAB0QMBAAAAAdIDAQAAAAHTAwIAAAAB1AMBAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAxAAAAAB2gMQAAAAAdsDAgAAAAHcAwIAAAAB3gMAAADeAwLfAwgAAAAB4AMCAAAAAeEDAgAAAAECAAAAFQAgLwAA5QsAIAMAAAAxACAvAADjCwAgMAAA6QsAIA4AAAAxACADAACSCQAgEwAAoAcAICgAAOkLACD-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCaBgAhngMBAJoGACGgAwEAmgYAIb4DAQCaBgAhvwMBAJoGACHAAwEAmgYAIQwDAACSCQAgEwAAoAcAIP4CAQCNBgAh_wIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAJoGACGeAwEAmgYAIaADAQCaBgAhvgMBAJoGACG_AwEAmgYAIcADAQCaBgAhAwAAABMAIC8AAOULACAwAADsCwAgIwAAABMAIAgAAMUJACALAADGCQAgDAAAxwkAIA0AAMgJACAQAADJCQAgEQAAygkAIBYAAMwJACAcAADNCQAgHQAAzgkAIB4AAM8JACAoAADsCwAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEhCAAAxQkAIAsAAMYJACAMAADHCQAgDQAAyAkAIBAAAMkJACARAADKCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgHgAAzwkAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhBf4CAQAAAAGAAwEAAAABgQNAAAAAAZADQAAAAAG9AwEAAAABDAMAAJMJACAUAAC5BwAg_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAZ0DAQAAAAGeAwEAAAABoAMBAAAAAb4DAQAAAAG_AwEAAAABwAMBAAAAAQIAAADmAgAgLwAA7gsAICEIAAC4CgAgCwAAuQoAIAwAALoKACANAAC7CgAgEAAAvAoAIBEAAL0KACAVAAC-CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AAPALACADAAAAMQAgLwAA7gsAIDAAAPQLACAOAAAAMQAgAwAAkgkAIBQAAKEHACAoAAD0CwAg_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAmgYAIZ4DAQCaBgAhoAMBAJoGACG-AwEAmgYAIb8DAQCaBgAhwAMBAJoGACEMAwAAkgkAIBQAAKEHACD-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIZ0DAQCaBgAhngMBAJoGACGgAwEAmgYAIb4DAQCaBgAhvwMBAJoGACHAAwEAmgYAIQMAAAATACAvAADwCwAgMAAA9wsAICMAAAATACAIAADFCQAgCwAAxgkAIAwAAMcJACANAADICQAgEAAAyQkAIBEAAMoJACAVAADLCQAgHAAAzQkAIB0AAM4JACAeAADPCQAgKAAA9wsAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhIQgAAMUJACALAADGCQAgDAAAxwkAIA0AAMgJACAQAADJCQAgEQAAygkAIBUAAMsJACAcAADNCQAgHQAAzgkAIB4AAM8JACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAIQX-AgEAAAABgAMBAAAAAYEDQAAAAAGQA0AAAAABvQMBAAAAAQoYAADmBgAgGQAA2AcAIP4CAQAAAAGBA0AAAAABpAMBAAAAAcgDAQAAAAHJAwgAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABAgAAAEMAIC8AAPkLACADAAAAQAAgLwAA-QsAIDAAAP0LACAMAAAAQAAgGAAA0QYAIBkAANYHACAoAAD9CwAg_gIBAI0GACGBA0AAjgYAIaQDAQCNBgAhyAMBAI0GACHJAwgAzwYAIcoDAQCNBgAhywMBAJoGACHMAwEAmgYAIQoYAADRBgAgGQAA1gcAIP4CAQCNBgAhgQNAAI4GACGkAwEAjQYAIcgDAQCNBgAhyQMIAM8GACHKAwEAjQYAIcsDAQCaBgAhzAMBAJoGACEK_gIBAAAAAYADAQAAAAGBA0AAAAABjwNAAAAAAZADQAAAAAGkAwAAAM8DArwDEAAAAAHFAwAAAM4DAssDAQAAAAHPAwEAAAABIQgAALgKACALAAC5CgAgDAAAugoAIA0AALsKACAQAAC8CgAgEQAAvQoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACD-AgEAAAABgQNAAAAAAZADQAAAAAHBAwEAAAABxQMBAAAAAcYDIAAAAAHHAyAAAAAB0QMBAAAAAdIDAQAAAAHTAwIAAAAB1AMBAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAxAAAAAB2gMQAAAAAdsDAgAAAAHcAwIAAAAB3gMAAADeAwLfAwgAAAAB4AMCAAAAAeEDAgAAAAECAAAAFQAgLwAA_wsAIAwDAAD4CAAg_gIBAAAAAf8CAQAAAAGBA0AAAAABkANAAAAAAaQDAAAArgMCrAMAAACsAwKuAwEAAAABrwMBAAAAAbADQAAAAAGxA0AAAAABsgMgAAAAAQIAAADaAwAgLwAAgQwAICEIAAC4CgAgCwAAuQoAIAwAALoKACANAAC7CgAgEAAAvAoAIBEAAL0KACAVAAC-CgAgFgAAvwoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AAIMMACAYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFQAA4ggAIBYAAOMIACAYAADfCAAgHgAA5ggAICEAAOAIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAIUMACADAAAAEwAgLwAAgwwAIDAAAIkMACAjAAAAEwAgCAAAxQkAIAsAAMYJACAMAADHCQAgDQAAyAkAIBAAAMkJACARAADKCQAgFQAAywkAIBYAAMwJACAdAADOCQAgHgAAzwkAICgAAIkMACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAISEIAADFCQAgCwAAxgkAIAwAAMcJACANAADICQAgEAAAyQkAIBEAAMoJACAVAADLCQAgFgAAzAkAIB0AAM4JACAeAADPCQAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEDAAAA9QMAIC8AAIUMACAwAACMDAAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAeAAC1BgAgIQAArwYAICIAALMGACAoAACMDAAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHgAAtQYAICEAAK8GACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEK_gIBAAAAAf8CAQAAAAGAAwEAAAABgQNAAAAAAY8DQAAAAAGQA0AAAAABpAMAAADPAwK8AxAAAAABxQMAAADOAwLLAwEAAAABAwAAAGkAIC8AAIEMACAwAACQDAAgDgAAAGkAIAMAAPcIACAoAACQDAAg_gIBAI0GACH_AgEAjQYAIYEDQACOBgAhkANAAI4GACGkAwAAzAeuAyKsAwAAywesAyKuAwEAmgYAIa8DAQCaBgAhsANAAJsGACGxA0AAmwYAIbIDIACmBgAhDAMAAPcIACD-AgEAjQYAIf8CAQCNBgAhgQNAAI4GACGQA0AAjgYAIaQDAADMB64DIqwDAADLB6wDIq4DAQCaBgAhrwMBAJoGACGwA0AAmwYAIbEDQACbBgAhsgMgAKYGACEH_gIBAAAAAYEDQAAAAAGkAwEAAAAByAMBAAAAAckDCAAAAAHKAwEAAAABywMBAAAAAQMAAAATACAvAAD_CwAgMAAAlAwAICMAAAATACAIAADFCQAgCwAAxgkAIAwAAMcJACANAADICQAgEAAAyQkAIBEAAMoJACAVAADLCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgKAAAlAwAIP4CAQCNBgAhgQNAAI4GACGQA0AAjgYAIcEDAQCNBgAhxQMBAI0GACHGAyAApgYAIccDIACmBgAh0QMBAI0GACHSAwEAjQYAIdMDAgDkBwAh1AMBAI0GACHVAwEAmgYAIdYDAQCaBgAh1wMBAJoGACHYAwEAmgYAIdkDEADBCQAh2gMQAMEJACHbAwIAwgkAIdwDAgDCCQAh3gMAAMMJ3gMi3wMIAMQJACHgAwIA5AcAIeEDAgDkBwAhIQgAAMUJACALAADGCQAgDAAAxwkAIA0AAMgJACAQAADJCQAgEQAAygkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB0AAM4JACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAIQf-AgEAAAABgAMBAAAAAYEDQAAAAAGPA0AAAAABkANAAAAAAaQDAAAAvAMCvAMQAAAAARgFAADbCAAgDAAA3ggAIBAAAN0IACARAADcCAAgEgAA4QgAIBUAAOIIACAWAADjCAAgGAAA3wgAIBwAAOUIACAeAADmCAAgIQAA4AgAICIAAOQIACD-AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABngMBAAAAAZ8DIAAAAAGgAwEAAAABogMAAACiAwKkAwAAAKQDAqUDIAAAAAGmAyAAAAABpwNAAAAAAQIAAADyAwAgLwAAlgwAIAMAAAD1AwAgLwAAlgwAIDAAAJoMACAaAAAA9QMAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHAAAtAYAIB4AALUGACAhAACvBgAgIgAAswYAICgAAJoMACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAjQYAIZ4DAQCNBgAhnwMgAKYGACGgAwEAmgYAIaIDAACnBqIDIqQDAACoBqQDIqUDIACmBgAhpgMgAKYGACGnA0AAmwYAIRgFAACqBgAgDAAArQYAIBAAAKwGACARAACrBgAgEgAAsAYAIBUAALEGACAWAACyBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAjQYAIZ4DAQCNBgAhnwMgAKYGACGgAwEAmgYAIaIDAACnBqIDIqQDAACoBqQDIqUDIACmBgAhpgMgAKYGACGnA0AAmwYAIRgEAADaCAAgDAAA3ggAIBAAAN0IACARAADcCAAgEgAA4QgAIBUAAOIIACAWAADjCAAgGAAA3wgAIBwAAOUIACAeAADmCAAgIQAA4AgAICIAAOQIACD-AgEAAAABgQNAAAAAAZADQAAAAAGdAwEAAAABngMBAAAAAZ8DIAAAAAGgAwEAAAABogMAAACiAwKkAwAAAKQDAqUDIAAAAAGmAyAAAAABpwNAAAAAAQIAAADyAwAgLwAAmwwAIAMAAAD1AwAgLwAAmwwAIDAAAJ8MACAaAAAA9QMAIAQAAKkGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHAAAtAYAIB4AALUGACAhAACvBgAgIgAAswYAICgAAJ8MACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAjQYAIZ4DAQCNBgAhnwMgAKYGACGgAwEAmgYAIaIDAACnBqIDIqQDAACoBqQDIqUDIACmBgAhpgMgAKYGACGnA0AAmwYAIRgEAACpBgAgDAAArQYAIBAAAKwGACARAACrBgAgEgAAsAYAIBUAALEGACAWAACyBgAgGAAArgYAIBwAALQGACAeAAC1BgAgIQAArwYAICIAALMGACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACGdAwEAjQYAIZ4DAQCNBgAhnwMgAKYGACGgAwEAmgYAIaIDAACnBqIDIqQDAACoBqQDIqUDIACmBgAhpgMgAKYGACGnA0AAmwYAISEIAAC4CgAgCwAAuQoAIAwAALoKACAQAAC8CgAgEQAAvQoAIBUAAL4KACAWAAC_CgAgHAAAwAoAIB0AAMEKACAeAADCCgAg_gIBAAAAAYEDQAAAAAGQA0AAAAABwQMBAAAAAcUDAQAAAAHGAyAAAAABxwMgAAAAAdEDAQAAAAHSAwEAAAAB0wMCAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMQAAAAAdoDEAAAAAHbAwIAAAAB3AMCAAAAAd4DAAAA3gMC3wMIAAAAAeADAgAAAAHhAwIAAAABAgAAABUAIC8AAKAMACAYBAAA2ggAIAUAANsIACAMAADeCAAgEAAA3QgAIBEAANwIACASAADhCAAgFQAA4ggAIBYAAOMIACAYAADfCAAgHAAA5QgAIB4AAOYIACAiAADkCAAg_gIBAAAAAYEDQAAAAAGQA0AAAAABnQMBAAAAAZ4DAQAAAAGfAyAAAAABoAMBAAAAAaIDAAAAogMCpAMAAACkAwKlAyAAAAABpgMgAAAAAacDQAAAAAECAAAA8gMAIC8AAKIMACADAAAAEwAgLwAAoAwAIDAAAKYMACAjAAAAEwAgCAAAxQkAIAsAAMYJACAMAADHCQAgEAAAyQkAIBEAAMoJACAVAADLCQAgFgAAzAkAIBwAAM0JACAdAADOCQAgHgAAzwkAICgAAKYMACD-AgEAjQYAIYEDQACOBgAhkANAAI4GACHBAwEAjQYAIcUDAQCNBgAhxgMgAKYGACHHAyAApgYAIdEDAQCNBgAh0gMBAI0GACHTAwIA5AcAIdQDAQCNBgAh1QMBAJoGACHWAwEAmgYAIdcDAQCaBgAh2AMBAJoGACHZAxAAwQkAIdoDEADBCQAh2wMCAMIJACHcAwIAwgkAId4DAADDCd4DIt8DCADECQAh4AMCAOQHACHhAwIA5AcAISEIAADFCQAgCwAAxgkAIAwAAMcJACAQAADJCQAgEQAAygkAIBUAAMsJACAWAADMCQAgHAAAzQkAIB0AAM4JACAeAADPCQAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhwQMBAI0GACHFAwEAjQYAIcYDIACmBgAhxwMgAKYGACHRAwEAjQYAIdIDAQCNBgAh0wMCAOQHACHUAwEAjQYAIdUDAQCaBgAh1gMBAJoGACHXAwEAmgYAIdgDAQCaBgAh2QMQAMEJACHaAxAAwQkAIdsDAgDCCQAh3AMCAMIJACHeAwAAwwneAyLfAwgAxAkAIeADAgDkBwAh4QMCAOQHACEDAAAA9QMAIC8AAKIMACAwAACpDAAgGgAAAPUDACAEAACpBgAgBQAAqgYAIAwAAK0GACAQAACsBgAgEQAAqwYAIBIAALAGACAVAACxBgAgFgAAsgYAIBgAAK4GACAcAAC0BgAgHgAAtQYAICIAALMGACAoAACpDAAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEYBAAAqQYAIAUAAKoGACAMAACtBgAgEAAArAYAIBEAAKsGACASAACwBgAgFQAAsQYAIBYAALIGACAYAACuBgAgHAAAtAYAIB4AALUGACAiAACzBgAg_gIBAI0GACGBA0AAjgYAIZADQACOBgAhnQMBAI0GACGeAwEAjQYAIZ8DIACmBgAhoAMBAJoGACGiAwAApwaiAyKkAwAAqAakAyKlAyAApgYAIaYDIACmBgAhpwNAAJsGACEBAwACDgQGAwUKBAcAHgxoBhBnDhEOBRJsEBVtDxZuERhqFRxxEx5yFyFrDSJwAQEDAAIBAwACBwMAAgYABwcAHQ4ABhBkDh9iBSBjBQUDAAIGAAcHABwQXw4RXgUMBwAbCBIICxsKDCEGDSUNECkOESwFFTAPFjsRHD8THU8aHlIXAgYWBwcACQEGFwACBgAHCgALAgcADAkcCgEJHQACAwACBgAHBAMAAgYABw4qBg8rBQMDAAIGAAcSMhAEAwACBwASEzYRFDgPAwMAAgYABxI3EAITOQAUOgADAwACBgAHG0EUBAcAGRgAFRlHFxpKEwMDAAIHABYXRBQBF0UABAMAAgYABwcAGBdIFAEXSQABGksAAQYABwsIUwALVAAMVQANVgAQVwARWAAVWQAWWgAcWwAdXAAeXQACEGEAEWAAAhBmACBlAAoEcwAFdAAMdwAQdgARdQAVeQAWegAcewAefAAheAAAAQMAAgEDAAIDBwAjNQAkNgAlAAAAAwcAIzUAJDYAJQQDAAIGAAcOAAYfnQEFBAMAAgYABw4ABh-jAQUDBwAqNQArNgAsAAAAAwcAKjUAKzYALAQDAAIGAAcOtQEGD7YBBQQDAAIGAAcOvAEGD70BBQMHADE1ADI2ADMAAAADBwAxNQAyNgAzAAADBwA4NQA5NgA6AAAAAwcAODUAOTYAOgAABQcAPzUAQjYAQ3cAQHgAQQAAAAAABQcAPzUAQjYAQ3cAQHgAQQEGAAcBBgAHAwcASDUASTYASgAAAAMHAEg1AEk2AEoCBgAHCgALAgYABwoACwMHAE81AFA2AFEAAAADBwBPNQBQNgBRAwMAAgYABxunAhQDAwACBgAHG60CFAUHAFY1AFk2AFp3AFd4AFgAAAAAAAUHAFY1AFk2AFp3AFd4AFgCGAAVGb8CFwIYABUZxQIXBQcAXzUAYjYAY3cAYHgAYQAAAAAABQcAXzUAYjYAY3cAYHgAYQAAAwcAaDUAaTYAagAAAAMHAGg1AGk2AGoBAwACAQMAAgMHAG81AHA2AHEAAAADBwBvNQBwNgBxAwMAAgYABxKIAxADAwACBgAHEo4DEAMHAHY1AHc2AHgAAAADBwB2NQB3NgB4AwMAAgYABxKgAxADAwACBgAHEqYDEAMHAH01AH42AH8AAAADBwB9NQB-NgB_AgMAAgYABwIDAAIGAAcFBwCEATUAhwE2AIgBdwCFAXgAhgEAAAAAAAUHAIQBNQCHATYAiAF3AIUBeACGAQIDAAIGAAcCAwACBgAHBQcAjQE1AJABNgCRAXcAjgF4AI8BAAAAAAAFBwCNATUAkAE2AJEBdwCOAXgAjwEBAwACAQMAAgMHAJYBNQCXATYAmAEAAAADBwCWATUAlwE2AJgBAAADBwCdATUAngE2AJ8BAAAAAwcAnQE1AJ4BNgCfAQEDAAIBAwACAwcApAE1AKUBNgCmAQAAAAMHAKQBNQClATYApgEBAwACAQMAAgMHAKsBNQCsATYArQEAAAADBwCrATUArAE2AK0BAAAAAwcAswE1ALQBNgC1AQAAAAMHALMBNQC0ATYAtQECAwACBgAHAgMAAgYABwMHALoBNQC7ATYAvAEAAAADBwC6ATUAuwE2ALwBIwIBJH0BJX8BJoABASeBAQEpgwEBKoUBHyuGASAsiAEBLYoBHy6LASExjAEBMo0BATOOAR83kQEiOJIBJjmTAQU6lAEFO5UBBTyWAQU9lwEFPpkBBT-bAR9AnAEnQZ8BBUKhAR9DogEoRKQBBUWlAQVGpgEfR6kBKUiqAS1JqwEOSqwBDkutAQ5MrgEOTa8BDk6xAQ5PswEfULQBLlG4AQ5SugEfU7sBL1S-AQ5VvwEOVsABH1fDATBYxAE0WcUBCFrGAQhbxwEIXMgBCF3JAQheywEIX80BH2DOATVh0AEIYtIBH2PTATZk1AEIZdUBCGbWAR9n2QE3aNoBO2nbAQdq3AEHa90BB2zeAQdt3wEHbuEBB2_jAR9w5AE8ceYBB3LoAR9z6QE9dOoBB3XrAQd27AEfee8BPnrwAUR78QEafPIBGn3zARp-9AEaf_UBGoAB9wEagQH5AR-CAfoBRYMB_AEahAH-AR-FAf8BRoYBgAIahwGBAhqIAYICH4kBhQJHigGGAkuLAYcCCowBiAIKjQGJAgqOAYoCCo8BiwIKkAGNAgqRAY8CH5IBkAJMkwGSAgqUAZQCH5UBlQJNlgGWAgqXAZcCCpgBmAIfmQGbAk6aAZwCUpsBnQITnAGeAhOdAZ8CE54BoAITnwGhAhOgAaMCE6EBpQIfogGmAlOjAakCE6QBqwIfpQGsAlSmAa4CE6cBrwITqAGwAh-pAbMCVaoBtAJbqwG1AhSsAbYCFK0BtwIUrgG4AhSvAbkCFLABuwIUsQG9Ah-yAb4CXLMBwQIUtAHDAh-1AcQCXbYBxgIUtwHHAhS4AcgCH7kBywJeugHMAmS7Ac4CC7wBzwILvQHSAgu-AdMCC78B1AILwAHWAgvBAdgCH8IB2QJlwwHbAgvEAd0CH8UB3gJmxgHfAgvHAeACC8gB4QIfyQHkAmfKAeUCa8sB5wIQzAHoAhDNAeoCEM4B6wIQzwHsAhDQAe4CENEB8AIf0gHxAmzTAfMCENQB9QIf1QH2Am3WAfcCENcB-AIQ2AH5Ah_ZAfwCbtoB_QJy2wH-Ag_cAf8CD90BgAMP3gGBAw_fAYIDD-ABhAMP4QGGAx_iAYcDc-MBigMP5AGMAx_lAY0DdOYBjwMP5wGQAw_oAZEDH-kBlAN16gGVA3nrAZYDEewBlwMR7QGYAxHuAZkDEe8BmgMR8AGcAxHxAZ4DH_IBnwN68wGiAxH0AaQDH_UBpQN79gGnAxH3AagDEfgBqQMf-QGsA3z6Aa0DgAH7Aa4DF_wBrwMX_QGwAxf-AbEDF_8BsgMXgAK0AxeBArYDH4ICtwOBAYMCuQMXhAK7Ax-FArwDggGGAr0DF4cCvgMXiAK_Ax-JAsIDgwGKAsMDiQGLAsQDBowCxQMGjQLGAwaOAscDBo8CyAMGkALKAwaRAswDH5ICzQOKAZMCzwMGlALRAx-VAtIDiwGWAtMDBpcC1AMGmALVAx-ZAtgDjAGaAtkDkgGbAtsDFZwC3AMVnQLeAxWeAt8DFZ8C4AMVoALiAxWhAuQDH6IC5QOTAaMC5wMVpALpAx-lAuoDlAGmAusDFacC7AMVqALtAx-pAvADlQGqAvEDmQGrAvMDAqwC9AMCrQL3AwKuAvgDAq8C-QMCsAL7AwKxAv0DH7IC_gOaAbMCgAQCtAKCBB-1AoMEmwG2AoQEArcChQQCuAKGBB-5AokEnAG6AooEoAG7AosEA7wCjAQDvQKNBAO-Ao4EA78CjwQDwAKRBAPBApMEH8IClAShAcMClgQDxAKYBB_FApkEogHGApoEA8cCmwQDyAKcBB_JAp8EowHKAqAEpwHLAqEEBMwCogQEzQKjBATOAqQEBM8CpQQE0AKnBATRAqkEH9ICqgSoAdMCrAQE1AKuBB_VAq8EqQHWArAEBNcCsQQE2AKyBB_ZArUEqgHaArYErgHbArgErwHcArkErwHdArwErwHeAr0ErwHfAr4ErwHgAsAErwHhAsIEH-ICwwSwAeMCxQSvAeQCxwQf5QLIBLEB5gLJBK8B5wLKBK8B6ALLBB_pAs4EsgHqAs8EtgHrAtAEDewC0QQN7QLSBA3uAtMEDe8C1AQN8ALWBA3xAtgEH_IC2QS3AfMC2wQN9ALdBB_1At4EuAH2At8EDfcC4AQN-ALhBB_5AuQEuQH6AuUEvQE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookmarkScalarFieldEnum: () => BookmarkScalarFieldEnum,
  CastMemberScalarFieldEnum: () => CastMemberScalarFieldEnum,
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  FavoriteScalarFieldEnum: () => FavoriteScalarFieldEnum,
  GenreScalarFieldEnum: () => GenreScalarFieldEnum,
  JsonNull: () => JsonNull2,
  LikeScalarFieldEnum: () => LikeScalarFieldEnum,
  MediaPlatformScalarFieldEnum: () => MediaPlatformScalarFieldEnum,
  MediaPurchaseScalarFieldEnum: () => MediaPurchaseScalarFieldEnum,
  MediaScalarFieldEnum: () => MediaScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PlatformScalarFieldEnum: () => PlatformScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  RentalScalarFieldEnum: () => RentalScalarFieldEnum,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  WatchlistScalarFieldEnum: () => WatchlistScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Admin: "Admin",
  Comment: "Comment",
  Like: "Like",
  Genre: "Genre",
  Media: "Media",
  CastMember: "CastMember",
  MediaPlatform: "MediaPlatform",
  MediaPurchase: "MediaPurchase",
  Payment: "Payment",
  Platform: "Platform",
  Profile: "Profile",
  Bookmark: "Bookmark",
  Favorite: "Favorite",
  Rental: "Rental",
  Review: "Review",
  Subscription: "Subscription",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Watchlist: "Watchlist"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
  userId: "userId"
};
var CommentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  reviewId: "reviewId",
  parentId: "parentId",
  content: "content",
  createdAt: "createdAt",
  status: "status",
  mediaId: "mediaId"
};
var LikeScalarFieldEnum = {
  id: "id",
  type: "type",
  userId: "userId",
  reviewId: "reviewId",
  createdAt: "createdAt",
  mediaId: "mediaId",
  commentId: "commentId"
};
var GenreScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  image: "image",
  isPublished: "isPublished",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MediaScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  type: "type",
  synopsis: "synopsis",
  releaseYear: "releaseYear",
  director: "director",
  posterUrl: "posterUrl",
  backdropUrl: "backdropUrl",
  trailerUrl: "trailerUrl",
  streamingUrl: "streamingUrl",
  rentalPrice: "rentalPrice",
  buyPrice: "buyPrice",
  runtimeMinutes: "runtimeMinutes",
  seasons: "seasons",
  pricing: "pricing",
  isPublished: "isPublished",
  isFeatured: "isFeatured",
  avgRating: "avgRating",
  reviewCount: "reviewCount",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  viewCount: "viewCount"
};
var CastMemberScalarFieldEnum = {
  id: "id",
  name: "name",
  role: "role",
  image: "image",
  mediaId: "mediaId"
};
var MediaPlatformScalarFieldEnum = {
  id: "id",
  mediaId: "mediaId",
  platformId: "platformId"
};
var MediaPurchaseScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  type: "type",
  status: "status",
  price: "price",
  expiresAt: "expiresAt",
  stripePaymentId: "stripePaymentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  paymentId: "paymentId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  subscriptionId: "subscriptionId",
  amount: "amount",
  currency: "currency",
  stripePaymentId: "stripePaymentId",
  status: "status",
  createdAt: "createdAt",
  rentalId: "rentalId"
};
var PlatformScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  icon: "icon",
  url: "url",
  type: "type",
  isFeatured: "isFeatured",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  email: "email",
  image: "image",
  bio: "bio",
  avatar: "avatar",
  coverImage: "coverImage",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookmarkScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  profileId: "profileId"
};
var FavoriteScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  profileId: "profileId"
};
var RentalScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  status: "status",
  expiresAt: "expiresAt",
  price: "price",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  rating: "rating",
  content: "content",
  tags: "tags",
  hasSpoiler: "hasSpoiler",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  plan: "plan",
  status: "status",
  stripeCustomerId: "stripeCustomerId",
  stripePriceId: "stripePriceId",
  currentPeriodStart: "currentPeriodStart",
  currentPeriodEnd: "currentPeriodEnd",
  cancelAtPeriodEnd: "cancelAtPeriodEnd",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var WatchlistScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status from "http-status";
import path2 from "path";
import ejs from "ejs";

// src/app/error-helpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, messgae, stack = "") {
    super(messgae);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/utils/email.ts
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  }
});
var sendEmail = async ({ to, subject, templateName, templateData, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
  } catch (error) {
    throw new AppError_default(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  appName: "Censura",
  baseURL: envVars.FRONTEND_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.UNVERIFIED
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[sendVerificationOTP] Hook triggered for ${email} with type: ${type}`);
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (!user) {
            console.error(
              `User with email ${email} not found. Cannot send verification OTP.`
            );
            return;
          }
          if (user && user.role === Role.ADMIN) {
            console.error(
              `User with email ${email} is a Admin. Skipping sending verification OTP.`
            );
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Email Verification",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Forget Password",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 5 * 60,
      otpLength: 6
    })
  ],
  trustedOrigins: [
    envVars.BETTER_AUTH_URL || "http://localhost:5000",
    "http://localhost:3000",
    "http://localhost:4000",
    envVars.FRONTEND_URL
  ],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  },
  redirect: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
    }
  }
});

// src/app/utils/seed.ts
var seedDefaultAdmin = async () => {
  try {
    const isDefaultAdminExist = await prisma.user.findFirst({
      where: { role: Role.ADMIN }
    });
    if (isDefaultAdminExist) {
      console.log("Default admin already exist. Skipping seeding Default-Admin.");
      return;
    }
    const defaultAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.DEFAULT_ADMIN_GMAIL,
        password: envVars.DEFAULT_ADMIN_PASSWORD,
        name: "Default Admin",
        role: Role.ADMIN,
        needPasswordChange: false,
        rememberMe: false
      }
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: defaultAdminUser.user.id
        },
        data: {
          status: UserStatus.ACTIVE,
          emailVerified: true
        }
      });
      await tx.admin.create({
        data: {
          userId: defaultAdminUser.user.id,
          name: "Default Admin",
          email: envVars.DEFAULT_ADMIN_GMAIL
        }
      });
    });
    const defaultAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.DEFAULT_ADMIN_GMAIL
      },
      include: {
        user: true
      }
    });
    console.log(`Default Admin created:`, defaultAdmin);
  } catch (error) {
    console.error(`Error seeding default admin: `, error);
    await prisma.user.delete({
      where: {
        email: envVars.DEFAULT_ADMIN_GMAIL
      }
    });
  }
};

// src/appServer.ts
import express from "express";
import path3 from "path";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var catchAsync_default = catchAsync;

// src/app/shared/sendRes.ts
var sendResponse = (res, responseData) => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
    data: responseData.data
  });
};
var sendRes_default = sendResponse;

// src/app/config/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
  appInfo: {
    name: "Censura"
  }
});

// src/app/modules/Subscription/subscription.service.ts
import httpStatus from "http-status";
var getPlans = async () => {
  return [
    {
      name: SubscriptionPlan.FREE,
      price: 0,
      badge: null,
      features: [
        "Access to free titles only",
        "480p streaming quality",
        "1 device at a time",
        "Ad-supported experience",
        "Limited new releases",
        "Community reviews & ratings"
      ]
    },
    {
      name: SubscriptionPlan.MONTHLY,
      price: 9.99,
      badge: "Most Popular",
      features: [
        "Access to all premium titles",
        "Full HD 1080p streaming",
        "2 devices simultaneously",
        "Ad-free experience",
        "New releases on day one",
        "Download for offline viewing",
        "Community reviews & ratings",
        "Cancel anytime"
      ]
    },
    {
      name: SubscriptionPlan.YEARLY,
      price: 99.99,
      badge: "Best Value",
      features: [
        "Everything in Monthly",
        "4K Ultra HD + HDR streaming",
        "4 devices simultaneously",
        "Ad-free experience",
        "Early access to new releases",
        "Download for offline viewing",
        "Priority customer support",
        "Exclusive member-only content",
        "Save 16% vs monthly billing"
      ]
    }
  ];
};
var createCheckoutSession = async (userId, userEmail, plan) => {
  if (plan === SubscriptionPlan.FREE) {
    throw new AppError_default(
      httpStatus.BAD_REQUEST,
      "Free plan does not require a checkout session."
    );
  }
  const prices = {
    [SubscriptionPlan.MONTHLY]: 999,
    // $9.99 -> 999 cents
    [SubscriptionPlan.YEARLY]: 9999
    // $99.99 -> 9999 cents
  };
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Censura ${plan} Plan`,
            description: `Unlock premium features with ${plan} subscription.`
          },
          unit_amount: prices[plan],
          recurring: {
            interval: plan === SubscriptionPlan.MONTHLY ? "month" : "year"
          }
        },
        quantity: 1
      }
    ],
    // 2. Attach user ID and Plan in metadata to read it back during webhook!
    metadata: {
      userId,
      plan
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`
  });
  return { session_url: session.url };
};
var handleWebhook = async (body, signature) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError_default(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, plan, mediaId, type } = session.metadata || {};
    if (userId && plan) {
      const currentPeriodStart = /* @__PURE__ */ new Date();
      const currentPeriodEnd = /* @__PURE__ */ new Date();
      if (plan === SubscriptionPlan.MONTHLY) {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else if (plan === SubscriptionPlan.YEARLY) {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }
      const updatedSubscription = await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan,
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          currentPeriodStart,
          currentPeriodEnd
        },
        create: {
          userId,
          plan,
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          currentPeriodStart,
          currentPeriodEnd
        }
      });
      await prisma.payment.create({
        data: {
          subscriptionId: updatedSubscription.id,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || "usd",
          stripePaymentId: session.payment_intent,
          status: "COMPLETED"
        }
      });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        try {
          await sendEmail({
            to: user.email,
            subject: "Your Censura Subscription is Active!",
            templateName: "subscription-success",
            templateData: {
              userName: user.name,
              plan,
              startDate: currentPeriodStart.toLocaleDateString(),
              endDate: currentPeriodEnd.toLocaleDateString(),
              loginUrl: `${envVars.FRONTEND_URL}/login`
            }
          });
        } catch (emailError) {
          console.error(
            "Failed to send subscription success email",
            emailError
          );
        }
      }
    }
    if (userId && mediaId && type) {
      const RENTAL_DURATION_HOURS2 = 48;
      const expiresAt = type === MediaPurchaseType.RENTAL ? new Date(Date.now() + RENTAL_DURATION_HOURS2 * 60 * 60 * 1e3) : null;
      await prisma.mediaPurchase.create({
        data: {
          userId,
          mediaId,
          type,
          status: MediaPurchaseStatus.ACTIVE,
          price: (session.amount_total || 0) / 100,
          expiresAt,
          stripePaymentId: session.payment_intent
        }
      });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        try {
          await sendEmail({
            to: user.email,
            subject: `Your ${type === MediaPurchaseType.RENTAL ? "Rental" : "Purchase"} is Confirmed!`,
            templateName: "media-purchase-success",
            templateData: {
              userName: user.name,
              type,
              expiresAt: expiresAt?.toLocaleDateString() ?? "Never (Permanent)",
              loginUrl: `${envVars.FRONTEND_URL}/login`
            }
          });
        } catch (emailError) {
          console.error("Failed to send media purchase email", emailError);
        }
      }
    }
  }
  return { received: true };
};
var getSubscriptionStatus = async (userId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  if (!subscription) {
    return { status: SubscriptionStatus.EXPIRED, plan: SubscriptionPlan.FREE };
  }
  if (subscription.currentPeriodEnd && /* @__PURE__ */ new Date() > subscription.currentPeriodEnd && subscription.status === SubscriptionStatus.ACTIVE) {
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: SubscriptionStatus.EXPIRED }
    });
    return updated;
  }
  return subscription;
};
var getPaymentHistory = async (userId) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return subscriptions;
};
var cancelSubscription = async (userId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  if (!subscription) {
    throw new AppError_default(httpStatus.NOT_FOUND, "No active subscription found");
  }
  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "Subscription is not active");
  }
  if (!subscription.stripeCustomerId) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "No Stripe customer found");
  }
  const stripeSubscriptions = await stripe.subscriptions.list({
    customer: subscription.stripeCustomerId,
    status: "active",
    limit: 1
  });
  if (!stripeSubscriptions.data.length) {
    throw new AppError_default(httpStatus.NOT_FOUND, "No active Stripe subscription found");
  }
  const stripeSubscriptionId = stripeSubscriptions.data[0].id;
  const latestPayment = await prisma.payment.findFirst({
    where: { subscriptionId: subscription.id },
    orderBy: { createdAt: "desc" }
  });
  await stripe.subscriptions.cancel(stripeSubscriptionId);
  let refund = null;
  if (latestPayment?.stripePaymentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        latestPayment.stripePaymentId
      );
      if (paymentIntent.latest_charge) {
        refund = await stripe.refunds.create({
          charge: paymentIntent.latest_charge
          // Remove amount for full refund, or specify partial:
          // amount: Math.round(latestPayment.amount * 100),
        });
      }
    } catch (refundError) {
      console.error("Refund failed:", refundError);
    }
  }
  const updated = await prisma.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.CANCELLED,
      cancelAtPeriodEnd: false,
      plan: SubscriptionPlan.FREE
    }
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    try {
      await sendEmail({
        to: user.email,
        subject: "Your Censura Subscription Has Been Cancelled",
        templateName: "subscription-cancelled",
        templateData: {
          userName: user.name,
          refunded: !!refund,
          loginUrl: `${envVars.FRONTEND_URL}/login`
        }
      });
    } catch (emailError) {
      console.error("Failed to send cancellation email", emailError);
    }
  }
  return {
    cancelled: true,
    refunded: !!refund,
    refundId: refund?.id ?? null
  };
};
var SubscriptionService = {
  getPlans,
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  getPaymentHistory,
  cancelSubscription
};

// src/app/modules/Subscription/subscription.controller.ts
import httpStatus2 from "http-status";
var getPlans2 = catchAsync_default(async (req, res) => {
  const result = await SubscriptionService.getPlans();
  sendRes_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Subscription plans retrieved successfully",
    data: result
  });
});
var createCheckoutSession2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const { plan } = req.body;
  const result = await SubscriptionService.createCheckoutSession(
    user.userId,
    user.email,
    plan
  );
  sendRes_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Checkout session created successfully",
    data: result
  });
});
var webhook = catchAsync_default(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const result = await SubscriptionService.handleWebhook(req.body, signature);
  res.status(httpStatus2.OK).json(result);
});
var getSubscriptionStatus2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionService.getSubscriptionStatus(user.userId);
  sendRes_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Subscription status retrieved successfully",
    data: result
  });
});
var getPaymentHistory2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionService.getPaymentHistory(user.userId);
  sendRes_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result
  });
});
var cancelSubscription2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionService.cancelSubscription(user.userId);
  sendRes_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Subscription cancelled and refund initiated",
    data: result
  });
});
var SubscriptionController = {
  getPlans: getPlans2,
  createCheckoutSession: createCheckoutSession2,
  webhook,
  getSubscriptionStatus: getSubscriptionStatus2,
  getPaymentHistory: getPaymentHistory2,
  cancelSubscription: cancelSubscription2
};

// src/app/routes/routes.ts
import { Router as Router14 } from "express";

// src/app/modules/Auth/auth.routes.ts
import { Router } from "express";

// src/app/modules/Auth/auth.service.ts
import status2 from "http-status";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      err
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const token = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN
  });
  return token;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN
    }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1e3
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/Auth/auth.service.ts
var register = async (user) => {
  const { name, email, password, role, acceptTerms, rememberMe } = user;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status2.FORBIDDEN, "User not created");
  }
  try {
    const profile = await prisma.$transaction(async (tx) => {
      return await tx.profile.create({
        data: {
          userId: data.user?.id,
          name,
          email
          // image: data.user.image,
        }
      });
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return { ...data, accessToken, refreshToken };
  } catch (err) {
    console.log("Register Transition Error", err);
    const userExists = await prisma.user.findUnique({
      where: {
        id: data.user.id
      }
    });
    if (userExists) {
      await prisma.user.delete({
        where: {
          id: userExists.id
        }
      });
    }
    throw new AppError_default(status2.FORBIDDEN, "User not created");
  }
};
var login = async (user) => {
  const { email, password } = user;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.UNVERIFIED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User not verified. Again send verification email."
    );
  }
  if (data.user.status === UserStatus.PENDING) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User pending. Please contact support team."
    );
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User deleted. Please contact support team."
    );
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User blocked. Please contact support team."
    );
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return { ...data, accessToken, refreshToken };
};
var logout = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.user.status === UserStatus.UNVERIFIED) {
    await prisma.user.update({
      where: {
        id: result.user.id
      },
      data: {
        emailVerified: true,
        status: UserStatus.ACTIVE
      }
    });
  }
  return result;
};
var sendVerifyOtp = async (email, type) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status2.FORBIDDEN, "User not found");
  }
  if (user.emailVerified) {
    throw new AppError_default(status2.FORBIDDEN, "User already verified");
  }
  if (user.status === UserStatus.PENDING) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User pending. Please contact support team."
    );
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status2.FORBIDDEN, "User not found.");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User blocked. Please contact support team."
    );
  }
  await auth.api.sendVerificationOTP({
    body: {
      email,
      type
    }
  });
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status2.UNAUTHORIZED, "invalid session token!");
  }
  const { confirmPassword, newPassword, oldPassword } = payload;
  if (newPassword !== confirmPassword) {
    throw new AppError_default(status2.FORBIDDEN, "Password not match");
  }
  const result = await auth.api.changePassword({
    body: {
      currentPassword: oldPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return { ...result, accessToken, refreshToken };
};
var forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status2.FORBIDDEN, "User not found");
  }
  if (!user.emailVerified) {
    throw new AppError_default(status2.FORBIDDEN, "User not verified");
  }
  if (user.status === UserStatus.PENDING) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User pending. Please contact support team."
    );
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User not found. Please contact support team."
    );
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User blocked. Please contact support team."
    );
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, newPassword, otp) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status2.FORBIDDEN, "User not found");
  }
  if (!user.emailVerified) {
    throw new AppError_default(status2.FORBIDDEN, "User not verified");
  }
  if (user.status === UserStatus.PENDING) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User pending. Please contact support team."
    );
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User not found. Please contact support team."
    );
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "User blocked. Please contact support team."
    );
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: user.id
    }
  });
};
var getMe = async (user) => {
  const { userId } = user;
  const userData = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      profile: true,
      bookmarks: {
        include: {
          media: true
        }
      },
      favorites: {
        include: {
          media: true
        }
      },
      watchlists: {
        include: {
          media: true
        }
      },
      subscription: true,
      purchases: true,
      _count: {
        select: {
          bookmarks: true,
          favorites: true,
          watchlists: true,
          reviews: true,
          comments: true,
          likes: true
        }
      }
    }
  });
  if (!userData) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  return { ...userData, meta: { ...userData._count } };
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.err) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var googleLoginSuccess = async (session) => {
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!user) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  getMe,
  getNewToken,
  googleLoginSuccess,
  sendVerifyOtp
};

// src/app/modules/Auth/auth.controller.ts
import status3 from "http-status";
var register2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.register(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var login2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var logout2 = catchAsync_default(async (req, res) => {
  const betterAuthToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logout(betterAuthToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var forgotPassword2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body.email);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "Forgot password successfully",
    data: result
  });
});
var resetPassword2 = catchAsync_default(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await AuthService.resetPassword(email, newPassword, otp);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "Reset password successfully",
    data: result
  });
});
var changePassword2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(payload, sessionToken);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "Password changed successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var verifyEmail2 = catchAsync_default(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyEmail(email, otp);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "Email verified successfully",
    data: result
  });
});
var sendVerifyOtp2 = catchAsync_default(async (req, res) => {
  const { email, type } = req.body;
  const result = await AuthService.sendVerifyOtp(email, type);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "Verify otp sent successfully",
    data: result
  });
});
var getMe2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.getMe(req.user);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var getNewToken2 = catchAsync_default(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status3.UNAUTHORIZED, "Refresh token not found");
  }
  const result = await AuthService.getNewToken(refreshToken, betterAuthToken);
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendRes_default(res, {
    statusCode: status3.OK,
    success: true,
    message: "New token generated successfully",
    data: {
      sessionToken,
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var googleLogin = catchAsync_default(async (req, res) => {
  const redirectPath = req.query.redirect || "/";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackUrl = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL: callbackUrl,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleSuccess = catchAsync_default(async (req, res) => {
  const redirectPath = req.query.redirect || "/";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.BETTER_AUTH_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    return res.redirect(
      `${envVars.BETTER_AUTH_URL}/login?error=no_session_found`
    );
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.BETTER_AUTH_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync_default((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  register: register2,
  login: login2,
  logout: logout2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  changePassword: changePassword2,
  verifyEmail: verifyEmail2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  handleOAuthError,
  googleLogin,
  googleSuccess,
  sendVerifyOtp: sendVerifyOtp2
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...authRoles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token"
      );
      if (!sessionToken) {
        throw new AppError_default(status4.UNAUTHORIZED, "No session token provided.");
      }
      const sessionExist = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: { gt: /* @__PURE__ */ new Date() }
        },
        include: { user: true }
      });
      if (!sessionExist || !sessionExist.user) {
        throw new AppError_default(status4.UNAUTHORIZED, "Invalid or expired session.");
      }
      const user = sessionExist.user;
      if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED || user.isDeleted) {
        throw new AppError_default(status4.UNAUTHORIZED, "User account is not active.");
      }
      if (!user.emailVerified) {
        throw new AppError_default(status4.UNAUTHORIZED, "Email not verified.");
      }
      if (user.emailVerified && user.status === UserStatus.UNVERIFIED) {
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            status: UserStatus.ACTIVE
          }
        });
      }
      const now = /* @__PURE__ */ new Date();
      const expiresAt = new Date(sessionExist.expiresAt);
      const createdAt = new Date(sessionExist.createdAt);
      const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
      const timeRemaining = expiresAt.getTime() - now.getTime();
      const percentRemaining = timeRemaining / sessionLifeTime * 100;
      if (percentRemaining < 20) {
        res.setHeader("X-Session-Refresh", "true");
        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
        res.setHeader("X-Time-Remaining", timeRemaining.toString());
      }
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError_default(status4.UNAUTHORIZED, "No access token provided.");
      }
      const verifyToken2 = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET
      );
      if (!verifyToken2.success) {
        throw new AppError_default(status4.UNAUTHORIZED, "Invalid access token.");
      }
      if (authRoles.length > 0 && !authRoles.includes(verifyToken2.data.role)) {
        throw new AppError_default(
          status4.FORBIDDEN,
          "You do not have permission to access this resource."
        );
      }
      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/modules/Auth/auth.validation.ts
import { z } from "zod";
var loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
  )
});
var registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
  name: z.string("Name is required").min(3, "Name must be at least 3 characters long"),
  role: z.enum(["USER", "ADMIN"], "Role is required"),
  acceptTerms: z.boolean("Accept Terms and Condition must be true"),
  rememberMe: z.boolean().optional()
});
var changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long")
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
});
var forgotPasswordSchema = z.object({
  email: z.email("Invalid email")
});
var resetPasswordSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
  token: z.string("Token is required")
});
var verifyEmailSchema = z.object({
  email: z.email("Invalid email"),
  otp: z.string("OTP is required")
});
var sendVerifyOtpSchema = z.object({
  email: z.email("Invalid email"),
  type: z.enum(
    ["sign-in", "email-verification", "forget-password", "change-email"],
    "Type is required"
  )
});
var AuthValidation = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  sendVerifyOtpSchema
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === "string") {
      req.body = JSON.parse(req.body);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      return next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/Auth/auth.routes.ts
var router = Router();
router.post(
  "/register",
  // validateRequest(AuthValidation.registerSchema),
  AuthController.register
);
router.post(
  "/login",
  // validateRequest(AuthValidation.loginSchema),
  AuthController.login
);
router.post("/logout", checkAuth(Role.USER, Role.ADMIN), AuthController.logout);
router.get("/me", checkAuth(Role.USER, Role.ADMIN), AuthController.getMe);
router.post("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);
router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail
);
router.post(
  "/send-verify-otp",
  validateRequest(AuthValidation.sendVerifyOtpSchema),
  AuthController.sendVerifyOtp
);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
var authRoutes = router;

// src/app/modules/Reviews/reviews.router.ts
import { Router as Router2 } from "express";

// src/app/modules/Reviews/reviews.controller.ts
import httpStatus3 from "http-status";

// src/app/modules/Reviews/reviews.service.ts
import status5 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.queryParams = queryParams || {};
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { search } = this.queryParams;
    const { searchableFields } = this.config;
    if (search && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          const stringFilter = {
            contains: search,
            mode: "insensitive"
          };
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              return { [relation]: { [nestedField]: stringFilter } };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              return {
                [relation]: {
                  some: { [nestedRelation]: { [nestedField]: stringFilter } }
                }
              };
            }
          }
          return { [field]: stringFilter };
        }
      );
      this.query.where.OR = searchConditions;
      this.countQuery.where.OR = searchConditions;
    }
    return this;
  }
  filter() {
    const { filterableFields } = this.config;
    const excludedFields = [
      "search",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    Object.keys(this.queryParams).forEach((key) => {
      const value = this.queryParams[key];
      if (value === void 0 || value === "" || excludedFields.includes(key))
        return;
      const isAllowed = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (!isAllowed) return;
      const queryWhere = this.query.where;
      const countWhere = this.countQuery.where;
      if (key.includes(".")) {
        const parts = key.split(".");
        if (parts.length === 2) {
          const [rel, field] = parts;
          queryWhere[rel] = {
            ...queryWhere[rel],
            [field]: this.parseFilterValue(value)
          };
          countWhere[rel] = {
            ...countWhere[rel],
            [field]: this.parseFilterValue(value)
          };
        } else if (parts.length === 3) {
          const [rel, nRel, field] = parts;
          const nestedCondition = {
            some: { [nRel]: { [field]: this.parseFilterValue(value) } }
          };
          queryWhere[rel] = this.deepMerge(
            queryWhere[rel] || {},
            nestedCondition
          );
          countWhere[rel] = this.deepMerge(
            countWhere[rel] || {},
            nestedCondition
          );
        }
      } else {
        const parsedValue = typeof value === "object" && !Array.isArray(value) ? this.parseRangeFilter(value) : this.parseFilterValue(value);
        queryWhere[key] = parsedValue;
        countWhere[key] = parsedValue;
      }
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    let sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    const sortMapping = {
      rating: { avgRating: sortOrder },
      likes: { likes: { _count: sortOrder } },
      // Sorts by number of likes
      recent: { createdAt: sortOrder }
    };
    if (sortMapping[sortBy]) {
      this.query.orderBy = sortMapping[sortBy];
    } else if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        this.query.orderBy = { [parts[0]]: { [parts[1]]: sortOrder } };
      }
    } else {
      this.query.orderBy = { [sortBy]: sortOrder };
    }
    return this;
  }
  fields(defaultFields) {
    const fieldsParam = this.queryParams.fields;
    const fieldsToUse = fieldsParam ? fieldsParam.split(",").map((f) => f.trim()) : defaultFields;
    if (fieldsToUse && fieldsToUse.length > 0) {
      this.selectFields = {};
      fieldsToUse.forEach((f) => this.selectFields[f] = true);
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields || this.query.select) return this;
    this.query.include = this.deepMerge(
      this.query.include || {},
      relation
    );
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields || this.query.select) return this;
    const result = {};
    defaultInclude?.forEach((f) => {
      if (includeConfig[f]) result[f] = includeConfig[f];
    });
    const includeParam = this.queryParams.include;
    if (typeof includeParam === "string") {
      includeParam.split(",").forEach((r) => {
        const rel = r.trim();
        if (includeConfig[rel]) result[rel] = includeConfig[rel];
      });
    }
    this.query.include = this.deepMerge(this.query.include || {}, result);
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(this.query.where || {}, condition);
    this.countQuery.where = this.deepMerge(
      this.countQuery.where || {},
      condition
    );
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages: Math.ceil(total / this.limit)
      }
    };
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (typeof value === "string" && !isNaN(Number(value)) && value !== "")
      return Number(value);
    if (Array.isArray(value))
      return { in: value.map((v) => this.parseFilterValue(v)) };
    return value;
  }
  parseRangeFilter(value) {
    const range = {};
    const operators = [
      "lt",
      "lte",
      "gt",
      "gte",
      "equals",
      "not",
      "contains",
      "in",
      "notIn"
    ];
    Object.keys(value).forEach((op) => {
      if (operators.includes(op)) range[op] = this.parseFilterValue(value[op]);
    });
    return range;
  }
};

// src/app/modules/Reviews/review.constant.ts
var reviewIncludeConfig = {
  user: true,
  media: true
};

// src/app/modules/Reviews/reviews.service.ts
var getAllReview = async (user, query) => {
  const reviewQuery = new QueryBuilder(prisma.review, query, {
    searchableFields: ["content", "rating"],
    filterableFields: ["status", "mediaId", "userId", "rating"]
  }).search().filter().sort().paginate().fields();
  const result = await reviewQuery.execute();
  return result;
};
var getSingleReview = async (id) => {
  const result = await prisma.review.findUnique({
    where: {
      id
    }
  });
  return result;
};
var getReviewByMediaId = async (mediaId) => {
  const isMediaExist = await prisma.media.findUnique({
    where: {
      id: mediaId
    }
  });
  if (!isMediaExist) {
    throw new AppError_default(status5.NOT_FOUND, "Media not found");
  }
  const result = await prisma.review.findMany({
    where: {
      mediaId,
      status: "APPROVED"
    },
    include: {
      user: true
    }
  });
  return result;
};
var createReview = async (user, data) => {
  const result = await prisma.review.create({
    data: {
      userId: user.userId,
      ...data
    }
  });
  return result;
};
var updateReview = async (id, data) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status5.NOT_FOUND, "Review not found");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return result;
};
var deleteReview = async (id) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status5.NOT_FOUND, "Review not found");
  }
  if (isReviewExist.status === ReviewStatus.APPROVED) {
    throw new AppError_default(
      status5.NOT_FOUND,
      "You can only delete pending or unpublished review"
    );
  }
  const result = await prisma.review.delete({
    where: {
      id
    }
  });
  return result;
};
var updateMediaRating = async (mediaId) => {
  const stats = await prisma.review.aggregate({
    where: {
      mediaId,
      status: ReviewStatus.APPROVED
    },
    _avg: {
      rating: true
    },
    _count: {
      id: true
    }
  });
  await prisma.media.update({
    where: { id: mediaId },
    data: {
      avgRating: stats._avg.rating || 0,
      reviewCount: stats._count.id
    }
  });
};
var updateReviewStatus = async (id, payload) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status5.NOT_FOUND, "Review not found");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: payload.status
    }
  });
  await updateMediaRating(isReviewExist.mediaId);
  return result;
};
var deleteReviewByAdmin = async (id) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status5.NOT_FOUND, "Review not found");
  }
  const result = await prisma.review.delete({
    where: {
      id
    }
  });
  await updateMediaRating(isReviewExist.mediaId);
  return result;
};
var getAllReviewAdmin = async (query) => {
  const reviewQuery = new QueryBuilder(prisma.review, query, {
    searchableFields: ["content", "rating"],
    filterableFields: ["status", "mediaId", "userId", "rating"]
  }).search().filter().include({
    user: true,
    media: true
  }).dynamicInclude(reviewIncludeConfig).sort().paginate().fields();
  const result = await reviewQuery.execute();
  return result;
};
var ReviewsService = {
  getAllReview,
  getSingleReview,
  getReviewByMediaId,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  deleteReviewByAdmin,
  getAllReviewAdmin
};

// src/app/modules/Reviews/reviews.controller.ts
var getAllReview2 = catchAsync_default(async (req, res) => {
  const query = req.query;
  const user = req.user;
  const result = await ReviewsService.getAllReview(user, query);
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var getSingleReview2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.getSingleReview(req.params.id);
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review fetched successfully",
    data: result
  });
});
var getReviewByMediaId2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.getReviewByMediaId(
    req.params.mediaId
  );
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review fetched successfully",
    data: result
  });
});
var createReview2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.createReview(
    req.user,
    req.body
  );
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var updateReview2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.updateReview(
    req.params.id,
    req.body
  );
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync_default(async (req, res) => {
  console.log(req.params.id);
  const result = await ReviewsService.deleteReview(req.params.id);
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var updateReviewStatus2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.updateReviewStatus(
    req.params.id,
    req.body
  );
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review status updated successfully",
    data: result
  });
});
var deleteReviewByAdmin2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.deleteReviewByAdmin(
    req.params.id
  );
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var getAllReviewAdmin2 = catchAsync_default(async (req, res) => {
  const result = await ReviewsService.getAllReviewAdmin(req.query);
  sendRes_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var ReviewsController = {
  getAllReview: getAllReview2,
  getSingleReview: getSingleReview2,
  getReviewByMediaId: getReviewByMediaId2,
  createReview: createReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  updateReviewStatus: updateReviewStatus2,
  deleteReviewByAdmin: deleteReviewByAdmin2,
  getAllReviewAdmin: getAllReviewAdmin2
};

// src/app/modules/Reviews/reviews.validation.ts
import { z as z2 } from "zod";
var createReviewValidation = z2.object({
  mediaId: z2.string("Media ID is required"),
  rating: z2.number("Rating must be a number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z2.string("Content is required"),
  status: z2.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  ).optional(),
  userId: z2.string("User ID is required"),
  tags: z2.array(z2.string("Tag is required")),
  hasSpoiler: z2.boolean("Has spoiler must be a boolean")
});
var updateReviewValidation = z2.object({
  mediaId: z2.string("Media ID is required"),
  rating: z2.number("Rating must be a number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z2.string("Content is required"),
  status: z2.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  ).optional(),
  userId: z2.string("User ID is required"),
  tags: z2.array(z2.string("Tag is required")),
  hasSpoiler: z2.boolean("Has spoiler must be a boolean")
});
var updateReviewStatusValidation = z2.object({
  status: z2.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  )
});
var ReviewsValidation = {
  createReviewValidation,
  updateReviewValidation,
  updateReviewStatusValidation
};

// src/app/modules/Reviews/reviews.router.ts
var router2 = Router2();
router2.get("/", ReviewsController.getAllReview);
router2.get("/admin", checkAuth(Role.ADMIN), ReviewsController.getAllReviewAdmin);
router2.get("/media/:mediaId", ReviewsController.getReviewByMediaId);
router2.get("/:id", ReviewsController.getSingleReview);
router2.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(ReviewsValidation.createReviewValidation),
  ReviewsController.createReview
);
router2.patch(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(ReviewsValidation.updateReviewValidation),
  ReviewsController.updateReview
);
router2.delete(
  "/:id",
  checkAuth(Role.USER),
  ReviewsController.deleteReview
);
router2.patch(
  "/admin/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(ReviewsValidation.updateReviewStatusValidation),
  ReviewsController.updateReviewStatus
);
router2.delete(
  "/admin/delete/:id",
  checkAuth(Role.ADMIN),
  ReviewsController.deleteReviewByAdmin
);
var ReviewsRoutes = router2;

// src/app/modules/Media/media.routes.ts
import { Router as Router3 } from "express";

// src/app/modules/Media/media.service.ts
import status6 from "http-status";

// src/app/utils/serviceHelpers.ts
var parseNullableNumber = (value) => {
  if (value === "null" || value === "" || value === void 0 || value === null) return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
};
var normalizeIds = (arr) => arr.map((item) => typeof item === "string" ? item : item.id);

// src/app/modules/Media/media.constant.ts
var mediaIncludeConfig = {
  genres: { include: { genre: true } },
  reviews: true,
  cast: true
};

// src/app/modules/Media/media.service.ts
var getAllMedia = async (query) => {
  const { genre, platform, minRating, ...remainingQuery } = query;
  const whereConditions = { isPublished: true };
  if (genre) {
    whereConditions.genres = {
      some: {
        slug: genre
      }
    };
  }
  if (platform) {
    whereConditions.platforms = {
      some: {
        platform: { slug: platform }
      }
    };
  }
  if (minRating) {
    whereConditions.avgRating = {
      gte: Number(minRating)
    };
  }
  const mediaQuery = new QueryBuilder(prisma.media, remainingQuery, {
    searchableFields: ["title", "synopsis"],
    filterableFields: ["type", "releaseYear"]
  }).search().filter().sort().paginate().where(whereConditions).include({
    genres: true,
    cast: true,
    platforms: { include: { platform: true } }
  }).dynamicInclude(mediaIncludeConfig);
  return await mediaQuery.execute();
};
var getSingleMedia = async (id) => {
  const result = await prisma.media.findUnique({
    where: { id },
    include: {
      genres: true,
      platforms: { include: { platform: true } },
      cast: true
    }
  });
  if (!result) {
    throw new AppError_default(status6.NOT_FOUND, "Media not found");
  }
  return result;
};
var createMedia = async (user, payload) => {
  const {
    genres,
    platforms,
    cast,
    slug,
    releaseYear,
    runtimeMinutes,
    seasons,
    ...mediaData
  } = payload;
  const slugMaker = slug.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const result = await prisma.$transaction(async (tx) => {
    const media = await tx.media.create({
      data: {
        ...mediaData,
        slug: slugMaker,
        releaseYear: Number(releaseYear),
        runtimeMinutes: Number(runtimeMinutes) || null,
        seasons: Number(seasons) || null
      }
    });
    if (genres?.length > 0) {
      const existingGenres = await tx.genre.findMany({
        where: { id: { in: genres } },
        select: { id: true }
      });
      if (existingGenres.length !== genres.length) {
        throw new AppError_default(status6.BAD_REQUEST, "One or more genres not found");
      }
      await tx.media.update({
        where: { id: media.id },
        data: {
          genres: { connect: genres.map((id) => ({ id })) }
        }
      });
    }
    if (platforms?.length > 0) {
      const existingPlatforms = await tx.platform.findMany({
        where: { id: { in: platforms } },
        select: { id: true }
      });
      if (existingPlatforms.length !== platforms.length) {
        throw new AppError_default(
          status6.BAD_REQUEST,
          "One or more platforms not found"
        );
      }
      await tx.mediaPlatform.createMany({
        data: platforms.map((platformId) => ({
          mediaId: media.id,
          platformId
        }))
      });
    }
    if (cast?.length > 0) {
      await tx.castMember.createMany({
        data: cast.map(
          (member) => ({
            mediaId: media.id,
            name: member.name,
            role: member.role,
            image: member.image || null
          })
        )
      });
    }
    return tx.media.findUniqueOrThrow({
      where: { id: media.id },
      include: {
        genres: true,
        platforms: { include: { platform: true } },
        cast: true
      }
    });
  });
  return result;
};
var updateMedia = async (id, user, payload) => {
  const {
    genres,
    platforms,
    cast,
    slug,
    releaseYear,
    runtimeMinutes,
    seasons,
    ...mediaData
  } = payload;
  await prisma.media.findUniqueOrThrow({ where: { id } });
  const result = await prisma.$transaction(async (tx) => {
    const media = await tx.media.update({
      where: { id },
      data: {
        ...mediaData,
        ...slug && {
          slug: slug.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
        },
        ...releaseYear && { releaseYear: Number(releaseYear) },
        runtimeMinutes: parseNullableNumber(runtimeMinutes),
        seasons: parseNullableNumber(seasons)
      }
    });
    if (genres !== void 0) {
      const genreIds = normalizeIds(genres);
      if (genreIds.length > 0) {
        const existingGenres = await tx.genre.findMany({
          where: { id: { in: genreIds } },
          select: { id: true }
        });
        if (existingGenres.length !== genreIds.length) {
          throw new AppError_default(
            status6.BAD_REQUEST,
            "One or more genres not found"
          );
        }
      }
      await tx.media.update({
        where: { id: media.id },
        data: {
          genres: { set: genreIds.map((gid) => ({ id: gid })) }
        }
      });
    }
    if (platforms !== void 0) {
      const platformIds = normalizeIds(platforms);
      await tx.mediaPlatform.deleteMany({ where: { mediaId: media.id } });
      if (platformIds.length > 0) {
        const existingPlatforms = await tx.platform.findMany({
          where: { id: { in: platformIds } },
          select: { id: true }
        });
        if (existingPlatforms.length !== platformIds.length) {
          throw new AppError_default(
            status6.BAD_REQUEST,
            "One or more platforms not found"
          );
        }
        await tx.mediaPlatform.createMany({
          data: platformIds.map((platformId) => ({
            mediaId: media.id,
            platformId
          }))
        });
      }
    }
    if (cast !== void 0) {
      await tx.castMember.deleteMany({ where: { mediaId: media.id } });
      if (cast.length > 0) {
        await tx.castMember.createMany({
          data: cast.map(
            (member) => ({
              mediaId: media.id,
              name: member.name,
              role: member.role,
              image: member.image || null
            })
          )
        });
      }
    }
    return tx.media.findUniqueOrThrow({
      where: { id: media.id },
      include: {
        genres: true,
        platforms: { include: { platform: true } },
        cast: true
      }
    });
  });
  return result;
};
var deleteMedia = async (id) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (!media) {
    throw new AppError_default(status6.NOT_FOUND, "Media not found");
  }
  if (media.isPublished === true) {
    throw new AppError_default(status6.BAD_REQUEST, "Unpublish media before deleting");
  }
  const result = await prisma.media.delete({
    where: {
      id
    }
  });
  return result;
};
var changeFeaturedStatus = async (id, payload) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (!media) {
    throw new AppError_default(status6.NOT_FOUND, "Media not found");
  }
  if (media.isFeatured === payload.isFeatured) {
    throw new AppError_default(status6.BAD_REQUEST, "Media is already featured");
  }
  const result = await prisma.media.update({
    where: {
      id
    },
    data: {
      isFeatured: payload.isFeatured
    }
  });
  return result;
};
var changePublishStatus = async (id, payload) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (!media) {
    throw new AppError_default(status6.NOT_FOUND, "Media not found");
  }
  if (media.isPublished === payload.isPublished) {
    throw new AppError_default(
      status6.BAD_REQUEST,
      `Media is already ${payload.isPublished ? "Published" : "Unpublished"}`
    );
  }
  const result = await prisma.media.update({
    where: {
      id
    },
    data: {
      isPublished: payload.isPublished
    }
  });
  return result;
};
var getMediaBySlug = async (slug) => {
  await prisma.media.update({
    where: { slug },
    data: {
      viewCount: { increment: 1 }
    }
  });
  const result = await prisma.media.findUniqueOrThrow({
    where: { slug },
    include: {
      genres: true,
      platforms: {
        include: { platform: true }
      },
      cast: true,
      reviews: {
        include: {
          likes: true,
          comments: true
        }
      },
      likes: true,
      comments: true
    }
  });
  return result;
};
var createManyMedia = async (payload) => {
  const results = await prisma.$transaction(async (tx) => {
    const createdMedia = [];
    for (const item of payload) {
      const {
        genres,
        platforms,
        cast,
        slug,
        releaseYear,
        runtimeMinutes,
        seasons,
        ...mediaData
      } = item;
      const slugMaker = slug.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const media = await tx.media.create({
        data: {
          ...mediaData,
          slug: slugMaker,
          releaseYear: Number(releaseYear),
          runtimeMinutes: Number(runtimeMinutes) || null,
          seasons: Number(seasons) || null
        }
      });
      if (genres?.length > 0) {
        await tx.media.update({
          where: { id: media.id },
          data: {
            genres: {
              connect: genres.map((id) => ({ id }))
            }
          }
        });
      }
      if (platforms?.length > 0) {
        await tx.mediaPlatform.createMany({
          data: platforms.map((platformId) => ({
            mediaId: media.id,
            platformId
          }))
        });
      }
      if (cast?.length > 0) {
        await tx.castMember.createMany({
          data: cast.map((member) => ({
            mediaId: media.id,
            name: member.name,
            role: member.role,
            image: member.image || null
          }))
        });
      }
      createdMedia.push(media);
    }
    return createdMedia;
  });
  return results;
};
var MediaService = {
  getAllMedia,
  getSingleMedia,
  getMediaBySlug,
  createMedia,
  updateMedia,
  deleteMedia,
  changeFeaturedStatus,
  changePublishStatus,
  createManyMedia
};

// src/app/modules/Media/media.controller.ts
import status7 from "http-status";
var getAllMedia2 = catchAsync_default(async (req, res) => {
  const query = req.query;
  const result = await MediaService.getAllMedia(query);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media fetched successfully",
    data: result
  });
});
var getSingleMedia2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.getSingleMedia(id);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media fetched successfully",
    data: result
  });
});
var getMediaBySlug2 = catchAsync_default(async (req, res) => {
  const { slug } = req.params;
  const result = await MediaService.getMediaBySlug(slug);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media fetched successfully",
    data: result
  });
});
var createMedia2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const data = req.body;
  const result = await MediaService.createMedia(user, data);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media created successfully",
    data: result
  });
});
var updateMedia2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const data = req.body;
  const result = await MediaService.updateMedia(id, user, data);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media updated successfully",
    data: result
  });
});
var deleteMedia2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.deleteMedia(id);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media deleted successfully",
    data: result
  });
});
var changeFeaturedStatus2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await MediaService.changeFeaturedStatus(id, data);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media editors pick status changed successfully",
    data: result
  });
});
var changePublishStatus2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await MediaService.changePublishStatus(id, data);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "Media publish status changed successfully",
    data: result
  });
});
var createManyMedia2 = catchAsync_default(async (req, res) => {
  const data = req.body;
  const result = await MediaService.createManyMedia(data);
  sendRes_default(res, {
    statusCode: status7.OK,
    success: true,
    message: "All Media created successfully",
    data: result
  });
});
var MediaController = {
  getAllMedia: getAllMedia2,
  getSingleMedia: getSingleMedia2,
  getMediaBySlug: getMediaBySlug2,
  createMedia: createMedia2,
  updateMedia: updateMedia2,
  deleteMedia: deleteMedia2,
  changeFeaturedStatus: changeFeaturedStatus2,
  changePublishStatus: changePublishStatus2,
  createManyMedia: createManyMedia2
};

// src/app/modules/Media/media.validation.ts
import { z as z3 } from "zod";
var createMediaValidationSchema = z3.object({
  title: z3.string().min(1, "Title is required"),
  synopsis: z3.string().min(1, "Synopsis is required"),
  slug: z3.string().min(1, "Slug is required"),
  type: z3.string().min(1, "Type is required"),
  releaseYear: z3.string({ error: "Release year is required" }),
  director: z3.string().min(1, "Director is required"),
  posterUrl: z3.string().min(1, "Poster URL is required"),
  backdropUrl: z3.string().optional(),
  trailerUrl: z3.string().optional(),
  streamingUrl: z3.string().optional(),
  runtimeMinutes: z3.string().optional(),
  seasons: z3.string().optional(),
  pricing: z3.enum(["FREE", "PREMIUM", "RENTAL"]),
  isPublished: z3.boolean().default(false),
  isFeatured: z3.boolean().default(false),
  cast: z3.array(
    z3.object({
      name: z3.string(),
      role: z3.string(),
      image: z3.string().optional()
    })
  ).optional(),
  genres: z3.array(z3.string()).optional(),
  platforms: z3.array(z3.string()).optional()
});
var updateMediaValidation = z3.object({
  title: z3.string().min(1, "Title is required").optional(),
  synopsis: z3.string().min(1, "Synopsis is required").optional(),
  slug: z3.string().min(1, "Slug is required").optional(),
  type: z3.string().min(1, "Type is required").optional(),
  releaseYear: z3.string({ error: "Release year is required" }).optional(),
  director: z3.string().min(1, "Director is required").optional(),
  posterUrl: z3.string().min(1, "Poster URL is required").optional(),
  backdropUrl: z3.string().optional(),
  trailerUrl: z3.string().optional(),
  streamingUrl: z3.string().optional(),
  runtimeMinutes: z3.string().optional(),
  seasons: z3.string().optional(),
  pricing: z3.enum(["FREE", "PREMIUM", "RENTAL"]).optional(),
  isPublished: z3.boolean().optional(),
  isFeatured: z3.boolean().optional(),
  cast: z3.array(
    z3.object({
      name: z3.string(),
      role: z3.string(),
      image: z3.string().optional()
    })
  ).optional(),
  genres: z3.array(z3.string()).optional(),
  platforms: z3.array(z3.string()).optional()
});
var changePublishStatusValidation = z3.object({
  isPublished: z3.boolean("isPublished is required")
});
var changeFeaturedStatusValidation = z3.object({
  isFeatured: z3.boolean("isFeatured is required")
});
var MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidation,
  changePublishStatusValidation,
  changeFeaturedStatusValidation
};

// src/app/modules/Media/media.routes.ts
var router3 = Router3();
router3.post("/bulk", checkAuth(Role.ADMIN), MediaController.createManyMedia);
router3.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.createMediaValidationSchema),
  MediaController.createMedia
);
router3.get("/", MediaController.getAllMedia);
router3.get("/:id", MediaController.getSingleMedia);
router3.get("/slug/:slug", MediaController.getMediaBySlug);
router3.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.updateMediaValidation),
  MediaController.updateMedia
);
router3.delete("/:id", checkAuth(Role.ADMIN), MediaController.deleteMedia);
router3.patch(
  "/featured/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.changeFeaturedStatusValidation),
  MediaController.changeFeaturedStatus
);
router3.patch(
  "/publish/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.changePublishStatusValidation),
  MediaController.changePublishStatus
);
var MediaRoutes = router3;

// src/app/modules/User/user.routes.ts
import { Router as Router4 } from "express";

// src/app/modules/User/user.service.ts
import status8 from "http-status";
var getAllUsers = async (query = {}) => {
  const userQuery = new QueryBuilder(prisma.user, query, {
    searchableFields: ["name", "email"],
    filterableFields: ["role", "status", "emailVerified"]
  }).search().filter().sort().paginate().fields();
  const result = await userQuery.execute();
  return result;
};
var getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id
    }
  });
};
var updateProfile = async (id, data) => {
  return await prisma.user.update({
    where: {
      id
    },
    data
  });
};
var deleteUser = async (id) => {
  return await prisma.user.delete({
    where: {
      id
    }
  });
};
var changeStatus = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (user.status === payload.status) {
    throw new AppError_default(status8.BAD_REQUEST, "User is already in this status");
  }
  return await prisma.user.update({
    where: {
      id
    },
    data: {
      status: payload.status
    }
  });
};
var UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeStatus
};

// src/app/modules/User/user.controller.ts
import status9 from "http-status";
var getAllUsers2 = catchAsync_default(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  sendRes_default(res, {
    statusCode: status9.OK,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var getUserById2 = catchAsync_default(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  sendRes_default(res, {
    statusCode: status9.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var updateProfile2 = catchAsync_default(async (req, res) => {
  const result = await UserService.updateProfile(
    req.params.id,
    req.body
  );
  sendRes_default(res, {
    statusCode: status9.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsync_default(async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);
  sendRes_default(res, {
    statusCode: status9.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var changeStatus2 = catchAsync_default(async (req, res) => {
  const result = await UserService.changeStatus(
    req.params.id,
    req.body
  );
  sendRes_default(res, {
    statusCode: status9.OK,
    success: true,
    message: "Status changed successfully",
    data: result
  });
});
var UserController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateProfile: updateProfile2,
  deleteUser: deleteUser2,
  changeStatus: changeStatus2
};

// src/app/modules/User/user.routes.ts
var router4 = Router4();
router4.get("/", checkAuth(Role.ADMIN), UserController.getAllUsers);
router4.get("/:id", checkAuth(Role.ADMIN), UserController.getUserById);
router4.patch("/profile", checkAuth(Role.USER), UserController.updateProfile);
router4.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteUser);
router4.patch("/:id/status", checkAuth(Role.ADMIN), UserController.changeStatus);
var userRoutes = router4;

// src/app/modules/Genre/genre.routes.ts
import { Router as Router5 } from "express";

// src/app/modules/Genre/genre.controller.ts
import status11 from "http-status";

// src/app/modules/Genre/genre.service.ts
import status10 from "http-status";
var createGenre = async (payload) => {
  const isExist = await prisma.genre.findUnique({
    where: { name: payload.name }
  });
  if (isExist) {
    throw new AppError_default(status10.BAD_REQUEST, "Genre already exists");
  }
  const result = await prisma.genre.create({
    data: payload
  });
  return result;
};
var getAllGenres = async (query) => {
  const genreQuery = new QueryBuilder(prisma.genre, query, {
    searchableFields: ["name", "description"],
    filterableFields: ["isFeatured", "isPublished"]
  }).search().filter().sort().paginate().fields();
  const result = await genreQuery.execute();
  return result;
};
var updateGenre = async (id, payload) => {
  const isExist = await prisma.genre.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new AppError_default(status10.NOT_FOUND, "Genre not found");
  }
  const result = await prisma.genre.update({
    where: { id },
    data: payload
  });
  return result;
};
var deleteGenre = async (id) => {
  const isExist = await prisma.genre.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new AppError_default(status10.NOT_FOUND, "Genre not found");
  }
  const result = await prisma.genre.delete({
    where: { id }
  });
  return result;
};
var createManyGenre = async (payload) => {
  const result = await prisma.genre.createMany({
    data: payload,
    skipDuplicates: true
  });
  return result;
};
var GenreService = {
  createGenre,
  getAllGenres,
  updateGenre,
  deleteGenre,
  createManyGenre
};

// src/app/modules/Genre/genre.controller.ts
var createGenre2 = catchAsync_default(async (req, res) => {
  const result = await GenreService.createGenre(req.body);
  sendRes_default(res, {
    statusCode: status11.CREATED,
    success: true,
    message: "Genre created successfully",
    data: result
  });
});
var getAllGenres2 = catchAsync_default(async (req, res) => {
  const query = req.query;
  console.log("query from genre get all: ", query);
  const result = await GenreService.getAllGenres(query);
  sendRes_default(res, {
    statusCode: status11.OK,
    success: true,
    message: "Genres fetched successfully",
    data: result
  });
});
var deleteGenre2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await GenreService.deleteGenre(id);
  sendRes_default(res, {
    statusCode: status11.OK,
    success: true,
    message: "Genre deleted successfully",
    data: result
  });
});
var updateGenre2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await GenreService.updateGenre(id, req.body);
  sendRes_default(res, {
    statusCode: status11.OK,
    success: true,
    message: "Genre updated successfully",
    data: result
  });
});
var createManyGenre2 = catchAsync_default(async (req, res) => {
  const data = req.body;
  const result = await GenreService.createManyGenre(data);
  sendRes_default(res, {
    statusCode: status11.OK,
    success: true,
    message: "All Genres created successfully",
    data: result
  });
});
var GenreController = {
  createGenre: createGenre2,
  getAllGenres: getAllGenres2,
  updateGenre: updateGenre2,
  deleteGenre: deleteGenre2,
  createManyGenre: createManyGenre2
};

// src/app/modules/Genre/genre.validation.ts
import { z as z4 } from "zod";
var createGenreSchema = z4.object({
  name: z4.string().min(1, "Genre name is required"),
  slug: z4.string().min(1, "Genre slug is required"),
  description: z4.string().min(1, "Genre description is required"),
  image: z4.string().min(1, "Genre image is required"),
  isPublished: z4.boolean().optional(),
  isFeatured: z4.boolean().optional()
});
var updateGenreSchema = z4.object({
  name: z4.string().min(1, "Genre name is required").optional(),
  description: z4.string().min(1, "Genre description is required").optional(),
  image: z4.string().min(1, "Genre image is required").optional(),
  isPublished: z4.boolean().optional(),
  isFeatured: z4.boolean().optional()
});
var GenreValidation = {
  createGenreSchema,
  updateGenreSchema
};

// src/app/modules/Genre/genre.routes.ts
var router5 = Router5();
router5.post("/bulk", checkAuth(Role.ADMIN), GenreController.createManyGenre);
router5.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.createGenreSchema),
  GenreController.createGenre
);
router5.get("/", GenreController.getAllGenres);
router5.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.updateGenreSchema),
  GenreController.updateGenre
);
router5.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  GenreController.deleteGenre
);
var GenreRoutes = router5;

// src/app/modules/Payment/payment.routes.ts
import { Router as Router6 } from "express";

// src/app/modules/Payment/payment.controller.ts
import httpStatus5 from "http-status";

// src/app/modules/Payment/payment.service.ts
import httpStatus4 from "http-status";
var RENTAL_DURATION_HOURS = 48;
var getMyPayments = async (user) => {
  return await prisma.payment.findMany({
    where: {
      subscription: {
        userId: user.userId
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      subscription: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getMyMediaPurchases = async (user) => {
  return await prisma.mediaPurchase.findMany({
    where: { userId: user.userId },
    include: { media: true },
    orderBy: { createdAt: "desc" }
  });
};
var createMediaCheckoutSession = async (user, mediaId, type) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError_default(httpStatus4.NOT_FOUND, "Media not found");
  if (media.pricing === "FREE")
    throw new AppError_default(httpStatus4.BAD_REQUEST, "This media is free, no purchase needed");
  if (type === MediaPurchaseType.RENTAL && media.pricing !== "RENTAL")
    throw new AppError_default(httpStatus4.BAD_REQUEST, "This media is not available for rental");
  const existing = await prisma.mediaPurchase.findFirst({
    where: {
      userId: user.userId,
      mediaId,
      type,
      status: MediaPurchaseStatus.ACTIVE,
      ...type === MediaPurchaseType.RENTAL ? { expiresAt: { gt: /* @__PURE__ */ new Date() } } : {}
    }
  });
  if (existing)
    throw new AppError_default(httpStatus4.CONFLICT, "You already have active access to this media");
  const price = type === MediaPurchaseType.RENTAL ? media.rentalPrice : media.buyPrice;
  if (!price)
    throw new AppError_default(httpStatus4.BAD_REQUEST, `No ${type.toLowerCase()} price set for this media`);
  const unitAmount = Math.round(Number(price) * 100);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${type === MediaPurchaseType.RENTAL ? "Rent" : "Buy"} \u2014 ${media.title}`,
            description: type === MediaPurchaseType.RENTAL ? `${RENTAL_DURATION_HOURS}-hour rental access` : "Permanent access"
          },
          unit_amount: unitAmount
        },
        quantity: 1
      }
    ],
    metadata: {
      userId: user.userId,
      mediaId,
      type
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`
  });
  return { session_url: session.url };
};
var expireOldMediaPurchases = async (userId) => {
  await prisma.mediaPurchase.updateMany({
    where: {
      userId,
      type: MediaPurchaseType.RENTAL,
      status: MediaPurchaseStatus.ACTIVE,
      expiresAt: { lt: /* @__PURE__ */ new Date() }
    },
    data: { status: MediaPurchaseStatus.EXPIRED }
  });
};
var checkMediaAccess = async (user, mediaId) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError_default(httpStatus4.NOT_FOUND, "Media not found");
  if (media.pricing === "FREE") return { hasAccess: true, reason: "FREE" };
  if (media.pricing === "PREMIUM") {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.userId }
    });
    const hasAccess = subscription?.status === "ACTIVE" && (subscription.plan === "MONTHLY" || subscription.plan === "YEARLY");
    return { hasAccess, reason: "PREMIUM" };
  }
  if (media.pricing === "RENTAL") {
    await expireOldMediaPurchases(user.userId);
    const purchase = await prisma.mediaPurchase.findFirst({
      where: {
        userId: user.userId,
        mediaId,
        type: MediaPurchaseType.RENTAL,
        status: MediaPurchaseStatus.ACTIVE,
        expiresAt: { gt: /* @__PURE__ */ new Date() }
      }
    });
    return { hasAccess: !!purchase, reason: "RENTAL", expiresAt: purchase?.expiresAt };
  }
  return { hasAccess: false, reason: "UNKNOWN" };
};
var PaymentService = {
  getMyPayments,
  getAllPayments,
  getMyMediaPurchases,
  createMediaCheckoutSession,
  checkMediaAccess,
  expireOldMediaPurchases
};

// src/app/modules/Payment/payment.controller.ts
var getMyPayments2 = catchAsync_default(async (req, res) => {
  const result = await PaymentService.getMyPayments(req.user);
  sendRes_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Payment history fetched successfully",
    data: result
  });
});
var getAllPayments2 = catchAsync_default(async (req, res) => {
  const result = await PaymentService.getAllPayments();
  sendRes_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result
  });
});
var getMyMediaPurchases2 = catchAsync_default(async (req, res) => {
  const result = await PaymentService.getMyMediaPurchases(req.user);
  sendRes_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Media purchase history fetched successfully",
    data: result
  });
});
var createMediaCheckoutSession2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const { mediaId, type } = req.body;
  const result = await PaymentService.createMediaCheckoutSession(
    user,
    mediaId,
    type
  );
  sendRes_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Media checkout session created successfully",
    data: result
  });
});
var checkMediaAccess2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const { mediaId } = req.params;
  const result = await PaymentService.checkMediaAccess(user, mediaId);
  sendRes_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Media access checked successfully",
    data: result
  });
});
var PaymentController = {
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2,
  getMyMediaPurchases: getMyMediaPurchases2,
  createMediaCheckoutSession: createMediaCheckoutSession2,
  checkMediaAccess: checkMediaAccess2
};

// src/app/modules/Payment/payment.routes.ts
var router6 = Router6();
router6.get(
  "/my-payments",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyPayments
);
router6.get(
  "/all-payments",
  checkAuth(Role.ADMIN),
  PaymentController.getAllPayments
);
router6.get(
  "/my-media-purchases",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyMediaPurchases
);
router6.post(
  "/media-checkout",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.createMediaCheckoutSession
);
router6.get(
  "/media-access/:mediaId",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.checkMediaAccess
);
var PaymentRoutes = router6;

// src/app/modules/Reaction/reaction.route.ts
import { Router as Router7 } from "express";

// src/app/modules/Reaction/reaction.service.ts
var getAllComments = async (query, user) => {
  const commentQuery = new QueryBuilder(prisma.comment, query, {
    searchableFields: ["content"],
    filterableFields: ["userId", "mediaId", "reviewId", "parentId"]
  }).search().filter().sort().paginate().fields().include({
    user: true,
    replies: true
  });
  const result = await commentQuery.execute();
  return result;
};
var getCommentsByReviewId = async (reviewId) => {
  const result = await prisma.comment.findMany({
    where: {
      reviewId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      replies: true,
      likes: true,
      parent: true
    }
  });
  return result;
};
var createReviewLike = async (user, data) => {
  const result = await prisma.like.create({
    data: {
      userId: user.userId,
      ...data
    }
  });
  return result;
};
var deleteReviewLike = async (id) => {
  const result = await prisma.like.delete({
    where: {
      id
    }
  });
  return result;
};
var createReviewComment = async (user, data) => {
  const review = await prisma.review.findUnique({
    where: {
      id: data.reviewId
    }
  });
  if (!review) {
    throw new AppError_default(404, "Review not found");
  }
  const media = await prisma.media.findUnique({
    where: {
      id: review.mediaId
    }
  });
  if (!media) {
    throw new AppError_default(404, "Media not found");
  }
  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id: data.reviewId
    }
  });
  if (isCommentExist) {
    throw new AppError_default(400, "Comment already exists");
  }
  const result = await prisma.comment.create({
    data: {
      userId: user.userId,
      reviewId: review.id,
      mediaId: review.mediaId,
      content: data.content
    }
  });
  return result;
};
var createCommentReply = async (user, data) => {
  const parentComment = await prisma.comment.findUnique({
    where: {
      id: data.parent
    }
  });
  if (!parentComment) {
    throw new AppError_default(404, "Parent comment not found");
  }
  const result = await prisma.comment.create({
    data: {
      userId: user.userId,
      parentId: parentComment.id,
      reviewId: parentComment.reviewId,
      mediaId: parentComment.mediaId,
      content: data.content
    }
  });
  return result;
};
var updateReviewComment = async (user, id, data) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id
    }
  });
  if (!comment) {
    throw new AppError_default(404, "Comment not found");
  }
  if (comment.userId !== user.userId) {
    throw new AppError_default(403, "You are not authorized to update this comment");
  }
  const result = await prisma.comment.update({
    where: {
      id
    },
    data: {
      content: data.content
    }
  });
  return result;
};
var deleteReviewComment = async (user, id) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id
    }
  });
  if (!comment) {
    throw new AppError_default(404, "Comment not found");
  }
  if (comment.userId !== user.userId) {
    throw new AppError_default(403, "You are not authorized to delete this comment");
  }
  const result = await prisma.comment.delete({
    where: {
      id
    }
  });
  return result;
};
var adminDeleteReviewComment = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id
    }
  });
  if (!comment) {
    throw new AppError_default(404, "Comment not found");
  }
  const result = await prisma.comment.delete({
    where: {
      id
    }
  });
  return result;
};
var LikesService = {
  getAllComments,
  getCommentsByReviewId,
  createReviewLike,
  deleteReviewLike,
  createReviewComment,
  deleteReviewComment,
  createCommentReply,
  updateReviewComment,
  adminDeleteReviewComment
};

// src/app/modules/Reaction/reaction.controller.ts
import status12 from "http-status";
var getAllComments2 = catchAsync_default(async (req, res) => {
  const query = req.query;
  const user = req.user;
  const result = await LikesService.getAllComments(query, user);
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comments fetched successfully",
    data: result
  });
});
var getCommentsByReviewId2 = catchAsync_default(async (req, res) => {
  const reviewId = req.params.reviewId;
  const result = await LikesService.getCommentsByReviewId(reviewId);
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comments fetched successfully",
    data: result
  });
});
var createLike = catchAsync_default(async (req, res) => {
  const result = await LikesService.createReviewLike(
    req.user,
    req.body
  );
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Like created successfully",
    data: result
  });
});
var deleteLike = catchAsync_default(async (req, res) => {
  const result = await LikesService.deleteReviewLike(req.params.id);
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Like deleted successfully",
    data: result
  });
});
var createComment = catchAsync_default(async (req, res) => {
  const result = await LikesService.createReviewComment(
    req.user,
    req.body
  );
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comment created successfully",
    data: result
  });
});
var deleteComment = catchAsync_default(async (req, res) => {
  const result = await LikesService.deleteReviewComment(
    req.user,
    req.params.id
  );
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result
  });
});
var createCommentReply2 = catchAsync_default(async (req, res) => {
  const result = await LikesService.createCommentReply(
    req.user,
    req.body
  );
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comment reply created successfully",
    data: result
  });
});
var updateComment = catchAsync_default(async (req, res) => {
  const result = await LikesService.updateReviewComment(
    req.user,
    req.params.id,
    req.body
  );
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comment updated successfully",
    data: result
  });
});
var adminDeleteComment = catchAsync_default(async (req, res) => {
  const result = await LikesService.adminDeleteReviewComment(
    req.params.id
  );
  sendRes_default(res, {
    statusCode: status12.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result
  });
});
var ReactionController = {
  getAllComments: getAllComments2,
  getCommentsByReviewId: getCommentsByReviewId2,
  createLike,
  deleteLike,
  createComment,
  deleteComment,
  createCommentReply: createCommentReply2,
  updateComment,
  adminDeleteComment
};

// src/app/modules/Reaction/reaction.validation.ts
import { z as z5 } from "zod";
var createLikeValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  type: z5.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
  mediaId: z5.string("Media ID is required"),
  commentId: z5.string("Comment ID is required").optional(),
  parentId: z5.string("Parent ID is required").optional()
});
var deleteLikeValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  type: z5.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
  mediaId: z5.string("Media ID is required"),
  commentId: z5.string("Comment ID is required").optional(),
  parentId: z5.string("Parent ID is required").optional()
});
var createCommentValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  mediaId: z5.string("Media ID is required"),
  content: z5.string("Comment content is required"),
  parentId: z5.string("Parent ID is required").optional(),
  status: z5.enum(["PENDING", "APPROVED", "UNPUBLISHED", "REJECTED", "BLOCKED"])
});
var deleteCommentValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  mediaId: z5.string("Media ID is required"),
  content: z5.string("Comment content is required"),
  parentId: z5.string("Parent ID is required").optional()
});
var createCommentReplyValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  mediaId: z5.string("Media ID is required"),
  parentId: z5.string("Parent ID is required"),
  content: z5.string("Comment content is required"),
  status: z5.enum(["PENDING", "APPROVED", "UNPUBLISHED", "REJECTED", "BLOCKED"])
});
var updateCommentValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  mediaId: z5.string("Media ID is required"),
  parentId: z5.string("Parent ID is required").optional(),
  content: z5.string("Comment content is required"),
  status: z5.enum(["PENDING", "APPROVED", "UNPUBLISHED", "REJECTED", "BLOCKED"])
});
var adminDeleteCommentValidation = z5.object({
  reviewId: z5.string("Review ID is required"),
  mediaId: z5.string("Media ID is required"),
  parentId: z5.string("Parent ID is required").optional(),
  content: z5.string("Comment content is required")
});
var ReactionValidation = {
  createLikeValidation,
  deleteLikeValidation,
  createCommentValidation,
  deleteCommentValidation,
  createCommentReplyValidation,
  updateCommentValidation,
  adminDeleteCommentValidation
};

// src/app/modules/Reaction/reaction.route.ts
var router7 = Router7();
router7.get("/comment", ReactionController.getAllComments);
router7.get("/comment/:reviewId", ReactionController.getCommentsByReviewId);
router7.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.createLikeValidation),
  ReactionController.createLike
);
router7.delete(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.deleteLikeValidation),
  ReactionController.deleteLike
);
router7.post(
  "/comment",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.createCommentValidation),
  ReactionController.createComment
);
router7.delete(
  "/comment/:id",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.deleteCommentValidation),
  ReactionController.deleteComment
);
router7.post(
  "/comment/reply",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.createCommentReplyValidation),
  ReactionController.createCommentReply
);
router7.put(
  "/comment/:id",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.updateCommentValidation),
  ReactionController.updateComment
);
router7.delete(
  "/admin/comment/:id",
  checkAuth(Role.ADMIN),
  validateRequest(ReactionValidation.adminDeleteCommentValidation),
  ReactionController.adminDeleteComment
);
var ReactionRoutes = router7;

// src/app/modules/Subscription/subscription.routes.ts
import { Router as Router8 } from "express";
var router8 = Router8();
router8.get("/plans", SubscriptionController.getPlans);
router8.post("/checkout", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.createCheckoutSession);
router8.get("/status", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getSubscriptionStatus);
router8.get("/history", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getPaymentHistory);
router8.delete(
  "/cancel",
  checkAuth(Role.USER, Role.ADMIN),
  SubscriptionController.cancelSubscription
);
var SubscriptionRouter = router8;

// src/app/modules/Watchlist/watchlist.router.ts
import { Router as Router9 } from "express";

// src/app/modules/Watchlist/watchlist.controller.ts
import status14 from "http-status";

// src/app/modules/Watchlist/watchlist.service.ts
import status13 from "http-status";
var getAllWatchlist = async (user, query) => {
  const result = await prisma.watchlist.findMany({
    where: {
      userId: user.userId
    },
    include: {
      media: true
    }
  });
  return result;
};
var createWatchlist = async (payload, user) => {
  const isExist = await prisma.watchlist.findFirst({
    where: {
      userId: user.userId,
      mediaId: payload.mediaId
    }
  });
  if (isExist) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "You already added this media to your watchlist"
    );
  }
  const result = await prisma.watchlist.create({
    data: {
      userId: user.userId,
      ...payload
    }
  });
  return result;
};
var deleteWatchlist = async (mediaId, user) => {
  const isExist = await prisma.watchlist.findFirst({
    where: {
      mediaId,
      userId: user.userId
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "You didn't add this media to your watchlist"
    );
  }
  const result = await prisma.watchlist.delete({
    where: {
      id: isExist.id
    }
  });
  return result;
};
var WatchlistService = {
  getAllWatchlist,
  createWatchlist,
  deleteWatchlist
};

// src/app/modules/Watchlist/watchlist.controller.ts
var getAllWatchlist2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await WatchlistService.getAllWatchlist(user, query);
  sendRes_default(res, {
    statusCode: status14.OK,
    success: true,
    message: "Watchlist fetched successfully",
    data: result
  });
});
var createWatchlist2 = catchAsync_default(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await WatchlistService.createWatchlist({ mediaId }, user);
  sendRes_default(res, {
    statusCode: status14.OK,
    success: true,
    message: "Watchlist created successfully",
    data: result
  });
});
var deleteWatchlist2 = catchAsync_default(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await WatchlistService.deleteWatchlist(mediaId, user);
  sendRes_default(res, {
    statusCode: status14.OK,
    success: true,
    message: "Watchlist deleted successfully",
    data: result
  });
});
var WatchlistController = {
  getAllWatchlist: getAllWatchlist2,
  createWatchlist: createWatchlist2,
  deleteWatchlist: deleteWatchlist2
};

// src/app/modules/Watchlist/watchlist.router.ts
var router9 = Router9();
router9.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.getAllWatchlist
);
router9.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.createWatchlist
);
router9.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.deleteWatchlist
);
var WatchlistRouter = router9;

// src/app/modules/Admin/admin.routes.ts
import { Router as Router10 } from "express";

// src/app/modules/Admin/admin.controller.ts
import httpStatus6 from "http-status";

// src/app/modules/Admin/admin.service.ts
var getStats = async () => {
  const [
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    revenueAggregate,
    avgRatingAggregate
  ] = await Promise.all([
    prisma.media.count(),
    prisma.review.count({
      where: { status: "APPROVED" }
    }),
    prisma.user.count(),
    prisma.user.count({
      where: { status: "ACTIVE" }
    }),
    prisma.subscription.count({
      where: { status: "ACTIVE" }
    }),
    prisma.payment.aggregate({
      where: { status: "succeeded" },
      _sum: { amount: true }
    }),
    prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true }
    })
  ]);
  return {
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    totalRevenue: revenueAggregate._sum.amount ?? 0,
    avgRating: avgRatingAggregate._avg.rating ?? 0
  };
};
var getSales = async () => {
  const [
    totalSales,
    revenueAggregate,
    monthlyRevenue,
    yearlyRevenue,
    rawSalesOverTime
  ] = await Promise.all([
    prisma.payment.count({
      where: { status: "succeeded" }
    }),
    prisma.payment.aggregate({
      where: { status: "succeeded" },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: {
        status: "succeeded",
        subscription: { plan: "MONTHLY" }
      },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: {
        status: "succeeded",
        subscription: { plan: "YEARLY" }
      },
      _sum: { amount: true }
    }),
    prisma.payment.findMany({
      where: { status: "succeeded" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" }
    })
  ]);
  const totalRevenue = revenueAggregate._sum.amount ?? 0;
  const subscriptionRevenue = (monthlyRevenue._sum.amount ?? 0) + (yearlyRevenue._sum.amount ?? 0);
  const salesOverTime = Object.values(
    rawSalesOverTime.reduce(
      (acc, payment) => {
        const date = payment.createdAt.toISOString().split("T")[0];
        if (!acc[date]) acc[date] = { date, revenue: 0, count: 0 };
        acc[date].revenue += payment.amount;
        acc[date].count += 1;
        return acc;
      },
      {}
    )
  );
  return {
    totalSales,
    totalRevenue,
    purchaseRevenue: 0,
    // ready for when MediaPurchase is wired up
    rentalRevenue: 0,
    // ready for when MediaPurchase is wired up
    subscriptionRevenue,
    salesOverTime
  };
};
var getReviews = async () => {
  const [reviewsData, recentReviews] = await Promise.all([
    prisma.review.groupBy({
      by: ["rating"],
      _count: { id: true },
      orderBy: { rating: "asc" }
    }),
    prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        content: true,
        status: true,
        user: {
          select: { name: true }
        },
        media: {
          select: { title: true }
        }
      }
    })
  ]);
  return {
    byRating: reviewsData,
    // [{rating, _count: {id}}]
    recentReviews
    // matches frontend review list exactly
  };
};
var getAllMedia3 = async (query) => {
  const { genre, platform, minRating } = query;
  const whereConditions = { isPublished: true };
  if (genre) {
    whereConditions.genres = { some: { slug: genre } };
  }
  if (platform) {
    whereConditions.platforms = { some: { platform: { slug: platform } } };
  }
  if (minRating) {
    whereConditions.avgRating = { gte: Number(minRating) };
  }
  const mediaQuery = new QueryBuilder(prisma.media, query, {
    searchableFields: ["title", "synopsis"],
    filterableFields: ["type", "releaseYear"]
  }).where(whereConditions).search().filter().sort().paginate().include({
    genres: true,
    cast: true,
    platforms: { include: { platform: true } }
  }).dynamicInclude(mediaIncludeConfig);
  return await mediaQuery.execute();
};
var AdminService = {
  getStats,
  getSales,
  getReviews,
  getAllMedia: getAllMedia3
};

// src/app/modules/Admin/admin.controller.ts
var getStats2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getStats();
  sendRes_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Admin statistics retrieved successfully",
    data: result
  });
});
var getSales2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getSales();
  sendRes_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Admin sales retrieved successfully",
    data: result
  });
});
var getReviews2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getReviews();
  sendRes_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Admin reviews retrieved successfully",
    data: result
  });
});
var getAllMedia4 = catchAsync_default(async (req, res) => {
  const query = req.query;
  const result = await AdminService.getAllMedia(query);
  sendRes_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Admin media retrieved successfully",
    data: result
  });
});
var AdminController = {
  getStats: getStats2,
  getSales: getSales2,
  getReviews: getReviews2,
  getAllMedia: getAllMedia4
};

// src/app/modules/Admin/admin.routes.ts
var router10 = Router10();
router10.get("/analytics/stats", checkAuth(Role.ADMIN), AdminController.getStats);
router10.get("/analytics/sales", checkAuth(Role.ADMIN), AdminController.getSales);
router10.get(
  "/analytics/reviews",
  checkAuth(Role.ADMIN),
  AdminController.getReviews
);
router10.get("/media", checkAuth(Role.ADMIN), AdminController.getAllMedia);
var AdminRoutes = router10;

// src/app/modules/Platform/platform.routes.ts
import { Router as Router11 } from "express";

// src/app/modules/Platform/platform.controller.ts
import status16 from "http-status";

// src/app/modules/Platform/platform.service.ts
import status15 from "http-status";
var createPlatform = async (payload) => {
  const isExist = await prisma.platform.findUnique({
    where: { name: payload.name }
  });
  if (isExist) {
    throw new AppError_default(status15.BAD_REQUEST, "Platform already exists");
  }
  const result = await prisma.platform.create({
    data: payload
  });
  return result;
};
var getAllPlatforms = async (query) => {
  const platformQuery = new QueryBuilder(prisma.platform, query, {
    searchableFields: ["name", "slug", "description"],
    filterableFields: ["isFeatured", "isPublished", "type"]
  }).search().filter().sort().paginate().fields();
  const result = await platformQuery.execute();
  return result;
};
var updatePlatform = async (id, payload) => {
  const isExist = await prisma.platform.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new AppError_default(status15.NOT_FOUND, "Platform not found");
  }
  const result = await prisma.platform.update({
    where: { id },
    data: payload
  });
  return result;
};
var deletePlatform = async (id) => {
  const isExist = await prisma.platform.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new AppError_default(status15.NOT_FOUND, "Platform not found");
  }
  const result = await prisma.platform.delete({
    where: { id }
  });
  return result;
};
var createManyPlatfrom = async (payload) => {
  const res = await prisma.platform.createMany({
    data: payload,
    skipDuplicates: true
  });
  return res;
};
var PlatformService = {
  createPlatform,
  getAllPlatforms,
  updatePlatform,
  deletePlatform,
  createManyPlatfrom
};

// src/app/modules/Platform/platform.controller.ts
var createPlatform2 = catchAsync_default(async (req, res) => {
  const result = await PlatformService.createPlatform(req.body);
  sendRes_default(res, {
    statusCode: status16.CREATED,
    success: true,
    message: "Platform created successfully",
    data: result
  });
});
var getAllPlatforms2 = catchAsync_default(async (req, res) => {
  const query = req.query;
  console.log("query from platfrom get all: ", query);
  const result = await PlatformService.getAllPlatforms(query);
  sendRes_default(res, {
    statusCode: status16.OK,
    success: true,
    message: "Platforms fetched successfully",
    data: result
  });
});
var deletePlatform2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await PlatformService.deletePlatform(id);
  sendRes_default(res, {
    statusCode: status16.OK,
    success: true,
    message: "Platform deleted successfully",
    data: result
  });
});
var updatePlatform2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await PlatformService.updatePlatform(id, req.body);
  sendRes_default(res, {
    statusCode: status16.OK,
    success: true,
    message: "Platform updated successfully",
    data: result
  });
});
var createManyPlatfrom2 = catchAsync_default(async (req, res) => {
  const data = req.body;
  const result = await PlatformService.createManyPlatfrom(data);
  sendRes_default(res, {
    statusCode: status16.OK,
    success: true,
    message: "All Platforms created successfully",
    data: result
  });
});
var PlatformController = {
  createPlatform: createPlatform2,
  getAllPlatforms: getAllPlatforms2,
  updatePlatform: updatePlatform2,
  deletePlatform: deletePlatform2,
  createManyPlatfrom: createManyPlatfrom2
};

// src/app/modules/Platform/platform.validation.ts
import { z as z6 } from "zod";
var createPlatformSchema = z6.object({
  name: z6.string().min(1, "Platform name is required"),
  slug: z6.string().min(1, "Platform slug is required"),
  description: z6.string().optional(),
  url: z6.string().optional(),
  type: z6.enum([
    "FREE",
    "PREMIUM",
    "RENTAL",
    "BUY",
    "ONE_TIME",
    "FREE_WITH_ADS",
    "LIMITED_FREE",
    "SUBSCRIPTION"
  ]).optional(),
  icon: z6.string().optional(),
  isPublished: z6.boolean().optional(),
  isFeatured: z6.boolean().optional()
});
var updatePlatformSchema = z6.object({
  name: z6.string().min(1, "Platform name is required").optional(),
  slug: z6.string().min(1, "Platform slug is required").optional(),
  description: z6.string().optional(),
  url: z6.string().optional(),
  type: z6.enum([
    "FREE",
    "PREMIUM",
    "RENTAL",
    "BUY",
    "ONE_TIME",
    "FREE_WITH_ADS",
    "LIMITED_FREE",
    "SUBSCRIPTION"
  ]).optional(),
  icon: z6.string().optional(),
  isPublished: z6.boolean().optional(),
  isFeatured: z6.boolean().optional()
});
var PlatformValidation = {
  createPlatformSchema,
  updatePlatformSchema
};

// src/app/modules/Platform/platform.routes.ts
var router11 = Router11();
router11.post(
  "/bulk",
  checkAuth(Role.ADMIN),
  PlatformController.createManyPlatfrom
);
router11.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(PlatformValidation.createPlatformSchema),
  PlatformController.createPlatform
);
router11.get("/", PlatformController.getAllPlatforms);
router11.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(PlatformValidation.updatePlatformSchema),
  PlatformController.updatePlatform
);
router11.delete("/:id", checkAuth(Role.ADMIN), PlatformController.deletePlatform);
var PlatformRoutes = router11;

// src/app/modules/Bookmark/bookmark.routes.ts
import { Router as Router12 } from "express";

// src/app/modules/Bookmark/bookmark.controller.ts
import status18 from "http-status";

// src/app/modules/Bookmark/bookmark.service.ts
import status17 from "http-status";
var getAllBookmark = async (user, query) => {
  const result = await prisma.bookmark.findMany({
    where: {
      userId: user.userId
    },
    include: {
      media: true
    }
  });
  return result;
};
var createBookmark = async (payload, user) => {
  const isExist = await prisma.bookmark.findFirst({
    where: {
      userId: user.userId,
      mediaId: payload.mediaId
    }
  });
  if (isExist) {
    throw new AppError_default(
      status17.BAD_REQUEST,
      "You already added this media to your bookmark"
    );
  }
  const result = await prisma.bookmark.create({
    data: {
      userId: user.userId,
      ...payload
    }
  });
  return result;
};
var deleteBookmark = async (mediaId, user) => {
  const isExist = await prisma.bookmark.findFirst({
    where: {
      mediaId,
      userId: user.userId
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status17.BAD_REQUEST,
      "You didn't add this media to your bookmark"
    );
  }
  const result = await prisma.bookmark.delete({
    where: {
      id: isExist.id
    }
  });
  return result;
};
var BookmarkService = {
  getAllBookmark,
  createBookmark,
  deleteBookmark
};

// src/app/modules/Bookmark/bookmark.controller.ts
var getAllBookmark2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await BookmarkService.getAllBookmark(user, query);
  sendRes_default(res, {
    statusCode: status18.OK,
    success: true,
    message: "Bookmark fetched successfully",
    data: result
  });
});
var createBookmark2 = catchAsync_default(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await BookmarkService.createBookmark({ mediaId }, user);
  sendRes_default(res, {
    statusCode: status18.OK,
    success: true,
    message: "Bookmark created successfully",
    data: result
  });
});
var deleteBookmark2 = catchAsync_default(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await BookmarkService.deleteBookmark(mediaId, user);
  sendRes_default(res, {
    statusCode: status18.OK,
    success: true,
    message: "Bookmark deleted successfully",
    data: result
  });
});
var BookmarkController = {
  getAllBookmark: getAllBookmark2,
  createBookmark: createBookmark2,
  deleteBookmark: deleteBookmark2
};

// src/app/modules/Bookmark/bookmark.routes.ts
var router12 = Router12();
router12.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.getAllBookmark
);
router12.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.createBookmark
);
router12.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.deleteBookmark
);
var BookmarkRouter = router12;

// src/app/modules/Favourite/favourite.routes.ts
import { Router as Router13 } from "express";

// src/app/modules/Favourite/favourite.controller.ts
import status20 from "http-status";

// src/app/modules/Favourite/favourite.service.ts
import status19 from "http-status";
var getAllFavourite = async (user, query) => {
  const result = await prisma.favorite.findMany({
    where: {
      userId: user.userId
    },
    include: {
      media: true
    }
  });
  return result;
};
var createFavourite = async (payload, user) => {
  const isExist = await prisma.favorite.findFirst({
    where: {
      userId: user.userId,
      mediaId: payload.mediaId
    }
  });
  if (isExist) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "You already added this media to your favorite"
    );
  }
  const result = await prisma.favorite.create({
    data: {
      userId: user.userId,
      ...payload
    }
  });
  return result;
};
var deleteFavourite = async (mediaId, user) => {
  const isExist = await prisma.favorite.findFirst({
    where: {
      mediaId,
      userId: user.userId
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "You didn't add this media to your favorite"
    );
  }
  const result = await prisma.favorite.delete({
    where: {
      id: isExist.id
    }
  });
  return result;
};
var FavoriteService = {
  getAllFavourite,
  createFavourite,
  deleteFavourite
};

// src/app/modules/Favourite/favourite.controller.ts
var getAllFavourite2 = catchAsync_default(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await FavoriteService.getAllFavourite(user, query);
  sendRes_default(res, {
    statusCode: status20.OK,
    success: true,
    message: "Favourite fetched successfully",
    data: result
  });
});
var createFavourite2 = catchAsync_default(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await FavoriteService.createFavourite({ mediaId }, user);
  sendRes_default(res, {
    statusCode: status20.OK,
    success: true,
    message: "Favourite created successfully",
    data: result
  });
});
var deleteFavourite2 = catchAsync_default(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await FavoriteService.deleteFavourite(mediaId, user);
  sendRes_default(res, {
    statusCode: status20.OK,
    success: true,
    message: "Favourite deleted successfully",
    data: result
  });
});
var FavoriteController = {
  getAllFavourite: getAllFavourite2,
  createFavourite: createFavourite2,
  deleteFavourite: deleteFavourite2
};

// src/app/modules/Favourite/favourite.routes.ts
var router13 = Router13();
router13.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.getAllFavourite
);
router13.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.createFavourite
);
router13.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.deleteFavourite
);
var FavoriteRouter = router13;

// src/app/routes/routes.ts
var router14 = Router14();
router14.use("/auth", authRoutes);
router14.use("/users", userRoutes);
router14.use("/media", MediaRoutes);
router14.use("/reviews", ReviewsRoutes);
router14.use("/genres", GenreRoutes);
router14.use("/platforms", PlatformRoutes);
router14.use("/payments", PaymentRoutes);
router14.use("/reactions", ReactionRoutes);
router14.use("/subscriptions", SubscriptionRouter);
router14.use("/watchlist", WatchlistRouter);
router14.use("/bookmark", BookmarkRouter);
router14.use("/favorite", FavoriteRouter);
router14.use("/admin", AdminRoutes);
var AppRoutes = router14;

// src/app/middleware/globalErrorHandler.ts
import status23 from "http-status";
import z7 from "zod";

// src/app/error-helpers/handleZodError.ts
import status21 from "http-status";
var handleZodError = (err) => {
  let statusCode = status21.BAD_REQUEST;
  let message = "Zod validation error.";
  let errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.length > 1 ? issue.path.join(" => ") : issue.path[0].toString(),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/error-helpers/handlePrismaError.ts
import status22 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status22.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status22.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status22.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status22.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status22.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status22.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status22.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status22.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status22.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status22.INTERNAL_SERVER_ERROR;
  }
  return status22.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status22.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status22.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status22.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [
    {
      path: "Rust Engine Crashed",
      message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
    }
  ];
  return {
    success: false,
    statusCode: status22.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status23.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z7.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status23.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status24 from "http-status";
var notFound = (req, res) => {
  res.status(status24.NOT_FOUND).json({
    success: false,
    statusCode: status24.NOT_FOUND,
    message: "Route not match or don't exist. Please check the path again.",
    errorSources: [
      {
        path: req.originalUrl,
        message: "Route not match or don't exist. Please check the path again."
      }
    ]
  });
};

// src/appServer.ts
var app = express();
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), "src/app/templates"));
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000"
    ],
    credentials: true
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/auth/*splat", toNodeHandler(auth));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.webhook
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", AppRoutes);
app.get("/", async (req, res) => {
  res.status(200).json({
    name: "Censura Server",
    version: "v1",
    port: envVars.PORT,
    localUrl: `http://localhost:${envVars.PORT}`,
    liveUrl: null,
    deploy_server: null,
    message: "Censura Server is running now.",
    node_env: envVars.NODE_ENV
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var appServer = app;

// src/index.ts
var server;
var bootstrap = async () => {
  try {
    await seedDefaultAdmin();
    server = appServer.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootstrap();
