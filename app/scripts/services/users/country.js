'use strict';

// (andres): This service handles the country
// where the user is using the app from
// so we can show localized data

App.service('CountryManagerSrv', function(){
    var data = {
        country: 'argentina',
        _default: true
    };

    function set(country){
        data.country = country;
        data._default = false;
    }

    function get(){
        return data.country;
    }

    this.set = set;
    this.get = get;
});