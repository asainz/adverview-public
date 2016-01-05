'use strict';

App.controller('NewsCtrl', function(
    $scope,
    NewsSrv,
    ContextSrv,
    CountryManagerSrv,
    PathsManagerSrv,
    NavigationSrv,
    MetadataSrv
){
    var NEWS_CATEGORIES = ['Fake category 1', 'Fake category 2'];
    var newsCategoriesString = NEWS_CATEGORIES.join(', ');

    $scope.loadMore = function(done){
        NewsSrv.more().then(function(response){
            $scope.allNews = response;

            done();
        });
    };

    $scope.goToLogin = function(){
        NavigationSrv.go(PathsManagerSrv.getPath('login'), {}, {
            query: {
                path: PathsManagerSrv.getPath('news'),
                params: {},
                origin: 'news'
            }
        });
    };

    $scope.goToExpandedView = function(news){
        NavigationSrv.go(PathsManagerSrv.getPath('news-expanded'), {
            idNews: news.idNews,
            aliasNews: news.alias
        });
    };

    ContextSrv.safe(function(){
        $scope.bannerData = ContextSrv.get('banners').news;

        $scope.user = {
            loggedIn: ContextSrv.get('loggedIn')
        };
    });

    NewsSrv.query({
        country: CountryManagerSrv.get()
    }).then(function(response){
        $scope.allNews = response;
    });

    NewsSrv.count({
        country: CountryManagerSrv.get()
    }).then(function(response){
        $scope.totalNews = response;
    });

    MetadataSrv.setSEO({
        description: MetadataSrv.getSEO().description.replace('{NEWS_CATEGORIES}', newsCategoriesString)
    });

    MetadataSrv.setOG({
        description: MetadataSrv.getOG().description.replace('{NEWS_CATEGORIES}', newsCategoriesString)
    });

});
