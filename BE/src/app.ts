import express from "express";
import cors from "cors";
import { requestLogger } from "./utils/middleware/logger";
import { createHandler } from "graphql-http";
import schema from "./schemas/user_schema";
import { Redis } from "ioredis";
import rateLimit from "express-rate-limit";

const app = express();

const redis = new Redis();
const loginLimiter = new rateLimit({ max: 5, windowMs: 1000 * 60 * 10 });

const maxNumberOfFailedLogins = 5;
const timeWindowForFailedLogins = 60 * 60 * 1;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.all("/graphql", loginLimiter, async (request, response) =>
  createHandler({ schema, context: { request, response } }),
);

app.get("/*", (_request, response) => {
  response.sendFile("/index.html", { root: "./dist" });
});

app.use(requestLogger);

export default app;
