let database: string;

if (process.env.NODE_ENV === 'test') {
  database = process.env.MONGO_DB
    ? `${process.env.MONGO_DB}_test`
    : 'tindin_test';
} else {
  database = process.env.MONGO_DB || 'tindin';
}

export default {
  user: process.env.MONGO_USER || 'mongo',
  password: process.env.MONGO_PASS || 'mongo',
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || '27017',
  database,
};
