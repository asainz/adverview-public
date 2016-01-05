'use strict';

App.filter('ellipsis', function(){
    return function(str, totalChars){
        if( str.length <= totalChars ){
            return str;
        }

        return str.substr(0, totalChars);
    };
});