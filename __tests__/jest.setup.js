Number.prototype._called = {}; // Hack solution: fixes error of _called not defined
jest.setTimeout(30000);

require("dotenv").config();
require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
