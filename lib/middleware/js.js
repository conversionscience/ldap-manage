'use strict';

var browserify = require('browserify'),
    path       = require('path'),
    fs         = require('fs'),
    $$         = require('async'),
    _          = require('lodash'),

    compiled = {};


module.exports = function(root, options) {
  options = _.extend({}, {
    files: {}
  }, options || {});

  var src = path.join(root, options.src);

  function compile(file, options, cb) {
    var b = browserify({
      basedir: src,
      paths: src
    });

    b.add(options.files);
    b.external(options.external);

    _.each(options.require, function(req, name) {
      b.require(req, {
        expose: name
      });
    });

    b.bundle(function(err, buffer) {
      if (err) return cb(err);
      fs.writeFile(file, buffer, cb);
    });
  }

  return function(req, res, next) {
    if (req.method !== 'GET' &&
        req.method !== 'HEAD' ||
        !(req.path in options.files)) return next();

    var config = _.extend({}, {
          require: {},
          files: [],
          external: []
        }, options.files[req.path]),

        file = path.join(options.dest, req.url);

    $$.waterfall([
      function(cb) {
        if (config.recompile !== true) {
          fs.stat(file, function(err, stat) {
            cb(null, stat && +stat.mtime || 0);
          });
        } else {
          cb(null, 0);
        }
      },
      function(mtime, cb) {
        if (!mtime || config.recompile || !(file in compiled)) {
          // do not map files if recompile required
          return cb(null, 0, []);
        }

        if (mtime && config.recompile === false) {
          // no recompile, force to waterfall end
          return cb(true);
        }

        var files = config.files.map(function(f) {
          return path.join(src, f);
        });

        $$.map(files, fs.stat, function(err, stats) {
          cb(err, mtime, stats);
        });
      },
      function(mtime, stats, cb) {
        if (!mtime || _.any(stats, function(s) { return +s.mtime > mtime; })) {
          compile(file, config, cb);
        } else {
          cb();
        }
      },
      function(cb) {
        compiled[file] = true;
        cb();
      }
    ], function(err) {
      next(err === true ? null : err);
    });
  };

};
