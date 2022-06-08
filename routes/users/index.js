const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("./controller");

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

module.exports = router;
