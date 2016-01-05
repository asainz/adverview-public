'use strict';

App.service('ReviewsSrv', function(
    $q,
    ResourcesManagerSrv,
    InfiniteLoaderSrv,
    NormalizersSrv,
    PAGINATION_CONFIG,
    NotificationsSrv,
    COPY
){

    var reviewsResource = ResourcesManagerSrv.create('reviews');
    var reviewResource = ResourcesManagerSrv.create('reviews');
    var countReviewsResource = ResourcesManagerSrv.create('reviews');
    var addReviewResource = ResourcesManagerSrv.createPost('reviews');

    var infinite = InfiniteLoaderSrv.create('reviews');
    infinite.limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;
    infinite.resource = reviewsResource;
    infinite.params = {};

    var queryCache = {};
    this.query = function(params){
        params = params || {};
        params.idAgency = params.idAgency || 0;
        params.sort = params.sort || 'dateAdded';
        params.dir = params.dir || 'desc';

        // if( queryCache[params.idAgency] ){
        //     return $q.when(queryCache[params.idAgency]);
        // }

        return infinite.query({
            act: 'query',
            idAgency: params.idAgency,
            filter: 1,
            sort: params.sort,
            dir: params.dir,
            country: '',
            email: ''
        }).then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            response = _.map(records, function(record){
                return NormalizersSrv.review(record, {cropText: true});
            });

            queryCache[params.idAgency] = response;

            return response;
        });
    };

    this.more = function(params){
        params = params || {};
        params.idAgency = params.idAgency || 0;

        // no need to send info for more(). It will use the same as query
        return infinite.more().then(function(response){
            var records = response.records || [];

            response = _.map(records, function(record){
                return NormalizersSrv.review(record, {cropText: true});
            });

            var totalResponse = queryCache[params.idAgency].concat(response);

            queryCache[params.idAgency] = totalResponse;

            return totalResponse;
        });
    };

    this.get = function(params){
        var id = params.idReview.toString();

        // id must be numeric
        if( !id.match(/^[\d]+$/) || id === '0'){
            return $q.reject({});
        }

        return reviewResource.get({
            act: 'get',
            idAgency: params.idAgency,
            idReview: id,
            filter: 1,
            sort: 'dateAdded',
            dir: 'desc',
            country: '',
            email: '',
            startIndex: 0,
            results: 1
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return null;
            }

            response = NormalizersSrv.review(records[0], {cropText: false});
            return response;
        });
    };

    var totalItems = {};
    this.count = function(params){
        params = params || {};
        params.idAgency = params.idAgency || 0;

        // it won't return true if totalItems === 0
        if( totalItems[params.idAgency] != null ){// jshint ignore:line
            return $q.when(totalItems[params.idAgency]);
        }

        return countReviewsResource.get({
            email: '',
            idAgency: params.idAgency,
            country: '',
            filter: 1,
            act:'count'
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                totalItems[params.idAgency] = 0;
                return 0;
            }

            totalItems[params.idAgency] = records[0].count;

            return totalItems[params.idAgency];
        });
    };

    this.save = function(params){
        return addReviewResource.save( _.extend({}, {
            act: 'add',
            obj: 'reviews'
        }, params)).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0];
        }, function(){
            NotificationsSrv.add(COPY.REQUEST_ERRORS.DEFAULT);
        });
    };
});
