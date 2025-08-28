const Claim = require("../models/Claim"); // Import Claim model

// Create a new claim
const createClaim = async (req, res) => {
  try {
    const newClaim = new Claim(req.body);
    await newClaim.save();
    res.status(201).json({ message: "Claim created successfully", data: newClaim });
  } catch (error) {
    res.status(500).json({ message: "Error creating claim", error: error.message });
  }
};

// Get all claims
const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find();
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims", error: error.message });
  }
};

// Get claim by ID
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claim", error: error.message });
  }
};

// Update claim by ID
const updateClaim = async (req, res) => {
  try {
    const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.status(200).json({ message: "Claim updated successfully", data: updatedClaim });
  } catch (error) {
    res.status(500).json({ message: "Error updating claim", error: error.message });
  }
};

// Delete claim by ID
const deleteClaim = async (req, res) => {
  try {
    const deletedClaim = await Claim.findByIdAndDelete(req.params.id);
    if (!deletedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.status(200).json({ message: "Claim deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting claim", error: error.message });
  }
};

module.exports = {
  createClaim,  
  getClaims,
  getClaimById,
  updateClaim,
  deleteClaim
};