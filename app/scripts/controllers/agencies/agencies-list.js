'use strict';

App.controller('AgenciesListCtrl', function(
    $rootScope,
    $scope,
    $timeout,
    AgenciesSrv,
    PubSubSrv,
    FiltersManagerSrv,
    ScreenSrv,
    AgenciesCategoriesSrv
){
    var filtersManagerSrv = FiltersManagerSrv.getInstance('agencies', AgenciesCategoriesSrv);

    function loadAgencies(){
        var filterBy = filtersManagerSrv.getSelected().filterBy;

        ScreenSrv.block();

        AgenciesSrv.query({ filterBy: filterBy }).then(function(response){
            $timeout(function(){
                $scope.agencies = response;
                ScreenSrv.unblock();
            }, 0);
        });

        // update total count after each change
        AgenciesSrv.count({ filterBy: filterBy }).then(function(count){
            $scope.totalAgencies = count;
        });
    }

    $scope.loadMore = function(done){
        var filterBy = filtersManagerSrv.getSelected().filterBy;
        AgenciesSrv.more({filterBy: filterBy}).then(function(response){
            $scope.agencies = response;

            done();
        });
    };

    var agenciesFilterUpdateUnsuscriber = PubSubSrv.suscribe('agenciesFilter.update', function(){
        loadAgencies();
    });

    loadAgencies();

    $scope.$on('$destroy', function(){
        agenciesFilterUpdateUnsuscriber();
    });
});
