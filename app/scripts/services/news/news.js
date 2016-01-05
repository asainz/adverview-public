'use strict';

App.service('NewsSrv', function(
    $q,
    ResourcesManagerSrv,
    NormalizersSrv,
    InfiniteLoaderSrv,
    PAGINATION_CONFIG
){
    var allNewsResource = ResourcesManagerSrv.create('news');
    var newsResource = ResourcesManagerSrv.create('news');
    var countNewsResource = ResourcesManagerSrv.create('news');

    var infinite = InfiniteLoaderSrv.create('news');
    infinite.limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;
    infinite.resource = allNewsResource;
    infinite.params = {};

    var queryCache = [];
    this.query = function(params){
        params = params || {};

        if( queryCache.length > 0 ){
            return $q.when(queryCache);
        }

        return infinite.query({
            act: 'query',
            sort: 'dateAdded',
            dir: 'desc',
            startIndex: 0,
            results: 100,
            filter: 1,
            country: params.country
        }).then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            response = _.map(records, NormalizersSrv.news);

            queryCache = response;

            return response;
        });
    };

    this.more = function(params){
        params = params || {};

        // no need to send info for more(). It will use the same as query
        return infinite.more().then(function(response){
            var records = response.records || [];

            response = _.map(records, NormalizersSrv.news);
            var totalResponse = queryCache.concat(response);

            queryCache = totalResponse;

            return totalResponse;
        });
    };

    this.count = function(params){
        params = params || {};

        return countNewsResource.get({
            email: '',
            country: params.country,
            act:'count',
            filter: 1
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0].count;
        });
    };

    this.get = function(params){
        var id = params.idNews.toString();

        // id must be numeric
        if( !id.match(/^[\d]+$/) || id === '0'){
            return $q.reject({});
        }

        return newsResource.get({
            act: 'get',
            idNews: id
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return null;
            }

            response = NormalizersSrv.news(records[0]);

            return response;
        });
    };
});
