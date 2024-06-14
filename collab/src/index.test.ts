import type {NextFunction} from "express";
import request from 'supertest';
import { app } from './index';

const VALID_DATA = [{ stepType: "removeMark" }];
const INVALID_DATA = [{ invalid: "1234" }];

jest.mock('./middleware/auth-middleware', () => {
  return {
    authMiddleware: (_: Request, __: Response, next: NextFunction) => next()
  }
});

describe('GET /', () => {
  it('should return Hello World', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
  it('healthcheck should return ok', async () => {
    const response = await request(app).get('/healthcheck');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});

describe('POST /', () => {
  it('post endpoint should 202', async () => {
    const response = await request(app)
        .post('/documents/1/steps')
        .send(VALID_DATA)
        .set('Accept', 'application/json');

    expect(response.status).toBe(202);
    expect(response.text).toBe('Received');
  });
});

describe('POST /', () => {
  it('post endpoint should 400', async () => {
    const response = await request(app)
        .post('/documents/1/steps')
        .send(INVALID_DATA)
        .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Not valid steps');
  });
});
