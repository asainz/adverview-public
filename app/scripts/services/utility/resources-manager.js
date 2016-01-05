'use strict';

App.service('ResourcesManagerSrv', function($resource, ENVIRONMENT_CONFIG, LOCAL_RESOURCES_CONFIG){
    function APIException(resource){
        this.message = 'Resource API not found';
        this.resource = resource;
        this.name = 'APIException';
    }

    function createLocal(key){
        var url = LOCAL_RESOURCES_CONFIG.URLS[key.toUpperCase()];

        if( !url ){
            throw new APIException(key);
        }

        return $resource( url );
    }

    function create(key, params){
        var url = ENVIRONMENT_CONFIG.BACKEND_HOST;

        params = params || {};
        params.obj = key;

        return $resource( url, params, {
            query: {
                method: 'GET',
                isArray: false
            }
        } );
    }

    function createPost(key, params){
        var url = ENVIRONMENT_CONFIG.BACKEND_HOST;

        params = params || {};

        return $resource( url, params, {
            save: {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    return $.param(obj);
                }
            }
        } );
    }

    this.create = create;
    this.createPost = createPost;
    this.createLocal = createLocal;
});