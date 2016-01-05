'use strict';

App.service('InfiniteLoaderSrv', function(
    PAGINATION_CONFIG
){
    var instances = {};

    function InfiniteLoader(){
        // defaults
        var Infinite = this;
        Infinite.limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;

        Infinite.data = {};
        Infinite.params = {};
        Infinite.resource = null;
        Infinite.startIndex = 0;

        Infinite.query = function(params){
            if( !Infinite.resource ){
                return;
            }

            Infinite.params = params || {};

            Infinite.params.startIndex = 0;
            Infinite.params.results = Infinite.limit;

            return Infinite.resource.query(Infinite.params).$promise;
        };

        Infinite.more = function(params){
            params = params || {};

            if( !Infinite.resource ){
                return;
            }

            Infinite.params = _.extend(Infinite.params, params);

            Infinite.params.startIndex = Infinite.params.startIndex + Infinite.params.results;

            return Infinite.resource.query(Infinite.params).$promise;
        };
    }

    this.create = function(key){
        var instance = new InfiniteLoader();
        instances[key] = instance;

        return instance;
    };

    this.getResource = function(key){
        var instance = instances[key];
        
        if( !instance ){
            throw 'No InfiniteLoader instance defined for ' + key;
        }

        return instance;
    };
});