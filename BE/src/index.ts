import app from "./app";
import { PORT } from "./utils/config";
import mongoose from "mongoose";
import { MONGO_URI } from "./utils/config";

console.log("Connecting to: MongoDB");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    throw new Error("Error while connecting to MongoDB: " + error.message);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
