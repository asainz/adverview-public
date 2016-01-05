var PLATFORM = (function(){
    var isAndroid = !!window.navigator.userAgent.match(/Android/i);
    var isIos = !!window.navigator.userAgent.match(/iPhone|iPad/i);
    var isWindowsPhone = !!window.navigator.userAgent.match(/IEMobile|Windows Phone/i);
    var isFirefox = !!window.navigator.userAgent.match(/Firefox/i);
    var isChrome = !!window.navigator.userAgent.match(/Chrome/i);

    return {
        IOS: isIos,
        ANDROID: isAndroid,
        WINDOWS_PHONE: isWindowsPhone,
        FIREFOX: isFirefox,
        CHROME: isChrome
    };
}());

(function(){
    var html = document.querySelector('html');

    function add(className){
        if( html.classList ){
            html.classList.add(className);
            return;
        }

        html.className += ' '+className;
    }

    function isMobile(){
        return PLATFORM.ANDROID || PLATFORM.IOS || PLATFORM.WINDOWS_PHONE;
    }

    if( PLATFORM.ANDROID ){
        add('android');
    }

    if( PLATFORM.IOS ){
        add('ios');
    }

    if( PLATFORM.WINDOWS_PHONE ){
        add('windows-phone');
    }

    if( PLATFORM.FIREFOX ){
        add('firefox');
    }

    if( PLATFORM.CHROME ){
        add('chrome');
    }

    if( !isMobile() ){
        add('desktop');
    }
}());