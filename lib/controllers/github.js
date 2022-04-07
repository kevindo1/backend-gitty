const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const jwt = require('jsonwebtoken');
const GitHubUser = require('../models/GithubUser');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', (req, res, next) => {
    const { code } = req.query;
    let user;
    exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))
      .then(({ login, avatar_url, email }) =>
        GitHubUser.findByUsername(login).then((foundUser) => {
          if (foundUser) {
            user = foundUser;
          } else {
            GitHubUser.insert({
              username: login,
              avatar: avatar_url,
              email,
            }).then((createdUser) => (user = createdUser));
          }
        })
      )
      .then(() => {
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        });
        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Logged out successfully' });
  });
