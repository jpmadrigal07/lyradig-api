const express = require("express");
const router = express.Router();
const {
  getAllReferralTopUps,
  addReferralTopUp,
  updateReferralTopUp,
  deleteReferralTopUp,
} = require("./controller");

router.get("/", getAllReferralTopUps);
router.post("/", addReferralTopUp);
router.put("/", updateReferralTopUp);
router.delete("/", deleteReferralTopUp);

module.exports = router;
