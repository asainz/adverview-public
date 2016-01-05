'use strict';

App.controller('LoginCtrl', function(
    $scope,
    $location,
    FBManagerSrv,
    ContextSrv,
    NavigationSrv,
    PathsManagerSrv,
    UsersSrv,
    HeaderSrv,
    COPY
){
    var destinationAfterLogin = { path: PathsManagerSrv.getRootPath(), params: {} };

    function updateUserProfile(){
        $scope.user = {
            loggedIn: ContextSrv.get('loggedIn'),
            profile: ContextSrv.get('profile')
        };
    }

    $scope.model = {
        title: COPY.LOGIN.TITLE.DEFAULT
    };

    if( _.isString($location.search().query) ){
        var data = JSON.parse( $location.search().query );
        var isPathValid = PathsManagerSrv.validate(data.path);

        if( isPathValid && _.isObject(data.params) ){
            destinationAfterLogin = data;
        }

        if( data.origin ){
            var origin = data.origin.replace(/-/g, '_').toUpperCase();

            $scope.model.title = COPY.LOGIN.TITLE[ origin ];
        }
    }

    function navigateAfterLogin(){
        NavigationSrv.go(destinationAfterLogin.path, destinationAfterLogin.params, {replace: true});
    }

    $scope.loginWithFB = function(){
        $scope.loginInProcess = true;

        FBManagerSrv.login().then(function(){
            ContextSrv.fetch().then(function(){
                navigateAfterLogin();
                $scope.loginInProcess = false;

                updateUserProfile();
            });
        });
    };

    HeaderSrv.setBackArrow();

    updateUserProfile();
});