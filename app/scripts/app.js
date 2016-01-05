'use strict';

var App = angular.module('AdverView', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'autocomplete',
    'ngSlider',
    'Facebook'
]);

App.config(function ($locationProvider, $routeProvider, PathsManagerSrvProvider, TemplatesManagerSrvProvider) {
    $locationProvider.html5Mode(true);

    function validateUserIsLoggedInBeforeResolving(params, $q, ContextSrv){
        var deferred = $q.defer();

        ContextSrv.safe(function(){
            if( ContextSrv.get('loggedIn') ){
                deferred.resolve( ContextSrv.get('profile') );
                return;
            }

            deferred.reject( {error: 'not-authorized', origin:  params.origin} );
        });

        return deferred.promise;
    }

    $routeProvider
        .when('/', {
            temapate: '<div></div>',
            controller: 'MainCtrl'
        })
        .when(PathsManagerSrvProvider.getPath('agencies'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('agencies'),
            controller: 'AgenciesCtrl'
        })
        .when(PathsManagerSrvProvider.getPath('add-agency'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('add-agency'),
            controller: 'AddAgenciesCtrl',
            resolve: {
                profile: function($q, ContextSrv){
                    return validateUserIsLoggedInBeforeResolving({origin: 'add-agency'}, $q, ContextSrv);
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('agency'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('agency'),
            controller: 'DetailsPageCommonCtrl',
            resolve: {
                params: function($route){
                    return {
                        idAgency: $route.current.params.idAgency,
                        backPathWhenNoHistory: {
                          name: 'agency'
                        }
                    };
                },
                manager: function(AgenciesSrv){
                    return AgenciesSrv;
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('reviews'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('reviews'),
            controller: 'ReviewsCtrl'
        })
        .when(PathsManagerSrvProvider.getPath('add-review'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('add-review'),
            controller: 'DetailsPageCommonCtrl',
            resolve: {
                params: function($route){
                    return {
                        idAgency: $route.current.params.idAgency,
                        backPathWhenNoHistory: {
                          name: 'agency',
                          params: {
                            idAgency: $route.current.params.idAgency
                          }
                        }
                    };
                },
                manager: function(AgenciesSrv){
                    return AgenciesSrv;
                },
                profile: function($q, ContextSrv){
                    return validateUserIsLoggedInBeforeResolving({origin: 'add-review'}, $q, ContextSrv);
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('review'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('reviews-details'),
            controller: 'DetailsPageCommonCtrl',
            resolve: {
                params: function($route){
                    return {
                        idReview: $route.current.params.idReview,
                        idAgency: $route.current.params.idAgency,
                        backPathWhenNoHistory: {
                          name: 'agency',
                          params: {
                            idAgency: $route.current.params.idAgency
                          }
                        }
                    };
                },
                manager: function(ReviewsSrv){
                    return ReviewsSrv;
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('salaries'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('salaries'),
            controller: 'SalariesCtrl'
        })
        .when(PathsManagerSrvProvider.getPath('average-salary'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('average-salary'),
            controller: 'DetailsPageCommonCtrl',
            resolve: {
                params: function($q, $route, ContextSrv){
                    var idSalary = $route.current.params.idSalary;
                    return ContextSrv.safe().then(function(){
                        return {
                            email: ContextSrv.get('profile').email,
                            idSalary: idSalary,
                            backPathWhenNoHistory: {
                              name: 'salaries'
                            }
                        };
                    });
                },
                manager: function(SalariesSrv){
                    return SalariesSrv;
                },
                hasEnteredSalary: function($q, $route, $routeParams, ContextSrv){
                    // (andres): $routeParams still has the params from the last resolved route,
                    // so if the origin is equal to 'view-average-salary', we can infer
                    // that we are coming from login page, so in that case, we set a flag
                    // as true.
                    // This is to handle this scenario: The user goes to average salary
                    // route without being logged. The user is presented with a dialog
                    // and then the login page. The user logs in and he doesn't entered
                    // a salary yet. The login page redirects him to the average salary
                    // page, but since he doesn't have a salary he needs to enter one. Since
                    // the user is coming from the login page and already saw an alert,
                    // we want to avoid showing a second one with a very similar message
                    // https://github.com/asainz/adverview/issues/255
                    var comingFromLogin = false;
                    if($routeParams.query){
                        try{
                            comingFromLogin = JSON.parse($routeParams.query).origin === 'view-average-salary';
                        }catch(err){}
                    }
                    var deferred = $q.defer();

                    ContextSrv.safe(function(){
                        if( ContextSrv.get('profile').hasEnteredSalary ){
                            deferred.resolve( ContextSrv.get('profile') );
                            return;
                        }

                        deferred.reject( {error: 'not-salary-entered', params: {
                            idSalary: $route.current.params.idSalary,
                            aliasSalary: $route.current.params.aliasSalary,
                            comingFromLogin: comingFromLogin
                        }} );
                    });

                    return deferred.promise;
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('add-salary'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('add-salary'),
            controller: 'AddSalaryCtrl',
            resolve: {
                profile: function($q, ContextSrv){
                    return validateUserIsLoggedInBeforeResolving({origin: 'add-salary'}, $q, ContextSrv);
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('news'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('news'),
            controller: 'NewsCtrl'
        })
        .when(PathsManagerSrvProvider.getPath('news-expanded'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('news-expanded'),
            controller: 'DetailsPageCommonCtrl',
            resolve: {
                params: function($route){
                    return {
                        idNews: $route.current.params.idNews,
                        backPathWhenNoHistory: {
                          name: 'news'
                        }
                    };
                },
                manager: function(NewsSrv){
                    return NewsSrv;
                }
            }
        })
        .when(PathsManagerSrvProvider.getPath('login'), {
            templateUrl: TemplatesManagerSrvProvider.getUrl('login'),
            controller: 'LoginCtrl'
        })
        .when(PathsManagerSrvProvider.getNotFoundPath(), {
            template: '<div></div>',
            resolve: {
                redirect: function($q, $timeout, NavigationSrv, PathsManagerSrv){
                    var deferred = $q.defer();

                    $timeout(function(){
                        deferred.reject();
                        $timeout(function(){
                            NavigationSrv.go(PathsManagerSrv.getPath('agencies'), {}, {replace: true});
                        });
                    });

                    return deferred.promise;
                }
            }
        })
        .otherwise({
            redirectTo: PathsManagerSrvProvider.getNotFoundPath()
        });

});

App.run(function(
    $rootScope,
    NavigationSrv,
    PubSubSrv,
    PathsManagerSrv,
    DialogSrv,
    COPY
){
    // NOTE(andres): This event receives the route that failed as second parameter
    $rootScope.$on('$routeChangeError', function(e, dest, origin, data){
        data = data || {};

        if( data.error === 'not-authorized' ){
            NavigationSrv.go(PathsManagerSrv.getPath('login'), {}, {
                replace: true,
                query: {
                    path: dest.$$route.originalPath,
                    params: dest.params,
                    origin: data.origin
                }
            });
            return;
        }

        if( data.error === 'not-salary-entered' ){
            if( data.params.comingFromLogin ){
                NavigationSrv.go(PathsManagerSrv.getPath('add-salary'), {}, {
                    replace: true,
                    query: {
                        path: PathsManagerSrv.getPath('average-salary'),
                        params: data.params
                    }
                });
                return;
            }

            DialogSrv.show({
                title: COPY.DIALOG.NO_SALARY_ENTERED.TITLE,
                content: COPY.DIALOG.NO_SALARY_ENTERED.CONTENT
            }).then(function(){
                NavigationSrv.go(PathsManagerSrv.getPath('add-salary'), {}, {
                    replace: true,
                    query: {
                        path: PathsManagerSrv.getPath('average-salary'),
                        params: data.params
                    }
                });
            });

            return;
        }

        NavigationSrv.go('agencies');
    });
});

App.run(function($rootScope){
    var unsuscribeRouteChangeStartEvent = $rootScope.$on('$routeChangeStart', function(e, route){
        if( !route || !route.$$route ){ return false; }

        route.$$route.resolve = route.$$route.resolve || {};

        route.$$route.resolve.loadContext = ['ContextSrv', function(ContextSrv){
            return ContextSrv.fetch().then(function(response){
                // remove the resolver once it was executed once
                delete route.$$route.resolve.loadContext;
                return response;
            });
        }];

        unsuscribeRouteChangeStartEvent();
    });
});

// Make sure the vertical scroll is set to zero after each navigation
App.run(function($rootScope, $window, $timeout){
    $rootScope.$on('$locationChangeSuccess', function(){
        $timeout(function(){
            $window.scrollTo(0,0);
        });
    });
});

App.config(function(FBManagerSrvProvider, ENVIRONMENT_CONFIG){
    FBManagerSrvProvider.config({
        appId: ENVIRONMENT_CONFIG.FACEBOOK_ID
    });
});

App.run(function($rootScope, MetadataSrv, TemplatesManagerSrv, CountryManagerSrv){
  var baseUrl = document.querySelector('base').getAttribute('href');
    $rootScope.$on('$routeChangeSuccess', function(e, route){
        if( !route || !route.$$route ){ return false; }

        var routeConfig = TemplatesManagerSrv.lookup(route.$$route.templateUrl);
        var ogData = routeConfig.ogData || {};
        var SEOData = routeConfig.seoData || {};

        var image = ogData.image ? baseUrl + ogData.image : baseUrl + 'images/logo.png';

        var country = CountryManagerSrv.get();

        MetadataSrv.setSEO({
          title: SEOData.title.replace('{COUNTRY}', country),
          description: SEOData.description.replace('{COUNTRY}', country)
        });

        MetadataSrv.setOG({
          title: ogData.title.replace('{COUNTRY}', country),
          description: ogData.description.replace('{COUNTRY}', country),
          image: image,
          url: location.href
        });
    });
});

App.config(function($httpProvider){
    $httpProvider.interceptors.push(function($q, CountryManagerSrv){
        return {
            request: function(config){
                var isApiCall = config.url.indexOf('db.php') > -1;

                if( isApiCall ){

                    if( config.method === 'GET' ){
                        config.params = config.params || {};

                        if( !config.params.country ){
                            config.params.country = CountryManagerSrv.get();
                        }
                    }

                    if( config.method === 'POST' ){
                        if( !config.data.country ){
                            config.data.country = CountryManagerSrv.get();
                        }
                    }


                }
                return config || $q.when(config);
            },
            response: function(response){
                return response || $q.when(response);
            },
            requestError: function(rejection){
                return $q.reject(rejection);
            },
            responseError: function(rejection){
                return $q.reject(rejection);
            }
        };
    });
});

App.run(function(CountryManagerSrv, GeolocationSrv){
    if( navigator.geolocation ){
        navigator.geolocation.getCurrentPosition(function(location){
            GeolocationSrv.getCountry(location.coords).then(function(response){
                // if we don't get a country from the browser, let's
                // use the default one
                if( response ){
                    CountryManagerSrv.set(response.toLowerCase());
                }
            });
        });
    }
    // if (Modernizr.geolocation) {
    //     navigator.geolocation.getCurrentPosition(show_map);
    // } else {
    //     // no native support; maybe try a fallback?
    // }
});
