'use strict';

App.service('HeaderSrv', function(PubSubSrv){
    // HeaderSrv.setBackArrow({
    //     destination: {
    //         path: 'agencies/:id',
    //         params: {
    //             id: 2
    //         }
    //     }
    // });
    function setBackArrow(params){
        PubSubSrv.publish('header.setBackArrow', params);
    }

    function hideBackArrow(){
        PubSubSrv.publish('header.hideBackArrow');
    }

    this.setBackArrow = setBackArrow;
    this.hideBackArrow = hideBackArrow;
});