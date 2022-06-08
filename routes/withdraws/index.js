const express = require("express");
const router = express.Router();
const {
  getAllWithdraws,
  addWithdraw,
  updateWithdraw,
  deleteWithdraw,
} = require("./controller");

router.get("/", getAllWithdraws);
router.post("/", addWithdraw);
router.put("/", updateWithdraw);
router.delete("/", deleteWithdraw);

module.exports = router;
