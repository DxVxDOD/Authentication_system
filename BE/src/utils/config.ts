import dotenv from "dotenv";
import { stringParser } from "./parsers/general_parsers";

dotenv.config();

export const PORT = stringParser(process.env.PORT) || 3000;
export const MONGO_URI = stringParser(process.env.MONGO_URI);
