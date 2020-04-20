module.exports = {
  googleClientID:
    "463309108914-5jd37iv9eev8if673o3o1hlerc9qsrk8.apps.googleusercontent.com",
  googleClientSecret: "N7mFYPYstFCoT9OfpfGwLfL0",
  mongoURI: "mongodb://127.0.0.1:27017/blog_ci",
  cookieKey: "123123123",
  redisUrl: "redis://127.0.0.1:6379",
  redisPassword: process.env.REDIS_PASSWORD || "",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
};
