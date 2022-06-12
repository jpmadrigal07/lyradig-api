const mongoose = require("mongoose");
const { Schema } = mongoose;

const topUps = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  pricePoints: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PricePoints",
  },
  referenceNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("TopUps", topUps);
