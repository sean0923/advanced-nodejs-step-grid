const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUri = 'redis://127.00.1:6379';
const client = redis.createClient(redisUri);
// promisify client.get
// client.get = util.promisify(client.get);
client.hget = util.promisify(client.hget);

// get reference to original mongoose exec func
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(option = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(option.key) || '';
  return this;
};

// Have to use function() instead of =>
mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify({ ...this.getQuery(), collection: mongoose.Collection.name });

  // see if the key exist in cache
  const cachedDataStr = await client.hget(this.hashKey, key);
  console.log('cachedDataStr: ', cachedDataStr);

  // if cache data exist then return parsed data
  if (cachedDataStr) {
    console.log('Data form cahce');
    const parsedCachedData = JSON.parse(cachedDataStr);

    return Array.isArray(parsedCachedData)
      ? parsedCachedData.map(obj => new this.model(obj))
      : new this.model(parsedCachedData);
  } else {
    console.log('Data form mongo');
    // if cache does not exist then cache it then return data from mongo
    const dataFromMongoDB = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(dataFromMongoDB), 'EX', 1);

    return dataFromMongoDB;
  }
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
