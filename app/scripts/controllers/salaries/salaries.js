'use strict';

App.controller('SalariesCtrl', function(
    $scope,
    $location,
    ContextSrv,
    SalariesSrv,
    NavigationSrv,
    PathsManagerSrv,
    CurrencySrv,
    CountryManagerSrv
){
    var currencies = [];

    function loadSalaries(){
        var country = CountryManagerSrv.get();

        var idCurrency = _.findWhere(currencies, {normalizedCountry: country}).idCurrency;

        SalariesSrv.query({
            idJob: $location.search().idJob,
            idCurrency: idCurrency
        }).then(function(response){
            $scope.salaries = response;
        });

        SalariesSrv.count({
            idJob: $location.search().idJob,
            idCurrency: idCurrency
        }).then(function(response){
            $scope.totalSalaries = response;
        });
    }

    $scope.goToAddSalary = function(){
        NavigationSrv.go(PathsManagerSrv.getPath('add-salary'));
    };

    $scope.loadMore = function(done){
        SalariesSrv.more().then(function(response){
            $scope.salaries = $scope.salaries.concat(response);

            done();
        });
    };

    ContextSrv.safe(function(){
        $scope.bannerData = ContextSrv.get('banners').salaries;
    });

    CurrencySrv.fetch().then(function(response){
        currencies = response;

        loadSalaries();
    });

    $scope.isFilteringByJob = $location.search().idJob;

});
