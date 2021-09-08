import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';

import AppError from '@errors/app-error';
import nodeConfig from '@config/node';

const handleError: ErrorRequestHandler = (
  err: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (nodeConfig.environment !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`server error: ${err.message}`);
  }

  if (err instanceof AppError) return response.status(err.statusCode).send();
  return response.status(500).send();
};

export default handleError;
