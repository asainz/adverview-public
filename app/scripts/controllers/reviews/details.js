'use strict';

App.controller('ReviewDetailsCtrl', function(
    $scope,
    $filter,
    PubSubSrv,
    ContextSrv,
    NavigationSrv,
    PathsManagerSrv,
    AgenciesSrv,
    DialogSrv,
    SocialNetworksSharerMixin,
    CountSocialSharesSrv,
    MetadataSrv,
    COPY
){
    function showWarningDialogBeforeSharing(){
      return DialogSrv.show({
          title: COPY.DIALOG.WARNING_BEFORE_SHARING.TITLE,
          content: COPY.DIALOG.WARNING_BEFORE_SHARING.CONTENT
      });
    }

    $scope.goToLogin = function(params){
        NavigationSrv.go(PathsManagerSrv.getPath('login'), {}, {
            query: {
                path: PathsManagerSrv.getPath('REVIEW'),
                params: {
                    idAgency: $scope.review.idAgency,
                    idReview: $scope.review.idReview,
                    aliasReview: $scope.review.alias,
                    aliasAgency: $scope.agency.alias
                },
                origin: params.origin
            }
        });
    };

    $scope.shareOnFacebook = function(){
      var params = {
        u: location.href
      };

      showWarningDialogBeforeSharing().then(function(){
        SocialNetworksSharerMixin.fb(params);
      });
    };

    $scope.shareOnTwitter = function(){
      var params = {
        url: location.href,
        text: 'Adverview - ' + $scope.review.title
      };

      showWarningDialogBeforeSharing().then(function(){
        SocialNetworksSharerMixin.tw(params);
      });
    };

    $scope.shareOnGPlus = function(){
      var params = {
        url: location.href,
        text: 'Adverview - ' + $scope.review.title
      };

      showWarningDialogBeforeSharing().then(function(){
        SocialNetworksSharerMixin.gplus(params);
      });
    };

    PubSubSrv.suscribe('detailsPageCommon.dataLoaded', function(data){
        $scope.review = data.details;

        AgenciesSrv.query({filterBy: 1}).then(function(response){
            $scope.agency = _.findWhere(response, {idAgency: $scope.review.idAgency});

            // review details page of a agency that is not laoded yet (due to pagination)
            // won't be returned by the query method, so we fetch it directly
            if( !$scope.agency ){
                AgenciesSrv.get({idAgency: $scope.review.idAgency}).then(function(response){
                    $scope.agency = response;
                });
            }

            var metaTitle = MetadataSrv.getSEO().title
                .replace('{AGENCY_NAME}', $scope.agency.name)
                .replace('{JOB_POSITION}', $scope.review.currentJobPosition);

            var metaDescription = MetadataSrv.getSEO().description
                .replace('{REVIEW_TITLE}', $scope.review.title)
                .replace('{REVIEW_SHORT}', $scope.review.content[0]);

            MetadataSrv.setSEO({
                title: metaTitle,
                description: metaDescription
            });

            MetadataSrv.setOG({
                title: metaTitle,
                description: metaDescription,
                image: $scope.agency.thumbnail
            });

        });

        $scope.totalComments = $scope.review.totalComments;

        $scope.user = {
            loaded: true,
            loggedIn: ContextSrv.get('loggedIn')
        };

        CountSocialSharesSrv.get({
          url: location.href
        }).then(function(response){
          $scope.loadingShareCount = false;
          $scope.totalShareCount = $filter('salary')(response.fb + response.tw);
        });
    });
});
