module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: "mongodb://127.0.0.1:27017/blog_ci",
  cookieKey: process.env.COOKIE_KEY,
  redisUrl: "redis://127.0.0.1:6379",
  redisPassword: "",
};
