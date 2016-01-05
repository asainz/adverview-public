'use strict';

App.service('CommentsSrv', function(
    ResourcesManagerSrv,
    NormalizersSrv,
    InfiniteLoaderSrv,
    PAGINATION_CONFIG
){
    var addCommentResource = ResourcesManagerSrv.createPost('comments');
    var commentsResource = ResourcesManagerSrv.create('comments');
    var countCommentsResource = ResourcesManagerSrv.create('comments');

    var infinite = InfiniteLoaderSrv.create('comments');
    infinite.limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;
    infinite.resource = commentsResource;
    infinite.params = {};

    this.save = function(params){
        return addCommentResource.save( _.extend({}, {
            act: 'add',
            obj: 'comments',
            idNews: 0,
            idReview: 0
        }, params)).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0];
        });
    };

    this.query = function(params){
        params = params || {};

        return infinite.query( _.extend({}, {
            act: 'query',
            filter: 1,
            sort: 'dateAdded',
            dir: 'desc',
            startIndex: 0,
            results: 100,
            email: '',
            idReview: 0,
            idNews: 0
        }, params) ) .then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            records = _.map(records, NormalizersSrv.reviewComment);
            return records;
        });
    };

    this.more = function(params){
        params = params || {};
        params.idReview = params.idReview || 0;

        // no need to send info for more(). It will use the same as query
        return infinite.more().then(function(response){
            var records = response.records || [];

            response = _.map(records, NormalizersSrv.reviewComment);

            return response;
        });
    };

    this.count = function(params){
        params = params || {};

        return countCommentsResource.get( _.extend({}, {
            email: '',
            country: '',
            filter: 1,
            act:'count',
            idReview: 0,
            idNews: 0
        }, params) ).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0].count;
        });
    };
});