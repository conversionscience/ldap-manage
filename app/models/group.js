'use strict';

var base   = require('./base'),
    config = require('../config');

module.exports = base(config.ldap.schema.group);
