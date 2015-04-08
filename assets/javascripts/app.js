(function() {
  'use strict';

  window.$ = window.jQuery = require('jquery');

  var angular = require('angular');

  require('angular-resource');
  require('angular-animate');
  require('angular-bootstrap');
  require('angular-ui-router');
  require('angular-filereader');

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate',
    'ngFileReader'
  ])

  .config(require('./routes'))

  .factory('Config', require('./resources/config'))
  .factory('Auth', require('./resources/auth'))
  .factory('User', require('./resources/user'))
  .factory('Group', require('./resources/group'))

  .controller('AuthCtrl', require('./controllers/auth'))
  .controller('HomeCtrl', require('./controllers/home'))
  .controller('NavbarCtrl', require('./controllers/navbar'))
  .controller('UsersCtrl', require('./controllers/users'))
  .controller('UserCtrl', require('./controllers/user'))

  .directive('ngErrors', require('./directives/ng-errors'))

  .run(['$urlRouter', '$state', '$rootScope', 'Auth',
      function($urlRouter, $state, $rootScope, Auth) {

    $rootScope.$on('$stateChangeStart', function(e, state) {
      Auth.user().catch(function() {
        if (state.name !== 'auth') {
          e.preventDefault();
          $state.go('auth');
        }
      });
    });

  }]);

}());
