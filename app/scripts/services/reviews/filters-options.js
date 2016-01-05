'use strict';

App.service('ReviewsFiltersOptionsSrv', function($q, ResourcesManagerSrv){
    var allReviewsFiltersOptions = ResourcesManagerSrv.createLocal('all_reviews_filters_options');
    var cache;

    function query(){
        if( cache ){
            return $q.when(cache);
        }

        return allReviewsFiltersOptions.query().$promise.then(function(response){
            cache = response;
            return response;
        });
    }

    this.query = query;
});
