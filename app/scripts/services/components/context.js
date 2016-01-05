'use strict';

App.service('ContextSrv', function(
    $q,
    ResourcesManagerSrv,
    PubSubSrv,
    FBManagerSrv,
    UsersSrv,
    FollowersSrv,
    JobsSrv,
    LikesSrv,
    NormalizersSrv
){

    var context = {
        data: {},
        loading: false,
        loaded: false
    };

    var safeCallbacksStack = [];

    function notifyLoadComplete(){
        PubSubSrv.publish('context.loaded');

        _.each(safeCallbacksStack, function(callback){
            callback.fn();
            callback.deferred.resolve();
        });

        safeCallbacksStack = [];
    }

    function loadFollowedAgencies(data){
        return FollowersSrv.query({
            email: data.profile.email
        }).then(function(response){
            data.profile.followedAgencies = response;

            return response;
        });
    }

    function loadUserLikes(data){
        return LikesSrv.query({
            email: data.profile.email
        }).then(function(response){
            var likes = [];
            var dislikes = [];

            _.each(response, function(item){
                var arr = item.positive ? likes : dislikes;
                arr.push(item);
            });

            data.profile.likes = likes;
            data.profile.dislikes = dislikes;

            return response;
        });
    }

    /**
     * # loadContext process
     * 1. load local files (app/data/*.json)
     * 2. get profile from FB
     * 3. When all previuos requests are complete
     *     3.1 Set some flags and save data
     *     3.2 If we don't have a profile from FB, send the context.loaded event and return
     *     3.3 If we do have a profile from FB
     *         3.3.1 Get the user profile from our database
     *         3.3.2 Get the list of follow agencies by this user and add it to the profile
     *         3.3.3 Merge FB and our profile, send the context.loaded event and return
     *         3.3.4 In case we don't have a profile user in our database (we always should),
     *               let's create it.
     *         3.4.5 Merge FB and our profile, send the context.loaded event and return
     *  4. Get job positions
     *  5. Get the likes/dislikes the user made to reviews and news
     */

    function loadContext(){
        var promises = [];
        var data = {};

        context.loading = true;

        // 1. get banners data
        var bannersDataResource = ResourcesManagerSrv.createLocal('banners');

        promises.push(bannersDataResource.get().$promise.then(function(response){
            data.banners = response;
            return response;
        }));

        promises.push( FBManagerSrv.getProfile().then(function(response){
            data.profile = NormalizersSrv.profileFromVendor(response, 'fb');
            data.loggedIn = !!response;

            if( data.loggedIn ){
                var followedAgencies = loadFollowedAgencies(data);
                var likes = loadUserLikes(data);

                return $q.all(followedAgencies, likes);
            }

            return response;
        }) );

        promises.push( JobsSrv.query().then(function(response){
            data.jobs = response;
            return response;
        }) );

        return $q.all(promises).then(function(){
            _.extend(context.data, data);
            context.loading = false;
            context.loaded = true;

            // if the user is not logged in on FB, there is nothing more we need to do here
            if( !context.data.loggedIn ){
                notifyLoadComplete();
                return context;
            }

            var userEmail = context.data.profile.email;
            // if the user is logged in on FB, we need to get his profile from our database
            return UsersSrv.get({email: userEmail}).then(function(user){
                // this user has already a record in our database
                if( user ){
                    user = NormalizersSrv.profile(user);
                    context.data.profile = _.extend({}, context.data.profile, user);

                    // HACK.
                    // The backend is sending the email as empty in this request, so we restore it
                    // using the one facebook sent us.
                    if( !context.data.profile.email ){
                      context.data.profile.email = userEmail;
                    }

                    notifyLoadComplete();
                    return context;
                }

                // we need to create a records for this user in out database
                // before we allow him to continue
                if( !user ){
                    UsersSrv.create({
                        profile: context.data.profile
                    }).then(function(success){

                        if( success ){
                            context.data.profile = _.extend({}, context.data.profile, user);
                            notifyLoadComplete();
                            return context;
                        }

                        if( !success ){
                            // TODO: Handle user creation error
                            notifyLoadComplete();
                            return context;
                        }
                    });
                }
            });

        });
    }

    function getData(key){
        if( !key || !_.isString(key) ){
            return context.data;
        }

        if( !_.isUndefined(context.data[key]) && !_.isNull(context.data[key]) ){
            return context.data[key];
        }

        throw 'ContextSrv:get - key \''+key+'\' not identified';
    }

    function update(key, newData){
        if( !key || !_.isString(key) ){ return; }

        if( !_.isUndefined(context.data[key]) && !_.isNull(context.data[key]) ){
            context.data[key] = newData;
            return newData;
        }

        throw 'ContextSrv:get - key \''+key+'\' not identified';
    }

    function isLoading(){
        return context.loading;
    }

    function isLoadComplete(){
        return context.loaded;
    }

    // executes a callbakc in a safe way, making sure the context is loaded already
    function safe(callback){
        var deferred = $q.defer();

        callback = _.isFunction(callback) ? callback : function(){};

        if( context.loaded ){
            callback();
            deferred.resolve();
        }else{
            safeCallbacksStack.push({
                fn: callback,
                deferred: deferred
            });
        }

        return deferred.promise;
    }

    this.fetch = loadContext;
    this.get = getData;
    this.update = update;
    this.safe = safe;
    this.isLoading = isLoading;
    this.isLoadComplete = isLoadComplete;
});
