'use strict';

App.service('SalariesRangeSrv', function(
    ResourcesManagerSrv,
    NormalizersSrv
){
    var SalariesRangeResource = ResourcesManagerSrv.create('salaries_range');

    this.query = function(params){
        params = params || {};

        return SalariesRangeResource.get({
            act: 'query',
            country: params.country || '',
            seniority: params.seniority || '',
            idJob: params.idJob || 0
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            // we asume that we will receive always only 1 record
            // since it doesn't make sense to have more than 1.
            // So, this service will always return the last item 
            // of the array in case there are more than one (assuming also that
            // is the newest one)
            var lastRecord = records[ records.length-1 ];
            return NormalizersSrv.salaryRange(lastRecord);
        });
    };
});