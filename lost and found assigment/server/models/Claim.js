const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  claimantId: {
    type: String,
    required: true,
  },
  policyNumber: {
    type: String,
    required: true,
  },
  claimAmount: {
    type: Number,
    required: true,
  },
  claimStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  description: {
    type: String,
    required: true,
  },
  documents: [
    {
      fileName: String,
      fileUrl: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Claim", claimSchema);
