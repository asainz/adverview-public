'use strict';

App.directive('selectControl', function(FormValidationSrv, TemplatesManagerSrv){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            form: '='
        },
        templateUrl: TemplatesManagerSrv.getUrl('select-control'),
        link: function(scope){
            scope.control.validations = _.extend({}, FormValidationSrv.getDefaultOptions(), scope.control.validations);
        },
        controller: function($scope, SelectListSrv){
            $scope.showOptions = function(){
                SelectListSrv.show({
                    options: $scope.control.options,
                    selected: $scope.selectedIndex
                }).then(function(selected){
                    $scope.control.value = selected.value;
                    $scope.selectedIndex = selected.index;
                    $scope.selectedOption = selected.value;
                });
            };

            $scope.getSelectedOption = function(){
                return $scope.selectedOption;
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

                // $scope.errors = {};
                // if( $scope.form.$pristine ){
                //     return;
                // }
                // $scope.errors = _.extend({}, control.$error);

            }, true);
        }
    };
});