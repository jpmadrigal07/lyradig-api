const Withdraws = require("../../models/withdraws");
const Users = require("../../models/users");
const isEmpty = require("lodash/isEmpty");
const { UNKNOWN_ERROR_OCCURRED } = require("../../constants");

const getAllWithdraws = async (req, res, next) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllWithdraw = await Withdraws.find(condition);
    res.json(getAllWithdraw);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    res.status(500).json(message);
  }
};

const addWithdraw = async (req, res, next) => {
  const { userId, amount } = req.body;
  if (userId && amount && declineReason) {
    const newWithdraw = new Withdraws({
      userId,
      amount,
    });
    try {
      const getWithdraw = await Withdraws.find({
        userId,
        amount, // add date here
        deletedAt: {
          $exists: false,
        },
      });
      const checkPointsSufficient = await Users.find({
        _id: userId,
        walletPoints: { $gte: amount },
        deletedAt: {
          $exists: false,
        },
      });
      if (getWithdraw.length > 0) {
        throw new Error("Withdraw name must be unique");
      } else if (checkPointsSufficient.length === 0) {
        throw new Error("Insufficient wallet points");
      } else {
        const createWithdraw = await newWithdraw.save();
        res.json(createWithdraw);
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
};

const updateWithdraw = async (req, res, next) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const withdraw = await Withdraws.findOne({
        _id: req.params.id,
        deletedAt: {
          $exists: false,
        },
      }).populate("userId");
      const isWalletPointsInsufficient =
        condition?.status === "Approved" &&
        withdraw.amount > withdraw.userId.walletPoints;
      if (isWalletPointsInsufficient) {
        throw new Error("Insufficient wallet points");
      }
      const updateWithdraw = await Withdraws.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      if (updateWithdraw?.status === "Approved") {
        const updateUser = await Users.findByIdAndUpdate(
          withdraw.userId,
          {
            $inc: { walletPoints: -withdraw.amount },
            updatedAt: Date.now(),
          },
          { new: true }
        );
        res.json({ updateWithdraw, updateUser });
      } else {
        res.json(updateWithdraw);
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Withdraw cannot be found");
  }
};

const deleteWithdraw = async (req, res, next) => {
  try {
    const getWithdraw = await Withdraws.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getWithdraw.length > 0) {
      const deleteWithdraw = await Withdraws.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteWithdraw);
    } else {
      throw new Error("Withdraw is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    res.status(500).json(message);
  }
};

module.exports = {
  getAllWithdraws,
  addWithdraw,
  updateWithdraw,
  deleteWithdraw,
};
