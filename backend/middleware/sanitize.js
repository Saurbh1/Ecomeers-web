const stripXss = (str) => {
  if (typeof str !== 'string') return str
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

const sanitizeValue = (val) => {
  if (typeof val === 'string') return stripXss(val)
  if (Array.isArray(val)) return val.map(sanitizeValue)
  if (val && typeof val === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(val)) {
      out[stripXss(k)] = sanitizeValue(v)
    }
    return out
  }
  return val
}

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body)
  if (req.query) req.query = sanitizeValue(req.query)
  if (req.params) req.params = sanitizeValue(req.params)
  next()
}

module.exports = { sanitizeInput, stripXss }
