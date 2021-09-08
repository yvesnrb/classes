import 'dotenv/config';

import app from '@http/server';
import serverConfig from '@config/server';

app.listen(serverConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on localhost:${serverConfig.port}`);
});
