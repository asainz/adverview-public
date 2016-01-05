'use strict';

App.service('MetadataSrv', function($window){
    var current = {
        seo: {},
        og: {}
    };

    var ogProperties = ['title', 'description', 'url', 'image'];
    var seoProperties = ['title', 'description'];

    function setDefaultValues(){
        _.each(ogProperties, function(prop){
            current.og[prop] = '';
        });

        _.each(seoProperties, function(prop){
            current.seo[prop] = '';
        });
    }

    function setOG(data){
        _.each(ogProperties, function(prop){
            if( data[prop] && current.og[prop] !== data[prop]){
                current.og[prop] = data[prop];

                var methodName = prop + 'Og';

                $window.META_DATA[methodName].call(this, data[prop]);
            }
        });
    }

    function setSEO(data){
        _.each(seoProperties, function(prop){
            if( data[prop] && current.seo[prop] !== data[prop]){
                current.seo[prop] = data[prop];

                var methodName = prop;

                $window.META_DATA[methodName].call(this, data[prop]);
            }
        });
    }

    function getSEO(){
        return current.seo;
    }

    function getOG(){
        return current.og;
    }

    setDefaultValues();

    this.setOG = setOG;
    this.getOG = getOG;
    this.getSEO = getSEO;
    this.setSEO = setSEO;

});
