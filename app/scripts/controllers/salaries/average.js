'use strict';

App.controller('AverageSalaryCtrl', function(
    $scope,
    $filter,
    $location,
    ContextSrv,
    HeaderSrv,
    PubSubSrv,
    AgenciesSrv,
    NavigationSrv,
    PathsManagerSrv,
    MetadataSrv
){

    $scope.goToSimilarPositions = function(){
        NavigationSrv.go(PathsManagerSrv.getPath('salaries'));
        $location.search('idJob', $scope.salary.idJob);
    };

    $scope.getSalaryColourClass = function(){
        if( !$scope.salary ){ return; }

        // (andres): In this case, we're using this filter to get the color class for the,
        // average salary. So, i am sending the same value in the two params, to the 'income'
        // will be equal to the 'average' and i will get always the same class.
        return $filter('salaryColour')($scope.salary.avgSalary, $scope.salary.avgSalary);
    };

    $scope.goToAgency = function(agency){
        NavigationSrv.go(PathsManagerSrv.getPath('agency'), {
            idAgency: agency.idAgency,
            aliasAgency: agency.alias
        });
    };

    $scope.agencies = [];

    PubSubSrv.suscribe('detailsPageCommon.dataLoaded', function(data){
        $scope.salary = data.details;

        $scope.loadingAgencies = true;
        $scope.finishedLoadAgencies = false;
        AgenciesSrv.getSalariesRanking({
            idSalary: $scope.salary.idSalary
        }).then(function(response){
            $scope.loadingAgencies = false;
            $scope.finishedLoadAgencies = true;
            $scope.agencies = response;
        }, function(){
            $scope.loadingAgencies = false;
            $scope.finishedLoadAgencies = true;
            $scope.agencies = [];
        });

        var metaTitle = MetadataSrv.getSEO().title
            .replace('{JOB_POSITION}', $scope.salary.currentJobPosition)
            .replace('{SENIORITY}', $scope.salary.currentSeniority);

        var metaDescription = MetadataSrv.getSEO().description.replace('{JOB_POSITION}', $scope.salary.currentJobPosition);

        MetadataSrv.setSEO({
            title: metaTitle,
            description: metaDescription
        });

        MetadataSrv.setOG({
            title: metaTitle,
            description: metaDescription
        });
    });

    ContextSrv.safe(function(){
        $scope.bannerData = ContextSrv.get('banners').averageSalary;
    });

    HeaderSrv.setBackArrow();
});
