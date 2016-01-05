'use strict';

App.controller('ReviewsCtrl', function(
    $scope,
    $timeout,
    ReviewsSrv,
    ContextSrv,
    HeaderSrv,
    NavigationSrv,
    PathsManagerSrv,
    SelectListSrv,
    ReviewsFiltersOptionsSrv,
    FiltersManagerSrv,
    ScreenSrv
){
    var filtersManagerSrv = FiltersManagerSrv.getInstance('reviews', ReviewsFiltersOptionsSrv);
    function updateSelectedFilterInScope(){
        $scope.selectedFilterOption = filtersManagerSrv.getSelected().name;
    }

    function loadReviews(){
      var sort = filtersManagerSrv.getSelected().sort;
      var dir = filtersManagerSrv.getSelected().dir;

      var params = {
        sort: sort,
        dir: dir
      };

      ScreenSrv.block();

      ReviewsSrv.query(params).then(function(response){
          $timeout(function(){
            $scope.reviews = response;
            ScreenSrv.unblock();
          }, 0);
      });

      ReviewsSrv.count(params).then(function(totalReviews){
          $scope.totalReviews = totalReviews;
      });
    }

    $scope.goToDetails = function(review){
        NavigationSrv.go(PathsManagerSrv.getPath('review'), {
            idReview: review.idReview,
            idAgency: review.idAgency,
            aliasReview: review.alias,
            aliasAgency: review.aliasAgency
        });
    };

    $scope.goToAgenciesList = function(){
        NavigationSrv.go(PathsManagerSrv.getPath('agencies'));
    };

    $scope.loadMore = function(done){
        ReviewsSrv.more({
            idAgency: 0
        }).then(function(response){
            $scope.reviews = response;

            done();
        });
    };

    $scope.showFilterOptions = function(){
        SelectListSrv.show({
            options: filtersManagerSrv.getAll(),
            selected: filtersManagerSrv.getSelected().index
        }).then(function(selected){
            filtersManagerSrv.select(selected.index);
            updateSelectedFilterInScope();

            loadReviews();
        });
    };

    filtersManagerSrv.query().then(function(){
        updateSelectedFilterInScope();

        // (andres):The first time this controller is executed, getSelected() will
        // return an empty object since the user didn't select a option yet,
        // so we force select the first one.
        // If the user goes to a another page and comes back, we will have already a selected
        // option, so we don't want to force select anyhitng. We will keep using the one that's
        // already selected.
        if( _.isEmpty(filtersManagerSrv.getSelected()) ){
            filtersManagerSrv.select(0);
        }
    });

    HeaderSrv.setBackArrow();
    loadReviews();

    ContextSrv.safe(function(){
        $scope.bannerBackgroundImage = ContextSrv.get('banners').allReviews.background;
        $scope.bannerText = ContextSrv.get('banners').allReviews.text;
    });
});
