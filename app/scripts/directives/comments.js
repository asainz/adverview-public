'use strict';

App.directive('comments', function(
    TemplatesManagerSrv
){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TemplatesManagerSrv.getUrl('comments'),
        scope: {
            entity: '@',
            model: '=',
            totalComments: '=',
            userLoggedIn: '='
        },
        controller: function(
            $scope,
            CommentsSrv,
            DialogSrv,
            NotificationsSrv,
            COPY,
            LENGTH_CONFIG,
            ContextSrv,
            ReviewNewsEntitiesMixin
        ){
            ReviewNewsEntitiesMixin.setScope($scope);
            var addEntityIdToObject = ReviewNewsEntitiesMixin.addEntityIdToObject;

            function handleCreationError(msg){
                NotificationsSrv.add(msg);
            }

            $scope.newCommentModel = {
                comment: {
                    label: COPY.FORM_LABELS.REVIEW_COMMENT,
                    value: '',
                    name: 'comment',
                    validations: {
                        maxlength: LENGTH_CONFIG.COMMENT_REVIEW_CONTENT
                    }
                },
                submit: {
                    label: COPY.FORM_LABELS.SUBMIT_REVIEW_COMMENT
                }
            };

            $scope.submit = function(done){
                var errorMessage = COPY.NOTIFICATIONS.COULD_NOT_ADD_COMMENT;

                var params = {
                    email: ContextSrv.get('profile').email,
                    content: $scope.newCommentModel.comment.value
                };

                addEntityIdToObject(params);

                CommentsSrv.save(params).then(function(response){
                    if( !response.idComment ){
                        handleCreationError(errorMessage);
                    }

                    DialogSrv.show({
                        title: COPY.DIALOG.COMMENT_ADDED.TITLE,
                        content: COPY.DIALOG.COMMENT_ADDED.CONTENT
                    }).then(function(){
                        
                    });

                    done();
                }, function(){
                    handleCreationError(errorMessage);

                    done();
                });

                _.each($scope.newCommentModel, function(model){
                    model.value = '';
                });
            };

            $scope.loadMore = function(done){
                var params = {};

                addEntityIdToObject(params);

                CommentsSrv.more(params).then(function(response){
                    $scope.comments = $scope.comments.concat(response);

                    done();
                });
            };

            $scope.$watch('model', function(){
                if( !$scope.model ){ return; }

                var queryParams = {};
                addEntityIdToObject(queryParams);

                CommentsSrv.query(queryParams).then(function(comments){
                    $scope.comments = comments;
                });
            });

        }
    };
});