'use strict';

App.service('ScreenSrv', function(PubSubSrv){
    var Screen = {
        blocked: false
    };

    function publishNewState(state){
        PubSubSrv.publish('screenLoader.change', {show: state});
    }

    function block(){
        Screen.blocked = true;
        publishNewState(true);
    }

    function unblock(){
        Screen.blocked = false;
        publishNewState(false);
    }

    function isBlocked(){
        return Screen.blocked;
    }

    this.block = block;
    this.unblock = unblock;
    this.isBlocked = isBlocked;
});