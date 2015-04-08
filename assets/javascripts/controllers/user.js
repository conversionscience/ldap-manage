module.exports = ['$scope', 'Group', 'user', function($scope, Group, user) {
  'use strict';

  $scope.user = user;
  $scope.shells = ['/bin/sh', '/bin/bash', '/bin/zsh'];
  $scope.maxsize = 200;

  $scope.photo = function(e) {
    user.photo = e.target.result.replace('data:image/jpeg;base64,', '');
  };

  $scope.groups = false;

  $scope.$watch('groupsOpen', function(isOpen) {
    if (isOpen) $scope.groups = $scope.groups || Group.list();
  });

  $scope.save = function() {
    $scope.errors = {
      'lastname': ['wrong']
    };
  };

}];
