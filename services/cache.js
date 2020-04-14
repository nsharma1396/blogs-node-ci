const mongoose = require("mongoose");

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
  console.log("I am about to run a query :p");
  return exec.apply(this, arguments);
};
