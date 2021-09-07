import { MongoClient } from 'mongodb';

import mongoConfig from '@config/mongodb';

const url = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}`;

export default new MongoClient(url, { maxPoolSize: 10 });
