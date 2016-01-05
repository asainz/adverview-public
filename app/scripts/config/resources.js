'use strict';

App.constant('LOCAL_RESOURCES_CONFIG', {
    // since this files will be served locally and relatively to where the app
    // is running, we don't need to set a host
    URLS: {
        AGENCIES_CATEGORIES: 'data/agencies-categories.json',
        ALL_REVIEWS_FILTERS_OPTIONS: 'data/all-reviews-filters-options.json',
        BANNERS: 'data/banners.json'
    }
});
