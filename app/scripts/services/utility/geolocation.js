'use strict';

App.service('GeolocationSrv', function(
    $http
){
    function getCountry(coords){
        // http://maps.googleapis.com/maps/api/geocode/json?latlng=-34.593348999999996,-58.4144581&sensor=false
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&sensor=false';

        url = url
                .replace('{latitude}', coords.latitude)
                .replace('{longitude}', coords.longitude);

        return $http({
            url: url,
            method: 'GET'
        }).then(function(response){
            var data = response && response.data || {};
            var result = [];

            if( data ){
                result = data.results && data.results[0] || [];
            }

            if( result.length === 0 ){
                return '';
            }

            var country = '';

            // (andres): Ignoring since jshint will compaint about the
            // snake case properties
            /* jshint ignore:start */
            _.each(result.address_components, function(component){
                if( component.types.indexOf('country') > -1 ){
                    country = component.long_name;
                }
            });
            /* jshint ignore:end */

            return country;
        });
    }

    this.getCountry = getCountry;
});