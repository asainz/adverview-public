'use strict';

App.service('FollowersSrv', function(
    ResourcesManagerSrv,
    NormalizersSrv
){
    var followedAgenciesResource = ResourcesManagerSrv.create('followers');

    this.query = function(params){
        params = params || {};

        return followedAgenciesResource.get({
            act: 'query',
            sort: 'name',
            dir: 'asc',
            startIndex: 0,
            results: 100,
            email: params.email,
            idAgency: 0
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            records = _.map(records, NormalizersSrv.agency);
            return records;
        });
    };
});