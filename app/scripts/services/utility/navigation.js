'use strict';

App.service('NavigationSrv', function(
    $window,
    $location,
    $route,
    PathsManagerSrv,
    CountryManagerSrv
){
    function go(path, data, options){
        var defaultOptions = {
            replace: false,
            query: {}
        };

        data = data || {};

        if( !data.country ){
          data.country = CountryManagerSrv.get();
        }

        var url = path;
        _.each(data, function(value, key){
            url = url.replace(':'+key, value);
        });

        // NOTE(andres): This is a simple precaution method. If after replacing
        // the variables in the url we still have a colon in it, it means
        // that some variable could not be replaced (for whatever reason). In that case,
        // we default to agencies url, instead of not doing nothig.
        //
        // TODO(andres): Improve logic to handle this scenario.
        if( url.indexOf(':') > -1 ){
            url = PathsManagerSrv.getRootPath();
        }

        var opts = _.extend({}, defaultOptions, options);

        $window.APP_FIRST_TIME_NAVIGATION = false;
        $location.path(url);

        if( opts.replace ){
            $location.replace();
        }

        if( !_.isEmpty(opts.query) ){
            $location.search('query', JSON.stringify(opts.query));
        }else{
            // NOTE(andres): we set the query params as null when we don't
            // specify an object to remove the param from the url. Otherwise,
            // it will remain there until it is changed.
            $location.search('query', null);
        }
    }

    function isCurrent(path){
        return $route.current.$$route.originalPath === path;
    }

    this.go = go;
    this.isCurrent = isCurrent;
});
