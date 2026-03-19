import express, { Request, Response } from "express";
import path from "path";
import { envVars } from "./config/env";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import cookieParser from "cookie-parser";
import { AppRoutes } from "./routes/routes";
import { auth } from "./lib/auth";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app = express();

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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", toNodeHandler(auth));
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

// Global Error Handler
app.use(globalErrorHandler);

export default app;
