const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Posts = require('../models/Posts');

module.exports = Router()
  .get('/', authenticate, (req, res, next) => {
    Posts.getPosts()
      .then((posts) => res.send(posts))
      .catch(next);
  })
  .post('/create', authenticate, (req, res, next) => {
    Posts.createPosts({
      text: req.body.text,
    })
      .then((post) => res.send(post))
      .catch(next);
  });
