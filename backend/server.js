require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Exp 16 backend is running"));
app.use("/api/auth", authRoutes);
app.use("/students", studentRoutes);

const PORT = process.env.PORT || 3000; // Render supplies PORT automatically

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "collegeDB" })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
