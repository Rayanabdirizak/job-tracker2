const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);