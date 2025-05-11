import { getMockReq, getMockRes } from '@jest-mock/express';
import { NextFunction, Request, Response } from 'express';
import APIChainer from '../src';

describe('APIChainer', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = getMockReq();
    const { res: mockRes, next: mockNext } = getMockRes();
    res = mockRes;
    next = mockNext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should chain middleware sequentially', async () => {
    const chain = new APIChainer()
      .use((req: Request, res: Response, next: NextFunction) => next())
      .use((req: Request, res: Response) => {
        res.status(200).json({ message: 'Done' });
        next();
      });

    await chain.execute(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Done' });
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test('should validate request payload', async () => {
    const chain = new APIChainer().validate({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    });

    req.body = { name: 'vivek' };
    await chain.execute(req, res);

    expect(res.status).not.toHaveBeenCalled();
    req.body = { name: 123 };
    await chain.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should handle authentication', async () => {
    const chain = new APIChainer().auth({ token: 'secret' });

    req.headers.authorization = 'Bearer secret';
    await chain.execute(req, res);
    expect(res.status).not.toHaveBeenCalled();

    req.headers.authorization = 'Bearer wrong';
    await chain.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
