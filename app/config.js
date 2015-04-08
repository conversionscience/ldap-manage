'use strict';

var extend = require('extend'),
    config = require('../config.json');

try {
  extend(true, config, require('../config_local.json'));
} catch(e) {}

try {
  extend(true, config, require('/etc/ldap-manager/config.json'));
} catch(e) {}

// extend binddn with dc and create ldap object
config.ldap.server.binddn = [
  config.ldap.server.binddn,
  config.ldap.dc
].join(',');

[ 'people', 'group', 'auth' ].forEach(function(name) {
  config.ldap.schema[name].dn = [
    config.ldap.schema[name].dn,
    config.ldap.dc
  ].join(',');
});

module.exports = config;
