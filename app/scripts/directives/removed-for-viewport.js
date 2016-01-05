'use strict';

App.directive('removedForViewport', function(PlatformSrv){
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, el, attrs){
            var isMobile =  PlatformSrv.isMobile();
            var targets = attrs.removedForViewport.split(' ');

            _.each(targets, function(target){
                if( (target === 'desktop' && !isMobile) || (target === 'mobile' && isMobile) ){
                    el.remove();
                }
            });
        }
    };
});