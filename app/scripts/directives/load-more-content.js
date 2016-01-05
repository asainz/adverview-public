'use strict';

App.directive('loadMoreContent', function(
    TemplatesManagerSrv,
    InfiniteLoaderSrv,
    NormalizersSrv,
    PAGINATION_CONFIG,
    PubSubSrv,
    PlatformSrv
){
    return {
        replace: false,
        restrict: 'E',
        scope: {
            items: '=',
            totalItems: '=',
            handleClick: '='
        },
        templateUrl: TemplatesManagerSrv.getUrl('load-more-content'),
        controller: function($scope, COPY){
            var loadMoreButtonLabel = COPY.LABELS.LOAD_MORE_BUTTON;

            $scope.loadMoreButtonLabel = loadMoreButtonLabel;

            $scope.loadMore = function(){
                if( $scope.loadingMore ){
                    return;
                }

                if( !areThereMoreItems() ){
                    return;
                }

                $scope.loadingMore = true;
                showLoadMoreButtonIfRequired();

                $scope.handleClick(function(){
                    $scope.loadingMore = false;
                });
            };

            function areThereMoreItems(){
                var items = $scope.items;
                var totalItems = $scope.totalItems;
                var moreItems = true;

                if( _.isUndefined(items) || _.isUndefined(totalItems) ){
                    return;
                }

                if( totalItems === 0 ){
                    moreItems = false;
                }

                if( totalItems <= PAGINATION_CONFIG.ITEMS_PER_PAGE ){
                    moreItems = false;
                }

                if( items.length >= $scope.totalItems ){
                    moreItems = false;
                }

                return moreItems;
            }

            function showLoadMoreButtonIfRequired(){
                if( !areThereMoreItems() ){
                    $scope.isLoadMoreButtonVisible = false;
                    return;
                }

                $scope.isLoadMoreButtonVisible = false;

                if( PlatformSrv.isDesktop() ){
                    $scope.isLoadMoreButtonVisible = true;
                }

                if( PlatformSrv.isMobile() ){
                    if( $scope.loadingMore ){
                        $scope.isLoadMoreButtonVisible = true;
                    }
                }
            }

            $scope.$watch('items', showLoadMoreButtonIfRequired);
            $scope.$watch('totalItems', showLoadMoreButtonIfRequired);

            var infiniteScrollEventUnsuscriber = PubSubSrv.suscribe('infiniteScroll.bottom', $scope.loadMore);

            $scope.$on('$destroy', function(){
                infiniteScrollEventUnsuscriber();
            });
        }
    };
});