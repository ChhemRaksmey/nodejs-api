const path = require('path');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.startsWith('change_me'))) {
  throw new Error('JWT_SECRET must be set to a strong value in production');
}

module.exports = {
  env,
  isProd,
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'my_api',
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    sync: process.env.DB_SYNC === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_only_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  upload: {
    dir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
    maxSizeMb: parseInt(process.env.UPLOAD_MAX_SIZE_MB, 10) || 10,
    maxFiles: parseInt(process.env.UPLOAD_MAX_FILES, 10) || 10,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
