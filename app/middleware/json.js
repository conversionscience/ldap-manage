'use strict';

var error = require('http-errors'),
    _     = require('lodash');

module.exports = function(req, res, cb) {
  var err = (['POST', 'PUT', 'PATCH'].indexOf(req.method) !== -1 &&
    (!req.is('application/json') || !_.isObject(req.body))) &&
      error(400, 'application/json required');

  cb(err);
};
