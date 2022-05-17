import log from 'log4js'

function generateLog(prefix) {
  const logger = log.getLogger(prefix)
  if (process.env.WK_MODE) logger.level = process.env.WK_MODE
  return logger
}

export default generateLog
