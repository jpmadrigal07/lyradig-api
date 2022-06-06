// KEYS.JS
const envStage = process.env.NODE_ENV;

if (envStage === "production") {
  // PRODUCTION KEYS
  module.exports = require("./prod");
} else {
  // DEV KEYS
  module.exports = require("./dev");
}
