'use strict';

var $$     = require('async'),
    format = require('util').format;

module.exports = function(opts) {

  var ldap = opts.ldap;

  return function(req, res, cb) {

    if (!req.session || !req.session.user) return cb();

    $$.waterfall([
      function(cb) {
        ldap.open(function(err) { cb(err); });
      },
      function(cb) {
        ldap.search({
          base: opts.base,
          scope: ldap.ONELEVEL,
          filter: format(opts.filter, req.session.user)
        }, function(err, data) { cb(err, data); });
      },
      function(objects, cb) {
        req.user = objects.shift();
        cb();
      }
    ], cb);
  };
};
