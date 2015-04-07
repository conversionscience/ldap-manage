module.exports = ['$parse', '$animate', function($parse, $animate) {
  'use strict';

  var _ = require('lodash');

  return {
    require: '^form',
    link: function($scope, $elem, $attrs) {
      var errors = $parse($attrs.ngErrors);

      $elem.on('submit', function() {
        $elem
          .find('.has-error')
            .find('.help-block')
            .remove()
            .end()
          .removeClass('has-error');
      });

      $scope.$watch(errors, function(errors) {
        if (errors) {
          _.each(errors, function(value, model) {
            var group = $elem
              .find('[ng-model=' + model + ']')
              .closest('.form-group')
              .addClass('has-error');
            _.each(value, function(value) {
              group.append($('<div class="help-block">')
                .text([model, value].join(' ')));
            });
          });

          $animate.addClass($elem, 'shake').then(function() {
            $animate.removeClass($elem, 'shake');
          });
        }
      });

    }
  };
}];
