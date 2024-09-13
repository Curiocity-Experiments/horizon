import winston from 'winston'

const logger = typeof window === 'undefined'
  ? winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    })
  : {
      error: (...args) => console.error(...args),
      warn: (...args) => console.warn(...args),
      info: (...args) => console.info(...args),
      debug: (...args) => console.debug(...args)
    }

export default logger