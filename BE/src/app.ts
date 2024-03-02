import { createHandler } from "graphql-http/lib/use/http";
import user from "./schemas/user_schema";
import express from "express";
import rateLimit from "express-rate-limit";

const app = express();

const rateLimiter = rateLimit({
  max: 5,
  windowMs: 1000 * 60 * 10,
});

app.all("/graphql", rateLimiter, (request, response) =>
  createHandler({
    schema: user,
    context: { request, response },
  }),
);

export default app;
