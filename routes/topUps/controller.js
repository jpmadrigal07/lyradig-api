const TopUps = require("../../models/topUps");
const isEmpty = require("lodash/isEmpty");
const { UNKNOWN_ERROR_OCCURRED } = require("../../constants");

const getAllTopUps = async (req, res, next) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllTopUps = await TopUps.find(condition);
    res.json(getAllTopUps);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    res.status(500).json(message);
  }
};

const addTopUp = async (req, res, next) => {
  const { userId, staffId, pricePoints, referenceNumber } = req.body;
  if (userId && staffId && pricePoints) {
    const newTopUps = new TopUps({
      userId,
      staffId,
      pricePoints,
      referenceNumber,
    });
    try {
      const getTopUps = await TopUps.find({
        referenceNumber,
        deletedAt: {
          $exists: false,
        },
      });
      if (getTopUps.length === 0) {
        const createTopUps = await newTopUps.save();
        res.json(createTopUps);
      } else {
        throw new Error("Top Up must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
};

const updateTopUp = async (req, res, next) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateTopUps = await TopUps.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateTopUps);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("TopUps cannot be found");
  }
};

const deleteTopUp = async (req, res, next) => {
  try {
    const getTopUps = await TopUps.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getTopUps.length > 0) {
      const deleteTopUps = await TopUps.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteTopUps);
    } else {
      throw new Error("TopUps is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
    res.status(500).json(message);
  }
};

module.exports = {
  getAllTopUps,
  addTopUp,
  updateTopUp,
  deleteTopUp,
};
