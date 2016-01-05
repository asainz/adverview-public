'use strict';

App.service('CurrencySrv', function(
    $q,
    ResourcesManagerSrv,
    NormalizersSrv
){
    var currencyResource = ResourcesManagerSrv.create('currency');

    var fetchCache = [];
    this.fetch = function(){

        if( fetchCache.length > 0 ){
            return $q.when(fetchCache);
        }

        return currencyResource.get({
            act: 'search'
        }).$promise.then(function(response){
            response.records = _.map(response.records, NormalizersSrv.currency);

            fetchCache = response.records;
            return response.records;
        });
    };
});