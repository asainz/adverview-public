'use strict';

App.filter('join', function(_str){
    return function (separator){
        var args = _.compact(Array.prototype.slice.call(arguments));
        var str = '';
        var strs = [];

        if( args.length === 1 ){
            return str;
        }

        strs = args.slice(1);

        if( strs.length === 1 ){
            return strs[0];
        }

        return _str.join.apply(null, [separator].concat(strs));
    };
});