'use strict';

App.directive('reviewDetailsBlock', function(TemplatesManagerSrv){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: TemplatesManagerSrv.getUrl('review-details'),
        scope: {
            review: '=',
            isDetailsPage: '=',
            showAgencyName: '='
        },
        link: function(scope){
            if( _.isUndefined(scope.showScore) ){
                scope.showScore = true;
            }
        }
    };
});