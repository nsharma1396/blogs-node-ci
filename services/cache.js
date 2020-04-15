const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl, {
  password: process.env.REDIS_PASSWORD,
});
client.get = util.promisify(client.get).bind(client);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  const cacheKey = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // console.log("Key", JSON.stringify(cacheKey));
  // try {
  // See if we have a value for 'key' in redis
  const cacheValue = await client.get(cacheKey);

  // If we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    if (Array.isArray(doc)) {
      return doc.map((docItem) => new this.model(docItem));
    } else {
      return new this.model(doc);
    }
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  console.log(cacheKey, JSON.stringify(result));

  client.set(cacheKey, JSON.stringify(result));

  return result;
  // } catch (err) {
  //   return exec.apply(this, arguments);
  // }
};
