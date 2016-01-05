'use strict';

App.directive('agencyDetailsBlock', function(TemplatesManagerSrv){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: TemplatesManagerSrv.getUrl('agency-details'),
        scope: {
            agency: '=',
            showScore: '=?',
            navigateToDetailsPage: '=?',
            showAddReviewOption: '=?',
            scoreSize: '@',
            isDetailsPage: '='
        },
        link: function(scope){
            if( _.isUndefined(scope.showScore) ){
                scope.showScore = true;
            }

            if( _.isUndefined(scope.showAddReviewOption) ){
                scope.showAddReviewOption = true;
            }
        },
        controller: function($scope, NavigationSrv, PathsManagerSrv){
            switch( $scope.scoreSize ){
                case 'normal':
                    $scope.scoreSizeInPixels = 50; break;

                case 'big':
                    $scope.scoreSizeInPixels = 72; break;
            }

            $scope.goToAddReview = function(agency){
                NavigationSrv.go(PathsManagerSrv.getPath('add-review'),{
                    idAgency: agency.idAgency,
                    aliasAgency: agency.alias
                });
            };

            $scope.goToDetails = function(agency){
                if( $scope.navigateToDetailsPage ){
                    NavigationSrv.go(PathsManagerSrv.getPath('agency'), {
                        idAgency: agency.idAgency,
                        aliasAgency: agency.alias
                    });
                }
            };
        }
    };
});
