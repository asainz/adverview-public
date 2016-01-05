'use strict';

App.service('NotificationsSrv', function($timeout, PubSubSrv){
    var stack = [];
    var currentlyActive = false;

    function add(content){
        var data = {
            content: content,
            id: _.uniqueId('notification_')
        };
        addToStack(data);
    }

    function addToStack(data){
        if( stack.length === 0 && !currentlyActive ){
            publish(data);
            return;
        }

        stack.push(data);
    }

    function publish(data){
        currentlyActive = true;
        PubSubSrv.publish('notification.add', data);
    }

    PubSubSrv.suscribe('notification.remove', function(){
        currentlyActive = false;
        if( stack.length > 0 ){
            $timeout(function(){
                publish( stack.shift() );
            }, 500);
        }
    });

    this.add = add;
});