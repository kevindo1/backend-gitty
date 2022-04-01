const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('. routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a post if user is currently signed in', async () => {
    const agent = request.agent(app);
    const loginReq = await request
      .agent(app)
      .get(`/api/v1/github/login/callback?code=42`)
      .redirects(1);

    const res = await request(app).post('/api/v1/posts').send({
      text: 'this is the first post',
    });
    expect(res.body).toEqual({
      id: expect.any(String),
      text: 'this is the first post',
    });
  });
});
