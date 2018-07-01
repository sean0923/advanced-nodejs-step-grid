const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const util = require('util');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id });

    const redis = require('redis');
    const redisUri = 'redis://127.00.1:6379';
    const client = redis.createClient(redisUri);

    client.get = util.promisify(client.get);

    // Do we have any cached data in redis related to this query
    const cachedBlogs = await client.get(req.user.id);

    // if yes, then respond to the request right away from redis
    if (cachedBlogs !== undefined && cachedBlogs !== null) {
      console.log('SEND FROM REDIS');
      return res.send(JSON.parse(cachedBlogs));
    }

    // if no, store blogs to redis
    client.set(req.user.id, JSON.stringify(blogs));

    console.log('SEND FROM MONGODB');
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
