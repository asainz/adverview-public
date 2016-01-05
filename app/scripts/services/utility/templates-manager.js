'use strict';

App.provider('TemplatesManagerSrv', function(TEMPLATES_URLS){
    var isMobile =  navigator.userAgent.match(/iPhone|Pad|Android/);

    function get(key){
      return TEMPLATES_URLS[key];
    }

    function getUrl(key){
        var value = get(key).url;

        if( !_.isObject(value) ){
            return value;
        }

        if( isMobile ){
            return value.mobile;
        }

        return value.desktop;
    }

    function lookup(url){
      var target = {};

      if(!url){
          return target;
      }

      if( url.substr(0,1) === '/' ){
        url = url.substr(1);
      }

      _.each(TEMPLATES_URLS, function(obj, key){
        if( get(key).url === url ){
          target = obj;
        }
      });

      return target;
    }

    this.getUrl = getUrl;
    this.lookup = lookup;

    this.$get = [function(){
        return {
            getUrl: getUrl,
            lookup: lookup
        };
    }];
});
