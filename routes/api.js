'use strict';

var express = require('express'),
    _       = require('lodash'),
    httpe   = require('http-errors'),
    api     = require('../lib/api'),
    router  = express.Router();

function requireUser(req, res, cb) {
  cb(!req.user && httpe(401));
}

router.use(function(req, res, cb) {
  var err = (['POST', 'PUT', 'PATCH'].indexOf(req.method) !== -1 &&
    (!req.is('application/json') || !_.isObject(req.body))) &&
      httpe(400, 'application/json required');

  cb(err);
});

router.all('/auth', api.auth);

module.exports = router;
