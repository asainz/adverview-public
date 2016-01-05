'use strict';

App.directive('inputControl', function(FormValidationSrv, TemplatesManagerSrv, COPY){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            form: '=',
            textarea: '=',
            size: '@'
        },
        templateUrl: TemplatesManagerSrv.getUrl('input-control'),
        link: function(scope){
            scope.control.validations = _.extend({}, FormValidationSrv.getDefaultOptions(), scope.control.validations);
            scope.messages = COPY.ERROR_MESSAGES;
            scope.control.placeholder = scope.control.placeholder ? scope.control.placeholder : scope.control.label;

            scope.rows = scope.size === 'big' ? 6 : 2;
            scope.control.validations.labels = {
                words: scope.control.validations.minWords ? scope.control.validations.minWords + ' palabras mínimo' : ''
            };

            // scope.regexp = REGEXP;
        },
        controller: function($scope){
            function getControl(){
                return $scope.form[$scope.control.name] || {};
            }
            $scope.hasErrors = false;

            $scope.$watch(function(){
                return getControl().$submitted;
            }, function(){
                var control = getControl();

                $scope.hasErrors = control.$invalid && control.$submitted;

                // $scope.errors = {};
                // if( $scope.form.$pristine ){
                //     return;
                // }
                // $scope.errors = _.extend({}, control.$error);

            }, true);
        }
    };
});