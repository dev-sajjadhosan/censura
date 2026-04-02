import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./app/config/env";

import { toNodeHandler } from "better-auth/node";
import { AppRoutes } from "./app/routes/routes";
import { startSubscriptionCronJobs } from "./app/utils/subscription.cron";
import { auth } from "./app/lib/auth";
import { SubscriptionController } from "./app/modules/Subscription/subscription.controller";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { seedDefaultAdmin } from "./app/utils/seed";

const app = express();

// Initialize cron jobs
// startSubscriptionCronJobs();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
    ],
    credentials: true,
  }),
);

app.use("/api/auth/*splat", toNodeHandler(auth));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.webhook,
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", AppRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Assalamu Alaikum! Censura Server is breathing. 🟢",
    meta: {
      name: "Censura Core Engine",
      version: "1.0.4-stable",
      developer: "The Legend",
      mood: "Happy & Hydrated 😊☕",
    },
    environment: {
      mode: envVars.NODE_ENV,
      port: envVars.PORT,
      uptime: `${process.uptime().toFixed(2)}s`,
      health: "Optimal",
    },
    endpoints: {
      v1: "/api/v1",
      docs: "/api/v1/docs", // Even if it doesn't exist yet, looks cool
      status: "/healthcheck",
    },
    links: {
      local: `http://localhost:${envVars.PORT}`,
      live: "https://censura-server.vercel.app", // Update this when live
    },
    quote: "Build things that matter, and don't forget to push your code! 🚀",
  });
});

app.get("/healthcheck", async (req: Request, res: Response) => {
  const healthData = {
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    memoryUsage: {
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    },
    database: "CONNECTED", // Since Prisma would've crashed the boot if the URL was wrong
  };

  try {
    res.status(200).json(healthData);
  } catch (error: any) {
    res.status(503).json({ status: "DOWN", error: error.message });
  }
});

app.get("/admin-create/:password", async (req: Request, res: Response) => {
  const { password } = req.params;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (password !== envVars.DEFAULT_ADMIN_PASSWORD) {
    return res.status(401).json({
      greeting: "Assalamu Alaikum, Stranger.",
      hacking_status: "In-Progress... (Not really, you're bad at this)",
      mood: "Extremely Disappointed 😒",
      developer_notes: {
        message: "Nice try, Mr. Robot. But you aren't the developer.",
        safety_tip: "Maybe try 'password123'? (Just kidding, don't do that).",
        consequence:
          "I've sent your IP address to your mother. She is not happy.",
      },
      security_logs: {
        ip_captured: clientIp,
        attempt_logged: true,
        humiliation_level: "Infinite",
      },
      final_word: "Go grab a chai and leave my server alone. ☕",
    });
  }

  await seedDefaultAdmin();
  res.status(200).json({
    message: "Walaikum Assalam, Boss! 👑",
    access: "Granted",
    status: "Welcome back. Let's build something that doesn't crash this time.",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
