'use strict';

App.filter('salary', function(){
    return function (value){
        var formattedValue = value.toString();
        var originalValue = value;
        var stringValue = value.toString();

        if( originalValue < 1000 ){
            return originalValue;
        }

        var integerPartLength = Math.round(originalValue / 1000).toString().length;

        formattedValue = stringValue.substr(0,integerPartLength) + ',' + stringValue.substr(integerPartLength,1) + 'K';

        return formattedValue;
    };
});
