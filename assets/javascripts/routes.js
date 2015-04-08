module.exports = ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

  'use strict';

  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('auth', {
      url: '/',
      templateUrl: 'templates/auth.html',
      controller: 'AuthCtrl'
    })
    .state('authenticated', {
      abstract: true,
      templateUrl: 'templates/layout.html'
    })
    .state('home', {
      parent: 'authenticated',
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('users', {
      parent: 'authenticated',
      search: true,
      url: '/users',
      templateUrl: 'templates/users.html',
      controller: 'UsersCtrl'
    })
    .state('users.show', {
      search: true,
      url: '/:username',
      templateUrl: 'templates/user.html',
      controller: 'UserCtrl',
      resolve: {
        user: ['$stateParams', 'User', function($stateParams, User) {
          return User.get($stateParams).$promise;
        }]
      }
    });
}];
