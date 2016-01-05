'use strict';

App.directive('radioControl', function(FormValidationSrv, TemplatesManagerSrv){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            form: '='
        },
        templateUrl: TemplatesManagerSrv.getUrl('radio-control'),
        controller: function(){
            
        }
    };
});