const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

const setAuthCookie = (res, token) => {
  res.cookie('token', token, cookieOptions)
}

const clearAuthCookie = (res) => {
  res.clearCookie('token', { path: '/', httpOnly: true, sameSite: cookieOptions.sameSite })
}

module.exports = { setAuthCookie, clearAuthCookie }
