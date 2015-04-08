module.exports = ['$resource', 'Config', function User($resource, Config) {
    'use strict';

    return $resource(Config.api.path + '/groups/:username');
}];
