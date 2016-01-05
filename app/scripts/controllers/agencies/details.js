'use strict';

App.controller('AgencyDetailsCtrl', function(
    $scope,
    PubSubSrv,
    ReviewsSrv,
    NavigationSrv,
    PathsManagerSrv,
    ContextSrv,
    AgenciesSrv,
    DialogSrv,
    NotificationsSrv,
    FollowersSrv,
    MetadataSrv,
    COPY
){

    function checkIsFollowedAgency(){
        var followedAgencies = ContextSrv.get('profile').followedAgencies;
        var index = _.where(followedAgencies, {idAgency: $scope.agency.idAgency});

        return index.length === 1;
    }

    function updateFollowedAgenciesList(){
        $scope.user.isFollowing = !$scope.user.isFollowing;

        FollowersSrv.query({
            email: $scope.user.profile.email
        }).then(function(response){
            $scope.user.profile.followedAgencies = response;
            ContextSrv.update('profile', $scope.user.profile);
        });
    }

    PubSubSrv.suscribe('detailsPageCommon.dataLoaded', function(data){
        $scope.agency = data.details;

        MetadataSrv.setSEO({
          title: MetadataSrv.getSEO().title.replace('{AGENCY_NAME}', $scope.agency.name),
          description: $scope.agency.metaDescription
        });

        MetadataSrv.setOG({
            title: MetadataSrv.getOG().title.replace('{AGENCY_NAME}', $scope.agency.name),
            description: $scope.agency.metaDescription,
            image: $scope.agency.thumbnail
        });

        ReviewsSrv.query({idAgency: $scope.agency.idAgency}).then(function(response){
            $scope.reviews = response;
        });

        ReviewsSrv.count({
            idAgency: $scope.agency.idAgency
        }).then(function(count){
            $scope.totalReviews = count;
        });

        $scope.user = {
            loaded: true,
            loggedIn: ContextSrv.get('loggedIn'),
            isFollowing: checkIsFollowedAgency(),
            profile: ContextSrv.get('profile')
        };


    });

    PubSubSrv.suscribe('context.updated', function(){
        $scope.user = {
            loaded: true,
            loggedIn: ContextSrv.get('loggedIn'),
            isFollowing: checkIsFollowedAgency(),
            profile: ContextSrv.get('profile')
        };
    });

    $scope.goToDetails = function(review, agency){
        NavigationSrv.go(PathsManagerSrv.getPath('review'), {
            idReview: review.idReview,
            idAgency: review.idAgency,
            aliasReview: review.alias,
            aliasAgency: agency.alias
        });
    };

    $scope.goToLogin = function(){
        NavigationSrv.go(PathsManagerSrv.getPath('login'), {}, {
            query: {
                path: PathsManagerSrv.getPath('agency'),
                params: {idAgency: $scope.agency.idAgency},
                origin: 'follow-agency'
            }
        });
    };

    $scope.follow = function(){
        $scope.isUpdating = true;
        AgenciesSrv.follow({
            idAgency: $scope.agency.idAgency,
            email: $scope.user.profile.email
        }).then(function(success){
            $scope.isUpdating = false;
            if( !success ){
                NotificationsSrv.add(COPY.NOTIFICATIONS.DEFAULT_NOTIFICATION_ERROR);
                return;
            }

            DialogSrv.show({
                title: COPY.DIALOG.AGENCY_FOLLOWED.TITLE,
                content: COPY.DIALOG.AGENCY_FOLLOWED.CONTENT.replace('{AGENCY_NAME}', $scope.agency.name)
            });

            updateFollowedAgenciesList();

        });
    };

    $scope.unfollow = function(){
        $scope.isUpdating = true;
        AgenciesSrv.unfollow({
            idAgency: $scope.agency.idAgency,
            email: $scope.user.profile.email
        }).then(function(success){
            $scope.isUpdating = false;
            if( !success ){
                NotificationsSrv.add(COPY.NOTIFICATIONS.DEFAULT_NOTIFICATION_ERROR);
                return;
            }

            DialogSrv.show({
                title: COPY.DIALOG.AGENCY_UNFOLLOWED.TITLE,
                content: COPY.DIALOG.AGENCY_UNFOLLOWED.CONTENT.replace('{AGENCY_NAME}', $scope.agency.name)
            });

            updateFollowedAgenciesList();

        });
    };

    $scope.loadMore = function(done){
        ReviewsSrv.more({
            idAgency: $scope.agency.idAgency
        }).then(function(response){
            $scope.reviews = response;

            done();
        });
    };
});
