(function() {
  'use strict';

  var angular = require('angular');

  require('angular-resource');
  require('angular-bootstrap');
  require('angular-ui-router');


  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngResource'
  ])

  .config(require('./routes'))

  .controller('AuthCtrl', require('./controllers/auth'));

}());
