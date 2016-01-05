'use strict';

/**
 * (andres): This mixin contains functions that are to use to deal with
 * logic that can work for news and reviews (entities).
 */

App.service('SocialNetworksSharerMixin', function($window){
    function fb(params){
        $window.open('http://www.facebook.com/sharer.php?' + $.param(params), 'fbPopup','height=300,width=600');
    }

    function tw(params){
        $window.open('https://twitter.com/share?' + $.param(params), 'twPopup','height=300,width=600');
    }

    function gplus(params){
      $window.open('https://plus.google.com/share?' + $.param(params), 'twPopup','height=300,width=600');
    }

    this.fb = fb;
    this.tw = tw;
    this.gplus = gplus;
});
