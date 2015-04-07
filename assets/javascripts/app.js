(function() {
  'use strict';

  window.$ = window.jQuery = require('jquery');

  var angular = require('angular');

  require('angular-resource');
  require('angular-animate');
  require('angular-bootstrap');
  require('angular-ui-router');

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate'
  ])

  .config(require('./routes'))

  .factory('Config', require('./resources/config'))
  .factory('Auth', require('./resources/auth'))

  .controller('AuthCtrl', require('./controllers/auth'))
  .controller('HomeCtrl', require('./controllers/home'))

  .directive('ngErrors', require('./directives/ng-errors'))

  .run(['$urlRouter', '$state', '$rootScope', 'Auth', function($urlRouter, $state, $rootScope, Auth) {

    $rootScope.$on('$stateChangeStart', function(e, state) {
      Auth.get().catch(function() {
        if (state.name !== 'auth') {
          e.preventDefault();
          $state.go('auth');
        }
      });
    });

  }]);

}());
