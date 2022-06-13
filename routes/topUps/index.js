const express = require("express");
const router = express.Router();
const {
  getAllTopUps,
  addTopUp,
  updateTopUp,
  deleteTopUp,
} = require("./default");

router.get("/", getAllTopUps);
router.post("/", addTopUp);
router.put("/", updateTopUp);
router.delete("/", deleteTopUp);

module.exports = router;
