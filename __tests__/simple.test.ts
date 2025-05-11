import { getMockReq, getMockRes } from '@jest-mock/express';
import { NextFunction, Request, Response } from 'express';

// Example middleware to test
const exampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Hello, World!' });
};

describe.skip('Example Middleware', () => {
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

  test.skip('should return a JSON response with status 200', () => {
    exampleMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Hello, World!' });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });
});
