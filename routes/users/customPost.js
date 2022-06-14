const PointsReceives = require("../../models/pointsReceives");
const ReferralTopUps = require("../../models/referralTopUps");
const Users = require("../../models/users");
const { UNKNOWN_ERROR_OCCURRED } = require("../../constants");
const keys = require("../../config/keys");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const collectWalletPoints = async (req, res, next) => {
  const { userId } = req.body;
  if (userId) {
    try {
      const getPointsReceives = await PointsReceives.find({
        userId,
        $or: [{ isCollected: false }, { isCollected: { $exists: false } }],
        deletedAt: {
          $exists: false,
        },
      });
      const getReferralTopUps = await ReferralTopUps.find({
        referredId: userId,
        $or: [{ isCollected: false }, { isCollected: { $exists: false } }],
        deletedAt: {
          $exists: false,
        },
      });
      const getTotalPoints = [
        ...getPointsReceives,
        ...getReferralTopUps,
      ].reduce((acc, curr) => acc + curr.points, 0);
      const toUpdatePointsReceives = getPointsReceives.map((pointReceive) => {
        return {
          updateOne: {
            filter: { _id: pointReceive._id },
            update: { $set: { isCollected: true } },
          },
        };
      });
      const toUpdateReferralTopUps = getReferralTopUps.map((referralTopUp) => {
        return {
          updateOne: {
            filter: { _id: referralTopUp._id },
            update: { $set: { isCollected: true } },
          },
        };
      });
      const updateUser = await Users.updateOne(
        { _id: userId },
        { $inc: { walletPoints: getTotalPoints } }
      );
      const bulkPointsReceives =
        toUpdatePointsReceives.length > 0
          ? await PointsReceives.bulkWrite(toUpdatePointsReceives.flat())
          : {};
      const bulkReferralTopUps =
        toUpdateReferralTopUps.length > 0
          ? await ReferralTopUps.bulkWrite(toUpdateReferralTopUps.flat())
          : {};
      res.json({ updateUser, bulkPointsReceives, bulkReferralTopUps });
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are missing");
  }
};

const auth = async (req, res, next) => {
  const { username, password } = req.body;
  if ((username, password)) {
    const encryptPassword = CryptoJS.AES.encrypt(
      password,
      keys.encryptKey
    ).toString();
    try {
      const user = await Users.findOne({
        username,
        password: encryptPassword,
        deletedAt: {
          $exists: false,
        },
      });
      if (!user) {
        throw new Error("Username or password is invalid");
      } else {
        const token = jwt.sign(
          { id: user.id, username: user.username, userType: user.userType },
          keys.signKey,
          { expiresIn: "1d" }
        );
        res.json(token);
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are missing");
  }
};

const verifyAuth = async (req, res, next) => {
  const token = req.body.token;
  try {
    // Check if token is defined
    if (!token) {
      throw new Error("Authentication is invalid");
    }
    // Verify the token
    const { username, exp } = jwt.verify(token, keys.signKey);
    // Check if username exist in db
    const user = await Users.findOne({ username });
    if (!user) {
      throw new Error("No user with that username");
    }
    // Check if token is not expired
    const expDate = moment.unix(parseInt(exp)).format("MM/DD/YYYY");
    const nowDate = moment().format("MM/DD/YYYY");
    if (expDate === nowDate) {
      throw new Error("Authentication is expired");
    }
    res.json(user);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    if (message === "jwt malformed") {
      res.status(500).json("Token is invalid");
    } else {
      res.status(500).json(message);
    }
  }
};

module.exports = {
  collectWalletPoints,
  auth,
  verifyAuth,
};
