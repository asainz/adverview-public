'use strict';

App.directive('validateMinimumWords', function(){
    return {
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel){
            var target = attrs.validateMinimumWords;
            ngModel.$validators.minWords = function(modelValue){
                var totalWords = modelValue.split(' ').length;

                return totalWords >= target;
            };
        }
    };
});