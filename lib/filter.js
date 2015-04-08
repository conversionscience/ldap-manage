'use strict';

var _      = require('lodash'),
    format = require('util').format;

function filter() {
  var args = _.compact(_.flatten(arguments)),
      type = args.shift().toLowerCase();

  if (args.length === 0) return '';
  if (args.length === 1) return args[0];

  switch(type) {
    case 'and': return format('(&%s)', args.join(''));
    case 'or': return format('(|%s)', args.join(''));
  }
}

function escape(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/[^a-z0-9_.-]+/ig, '');
}

module.exports = {
  and: filter.bind(null, 'and'),
  or: filter.bind(null, 'or'),
  escape: escape
};
