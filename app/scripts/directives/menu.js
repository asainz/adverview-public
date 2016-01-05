'use strict';

App.directive('menu', function(
    $timeout,
    TemplatesManagerSrv,
    PubSubSrv,
    AgenciesSrv,
    NotificationsSrv,
    DialogSrv,
    FollowersSrv,
    PlatformSrv
){
    return {
        restrict: 'E',
        replace: true,
        require: '^body',
        templateUrl: TemplatesManagerSrv.getUrl('menu'),
        link: function(scope, el, attrs, body){
            scope.scrollIntoView = function(){
                el[0].scrollTop = 0;
            };

            scope.closeMenu = function(){
                if( PlatformSrv.isMobile() ){
                    PubSubSrv.publish('screenBlocker.change', {show: false});
                }

                scope.isMenuOpen = false;
                
                $timeout(function(){
                    body.removeClass('menu-open');
                }, 250);
            };

            scope.openMenu = function(){
                if( PlatformSrv.isMobile() ){
                    PubSubSrv.publish('screenBlocker.change', {show: true});
                }

                scope.isMenuOpen = true;
                scope.scrollIntoView();
                body.addClass('menu-open');
            };

            scope.toggleMenu = function(){
                if( scope.isMenuOpen ){
                    scope.closeMenu();
                    return;
                }

                if( !scope.isMenuOpen ){
                    scope.openMenu();
                    return;
                }
            };

            PubSubSrv.suscribe('menu.open', function(){
                if( scope.isMenuOpen ){ return; }
                scope.openMenu();
            });

            PubSubSrv.suscribe('screenBlocker.hide', function(){
                if( !scope.isMenuOpen ){ return; }
                scope.closeMenu();
            });
        },
        controller: function(
            $scope,
            NavigationSrv,
            PathsManagerSrv,
            FBManagerSrv,
            ContextSrv,
            PubSubSrv,
            COPY
        ){
            function goTo( path, params ){
                if( NavigationSrv.isCurrent( path ) ){
                    $scope.closeMenu();
                }else{
                    NavigationSrv.go( path, params );
                }
            }
 
            function updateUserProfile(){
                $scope.user = {
                    loggedIn: ContextSrv.get('loggedIn'),
                    profile: ContextSrv.get('profile')
                };
            }

            function updateFollowedAgenciesListAndNotify(){
                FollowersSrv.query({
                    email: $scope.user.profile.email
                }).then(function(response){
                    $scope.user.profile.followedAgencies = response;
                    ContextSrv.update('profile', $scope.user.profile);

                    PubSubSrv.publish('context.updated');
                });
            }

            $scope.goToAddAgency = function(){
                goTo(PathsManagerSrv.getPath('add-agency'));
            };

            $scope.goToSalaries = function(){
                goTo(PathsManagerSrv.getPath('salaries'));
            };

            $scope.goToNews = function(){
                goTo(PathsManagerSrv.getPath('news'));
            };

            $scope.goToAgencies = function(){
                goTo(PathsManagerSrv.getPath('agencies'));
            };

            $scope.goToLogin = function(){
                goTo(PathsManagerSrv.getPath('login'));
            };

            $scope.goToAgency = function(agency){
                NavigationSrv.go(PathsManagerSrv.getPath('agency'), {
                    idAgency: agency.idAgency,
                    aliasAgency: agency.alias
                });
                $scope.closeMenu();
            };

            $scope.handleNewSearchOptionSelected = function(selectedOption){
                var agency = _.findWhere($scope.allAgencies, {name: selectedOption});
                $scope.searchText = '';
                $scope.goToAgency(agency);
            };

            $scope.unfollow = function(agency){
                $scope.closeMenu();
                AgenciesSrv.unfollow({
                    idAgency: agency.idAgency,
                    email: $scope.user.profile.email
                }).then(function(success){
                    if( !success ){
                        NotificationsSrv.add(COPY.NOTIFICATIONS.DEFAULT_NOTIFICATION_ERROR);
                        return;
                    }

                    DialogSrv.show({
                        title: COPY.DIALOG.AGENCY_UNFOLLOWED.TITLE,
                        content: COPY.DIALOG.AGENCY_UNFOLLOWED.CONTENT.replace('{AGENCY_NAME}', agency.name)
                    });

                    updateFollowedAgenciesListAndNotify();

                });
            };

            $scope.logoutWithFacebook = function(){
                PubSubSrv.publish('screenLoader.change', {show: true});
                $scope.closeMenu();

                FBManagerSrv.logout().then(function(){
                    ContextSrv.fetch().then(function(){
                        PubSubSrv.publish('screenLoader.change', {show: false});
                        NavigationSrv.go( PathsManagerSrv.getRootPath() );

                        updateUserProfile();
                    });
                });
            };

            ContextSrv.safe(function(){
                updateUserProfile();
            });

            PubSubSrv.suscribe('context.loaded', function(){
                updateUserProfile();
            });

            AgenciesSrv.fetch().then(function(response){
                $scope.allAgencies = response;
                $scope.agenciesForSuggestion = _.map(response, function(agencie){
                    return agencie.name;
                });
            });
        }
    };
});