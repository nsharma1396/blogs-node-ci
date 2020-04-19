Number.prototype._called = {}; // Hack solution: fixes error of _called not defined
jest.setTimeout(30000);

require("dotenv").config();
require("../models/User");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  useMongoClient: true,
});
