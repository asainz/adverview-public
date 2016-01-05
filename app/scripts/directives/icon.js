'use strict';

App.directive('icon', function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      name: '@',
      size: '@',
      color: '@'
    },
    template: '<img ng-src="images/svg/{{fullName}}.svg" alt="svg-icon-{{fullName}}">',
    link: function(scope, el, attrs){
      var sizeInNumber;

      switch (attrs.size) {
        case 'small':
          sizeInNumber = 20;
          break;
        case 'medium':
          sizeInNumber = 88;
          break;
        case 'big':
          sizeInNumber = 122;
          break;
      }

      // default
      scope.fullName = 'light-' + scope.name;

      switch (attrs.color) {
        case 'light':
          scope.fullName = 'light-' + scope.name;
          break;
        case 'dark':
          scope.fullName = 'dark-' + scope.name;
          break;
        case 'blue':
          scope.fullName = 'blue-' + scope.name;
          break;
        case 'green':
          scope.fullName = 'green-' + scope.name;
          break;
      }

      if( sizeInNumber ){
        el.css({
          width: sizeInNumber,
          height: sizeInNumber
        });
      }
      $compile(el.contents())(scope);
    }
  };
});
