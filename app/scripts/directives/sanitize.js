'use strict';

/**
 * This directive removes all malicious code from the user input before is sent to the backend.
 * We do so in two parts:
 * 1. Add a parser method, that will sanitize the content before is used by angular
 * 2. Add a blur event listener, that will sanitize the content in the ui, so the user will se how the
 * malicious code is removed when he leaves the input/text-area.
 * 
 * @name input
 * @name textarea
 *
 */
var sanitizeDirective = function (
    $timeout,
    $sanitize,
    _str
) {
    return {
        restrict: 'E',
        require: '?^ngModel',
        link: function(scope, elem, attrs, ctrl){
            if( !ctrl ){ return; }

            function sanitize(value){
                // We need to add a try/catch block as this function will be executed every time the input
                // changes, and if we try to sanitize every time, it will throw some errors
                if (_.isBoolean(value)) {
                    return value;
                }
                var sanitized = value;
                try{
                    sanitized = $sanitize(value);
                }catch(e){}

                sanitized = _str.unescapeHTML(sanitized);

                return sanitized;
            }

            // (1)
            elem.on('blur', function(){
                $timeout(function(){
                    var sanitized = sanitize(ctrl.$$rawModelValue);
                    ctrl.$setViewValue(sanitized);
                    elem.val( sanitized );
                }, 0);
            });
        }
    };
};

App.directive('input', sanitizeDirective);
App.directive('textarea', sanitizeDirective);
