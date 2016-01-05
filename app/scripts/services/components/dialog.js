'use strict';

App.service('DialogSrv', function($q, PubSubSrv){
    var deferred;
    var dialogVisible = false;

    function show(params){
        // if there is a dialog already in screen, ignore other request
        // to show it
        if( dialogVisible ){ return; }

        dialogVisible = true;
        PubSubSrv.publish('dialog.show', params);

        deferred = $q.defer();
        return deferred.promise;
    }

    PubSubSrv.suscribe('dialog.hide', function(params){
        if( !dialogVisible ){ return; }

        dialogVisible = false;
        deferred.resolve(params);
    });

    this.show = show;
});