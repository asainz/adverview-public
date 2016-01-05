'use strict';

/**
 * (andres): This mixin contains functions that are to use to deal with
 * logic that can work for news and reviews (entities).
 */

App.service('ReviewNewsEntitiesMixin', function(){
    var $scope = {};
    var COPY = {};

    function setScope(scope){
        $scope = scope;
    }

    function setCopy(copy){
        COPY = copy;
    }

    function isReview(){
        return $scope.entity === 'review';
    }

    function isNews(){
        return $scope.entity === 'news';
    }

    function getEntityId(){
        if( isReview() ){
            return $scope.model.idReview;
        }

        if( isNews() ){
            return $scope.model.idNews;
        }
    }

    function addEntityIdToObject(obj){
        if( isReview() ){
            obj.idReview = getEntityId();
        }

        if( isNews() ){
            obj.idNews = getEntityId();
        }
    }

    function getEntityIdName(){
        if( isReview() ){
            return 'idReview';
        }

        if( isNews() ){
            return 'idNews';
        }
    }

    function getNotificationsCopy(){
      if( isReview() ){
            return COPY.NOTIFICATIONS.REVIEW;
        }

        if( isNews() ){
            return COPY.NOTIFICATIONS.NEWS;
        }
    }

    this.isReview = isReview;
    this.isNews = isNews;
    this.getEntityId = getEntityId;
    this.addEntityIdToObject = addEntityIdToObject;
    this.getEntityIdName = getEntityIdName;
    this.getNotificationsCopy = getNotificationsCopy;
    this.setScope = setScope;
    this.setCopy = setCopy;
});
