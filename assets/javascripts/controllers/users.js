module.exports = ['$scope', '$state', '$timeout', 'User',
    function UsersCtrl($scope, $state, $timeout, User) {
  'use strict';

  $scope.users = User.query();

  var query, queryTimeout;
  $scope.$on('search', function(e, q) {
    if (query !== q) {
      $timeout.cancel(queryTimeout);
      queryTimeout = $timeout(function() {
        query = q;
        User.query({query: query}, function(users) {
          $scope.users = users;
          if (users.length === 1) {
            $state.go('users.show', {username: users[0].username});
          }
        });
      }, 200);
    }
  });

}];
