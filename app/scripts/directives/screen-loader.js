'use strict';

App.directive('screenLoader', function($timeout, PubSubSrv, TemplatesManagerSrv){
    var BODY_CLASS_WHEN_VISIBLE = 'screen-loader-visible';

    return {
        replace: true,
        scope: {},
        require: '^body',
        templateUrl: TemplatesManagerSrv.getUrl('screen-loader'),
        link: function(scope, el, attrs, body){
            PubSubSrv.suscribe('screenLoader.change', function(state){
                if( state.show ){
                    body.disableScroll();
                    body.addClass( BODY_CLASS_WHEN_VISIBLE );
                }else{
                    body.enableScroll();
                    body.removeClass( BODY_CLASS_WHEN_VISIBLE );
                }
                scope.show = state.show;
            });

            // we need to hide the screen if the user changes the page
            scope.$on('$routeChangeSuccess', function(){
                if( !scope.show ){
                    return;
                }
            });
        }
    };
});