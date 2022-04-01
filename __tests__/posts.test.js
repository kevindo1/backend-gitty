const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('. routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it.only('user can get posts', async () => {
    const agent = request.agent(app);
    await request(app).get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const post1 = {
      id: expect.any(String),
      text: 'this is the first post',
    };

    const post2 = {
      id: expect.any(String),
      text: 'this is the second post',
    };

    const res = await agent.get('/api/v1/posts/');

    expect(res.body).toEqual([post1, post2]);
  });

  // it('creates a post if user is currently signed in', async () => {
  //   const agent = request.agent(app);
  //   const loginReq = await request
  //     .agent(app)
  //     .get(`/api/v1/github/login/callback?code=42`)
  //     .redirects(1);

  //   const res = await request(app).post('/api/v1/posts').send({
  //     text: 'this is the first post',
  //   });
  //   expect(res.body).toEqual({
  //     id: expect.any(String),
  //     text: 'this is the first post',
  //   });
  // });
});
