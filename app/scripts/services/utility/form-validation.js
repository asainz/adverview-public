'use strict';

App.service('FormValidationSrv', function(RegExpSrv){
    var defaults = {
        required: true,
        maxlength: 400,
        minlength: 4,
        type: 'text',
        pattern: RegExpSrv.fullAlpha,
        minWords: null,
        maxWords: null
    };

    function getDefaultOptions(){
        return defaults;
    }

    this.getDefaultOptions = getDefaultOptions;
});