'use strict';

App.directive('checkboxControl', function($timeout, FormValidationSrv, TemplatesManagerSrv){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            form: '='
        },
        templateUrl: TemplatesManagerSrv.getUrl('checkbox-control'),
        link: function(scope){
            scope.control.validations = _.extend({}, FormValidationSrv.getDefaultOptions(), scope.control.validations);

            var controlOptionsWatchUnsuscriber = scope.$watch('control.options', function(){
                if( _.isEmpty(scope.control.options) ){
                    return;
                }

                scope.options = _.map(scope.control.options, function(option){
                    return {
                        value: option,
                        selected: false
                    };
                });

                $timeout(function(){
                    controlOptionsWatchUnsuscriber();
                });
            });
        },
        controller: function($scope){
            $scope.selectedOptions = [];

            $scope.toggleOption = function(){
                var selected = _.where($scope.options, {selected: true});

                if( selected.length > 0 ){
                    $scope.control.value = selected;
                }else{
                    $scope.control.value = '';
                }
            };

            function getControl(){
                return $scope.form[$scope.control.name] || {};
            }

            $scope.hasErrors = false;

            $scope.$watch(function(){
                return getControl().$submitted;
            }, function(){
                var control = getControl();

                $scope.hasErrors = control.$invalid && getControl().$submitted;
            }, true);
        }
    };
});