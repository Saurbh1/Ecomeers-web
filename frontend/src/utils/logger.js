const isDev = import.meta.env.DEV

export const logger = {
  info: (...args) => { if (isDev) console.info('[Luxe]', ...args) },
  warn: (...args) => console.warn('[Luxe]', ...args),
  error: (...args) => console.error('[Luxe]', ...args),
  debug: (...args) => { if (isDev) console.debug('[Luxe]', ...args) },
}

export default logger
