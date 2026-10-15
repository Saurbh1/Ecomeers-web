const levels = { error: 0, warn: 1, info: 2, debug: 3 }
const current = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

const log = (level, message, meta = {}) => {
  if (levels[level] > levels[current]) return
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  }
  const line = JSON.stringify(entry)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

module.exports = {
  error: (msg, meta) => log('error', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta),
}
