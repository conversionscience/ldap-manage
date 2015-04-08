'use strict';

var _          = require('lodash'),
    $$         = require('async'),
    connection = require('../connection'),
    format     = require('util').format,
    lfilter    = require('../../lib/filter');

// function open(cb) {
//   connection.open(function(err) { cb(err); });
// }

// function close(cb) {
//   return function() {
//     var args = _.toArray(arguments);
//     connection.close(function(err) {
//       if (err) return cb(err);
//       cb.apply(null, args);
//     });
//   };
// }

function encode(obj) {
  /*jshint validthis:true */
  if (!obj) return obj;
  return _.object(_.compact(_.map(this.transform, function(rule) {
    var key = rule[0],
        value = obj[key];
    if (!(key in obj) || rule[4] === false) return false;
    if (rule[2] && rule[2] !== String) value = value.map(function(v) {
      switch(rule[2]) {
        case 'integer': return parseInt(v, 10);
        case 'buffer': return v.toString('base64');
        default: return v;
      }
    });
    if (rule[3] !== false) value = value[0];
    return [rule[1], value];
  })));
}

function decode(obj) {
  /*jshint validthis:true */
  if (!obj) return obj;
  return _.object(_.compact(_.map(this.transform, function(rule) {
    var key = rule[1],
        value = obj[key];
    if (!(key in obj)) return false;
    if (!_.isArray(value)) value = [value];
    value = value.map(function(v) { return v.toString(); });
    return [rule[0], value];
  })));
}

function list(query, limit, cookie, cb) {
  console.log('list');
  /*jshint validthis:true */

  var that = this,
      filter = lfilter.and([
        this.filter,
        lfilter.or(this.searchAttrs.map(function(query, k) {
          return query && format('(%s=%s)', k, '*' + query + '*');
        }.bind(null, lfilter.escape(query))))
      ]);

  console.log(filter);
  $$.waterfall([
    connection.search.bind(connection, _.pick({
      base: this.dn,
      scope: connection.ONELEVEL,
      filter: filter,
      attrs: this.list_attrs,
      pagesize: limit,
      cookie: cookie
    }, _.identity)),
    function(results, cookie, cb) {
      cb(null, results.map(encode.bind(that)), cookie);
    }
  ], cb);
}

function get(cn, cb) {
  /*jshint validthis:true */
  var that = this;
  $$.waterfall([
    connection.search.bind(connection, {
      base: this.dn,
      scope: connection.ONELEVEL,
      filter: format('(%s)', format(this.name, cn))
    }),
    function(results, cookie, cb) {
      cb(null, encode.call(that, results.shift()));
    }
  ], cb);
}

module.exports = function(config) {
  return {
    encode: encode.bind(config),
    decode: decode.bind(config),
    list: list.bind(config),
    get: get.bind(config),

    update: function(/*cn, obj, cb*/) {

    },

    remove: function(/*cn, cb*/) {

    },

    create: function(/*user, cb*/) {

    }
  };
};

