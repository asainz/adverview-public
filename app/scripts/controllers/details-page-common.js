'use strict';

App.controller('DetailsPageCommonCtrl', function(
    $scope,
    $window,
    params,
    manager,
    PubSubSrv,
    HeaderSrv,
    NavigationSrv,
    PathsManagerSrv
){
    function render(data){
        var backButtonDestination;

        if( $window.APP_FIRST_TIME_NAVIGATION ){
            if( params.backPathWhenNoHistory && !_.isEmpty(params.backPathWhenNoHistory) ){
                backButtonDestination = {
                    destination: {
                        path: PathsManagerSrv.getPath(params.backPathWhenNoHistory.name),
                        params: params.backPathWhenNoHistory.params
                    }
                };
            }
        }

        HeaderSrv.setBackArrow(backButtonDestination);
        PubSubSrv.publish('screenLoader.change', {show: false});
        PubSubSrv.publish('detailsPageCommon.dataLoaded', {details: data});
    }

    PubSubSrv.publish('screenLoader.change', {show: true});

    manager.get( params ).then(function(response){
        if( !response ){
            NavigationSrv.go(PathsManagerSrv.getRootPath(), {}, {replace: true});
        }

        render(response);
    }, function(){
        PubSubSrv.publish('screenLoader.change', {show: false});
        NavigationSrv.go(PathsManagerSrv.getRootPath(), {}, {replace: true});
    });

    $scope.$on('$destroy', function(){
        PubSubSrv.clean('detailsPageCommon.dataLoaded');
    });
});
