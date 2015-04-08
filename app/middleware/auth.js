'use strict';

var user   = require('../models/user');

module.exports = function(req, res, cb) {
  if (!req.session || !req.session.user) return cb();

  user.get(req.session.user, function(err, user) {
    if (user) req.user = user;
    cb(err);
  });
};
