const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Fix CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("Job Tracker API Running 🚀");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });