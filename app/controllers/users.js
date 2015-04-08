'use strict';

var error = require('http-errors'),
    config = require('../config'),
    user  = require('../models/user');

function list(req, res, cb) {
  var query = req.query.query,
      limit = +req.query.limit || config.ldap.limit,
      cookie = req.headers[config.api.list_cookie];

  user.list(query, limit, cookie, function(err, list, cookie) {
    if (err) return cb(err);
    if (cookie) {
      res.set(config.api.list_cookie, cookie);
    }
    res.json(list).end();
  });

}

function get(req, res, cb) {
  user.get(req.params.username, function(err, user) {
    if (err || !user) return cb(err || error(404));
    res.json(user).end();
  });

}

function create(/*req, res, cb*/) {

}

function update(/*req, res, cb*/) {

}

function remove(/*req, res, cb*/) {

}

module.exports = {
  list: list,
  get: get,
  create: create,
  update: update,
  remove: remove
};
