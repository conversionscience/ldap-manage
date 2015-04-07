module.exports = ['$state', '$scope', 'Auth',
    function AuthCtrl($state, $scope, Auth) {
  'use strict';

  $scope.authenticate = function(username, password) {
    Auth
      .login(username, password)
      .then(function() {
        $state.go('home');
      })
      .catch(function(errors) {
        $scope.errors = errors;
      });
  };

}];
