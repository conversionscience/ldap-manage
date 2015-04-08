'use strict';

var LDAP   = require('LDAP'),
    config = require('./config'),
    connection = new LDAP(config.ldap.server);

connection.open(function(err) {
  if (err) throw (err);
});

module.exports = connection;
