const Item = require("../models/Item");

// Get pending items
const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: "Pending" }).populate("reportedBy", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Approve item
const approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });

    item.status = "Approved";
    item.approvedBy = req.user.id; // requires `protect` middleware to set `req.user`
    await item.save();

    res.json({ msg: "Item approved successfully", item });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reject item
const rejectItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });

    item.status = "Rejected";
    await item.save();

    res.json({ msg: "Item rejected successfully", item });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { getPendingItems, approveItem, rejectItem };
