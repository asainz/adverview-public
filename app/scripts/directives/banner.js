'use strict';

App.directive('banner', function(){
    return {
        replace: true,
        restrict: 'E',
        transclude: true,
        scope: {
            backgroundImage: '='
        },
        template: '<div class="banner" ng-style="backgroundCSS" ng-transclude></div>',
        controller: function($scope){
            //default
            $scope.backgroundCSS = {'background-image': 'url(images/banners/agencies.jpg)'};

            $scope.$watch('backgroundImage', function(image){
                if( !image ){ return; }
                $scope.backgroundCSS = {'background-image': 'url('+image+')'};
            });
        }
    };
});