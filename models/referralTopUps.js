const mongoose = require("mongoose");
const { Schema } = mongoose;

const referralTopUps = new Schema({
  referrerId: {
    type: mongoose.Schema.Types.String,
    ref: "Users",
  },
  referredId: {
    type: mongoose.Schema.Types.String,
    ref: "Users",
  },
  points: Number,
  isCollected: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("ReferralTopUps", referralTopUps);
