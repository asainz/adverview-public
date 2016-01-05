'use strict';

App.service('SelectListSrv', function($q, PubSubSrv){
    var deferred;
    function show(params){
        PubSubSrv.publish('selectList.show', params);

        deferred = $q.defer();
        return deferred.promise;
    }

    PubSubSrv.suscribe('selectList.hide', function(params){
        deferred.resolve(params);
    });

    this.show = show;
});