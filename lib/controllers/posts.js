const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Posts = require('../models/Posts');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const post = await Posts.getPosts();
      res.send(post);
    } catch (error) {
      next(error);
    }
  })
  .post('/create', authenticate, async (req, res, next) => {
    res.send({ id: '1', text: 'this is the first post' });
  });
