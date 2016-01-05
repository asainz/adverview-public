'use strict';

App.directive('screenBlocker', function($timeout, PubSubSrv){
    var BODY_CLASS_WHEN_VISIBLE = 'screen-blocker-visible';

    function hideScreenAndNotify(_scope, _body){
        $timeout(function(){
            _scope.show = false;
            _body.enableScroll();
            _body.removeClass( BODY_CLASS_WHEN_VISIBLE );
            PubSubSrv.publish('screenBlocker.hide');
        }, 0);
    }

    return {
        replace: true,
        scope: {},
        require: '^body',
        template: '<div class="screen-blocker js-screen-blocker" ng-show="show"></div>',
        link: function(scope, el, attrs, body){
            PubSubSrv.suscribe('screenBlocker.change', function(params){
                if( scope.show === params.show ){ return; }

                if( !_.isBoolean(params.closeOnInteraction) ){
                    params.closeOnInteraction = true;   
                }

                if( params.show ){
                    body.disableScroll();
                    body.addClass( BODY_CLASS_WHEN_VISIBLE );
                }else{
                    body.enableScroll();
                    body.removeClass( BODY_CLASS_WHEN_VISIBLE );
                }
                scope.show = params.show;
                scope.closeOnInteraction = params.closeOnInteraction;
            });

            el.on('click', function(){
                if( scope.closeOnInteraction ){
                    hideScreenAndNotify(scope, body);
                }
            });

            document.addEventListener('keydown', function(e){
                if( !scope.show ){ return; }

                $timeout(function(){
                    // escape key
                    if( e.keyCode === 27 ){
                        hideScreenAndNotify(scope, body);
                    }
                });
            });

            // we need to hide the screen if the user changes the page
            scope.$on('$routeChangeSuccess', function(){
                if( !scope.show ){
                    return;
                }
                hideScreenAndNotify(scope, body);
            });
        }
    };
});