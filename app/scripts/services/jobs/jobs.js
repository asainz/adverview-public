'use strict';

App.service('JobsSrv', function(
    ResourcesManagerSrv
){
    var jobsResource = ResourcesManagerSrv.create('jobs');

    this.query = function(){
        return jobsResource.get({
            act: 'search'
        }).$promise.then(function(response){
            return response.records;
        });
    };
});