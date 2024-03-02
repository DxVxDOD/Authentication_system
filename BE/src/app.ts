import { createHandler } from "graphql-http/lib/use/http";
import user from "./schemas/user_schema";
import express from "express";

const app = express();

app.all("/graphql", (request, response) =>
  createHandler({
    schema: user,
    context: { request, response },
  }),
);

export default app;
