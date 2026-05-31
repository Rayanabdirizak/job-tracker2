const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
 origin: ["http://localhost:5173", "https://job-tracker2-jade.vercel.app", "https://habit-tracker-chi-gold.vercel.app"],
}));

app.use(express.json());

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const habitRoutes = require("./routes/habits");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/habits", habitRoutes);

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

  