'use strict';

/**
 * this directive will handle the like/dislike buttons for both
 * reviews and news. They are called 'entities' inside the directive
 * so the directive don't need to know much about what entity
 * it is handling at the moment.
 */

App.directive('likes', function(
    TemplatesManagerSrv,
    ContextSrv,
    LikesSrv,
    NotificationsSrv,
    ReviewNewsEntitiesMixin
){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TemplatesManagerSrv.getUrl('likes'),
        scope: {
            model: '=',
            entity: '@',
            whenUserNotLoggedIn: '='
        },
        controller: function($scope, COPY){
            ReviewNewsEntitiesMixin.setScope($scope);
            ReviewNewsEntitiesMixin.setCopy(COPY);
            var addEntityIdToObject = ReviewNewsEntitiesMixin.addEntityIdToObject;
            var getEntityId = ReviewNewsEntitiesMixin.getEntityId;
            var getEntityIdName = ReviewNewsEntitiesMixin.getEntityIdName;

            function isUserLinkingOrDislinking(like){
                var entityIdName = getEntityIdName();

                if( like[entityIdName] === $scope.model[entityIdName] ){
                    return true;
                }

                return false;
            }

            function findLikeObjectInContext(type){
                // type === 'likes'|'dislikes'

                var params = {};
                var entityIdName = getEntityIdName();

                params[entityIdName] = getEntityId();

                return _.findWhere(ContextSrv.get('profile')[type], params);
            }

            function updateCountInContext(type, idLike){
                // type === 'likes'|'dislikes'|'unlikes'|'undislikes'

                var isRemoving = type.substr(0,2) === 'un';
                var temp = ContextSrv.get('profile');
                type = type.replace('un', '');

                if( isRemoving ){
                  temp[type] = _.reject(temp[type], function(obj){
                    return obj.idLike === idLike;
                  });
                }

                if( !isRemoving ){
                  var newLikeObj = {
                      idLike: idLike
                  };
                  newLikeObj[getEntityIdName()] = getEntityId();

                  temp[type].push( newLikeObj );
                }

                ContextSrv.update( 'profile' , temp);
            }

            var processingLike = false;
            var processingDislike = false;

            $scope.handleLike = function(){
                if( processingLike ){ return; }

                if( !ContextSrv.get('loggedIn') ){
                    $scope.whenUserNotLoggedIn({origin: 'like'});
                    return;
                }

                processingLike = true;

                if( $scope.isUserLiking ){
                    var like = findLikeObjectInContext('likes');

                    LikesSrv.delete({
                        idLike: like.idLike
                    }).then(function(){
                        $scope.model.like -= 1;

                        updateCountInContext('unlikes', like.idLike);

                        $scope.isUserLiking = false;
                        processingLike = false;
                        NotificationsSrv.add(ReviewNewsEntitiesMixin.getNotificationsCopy().UNLIKE);
                    }, function(){
                        processingLike = false;
                    });

                    return;
                }

                var params = {
                    positive: true,
                    email: ContextSrv.get('profile').email
                };

                addEntityIdToObject(params);

                LikesSrv.save(params).then(function(response){
                    $scope.model.like += 1;

                    updateCountInContext('likes', response.idLike);

                    if( $scope.model.unlike > 0 && $scope.isUserDisliking ){
                        $scope.model.unlike -= 1;

                        var likeObjToRemove = findLikeObjectInContext('dislikes');
                        updateCountInContext('undislikes', likeObjToRemove.idLike);
                    }

                    $scope.isUserLiking = true;
                    $scope.isUserDisliking = false;
                    processingLike = false;
                    NotificationsSrv.add(ReviewNewsEntitiesMixin.getNotificationsCopy().LIKE);
                }, function(){
                    processingLike = false;
                });
            };

            $scope.handleDislike = function(){
                if( processingDislike ){ return; }

                if( !ContextSrv.get('loggedIn') ){
                    $scope.whenUserNotLoggedIn({origin: 'dislike'});
                    return;
                }

                processingDislike = true;

                if( $scope.isUserDisliking ){
                    var like = findLikeObjectInContext('dislikes');

                    LikesSrv.delete({
                        idLike: like.idLike
                    }).then(function(){
                        $scope.model.unlike -= 1;

                        updateCountInContext('undislikes', like.idLike);

                        $scope.isUserDisliking = false;
                        processingDislike = false;
                        NotificationsSrv.add(ReviewNewsEntitiesMixin.getNotificationsCopy().UNDISLIKE);
                    }, function(){
                        processingDislike = false;
                    });

                    return;
                }

                var params = {
                    positive: false,
                    email: ContextSrv.get('profile').email
                };

                addEntityIdToObject(params);

                LikesSrv.save(params).then(function(response){
                    $scope.model.unlike += 1;

                    updateCountInContext('dislikes', response.idLike);

                    if( $scope.model.like > 0 && $scope.isUserLiking ){
                        $scope.model.like -= 1;

                        var likeObjToRemove = findLikeObjectInContext('likes');
                        updateCountInContext('unlikes', likeObjToRemove.idLike);
                    }

                    $scope.isUserDisliking = true;
                    $scope.isUserLiking = false;
                    processingDislike = false;
                    NotificationsSrv.add(ReviewNewsEntitiesMixin.getNotificationsCopy().DISLIKE);
                });
            };

            $scope.$watch('model', function(){
                if( !$scope.model ){ return; }

                ContextSrv.safe(function(){
                    _.each(ContextSrv.get('profile').likes, function(like){
                        // if we got a match, don't keep checking
                        if( !$scope.isUserLiking ){
                            $scope.isUserLiking = isUserLinkingOrDislinking(like);
                        }
                    });

                    _.each(ContextSrv.get('profile').dislikes, function(like){
                        // if we got a match, don't keep checking
                        if( !$scope.isUserDisliking ){
                            $scope.isUserDisliking = isUserLinkingOrDislinking(like);
                        }
                    });
                });
            });
        }
    };
});
