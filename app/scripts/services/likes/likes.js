'use strict';

App.service('LikesSrv', function(
    ResourcesManagerSrv,
    NotificationsSrv,
    NormalizersSrv,
    COPY
){

    var changeLikesResource = ResourcesManagerSrv.createPost('likes');
    var deleteLikeResource = ResourcesManagerSrv.createPost('likes');
    var likesResource = ResourcesManagerSrv.create('likes');

    this.query = function(params){
        params = params || {};

        return likesResource.get( _.extend({}, {
            act: 'query',
            idNews: 0,
            idReview: 0,
            dir: 'asc',
            sort: 'dateAdded',
            startIndex: 0,
            results: 500,
            filter: 0 // 1 for likes, 2 for dislikes
        }, params)).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            records = _.map(records, NormalizersSrv.like);
            return records;
        });
    };

    this.save = function(params){
        params = params || {};

        return changeLikesResource.save( _.extend({}, {
            act: 'add',
            obj: 'likes',
            idNews: 0,
            idReview: 0
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

    this.delete = function(params){
        params = params || {};

        return deleteLikeResource.save( _.extend({}, {
            act: 'delete',
            obj: 'likes',
            idNews: 0,
            idReview: 0
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