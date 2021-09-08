import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import handleError from '@http/middleware/handle-error-middleware';
import routes from '@http/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(handleError);

export default app;
