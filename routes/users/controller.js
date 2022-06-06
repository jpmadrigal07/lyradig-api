const Users = require("../../models/users");
const isEmpty = require("lodash/isEmpty");
const { UNKNOWN_ERROR_OCCURRED } = require("../../constants");

const getAllUsers = async (req, res, next) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllUser = await Users.find(condition);
    res.json(getAllUser);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    res.status(500).json(message);
  }
};

const addUser = async (req, res, next) => {
  const { username, password, userType } = req.body;
  if (username && password && userType) {
    const newUser = new User({
      username,
      password,
      userType,
    });
    try {
      const getUser = await User.find({
        username,
        deletedAt: {
          $exists: false,
        },
      });
      if (getUser.length === 0) {
        const createUser = await newUser.save();
        res.json(createUser);
      } else {
        throw new Error("Username must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
};

module.exports = {
  getAllUsers,
  addUser,
};
