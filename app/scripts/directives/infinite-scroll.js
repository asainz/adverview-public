'use strict';

App.directive('infiniteScroll', function(
    PubSubSrv
){
    return {
        replace: false,
        restrict: 'A',
        link: function(scope, el){
            var handler = _.throttle(function(){
                var height = el[0].getBoundingClientRect().height;
                var scrollHeight = el[0].scrollHeight;
                var scrollTop = el[0].scrollTop;

                if( (scrollHeight - scrollTop) <= height ){
                    PubSubSrv.publish('infiniteScroll.bottom');
                }

            }, 250);

            el.on('scroll', handler);
        }
    };
});