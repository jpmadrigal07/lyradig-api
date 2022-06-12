const PointsReceives = require("../../models/pointsReceives");
const Users = require("../../models/users");
const { UNKNOWN_ERROR_OCCURRED } = require("../../constants");

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
      const getTotalPoints = getPointsReceives.reduce(
        (acc, curr) => acc + curr.points,
        0
      );
      const toUpdate = getPointsReceives.map((pointReceive) => {
        return {
          updateOne: {
            filter: { _id: pointReceive._id },
            update: { $set: { isCollected: true } },
          },
        };
      });
      const updateUser = await Users.updateOne(
        { _id: userId },
        { $inc: { walletPoints: getTotalPoints } }
      );
      const bulkInsert = await PointsReceives.bulkWrite(toUpdate.flat());
      res.json({ updateUser, bulkInsert });
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOWN_ERROR_OCCURRED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are missing");
  }
};

module.exports = {
  collectWalletPoints,
};
