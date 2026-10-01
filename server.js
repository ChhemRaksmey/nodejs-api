const express = require('express');
const config = require('./configs');
const db = require('./models');
const routes = require('./routes');
const { user: userService } = require('./services');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(config.upload.dir));

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.use('/api', routes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  let errors;

  switch (err.name) {
    case 'SequelizeUniqueConstraintError':
      status = 409;
      message = 'Duplicate value';
      errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
      break;
    case 'SequelizeValidationError':
      status = 422;
      message = 'Validation failed';
      errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
      break;
    case 'MulterError':
      status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      break;
    default:
  }

  if (status >= 500) {
    console.error(err);
    if (config.isProd) message = 'Internal server error';
  }
  res.status(status).json({ success: false, message, ...(errors && { errors }) });
});

async function start() {
  await db.sequelize.authenticate();
  console.log('[db] connected');
  if (config.db.sync) {
    await db.sequelize.sync({ alter: true });
    console.log('[db] synced');
  }
  await userService.ensureAdmin();

  const server = app.listen(config.port, () => console.log(`[server] listening on :${config.port} (${config.env})`));

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await db.sequelize.close();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

if (require.main === module) {
  start().catch((err) => {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  });
}

module.exports = app;
