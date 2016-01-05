'use strict';

App.provider('PathsManagerSrv', function(PATHS_CONFIG){
    var rootPath = 'agencies';
    var notFound = 'not-found';

    function getPath(key){
        key = key.replace('-', '_').toUpperCase();

        return PATHS_CONFIG[key] || '';
    }

    function getRootPath(){
        return getPath( rootPath );
    }

    function getNotFoundPath(){
        return getPath( notFound );
    }

    this.getPath = getPath;
    this.getRootPath = getRootPath;
    this.getNotFoundPath = getNotFoundPath;

    this.$get = [function(){
        function validate(target){
            var isValid = false;

            _.each(PATHS_CONFIG, function(path){
                if( !isValid && path === target ){
                    isValid = true;
                }
            });

            return isValid;
        }

        return {
            getPath: getPath,
            getRootPath: getRootPath,
            getNotFoundPath: getNotFoundPath,
            validate: validate
        };
    }];
});
