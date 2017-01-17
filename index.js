modules.exports = function redirectToHTTPS (ignoreHosts, ignoreRoutes) {
  if (!ignoreHosts) {
    ignoreHosts = [];
  }

  if (!ignoreRoutes) {
    ignoreRoutes = [];
  }

  return function (req, res, next) {
    if (
      'https' !== req.protocol &&
      ignoreHosts.indexOf(req.get('host')) === -1 &&
      ignoreRoutes.indexOf(req.path) === -1
    )  {
      return res.redirect('https://' + req.get('host') + req.url);
    }

    next();
  };
};
