const mongoose = require("mongoose");
const { Schema } = mongoose;

const referrals = new Schema({
  referralCode: String,
  referrerId: {
    type: mongoose.Schema.Types.String,
    ref: "userId",
  },
  referredId: {
    type: mongoose.Schema.Types.String,
    ref: "userId",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Referrals", referrals);
