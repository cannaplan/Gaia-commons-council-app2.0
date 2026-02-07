import request from 'supertest';

describe('Health endpoint (smoke)', () => {
  it('responds 200 and returns JSON body', async () => {
    const res = await request('http://localhost:3000').get('/api/health').expect(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty('status');
    if (typeof res.body === 'object') {
      expect(res.body).toHaveProperty('status');
    }
  }, 10000);
});
