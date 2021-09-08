import { Router } from 'express';

import SessionController from '@http/controllers/session-controller';

const usersRouter = Router();
const sessionController = new SessionController();

usersRouter.post('/', sessionController.create.bind(sessionController));

export default usersRouter;
