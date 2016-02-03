var basicAuth = require('basic-auth');

var authorizationRequired = function (req, res, next) {
  var credentials = basicAuth(req) || {};

  if (credentials.name === 'john' && credentials.pass === 'doe') {
    return next();
  } else {
    return res.sendStatus(401);
  }
};

module.exports = authorizationRequired;
