'use strict';

App.directive('notification', function(TemplatesManagerSrv){
    return {
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: TemplatesManagerSrv.getUrl('notification'),
        controller: function($scope, PubSubSrv, $timeout){
            var currentlyActive = false;
            var DURATION = 2500;

            function removeAndNotify(){
                var id = currentlyActive;
                $scope.visible = false;
                currentlyActive = false;

                PubSubSrv.publish('notification.remove', { id: id });
            }

            PubSubSrv.suscribe('notification.add', function(params){
                if( currentlyActive ){ return; }

                currentlyActive = params.id;
                $scope.model = {
                    content: params.content
                };
                $scope.visible = true;

                $timeout(function(){
                    removeAndNotify();
                }, DURATION);
            });
        }
    };
});
