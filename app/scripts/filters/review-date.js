'use strict';

App.filter('review-date', function(){
    var MONTHS = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    return function(iso){
        if( !iso ){
            return '';
        }
        // (andres): the date sent from the backend will have this iso format: 2015-03-23 23:13:10
        // so it will return a 'Invalid Date' in safari. In order to fix it, we replace the space
        // with a T. more info: http://stackoverflow.com/questions/16616950/date-function-returning-invalid-date-in-safari-and-firefox
        iso = iso.replace(' ', 'T');
        var date = new Date(iso);
        return date.getDate() + ' ' + MONTHS[date.getMonth()] + ', ' + date.getFullYear(); 
    };
});