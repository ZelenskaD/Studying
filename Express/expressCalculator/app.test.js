const request = require('supertest');
const app = require('./app');

describe('GET /mean', () => {
  it('should return the mean of numbers', async () => {
    const res = await request(app).get('/mean?numbers=1,2,3,4,5');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ operation: 'mean', value: 3 });
  });

  it('should return 400 for invalid number', async () => {
    const res = await request(app).get('/mean?numbers=foo,2,3');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual('foo is not a number.');
  });

  it('should return 400 for missing numbers', async () => {
    const res = await request(app).get('/mean');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual('nums are required.');
  });
});

describe('GET /median', () => {
  it('should return the median of numbers', async () => {
    const res = await request(app).get('/median?numbers=1,2,3,4,5');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ operation: 'median', value: 3 });
  });

  it('should return 400 for invalid number', async () => {
    const res = await request(app).get('/median?numbers=foo,2,3');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual('foo is not a number.');
  });

  it('should return 400 for missing numbers', async () => {
    const res = await request(app).get('/median');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual('nums are required.');
  });
});

describe('GET /mode', () => {
  it('should return the mode of numbers', async () => {
    const res = await request(app).get('/mode?numbers=1,2,2,3,4,4,4,5');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ operation: 'mode', value: [4] });
  });

  it('should return 400 for invalid number', async () => {
    const res = await request(app).get('/mode?numbers=foo,2,3');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual('foo is not a number.');
  });

  it('should return 400 for missing numbers', async () => {
    const res = await request(app).get('/mode');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual('nums are required.');
  });
});
