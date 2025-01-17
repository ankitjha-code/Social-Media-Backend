import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/admin.route.js";
import submissionRouter from "./routes/userSubmissions.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "50mb" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Welcome to the backend of the project");
});
app.use("/api/admin", adminRouter);
app.use("/api/submissions", submissionRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
