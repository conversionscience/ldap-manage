'use strict';

var error  = require('http-errors'),
    $$     = require('async'),
    extend = require('extend'),
    LDAP   = require('LDAP'),

    format = require('util').format;

module.exports = function(req, res, cb) {
  switch(req.method) {
    case 'GET':
      if (!req.user) return cb(error(401));
      res.json(req.user);
      break;

    case 'POST':
    case 'PUT':
      var config = req.app.get('config'),
          username = req.body.username,
          password = req.body.password;

      if (!username) {
        return cb(error(401, {username: ['not provided']}));
      }

      if (!password) {
        return cb(error(401, {password: ['not provided']}));
      }

      var opts = extend({}, config.ldap.server);
      delete opts.binddn;
      delete opts.password;

      var ldap = new LDAP(opts);

      $$.waterfall([
        function(cb) {
          ldap.open(cb);
        },
        function(unused, unused2, cb) {
          ldap.findandbind({
            base: config.ldap.schema.people,
            scope: ldap.ONELEVEL,
            filter: format(config.ldap.schema.filter, username),
            password: password
          }, cb);
        }
      ], function(err, user) {
        ldap.close();
        if (err && err.code === 49) {
          cb(error(401, {'password':['not correct']}));
        } else if (err) {
          cb(err);
        } else {
          req.session.user = username;
          res.json(user);
        }
      });
      break;

    case 'DELETE':
      if (!req.user) return cb(error(401));
      delete req.user;
      delete req.session.user;
      res.json({});
      break;

    default:
      cb(error(401));
  }
};
