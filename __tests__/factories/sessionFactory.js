const Keygrip = require("keygrip");
const keys = require("../../config/keys");

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("express:sess=" + session);
  return {
    session,
    sig,
  };
};
