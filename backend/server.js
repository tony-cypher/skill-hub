import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port 5000");
});
