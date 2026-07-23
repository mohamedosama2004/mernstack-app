import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import path from "path";
import rateLimiter from "../middleware/ratelimiter.js";
dotenv.config();
const port = process.env.PORT || 5001;
const app = express();
const __dirname = path.resolve();
app.use("/api/notes", notesRoutes);
// middle ware
app.use(express.json()); // this  middle layer will parse the json bodies

// our middle ware
app.use(rateLimiter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server started at PORT ${port} `);
  });
});
