'use strict';

App.service('PlatformSrv', function($window){
    function isMobile(){
        return PLATFORM.ANDROID || PLATFORM.IOS || PLATFORM.WINDOWS_PHONE;
    }

    function isDesktop(){
        return !isMobile();
    }

    this.isMobile = isMobile;
    this.isDesktop = isDesktop;
});