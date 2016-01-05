'use strict';

App.directive('dialog', function(TemplatesManagerSrv, PubSubSrv){
    return {
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: TemplatesManagerSrv.getUrl('dialog'),
        link: function(scope){
            PubSubSrv.suscribe('dialog.show', function(params){
                // if there is a dialog already in screen, ignore other request
                // to show it
                if( scope.visible ){ return; }

                PubSubSrv.publish('screenBlocker.change', {show: true, closeOnInteraction: false});

                scope.model = {};

                scope.model.title = params.title;
                scope.model.content = params.content;

                scope.visible = true;
            });

            PubSubSrv.suscribe('screenBlocker.hide', function(){
                if( !scope.visible ){ return; }

                scope.visible = false;
                PubSubSrv.publish('dialog.hide');
            });
        },
        controller: function($scope){
            $scope.visible = false;

            $scope.close = function(){
                $scope.visible = false;

                PubSubSrv.publish('screenBlocker.change', {show: false});
                PubSubSrv.publish('dialog.hide');
            };
        }
    };
});