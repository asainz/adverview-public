'use strict';

App.service('AgenciesCategoriesSrv', function($q, ResourcesManagerSrv){
    var categoriesResource = ResourcesManagerSrv.createLocal('agencies_categories');
    var cache;

    function query(){
        if( cache ){
            return $q.when(cache);
        }

        return categoriesResource.query().$promise.then(function(response){
            cache = response;
            return response;
        });
    }

    this.query = query;
});