
const express = require("express");
const router = express.Router();
const {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
} = require("../controllers/claimController");

router.post("/", createClaim);     
router.get("/", getClaims);        
router.get("/:id", getClaimById);  
router.put("/:id", updateClaim);   
router.delete("/:id", deleteClaim); 

module.exports = router;
