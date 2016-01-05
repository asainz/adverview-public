'use strict';

App.service('AgenciesSrv', function(
    $q,
    $log,
    ResourcesManagerSrv,
    InfiniteLoaderSrv,
    NormalizersSrv,
    NotificationsSrv,
    PAGINATION_CONFIG,
    COPY
){
    var agenciesResource = ResourcesManagerSrv.create('agencies');
    var agencyResource = ResourcesManagerSrv.create('agencies');
    var followAgencyResource = ResourcesManagerSrv.createPost('followers');
    var addAgencyResource = ResourcesManagerSrv.createPost('followers');
    var unfollowAgencyResource = ResourcesManagerSrv.createPost('followers');
    var countAgenciesResource = ResourcesManagerSrv.create('agencies');
    var getAgenciesSalariesRankingResource = ResourcesManagerSrv.create('agencies');

    var infinite = InfiniteLoaderSrv.create('agencies');
    infinite.limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;
    infinite.resource = agenciesResource;
    infinite.params = {};

    var queryCache = {};
    this.query = function(params){
        params = params || {};
        params.filterBy = params.filterBy || 1;

        if( queryCache[params.filterBy] ){
            return $q.when(queryCache[params.filterBy]);
        }

        return infinite.query({
            act: 'query',
            idAgency: 0,
            filter: params.filterBy,
            sort: 'overallScore',
            dir: 'desc',
            country: ''
        }).then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return records;
            }

            response = _.map(records, NormalizersSrv.agency);

            queryCache[params.filterBy] = response;

            return response;
        });
    };

    var autocompleteCache = [];
    this.fetch = function(){
        var filterBy = 1;

        if( autocompleteCache.length > 0 ){
            return $q.when(autocompleteCache);
        }

        return agenciesResource.query({
            act: 'query',
            idAgency: 0,
            filter: filterBy,
            sort: 'overallScore',
            dir: 'desc',
            country: '',
            startIndex: 0,
            results: 1000
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                autocompleteCache = records;
                return records;
            }

            response = _.map(records, NormalizersSrv.agency);
            autocompleteCache = response;

            return response;
        });
    };

    this.more = function(params){
        params = params || {};
        params.filterBy = params.filterBy || 1;

        // no need to send info for more(). It will use the same as query
        return infinite.more({
            filter: params.filterBy
        }).then(function(response){
            var records = response.records || [];

            response = _.map(records, NormalizersSrv.agency);
            var totalResponse = queryCache[params.filterBy].concat(response);

            queryCache[params.filterBy] = totalResponse;

            return totalResponse;
        });
    };

    var detailsCache = {};
    this.get = function(params){
        var id = params.idAgency.toString();

        // id must be numeric
        if( !id.match(/^[\d]+$/) || id === '0'){
            return $q.reject({});
        }

        if( detailsCache[id] ){
            return $q.when(detailsCache[id]);
        }

        return agencyResource.get({
            act: 'get',
            idAgency: id,
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

            response = NormalizersSrv.agency(records[0]);

            response.tags = NormalizersSrv.createAgencyTags(response);

            detailsCache[id] = response;

            return response;
        });
    };

    this.follow = function(params){
        return followAgencyResource.save({
            obj: 'followers',
            act: 'add',
            idAgency: params.idAgency,
            email: params.email
        }).$promise.then(function(response){
            return response && !!response.records; // success
        }, function(){
            NotificationsSrv.add(COPY.REQUEST_ERRORS.DEFAULT);
        });
    };

    this.unfollow = function(params){
        return unfollowAgencyResource.save({
            obj: 'followers',
            act: 'delete',
            idAgency: params.idAgency,
            email: params.email
        }).$promise.then(function(response){
            return response && !!response.records; // success
        }, function(){
            NotificationsSrv.add(COPY.REQUEST_ERRORS.DEFAULT);
        });
    };

    this.save = function(params){
        return addAgencyResource.save( _.extend({}, {
            act: 'add',
            obj: 'agencies'
        }, params)).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return 0;
            }

            return records[0];
        }, function(response){
            return response.data || response;
        });
    };

    var totalItems = {};
    this.count = function(params){
        params = params || {};
        params.filterBy = params.filterBy || 1;

        // it won't return true if totalItems === 0
        if( totalItems[params.filterBy] != null ){// jshint ignore:line
            return $q.when(totalItems[params.filterBy]);
        }

        return countAgenciesResource.get({
            email: '',
            idAgency: 0,
            country: '',
            filter: params.filterBy,
            act:'count',
            email_usuario_alta: ''// jshint ignore:line
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                totalItems[params.filterBy] = 0;
                return 0;
            }

            totalItems[params.filterBy] = records[0].count;

            return totalItems[params.filterBy];
        });
    };

    this.getSalariesRanking = function(params){
        params = params || {};

        if( !params.idSalary ){
            $log.error('You need to pass a idSalary in order to get the agencies salaries ranking');
            return [];
        }

        return getAgenciesSalariesRankingResource.get({
            act: 'salaries_ranking',
            idSalary: params.idSalary
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return [];
            }

            records = _.map(records, NormalizersSrv.agency);

            return records;
        });
    };
});
