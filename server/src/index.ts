import express from "express";
import cors from "cors";

import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import v1Routes from "./routes/v1.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import "./types/express-augmentations.js";

dotenv.config({
  path: "./.env",
});

export const NODE_ENV = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: NODE_ENV !== "DEVELOPMENT",
  })
);

const allowedOrigins = (
  process.env.CORS_ORIGIN + ",https://wish-together.vercel.app/"
).split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
    maxAge: 600,
  })
);
app.options("*", cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wishlist API Service",
    note: "Click on the 'url' values below to access the respective API versions",
    available_versions: {
      v1: {
        status: "active",
        route: "/api/v1",
        url: `${req.protocol}://${req.get("host")}/api/v1`,
        documentation: `${req.protocol}://${req.get("host")}/api/v1/docs`,
        description: "Version 1 of the Wishlist API",
      },
    },
    current_mode: NODE_ENV,
  });
});

app.use("/api/v1", v1Routes);

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    note: "Check the URL and try again",
  });
});
app.use(errorMiddleware);

app.listen(PORT, () =>
  console.log(
    `Server is working on ${
      NODE_ENV === "DEVELOPMENT" ? `http://localhost:${PORT}` : `Port:${PORT}`
    } in ${NODE_ENV} Mode.`
  )
);
