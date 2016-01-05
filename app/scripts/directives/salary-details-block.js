'use strict';

App.directive('salaryDetailsBlock', function(TemplatesManagerSrv){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: TemplatesManagerSrv.getUrl('salary-details'),
        scope: {
            salary: '=',
            showSimilarPositions: '='
        },
        link: function(){
        },
        controller: function(
            $scope,
            $location,
            $filter,
            NavigationSrv,
            PathsManagerSrv,
            ContextSrv,
            DialogSrv,
            COPY
        ){
            $scope.goToAverageSalary = function(salary){
                var hasEnteredSalary = ContextSrv.get('profile').hasEnteredSalary;
                var isUserLoggedIn = ContextSrv.get('loggedIn');

                if( !isUserLoggedIn ){
                    DialogSrv.show({
                        title: COPY.DIALOG.NO_LOGIN_FOR_AVERAGE_SALARY.TITLE,
                        content: COPY.DIALOG.NO_LOGIN_FOR_AVERAGE_SALARY.CONTENT
                    }).then(function(){
                        NavigationSrv.go(PathsManagerSrv.getPath('login'), {}, {
                            query: {
                                path: PathsManagerSrv.getPath('average-salary'),
                                params: {
                                    idSalary: salary.idSalary,
                                    aliasSalary: salary.alias
                                },
                                origin: 'view-average-salary'
                            }
                        });
                    });

                    return;
                }
                
                if( !hasEnteredSalary ){
                    DialogSrv.show({
                        title: COPY.DIALOG.NO_SALARY_ENTERED.TITLE,
                        content: COPY.DIALOG.NO_SALARY_ENTERED.CONTENT
                    }).then(function(){
                        NavigationSrv.go(PathsManagerSrv.getPath('add-salary'), {}, {
                            query: {
                                path: PathsManagerSrv.getPath('average-salary'),
                                params: {
                                    idSalary: salary.idSalary,
                                    aliasSalary: salary.alias
                                }
                            }
                        });
                    });

                    return;
                }
                
                NavigationSrv.go(PathsManagerSrv.getPath('average-salary'), {
                    idSalary: salary.idSalary,
                    aliasSalary: salary.alias
                });
            };

            $scope.getSalaryColourClass = function(){
                if( !$scope.salary ){ return; }
                return $filter('salaryColour')($scope.salary.avgSalary, $scope.salary.income);
            };

            $scope.goToSimilarPositions = function(){
                $location.search('idJob', $scope.salary.idJob);
            };
        }
    };
});