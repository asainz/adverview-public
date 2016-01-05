'use strict';

App.controller('NewsExpandedCtrl', function(
    $scope,
    $filter,
    PubSubSrv,
    NavigationSrv,
    PathsManagerSrv,
    ContextSrv,
    SocialNetworksSharerMixin,
    CountSocialSharesSrv,
    MetadataSrv
){
    PubSubSrv.suscribe('detailsPageCommon.dataLoaded', function(data){
        $scope.news = data.details;

        ContextSrv.safe(function(){
          $scope.user = {
              loaded: true,
              loggedIn: ContextSrv.get('loggedIn')
          };
        });

        $scope.totalComments = $scope.news.totalComments;

        MetadataSrv.setSEO({
            title: MetadataSrv.getSEO().title.replace('{NEWS_TITLE}', $scope.news.title),
            description: MetadataSrv.getSEO().description.replace('{NEWS_SHORT}', $scope.news.contentShort)
        });

        MetadataSrv.setOG({
          title: MetadataSrv.getOG().title.replace('{NEWS_TITLE}', $scope.news.title),
          description: MetadataSrv.getOG().description.replace('{NEWS_SHORT}', $scope.news.contentShort),
          image: $scope.news.thumbnail,
          url: location.href
        });

        $scope.loadingShareCount = true;

        CountSocialSharesSrv.get({
          url: location.href
        }).then(function(response){
          $scope.loadingShareCount = false;
          $scope.totalShareCount = $filter('salary')(response.fb + response.tw);
        });
    });

    $scope.goToLogin = function(params){
        NavigationSrv.go(PathsManagerSrv.getPath('login'), {}, {
            query: {
                path: PathsManagerSrv.getPath('news-expanded'),
                params: {
                    idNews: $scope.news.idNews,
                    aliasNews: $scope.news.alias
                },
                origin: params.origin
            }
        });
    };

    $scope.shareOnFacebook = function(){
      var params = {
        u: location.href
      };
      SocialNetworksSharerMixin.fb(params);
    };

    $scope.shareOnTwitter = function(){
      var params = {
        url: location.href,
        text: 'Adverview - ' + $scope.news.title
      };
      SocialNetworksSharerMixin.tw(params);
    };

    $scope.shareOnGPlus = function(){
      var params = {
        url: location.href,
        text: 'Adverview - ' + $scope.news.title
      };
      SocialNetworksSharerMixin.gplus(params);
    };
});
