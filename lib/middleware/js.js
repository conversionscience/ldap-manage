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
    console.log('compile');
    var b = browserify({
          basedir: src,
          paths: src
        }),
        files = [];

    b.add(options.files);
    b.external(options.external);

    _.each(options.require, function(req, name) {
      b.require(req, {
        expose: name
      });
    });

    b.on('file', function(file) {
      files.push(file);
    });

    b.bundle(function(err, buffer) {
      if (err) return cb(err);
      fs.writeFile(file, buffer, function(err) {
        cb(err, files);
      });
    });
  }

  return function(req, res, cb) {
    if (req.method !== 'GET' &&
        req.method !== 'HEAD' ||
        !(req.path in options.files)) return cb();

    var config = _.extend({}, {
          require: {},
          files: [],
          external: []
        }, options.files[req.path]),

        file = path.join(options.dest, req.url);

    $$.waterfall([
      function(cb) {
        fs.stat(file, function(err, stat) {
          cb(null, stat && +stat.mtime || 0);
        });
      },
      function(mtime, cb) {
        // we don't care about dest mtime if file isn't compiled yet
        if (!(file in compiled)) {
          // do not map files if recompile required
          return cb(null, true);
        }

        $$.map(compiled[file], fs.stat, function(err, stats) {
          // err means file not found, we must recompile
          cb(null, err || !mtime ||
                    _.any(stats, function(s) { return +s.mtime > mtime; }));
        });
      },
      function(recompile, cb) {
        if (recompile) {
          compile(file, config, cb);
        } else {
          cb(null, false);
        }
      },
      function(files, cb) {
        if (files !== false)
          compiled[file] = files;
        cb();
      }
    ], cb);
  };

};
