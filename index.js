const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const keys = require("./config/keys");
const app = express();
const routes = require("./routes");

// Connect to Mongo
mongoose
  .connect(keys.mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log("DB STATUS: Connected"))
  .catch((err) => console.log("DB STATUS: " + err));

app.use(cors());
app.use(express.json());
routes(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`SERVER PORT: ${port}`);
  console.log(`REST API: /api/**`);
});
