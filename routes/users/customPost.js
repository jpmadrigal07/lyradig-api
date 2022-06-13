const PointsReceives = require("../../models/pointsReceives");
const ReferralTopUps = require("../../models/referralTopUps");
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

module.exports = {
  collectWalletPoints,
};
