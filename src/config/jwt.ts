export default {
  secret: process.env.JWT_SECRET || 'unsafe secret',
  expiration: process.env.JWT_EXPIRATION || '1h',
};
