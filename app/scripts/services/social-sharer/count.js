'use strict';

App.service('CountSocialSharesSrv', function(
    $http,
    $q
){
    function getFacebookShares(params){
      params.url = 'https://www.adverview.com/dev/fe/26-04-15_22.43.20/news/10';

        return $http({
            method: 'GET',
            url: 'https://graph.facebook.com/',
            params: {
                id: params.url
            }
        });
    }

    function getTwitterShares(params){
        return $http({
            method: 'JSONP',
            url: 'https://cdn.api.twitter.com/1/urls/count.json',
            params: {
                url: params.url,
                callback: 'JSON_CALLBACK'
            }
        });
    }

    function get(params){
        var promises = [getFacebookShares(params), getTwitterShares(params)];
        return $q.all( promises ).then(function(response){
            var facebookResponse = response[0];
            var twitterResponse = response[1];

            return {
                fb: facebookResponse.shares || 0,
                tw: twitterResponse.count || 0
            };
        });
    }

    this.get = get;
});
