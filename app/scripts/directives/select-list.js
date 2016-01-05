'use strict';

App.directive('selectList', function(
    $timeout,
    $window,
    PubSubSrv,
    TemplatesManagerSrv
){
    // total items that the list will render without scrolling
    // var ITEMS_FOLD = 8;

    // how many icons display after the selected one when the scroll is force to that item
    // var SCROLLING_OFFSET = 1;

    function notifyClosingWithoutSelection(scope){
        var index = scope.selectedIndex;
        var value = index && scope.options[index];

        closeView(scope);

        PubSubSrv.publish('selectList.hideWithoutSelection', {
            index: index,
            value: value
        });
    }

    function closeView(scope){
        $timeout(function(){
            scope.visible = false;
            scope.options = [];
            scope.defaultSelectedIndex = -1;
            scope.selectedIndex = -1;
        }, 0);
    }

    return {
        replace: true,
        scope: {},
        templateUrl: TemplatesManagerSrv.getUrl('select-list'),
        link: function(scope){
            PubSubSrv.suscribe('selectList.show', function(params){
                if( scope.visible ){ return; }

                scope.options = params.options;
                scope.defaultSelectedIndex = params.selected;
                scope.selectedIndex = params.selected;

                PubSubSrv.publish('screenBlocker.change', {show: true});

                scope.visible = true;
            });
        },
        controller: function($scope){
            closeView($scope);

            PubSubSrv.suscribe('screenBlocker.hide', function(){
                notifyClosingWithoutSelection($scope);
            });

            $scope.handleSelection = function(selectedIndex){
                PubSubSrv.publish('selectList.hide', {
                    index: selectedIndex,
                    value: $scope.options[selectedIndex]
                });

                closeView($scope);

                PubSubSrv.publish('screenBlocker.change', {show: false});
            };

            $scope.$on('$routeChangeSuccess', function(){
                if( $scope.visible ){
                    notifyClosingWithoutSelection($scope);
                }
            });

            $scope.handleClickOnListBackground = function(){
                // (andres): If you want the list not to close when clicking in the
                // background, uncomment the if statement below this comment.

                // if( e.target.id === 'selectList' ){
                    PubSubSrv.publish('screenBlocker.change', {show: false});
                    notifyClosingWithoutSelection($scope);
                // }
            };
        }
    };
});