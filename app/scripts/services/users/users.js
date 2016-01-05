'use strict';

App.service('UsersSrv', function(
    ResourcesManagerSrv
){
    var createUserResource = ResourcesManagerSrv.createPost('users');
    var userResource = ResourcesManagerSrv.create('users');

    this.get = function(params){
        return userResource.get({
            act: 'get',
            email: params.email
        }).$promise.then(function(response){
            var records = response.records || [];

            if( records.length === 0 ){
                return null;
            }

            return records[0];
        });
    };

    this.create = function(params){
        var profile = params.profile;
        return createUserResource.save({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            facebookid: profile.id,
            loginService: profile.loginService,
            workOnFB: profile.workOnFB,
            act: 'add',
            obj: 'users'
        }).$promise.then(function(){
            return {success: true};
        }, function(response){
            return {success: false, error: response};
        });
    };
});