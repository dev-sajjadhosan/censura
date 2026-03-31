import express, { Request, Response } from "express";
import path from "path";

import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import cookieParser from "cookie-parser";
import { startSubscriptionCronJobs } from "./app/utils/subscription.cron";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { SubscriptionController } from "./app/modules/Subscription/subscription.controller";
import { AppRoutes } from "./app/routes/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";


const app = express();

// Initialize cron jobs
// startSubscriptionCronJobs();

app.set("view engine", "ejs"); // for email templates
app.set("views", path.resolve(process.cwd(), "src/app/templates")); // email templates location

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
    ],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth/*splat", toNodeHandler(auth));

// Mount webhook before express.json() so it retains the raw body as a buffer
// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   SubscriptionController.webhook
// );

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", AppRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    name: "Censura Server",
    version: "v1",
    port: envVars.PORT,
    localUrl: `http://localhost:${envVars.PORT}`,
    liveUrl: null,
    deploy_server: null,
    message: "Censura Server is running now.",
    node_env: envVars.NODE_ENV,
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export const appServer = app; 
