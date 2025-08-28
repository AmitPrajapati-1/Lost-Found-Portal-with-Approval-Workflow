const Item = require("../models/Item");

// Report (create) new item
const reportItem = async (req, res) => {
  try {
    const { title, description, location, category, imageUrl, dateReported } = req.body;
    const item = new Item({
      title,
      description,
      location,
      category,
      imageUrl,
      ...(dateReported ? { dateReported } : {}),
      reportedBy: req.user.id, // from JWT middleware
      status: "Pending"
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all items (admin/debug purpose)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("reportedBy", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get only approved items
const getApprovedItems = async (req, res) => {
  try {
    const items = await Item.find({ status: "Approved" }).populate("reportedBy", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("reportedBy", "name");
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update item (e.g., admin approving/rejecting)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Claim an item
const claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    if (item.status === "Claimed")
      return res.status(400).json({ msg: "Item already claimed" });

    item.status = "Claimed";
    item.claimantId = req.user.id;
    item.claimDate = new Date();
    await item.save();

    res.json({ msg: "Item claimed successfully", item });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  reportItem,
  getAllItems,
  getApprovedItems,
  getItemById,
  updateItem,
  deleteItem,
  claimItem
};
