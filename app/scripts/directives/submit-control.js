'use strict';

App.directive('submitControl', function(TemplatesManagerSrv){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            form: '=',
            whenSubmit: '='
        },
        templateUrl: TemplatesManagerSrv.getUrl('submit-control'),
        controller: function($scope, NotificationsSrv, COPY){
            function getForm(){
                return $scope.form || {};
            }

            $scope.getButtonIcon = function(){
                if( $scope.submitting ){
                    return 'icon-loading';
                }
                return 'icon-custom-chevron-down';
            };

            $scope.submit = function(){
                var form = getForm();
                var errorMessage = '';
                var errorField;

                _.each(form, function(field, fieldName){
                    // internal angular variable
                    if( fieldName.indexOf('$') === 0 ){ return; }

                    field.$submitted = false;

                    // if we already have an error, don't keep validating
                    if( errorMessage ){ return; }

                    if( field.$invalid ){
                        var errorCopy;

                        errorCopy = _.extend({}, COPY.ERROR_MESSAGES.default, COPY.ERROR_MESSAGES[ fieldName ]);

                        // we only care about one error at a time
                        var first = true;
                        _.each(field.$error, function(error, errorName){
                            if( first ){
                                errorMessage = errorCopy[ errorName ];
                                errorField = field;
                                first = false;
                            }
                        });
                    }
                });

                if( errorMessage ){
                    NotificationsSrv.add(errorMessage);
                    errorField.$submitted = true;
                    return;
                }

                $scope.submitting = true;

                $scope.whenSubmit(function(){
                    $scope.submitting = false;
                });
            };

            // Handle logic to enable/disable the submit button upon form validity
            // $scope.controlDisabled = false;
            // $scope.$watch(function(){
            //     return getForm().$invalid;
            // }, function(){
            //     $scope.controlDisabled = getForm().$pristine || ( getForm().$invalid && getForm().$dirty );
            // }, true);
        }
    };
});