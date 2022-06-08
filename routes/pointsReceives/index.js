const express = require("express");
const router = express.Router();
const {
  getAllPointsReceives,
  addPointsReceive,
  updatePointsReceive,
  deletePointsReceive,
} = require("./controller");

router.get("/", getAllPointsReceives);
router.post("/", addPointsReceive);
router.put("/", updatePointsReceive);
router.delete("/", deletePointsReceive);

module.exports = router;
