'use strict';

App.directive('body', function(){
    var body = angular.element('body');
    var originalBodyOverflow = body.css('overflow');

    function enableScroll(){
        body.css('overflow', originalBodyOverflow);
        angular.element('.js-screen-blocker').unbind('touchmove');
    }

    // (andres): The only way to disable scroll in desktop, ios8, and android > 4 i found is
    // listening for touch events on the screen blocker div and prevent it from propagating.
    // In iOS8 and android 4.3, if i cache the .js-screen-blocker in a variable, it wouldn't
    // disable the scrolling.
    function disableScroll(){
        body.css('overflow', 'hidden');
        angular.element('.js-screen-blocker').bind('touchmove', function(e){
            e.preventDefault();
            e.stopPropagation();
            return;
        });
    }

    function on(eventName, handler){
        body.on(eventName, handler);
    }

    function off(eventName){
        body.off(eventName);
    }

    function addClass(className){
        body.addClass(className);
    }

    function removeClass(className){
        body.removeClass(className);
    }

    return {
        controller: function(){
            this.enableScroll = enableScroll;
            this.disableScroll = disableScroll;
            this.on = on;
            this.off = off;
            this.addClass = addClass;
            this.removeClass = removeClass;
        }
    };
});