import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import rateLimiter from "../middleware/ratelimiter.js";
dotenv.config();
const port = process.env.PORT || 5001;
const app = express();
// middle ware
app.use(express.json()); // this  middle layer will parse the json bodies

// our middle ware
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server started at PORT ${port} `);
  });
});
