'use strict';

App.directive('sliderControl', function(
    $filter,
    FormValidationSrv,
    TemplatesManagerSrv
){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            form: '='
        },
        templateUrl: TemplatesManagerSrv.getUrl('slider-control'),
        link: function(scope){
            scope.control.validations = _.extend({}, FormValidationSrv.getDefaultOptions(), scope.control.validations);

            scope.control.options = scope.control.options || {};
        },
        controller: function($scope){
            $scope.sliderOptions = {
                from: $scope.control.options.from || 1,
                to: $scope.control.options.to || 10,
                step: $scope.control.options.step || 1,
                smooth: true,
                css: {
                    background: {'background-color': 'silver'},
                    before: {'background-color': 'purple'},
                    default: {'background-color': 'white'},
                    after: {'background-color': 'white'},
                    pointer: {'background-color': 'red'}
                },
                realtime: true,
                callback: function(){
                    if( $scope.sliderWasMoved ){ return; }

                    $scope.sliderWasMoved = true;
                }
            };

            $scope.control.value = 0;
            $scope.sliderWasMoved = false;

            function getControl(){
                return $scope.form[$scope.control.name] || {};
            }
            $scope.hasErrors = false;

            $scope.$watch('control.value', function(){
                if( $scope.control.options.mode === 'review' ){
                    $scope.labelColorClass = 'score-' + ($scope.control.value*10);
                }

                if( $scope.control.options.mode === 'salary' ){
                    $scope.control.formattedValue = $filter('salary')($scope.control.value);
                }
            });

            $scope.$watch(function(){
                return getControl().$submitted;
            }, function(){
                var control = getControl();

                $scope.hasErrors = control.$invalid && control.$submitted;
            }, true);
        }
    };
});