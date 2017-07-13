function searchIgnore (value, ignores) {
  return ignores.some((search) => {
    return search.test(value)
  })
}

function redirectToHTTPS (ignoreHosts = [], ignoreRoutes = []) {
  return function middlewareRedirectToHTTPS (req, res, next) {
    const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
      parseInt(req.get('x-forwarded-port'), 10) !== 443

    if (isNotSecure && !searchIgnore(req.get('host'), ignoreHosts) &&
      !searchIgnore(req.path, ignoreRoutes)) {
      return res.redirect('https://' + req.get('host') + req.url)
    }

    next()
  }
}

exports.redirectToHTTPS = redirectToHTTPS
