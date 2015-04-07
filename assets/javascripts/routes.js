module.exports = ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

  'use strict';

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('auth', {
      url: '/',
      templateUrl: 'templates/auth.html',
      controller: 'AuthCtrl'
    });
}];
