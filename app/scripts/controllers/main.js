'use strict';

App.controller('MainCtrl', function($scope, $route, PubSubSrv, NavigationSrv, PathsManagerSrv){
    PubSubSrv.suscribe('blockScreen.change', function(data){
        $scope.screenBlocked = data.blocked;
    });

    $scope.isLoadingContextForFirstTime = true;

    PubSubSrv.suscribe('context.loaded', function(){
        $scope.isLoadingContextForFirstTime = false;

        if( $route.current.$$route.originalPath === '/' ){
            NavigationSrv.go(PathsManagerSrv.getPath('agencies'), {}, {replace: true});
        }
    });
});
