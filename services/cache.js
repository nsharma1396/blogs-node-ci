const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl, {
  password: process.env.REDIS_PASSWORD,
});
client.hget = util.promisify(client.hget).bind(client);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ""); // to cover all posibilities except of just user id as a top level key for the nested redis entry

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  console.log("Caching", this.mongooseCollection.name);
  const cacheKey = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // console.log("Key", JSON.stringify(cacheKey));
  // try {
  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, cacheKey);

  // If we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    console.log("Blogs found in cache");

    if (Array.isArray(doc)) {
      return doc.map((docItem) => new this.model(docItem));
    } else {
      return new this.model(doc);
    }
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, cacheKey, JSON.stringify(result));
  client.expire(this.hashKey, 10);

  return result;
  // } catch (err) {
  //   return exec.apply(this, arguments);
  // }
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
