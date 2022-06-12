const express = require("express");
const router = express.Router();
const {
  getAllPointsReceives,
  addPointsReceive,
  updatePointsReceive,
  deletePointsReceive,
} = require("./default");
const { collectPointsReceives } = require("./customPost");

// default
router.get("/", getAllPointsReceives);
router.post("/", addPointsReceive);
router.put("/", updatePointsReceive);
router.delete("/", deletePointsReceive);

// custom post
router.post("/collectPointsReceives", collectPointsReceives);

module.exports = router;
