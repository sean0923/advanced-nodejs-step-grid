const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUri = 'redis://127.00.1:6379';
const client = redis.createClient(redisUri);
// promisify client.get
client.get = util.promisify(client.get);

// get reference to original mongoose exec func
const exec = mongoose.Query.prototype.exec;

// Have to use function() instead of =>
mongoose.Query.prototype.exec = async function() {
  const key = JSON.stringify({ ...this.getQuery(), collection: mongoose.Collection.name });

  // see if the key exist in cache
  const cachedDataStr = await client.get(key);

  // if it does return that
  if (cachedDataStr) {
    console.log('cachedDataStr: ', cachedDataStr);
    const parsedCachedData = JSON.parse(cachedDataStr);

    Array.isArray(parsedCachedData)
      ? parsedCachedData.map(obj => this.model(obj))
      : new this.model(parsedCachedData);
  }

  // else store it to redis then return data from mongo
  const dataFromMongoDB = await exec.apply(this, arguments);
  client.set(key, JSON.stringify(dataFromMongoDB));

  return dataFromMongoDB;
};

// const redis = require('redis');
// const redisUri = 'redis://127.00.1:6379';
// const client = redis.createClient(redisUri);
// client.get = util.promisify(client.get);
// // Do we have any cached data in redis related to this query
// const cachedBlogs = await client.get(req.user.id);
// // if yes, then respond to the request right away from redis
// if (cachedBlogs !== undefined && cachedBlogs !== null) {
//   console.log('SEND FROM REDIS');
//   return res.send(JSON.parse(cachedBlogs));
// }
// // if no, store blogs to redis
// client.set(req.user.id, JSON.stringify(blogs));
// console.log('SEND FROM MONGODB');
