'use strict';

App.directive('progressRadial', function($timeout, TemplatesManagerSrv){
    return {
        replace: true,
        scope: {
            value: '@',
            circleSize: '@'
        },
        templateUrl: TemplatesManagerSrv.getUrl('progress-radial'),
        controller: function($scope){

            $scope.$watch('value', function(value){
                if( !value ){ return; }

                var percentageValue = value * 10;

                // value rounded to the lowest ten multiple
                // 1.5 -> 10
                // 2.1 -> 20
                // 8.9 -> 80
                var roundedValue = Math.floor(value) * 10;

                if( roundedValue === 0 ){
                    roundedValue = 10;
                }

                $scope.colorClass = 'progress-color-'+roundedValue;

                $scope.labelValue = value.toString();

                var circleSize = $scope.circleSize || 60;
                var radiusOffset = 2;

                $scope.circle = {
                    radius: (circleSize / 2) - radiusOffset,
                    x: circleSize / 2,
                    y: circleSize / 2,
                    viewportX: circleSize,
                    viewportY: circleSize
                };

                $scope.labelStyle = {
                    left: radiusOffset,
                    top: radiusOffset,
                    'line-height': (circleSize - 2*radiusOffset) + 'px',
                    height: circleSize - 2*radiusOffset,
                    width: circleSize - 2*radiusOffset
                };

                $scope.circle.circunference = Math.PI*($scope.circle.radius*2);

                if (percentageValue < 0) { percentageValue = 0;}
                if (percentageValue > 100) { percentageValue = 100;}
                
                var strokeOffset = ((100-percentageValue)/100)*$scope.circle.circunference;

                $scope.circleStyle = {'stroke-dashoffset': strokeOffset};
                
            });
        }
    };
});

// $circle.css({ strokeDashoffset: pct, stroke: 'red'});