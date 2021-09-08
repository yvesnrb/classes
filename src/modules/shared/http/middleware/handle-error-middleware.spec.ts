import { Response, Request, NextFunction } from 'express';

import handleError from '@http/middleware/handle-error-middleware';
import AppError from '@errors/app-error';

jest.mock('@config/node', () => ({
  environment: 'development',
}));

global.console.log = jest.fn();

let request: Request;
let response: Response;
let next: NextFunction;

describe('HandleErrorMiddleware', () => {
  beforeEach(() => {
    request = {} as Request;

    response = {} as Response;
    response.status = jest.fn().mockReturnValue(response);
    response.send = jest.fn().mockReturnValue(response);

    next = {} as NextFunction;
  });

  it('should return the status code when the error is an AppError', () => {
    const appError = new AppError('test error', 402);
    handleError(appError, request, response, next);

    expect(response.status).toHaveBeenCalledWith(402);
    expect(response.send).toHaveBeenCalled();
  });

  it('should return 500 on generic error objects', () => {
    const error = new Error('generic error');
    handleError(error, request, response, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalled();
  });

  it('should log the error message when the environment is not test', () => {
    const error = new Error('generic error');
    handleError(error, request, response, next);

    expect(global.console.log).toHaveBeenCalledWith(
      expect.stringContaining('generic error'),
    );
  });
});
