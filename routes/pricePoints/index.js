const express = require("express");
const router = express.Router();
const {
  getAllPricePoints,
  addPricePoint,
  updatePricePoint,
  deletePricePoint,
} = require("./controller");

router.get("/", getAllPricePoints);
router.post("/", addPricePoint);
router.put("/", updatePricePoint);
router.delete("/", deletePricePoint);

module.exports = router;
