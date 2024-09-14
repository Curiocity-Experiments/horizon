// lib/logger.js

// TODO: Implement more sophisticated logging with log levels and log rotation
// TODO: Add integration with error tracking service (e.g., Sentry)

const logger = {
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
  info: (...args) => console.info(...args),
  log: (...args) => console.log(...args),
};

export default logger;