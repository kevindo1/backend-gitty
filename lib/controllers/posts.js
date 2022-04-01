const { Router } = require('express');
const Posts = require('../models/Posts');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const post = await Posts.getPosts();
    res.send(post);
  } catch (error) {
    next(error);
  }
});
