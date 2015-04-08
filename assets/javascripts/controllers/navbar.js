module.exports = ['$state', '$timeout', '$scope', '$rootScope', 'Auth',
    function($state, $timeout, $scope, $rootScope, Auth) {
  'use strict';

  $scope.is = function(name) {
    return $state.current.name.indexOf(name) === 0 && 'active';
  };

  $scope.search = $state.current.search;
  $rootScope.$on('$stateChangeStart', function(e, state) {
    $scope.search = state.search;
  });

  Auth.user().then(function(user) {
    $scope.user = user;
  });

  $scope.$watch('query', function(q, qq) {
    $rootScope.$broadcast('search', q);
  });
}];
