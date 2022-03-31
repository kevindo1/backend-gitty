const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');
const jwt = require('jsonwebtoken');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', async (req, res, next) => {
    const { code } = req.query;
    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email } = await getGithubProfile(token);
    let user = await GithubUser.findByUsername(login);

    if (!user) {
      user = await GithubUser.insert({
        username: login,
        email,
        avatar: avatar_url,
      });
    }

    const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    try {
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/posts');
      return user;
    } catch (error) {
      next(error);
    }
  });
