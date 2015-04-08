'use strict';

var error  = require('http-errors'),
    $$     = require('async'),
    _      = require('lodash'),
    LDAP   = require('LDAP'),
    user   = require('../models/user'),

    config = require('../config').ldap,
    format = require('util').format;

function get(req, res, cb) {
  if (!req.user) return cb(error(401));
  res.json(req.user).end();
}

function login(req, res, cb) {
  if (!req.body.username)
    return cb(error(401, {username: ['is not provided']}));
  if (!req.body.password)
    return cb(error(401, {password: ['is not provided']}));

  var username = req.body.username,
      password = req.body.password,
      ldap = new LDAP(_.omit(config.server, 'binddn', 'password'));

  $$.waterfall([
    ldap.open.bind(ldap),
    function(u1, u2, cb) {
      ldap.findandbind({
        base: config.schema.auth.dn,
        scope: ldap.ONELEVEL,
        filter: format(config.schema.auth.filter, username),
        password: password
      }, cb);
    },
    function(cb) {
      user.get(username, _.toArray(arguments).pop());
    }
  ], function(err, user) {
    ldap.close();
    if (err) {
      cb(error(401, {'password': ['is not correct']}));
    } else {
      req.session.user = username;
      res.json(user).end();
    }
  });
}

function logout(req, res, cb) {
  if (!req.user) return cb(error(401));
  delete req.user;
  delete req.session.user;
  res.json({}).end();
}

module.exports = { get: get, login: login, logout: logout };
