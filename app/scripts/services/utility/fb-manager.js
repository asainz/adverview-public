'use strict';

angular.module('Facebook', []);

angular.module('Facebook').provider('FBManagerSrv', function(){
    var opts = {};
    var defaultOpts = {
        xfbml : true,
        version : 'v2.2'
    };

    this.config = function(options){
        opts = _.extend({}, defaultOpts, options);
    };

    this.$get = ['$window', '$rootScope', '$timeout', '$q', function($window, $rootScope, $timeout, $q){
        // var profile = $q.defer();
        var sdkLoad = $q.defer();
        var LOGIN_STATUS;

        var eventsMapping = {
            'auth.login': 'userLoggedIn',
            'auth.logout': 'userLoggedOut'
        };

        function loadFBSDK(){
            // //load FB SDK
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = '//connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            return sdkLoad.promise;
        }

        function fetchUserProfile(){
            var deferred = $q.defer();
            $window.FB.api('/me', function(profile) {

                $window.FB.api(profile.id  + '/picture?height=80&width=80', function(picture){
                    profile = _.extend(profile, {picture: picture.data.url});
                    deferred.resolve(profile);
                });

            });

            return deferred.promise;
        }

        function convertFacebookEventsIntoAngularEvents(){
            _.each(eventsMapping, function(ngEvent, fbEvent){
                $window.FB.Event.subscribe(fbEvent, function(){
                    broadcastEvent( ngEvent );
                });
            });
        }

        function broadcastEvent(name, params){
            $timeout(function(){
                $rootScope.$broadcast(name, params);
            }, 0);
        }

        $window.fbAsyncInit = function(){
            $window.FB.init(opts);

            sdkLoad.resolve();
        };

        /* jshint ignore:start */
        function handleSDKLoad(){
            convertFacebookEventsIntoAngularEvents();

            // $window.FB.Event.subscribe('auth.login', function(){
            //     fetchUserProfile();
            // });

            $window.FB.getLoginStatus(function(response) {
                var eventName;

                switch( response.status ){
                    case 'connected':
                        LOGIN_STATUS = 'connected';
                        // fetchUserProfile();
                        eventName = 'userLoggedIn';
                        break;

                    case 'unknown':
                        // profile.resolve(null);
                        LOGIN_STATUS = 'unknown';
                        eventName = 'userNotLoggedIn';
                        break;

                    // case 'not_authorized':
                    default:
                        LOGIN_STATUS = 'not_authorized';
                        eventName = 'userLoggedOut';
                        break;
                }
                broadcastEvent(eventName);
            });
        }
        /* jshint ignore:end */

        // loadFBSDK().then(function(){
        //     convertFacebookEventsIntoAngularEvents();

        //     // $window.FB.Event.subscribe('auth.login', function(){
        //     //     fetchUserProfile();
        //     // });

        //     $window.FB.getLoginStatus(function(response) {
        //         var eventName;

        //         switch( response.status ){
        //             case 'connected':
        //                 LOGIN_STATUS = 'connected';
        //                 // fetchUserProfile();
        //                 eventName = 'userLoggedIn';
        //                 break;

        //             case 'unknown':
        //                 // profile.resolve(null);
        //                 LOGIN_STATUS = 'unknown';
        //                 eventName = 'userNotLoggedIn';
        //                 break;

        //             // case 'not_authorized':
        //             default:
        //                 LOGIN_STATUS = 'not_authorized';
        //                 eventName = 'userLoggedOut';
        //                 break;
        //         }
        //         broadcastEvent(eventName);
        //     });
        // });

        function login(){
            var deferred = $q.defer();

            $window.FB.login(function(response) {

                if (response.authResponse) {
                    // console.log('Welcome!  Fetching your information.... ');
                    // //console.log(response); // dump complete info
                    // access_token = response.authResponse.accessToken; //get access token
                    // user_id = response.authResponse.userID; //get FB UID

                    // FB.api('/me', function(response) {
                    //     // user_email = response.email; //get user email
                    //     console.log('RESPONSE', response);  
                    // });
                  
                    deferred.resolve();

                } else {
                    deferred.reject({error: 'canceled-by-user'});
                }
            }, {
                scope: 'email,user_work_history'
            });

            return deferred.promise;
        }

        function logout(){
            var deferred = $q.defer();

            $window.FB.logout(function(){
                deferred.resolve();
            });

            return deferred.promise;
        }

        function getProfile(){
            var deferred = $q.defer();

            loadFBSDK().then(function(){
                convertFacebookEventsIntoAngularEvents();

                $window.FB.getLoginStatus(function(response) {
                    var eventName;

                    switch( response.status ){
                        case 'connected':
                            LOGIN_STATUS = 'connected';
                            // fetchUserProfile();
                            
                            fetchUserProfile().then(function(response){
                                deferred.resolve(response);
                            });

                            eventName = 'userLoggedIn';
                            break;

                        case 'unknown':
                            deferred.resolve(null);
                            LOGIN_STATUS = 'unknown';
                            eventName = 'userNotLoggedIn';
                            break;

                        // case 'not_authorized':
                        default:
                            LOGIN_STATUS = 'not_authorized';
                            eventName = 'userLoggedOut';
                            deferred.resolve(null);
                            break;
                    }
                    broadcastEvent(eventName);
                });
            });

            return deferred.promise;
        }

        return {
            getProfile: getProfile,
            login: login,
            logout: logout
        };
    }];
});