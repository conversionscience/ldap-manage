module.exports = ['$http', '$q', 'Config', function($http, $q, Config) {
  'use strict';

  var url = Config.api.path + '/auth',
      user = $q.defer(),
      Auth = function() {
        $http
          .get(url)
          .success(function(data) {
            user.resolve(data);
          })
          .error(function(data) {
            user.reject(data.details);
          });
      };

  Auth.prototype.user = function() {
    return user.promise;
  };

  Auth.prototype.login = function(username, password) {
    user = $q.defer();
    $http
      .post(url, {username: username, password: password})
      .success(function(data) {
        user.resolve(data);
      })
      .error(function(data) {
        user.reject(data.details);
      });
    return user.promise;
  };

  Auth.prototype.logout = function() {
    user = $q.defer();
    $http
      .delete(url)
      .success(function() {
        user.resolve();
      })
      .error(function() {
        user.resolve();
      });
    return user.promise;
  };

  return new Auth();
}];
