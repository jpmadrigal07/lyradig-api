const express = require("express");
const router = express.Router();
const { getAllUsers, addUser, updateUser, deleteUser } = require("./default");
const { collectWalletPoints, auth, verifyAuth } = require("./customPost");
const { isUserLoggedIn, isUserStaff } = require("../../helper");

// default
router.get("/", isUserLoggedIn, isUserStaff, getAllUsers);
router.post("/", addUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

// custom post
router.post("/collectWalletPoints", isUserLoggedIn, collectWalletPoints);
router.post("/auth", auth);
router.post("/verifyAuth", verifyAuth);

module.exports = router;
