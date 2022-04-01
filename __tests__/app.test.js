const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GitHubUser = require('../lib/models/GithubUser');

jest.mock('../lib/utils/github');

describe('. routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('redirects the user to the Github OAuth page after logging in', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should login and redirect to the posts', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(req.redirects[0]).toEqual(expect.stringContaining('/api/v1/posts'));
  });

  it('should sign out user and delete route', async () => {
    await GitHubUser.insert({
      login: 'fake_github_user',
      avatar_url: 'https://www.placecage.com/gif/300/300',
      email: 'not-real@example.com',
    });

    const res = await request(app).delete('/api/v1/login/callback');
    expect(res.body).toEqual({
      message: 'Logged out successfully',
      success: true,
    });
  });
});
