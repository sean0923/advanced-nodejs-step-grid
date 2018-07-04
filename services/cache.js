const mongoose = require('mongoose');

// get reference to original mongoose exec func
const exec = mongoose.Query.prototype.exec;

// Have to use function() instead of =>
mongoose.Query.prototype.exec = function() {
  console.log('ABOUT TO RUN A QUERY');

  const key = JSON.stringify({ ...this.getQuery(), collection: mongoose.Collection.name });
  console.log('key: ', key);


  return exec.apply(this, arguments);
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
