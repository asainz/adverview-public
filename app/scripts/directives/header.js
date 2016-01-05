'use strict';

App.directive('mainHeader', function(
    $window,
    PubSubSrv,
    TemplatesManagerSrv,
    NavigationSrv,
    PathsManagerSrv,
    PlatformSrv
){
    var backArrowDestination;

    function showBackArrow(_scope){
        _scope.backArrowVisibilityState = {'visibility': 'visible'};
    }

    function hideBackArrow(_scope){
        _scope.backArrowVisibilityState = {'visibility': 'hidden'};
    }

    return {
        replace: true,
        scope: {},
        require: '^body',
        templateUrl: TemplatesManagerSrv.getUrl('main-header'),
        link: function(scope, el, attrs, body){
            PubSubSrv.suscribe('header.setBackArrow', function(params){
                params = params || {};

                backArrowDestination = params.destination;
                showBackArrow(scope);
            });

            PubSubSrv.suscribe('header.hideBackArrow', function(){
                hideBackArrow(scope);
            });

            scope.openMenu = function(){
                if( PlatformSrv.isMobile() ){
                    PubSubSrv.publish('screenBlocker.change', {show: true});
                }

                scope.isMenuOpen = true;
                body.addClass('menu-open');
                PubSubSrv.publish('menu.open');
            };

            scope.$on('$routeChangeStart', function(){
                hideBackArrow(scope);
            });

            hideBackArrow(scope);
        },
        controller: function($scope){
            $scope.handleBackArrowClick = function(){
                if( !backArrowDestination ){
                    if( !$window.APP_FIRST_TIME_NAVIGATION ){
                        $window.history.back();
                        return;
                    }

                    NavigationSrv.go(PathsManagerSrv.getRootPath());
                    return;
                }

                NavigationSrv.go(backArrowDestination.path, backArrowDestination.params);
                backArrowDestination = null;
            };
        }
    };
});
