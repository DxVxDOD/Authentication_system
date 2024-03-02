import app from "./app";
import { PORT } from "./utils/config";
import mongoose from "mongoose";
import { MONGO_URI } from "./utils/config";
import { createClient } from "redis";

const client = createClient();

console.log("Connecting to: MongoDB");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    throw new Error("Error while connecting to MongoDB: " + error.message);
  });

console.log("Connecting to: Redis");
client.on("error", (err) => console.log("Redis Client Error", err));

client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((error) => {
    throw new Error("Error while connecting to Redis: " + error.message);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
