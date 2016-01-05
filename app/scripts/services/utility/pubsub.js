'use strict';

App.service('PubSubSrv', function(){
    var Events = {};

    function suscribe(name, handler){

        if( !_.isFunction(handler) ){
            return;
        }

        if( !Events[name] ){
            Events[name] = {queue: []};
        }

        var index = Events[name].queue.push( handler ) - 1;

        return function(){
            delete Events[name].queue[index];
        };
    }

    function publish(name, data){
        if( !Events[name] ){
            return;
        }

        var handlerData = data || {};

        _.each(Events[name].queue, function(handler){
            if( _.isFunction(handler) ){
                handler(handlerData);
            }
        });
    }

    function clean(name){
        if( !Events[name] ){
            return;
        }

        Events[name].queue = [];
    }

    this.suscribe = suscribe;
    this.publish = publish;
    this.clean = clean;
});