const express = require("express");
const { approveItem, rejectItem, getPendingItems } = require("../controllers/moderatorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all pending items
router.get("/pending", protect, getPendingItems);

// Approve an item
router.put("/approve/:id", protect, approveItem);

// Reject an item
router.put("/reject/:id", protect, rejectItem);

module.exports = router;
