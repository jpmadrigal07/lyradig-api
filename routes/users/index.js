const express = require("express");
const router = express.Router();
const { getAllUsers, addUser, updateUser, deleteUser } = require("./default");
const { collectWalletPoints } = require("./customPost");

// default
router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

// custom post
router.post("/collectWalletPoints", collectWalletPoints);

module.exports = router;
