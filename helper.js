const Users = require("./models/users");
const { UNKNOWN_ERROR_OCCURRED } = require("./constants");
const keys = require("./config/keys");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const isUserLoggedIn = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const { username, exp } = jwt.verify(bearerToken, keys.signKey);
      const user = await Users.findOne({ username });
      if (!user) {
        throw new Error("No account found");
      }
      const expDate = moment.unix(parseInt(exp)).format("MM/DD/YYYY");
      const nowDate = moment().format("MM/DD/YYYY");
      if (expDate === nowDate) {
        throw new Error("Authentication is expired");
      }
      next();
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(403).json(`Authorize Request Error: ${message}`);
    }
  } else {
    res.status(403).json(`You are not authorized to perform this action`);
  }
};

const isUserStaff = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const { username, userType } = jwt.verify(bearerToken, keys.signKey);
      const user = await Users.findOne({ username });
      if (!user) {
        throw new Error("No account found");
      }
      if (userType !== "Staff") {
        throw new Error("You are not authorized to perform this action");
      }
      next();
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(403).json(`Authorize Request Error: ${message}`);
    }
  } else {
    res.status(403).json(`You are not authorized to perform this action`);
  }
};

const isUserAdmin = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const { username, userType } = jwt.verify(bearerToken, keys.signKey);
      const user = await Users.findOne({ username });
      if (!user) {
        throw new Error("No account found");
      }
      if (userType !== "Admin") {
        throw new Error("You are not authorized to perform this action");
      }
      next();
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(403).json(`Authorize Request Error: ${message}`);
    }
  } else {
    res.status(403).json(`You are not authorized to perform this action`);
  }
};

module.exports = {
  isUserLoggedIn,
  isUserStaff,
  isUserAdmin,
};
