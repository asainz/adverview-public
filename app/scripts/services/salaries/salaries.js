'use strict';

App.service('SalariesSrv', function(
    $q,
    ResourcesManagerSrv,
    NormalizersSrv,
    InfiniteLoaderSrv,
    NotificationsSrv,
    PAGINATION_CONFIG,
    COPY
){
    var salariesResource = ResourcesManagerSrv.create('salaries');
    var salaryResource = ResourcesManagerSrv.create('salaries');
    var countSalariesResource = ResourcesManagerSrv.create('salaries');
    var addSalaryResource = ResourcesManagerSrv.createPost('salaries');

    var infinite = InfiniteLoaderSrv.create('salaries');
    infinite.limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;
    infinite.resource = salariesResource;
    infinite.params = {};

    this.save = function(params){
        return addSalaryResource.save( _.extend({}, {
            act: 'add',
            obj: 'salaries',
            idNews: 0,
            idReview: 0
        }, params)).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0];
        }, function(){
            NotificationsSrv.add(COPY.REQUEST_ERRORS.DEFAULT);
        });
    };

    this.query = function(params){
        params = params || {};
        params.idJob = params.idJob || 0;
        params.idCurrency = params.idCurrency || 0;

        return infinite.query({
            act: 'query_last',
            sort: 'dateAdded',
            dir: 'desc',
            startIndex: 0,
            results: 100,
            email: '',
            idJob: params.idJob,
            idAgency: 0,
            idCurrency: params.idCurrency,
            country: '',
            seniority: params.seniority || ''
        }).then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            records = _.map(records, NormalizersSrv.salary);
            return records;
        });
    };

    this.more = function(params){
        params = params || {};
        params.idReview = params.idReview || 0;

        // no need to send info for more(). It will use the same as query
        return infinite.more().then(function(response){
            var records = response.records || [];

            response = _.map(records, NormalizersSrv.salary);

            return response;
        });
    };

    var detailsCache = {};
    this.get = function(params){
        var id = params.idSalary.toString();

        // id must be numeric
        if( !id.match(/^[\d]+$/) || id === '0'){
            return $q.reject({});
        }

        if( detailsCache[id] ){
            return $q.when(detailsCache[id]);
        }

        return salaryResource.get({
            act: 'get',
            idSalary: id,
            email: params.email,
            filter: 1,
            sort: 'name',
            dir: 'asc',
            country: '',
            startIndex: 0,
            results: 1
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return null;
            }

            response = NormalizersSrv.salary(records[0]);

            detailsCache[id] = response;

            return response;
        });
    };

    this.count = function(params){
        params = params || {};
        params.idJob = params.idJob || 0;
        params.idCurrency = params.idCurrency || 0;

        return countSalariesResource.get({
            email: '',
            country: '',
            act:'count_last',
            idAgency: 0,
            idJob: params.idJob,
            idCurrency: params.idCurrency,
            seniority: params.seniority || ''
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0].count;
        });
    };
});