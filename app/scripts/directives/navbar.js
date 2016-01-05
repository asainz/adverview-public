'use strict';

App.directive('navbar', function(
    TemplatesManagerSrv,
    PathsManagerSrv
){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TemplatesManagerSrv.getUrl('navbar'),
        controller: function(
            $scope,
            $route,
            NavigationSrv
        ){
            function getCurrentOriginalPath(){
                return $route.current.$$route.originalPath;
            }

            $scope.goTo = function( path ){
                if( !NavigationSrv.isCurrent( path ) ){
                    NavigationSrv.go( path );
                }
            };

            $scope.options = [
                { name: 'Agencias', path: PathsManagerSrv.getPath('agencies') },
                { name: 'Salarios', path: PathsManagerSrv.getPath('salaries') },
                { name: 'Noticias', path: PathsManagerSrv.getPath('news') }
            ];

            $scope.target = getCurrentOriginalPath();

            $scope.$on('$routeChangeSuccess', function(){
                $scope.target = getCurrentOriginalPath();
            });
        }
    };
});
