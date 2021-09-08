import { Router } from 'express';

import usersRouter from '@http/routes/users-route';

const routes = Router();

routes.use('/users', usersRouter);

export default routes;
