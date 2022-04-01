const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Posts = require('../models/Posts');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const post = await Posts.getPosts();
    res.send(post);
  } catch (error) {
    next(error);
  }
});
