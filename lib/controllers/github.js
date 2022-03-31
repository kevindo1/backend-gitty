const { Router } = require('express');

module.exports = Router().get('/login', async (req, res) => {
  res
    .redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    )

    .get('/login/callback', async (req, res) => {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const { login, avatar_url, email } = await getGithubProfile(token);
      let user = await GithubUser.findByUsername(login);

      if (!user) {
        user = await GithubUser.insert({
          username: login,
          avatar: avatar_url,
          email,
        });
      }
    });
});
