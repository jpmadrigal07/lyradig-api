const Users = require("../../models/users");
const isEmpty = require("lodash/isEmpty");
const { UNKNOWN_ERROR_OCCURRED } = require("../../constants");
const keys = require("../../config/keys");
const CryptoJS = require("crypto-js");

const referralCode = () => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

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
    const encryptPassword = CryptoJS.AES.encrypt(
      password,
      keys.encryptKey
    ).toString();
    const newUser = new Users({
      username,
      password: encryptPassword,
      userType,
      referralCode: referralCode(),
    });
    try {
      const getUser = await Users.find({
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
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
};

const updateUser = async (req, res, next) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateUser);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("User cannot be found");
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const getUser = await Users.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getUser.length > 0) {
      const deleteUser = await Users.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteUser);
    } else {
      throw new Error("User is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    res.status(500).json(message);
  }
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
