const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');

const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${logDirectory}/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,    // Compress old logs to save space
  maxSize: '20m',         // Rotate if file exceeds 20 Megabytes
  maxFiles: '14d'         // Keep logs for 14 days
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  filename: `${logDirectory}/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d'         // Keep error logs longer (30 days)
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    dailyRotateTransport,
    errorRotateTransport
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;