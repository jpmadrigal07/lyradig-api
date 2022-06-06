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
}

module.exports = {
    getAllUsers
}