const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  await next(); // await till the handler is done with it's work and then proceed to clearHash

  clearHash(req.user.id);
};
