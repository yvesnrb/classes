import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import SessionController from '@http/controllers/session-controller';
import authUserRequestSchema from '@http/schemas/auth-user-request-schema';

const usersRouter = Router();
const sessionController = new SessionController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: authUserRequestSchema,
  }),
  sessionController.create.bind(sessionController),
);

export default usersRouter;
