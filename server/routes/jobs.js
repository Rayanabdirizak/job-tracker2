const express = require("express");
const router = express.Router();
const Job = require("../models/jobs");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort("-createdAt");
    res.status(200).json({ jobs, count: jobs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;