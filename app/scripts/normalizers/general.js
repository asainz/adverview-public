'use strict';

App.service('NormalizersSrv', function(
    $filter,
    _str,
    LENGTH_CONFIG,
    RegExpSrv
){

    function slugify(string){
        return _str.slugify(string);
    }

    function agency(record){
        if( record.__normalized ){
            return record;
        }
        record.fullLocation = $filter('join')(', ', record.location, record.country);
        record.totalReviews = record.reviews;
        record.score = {
            overall: Math.round(record.overallScore*10)/10
        };
        record.name = record.name.substr(0, LENGTH_CONFIG.AGENCY_NAME_MAX);
        record.bannerBackground = 'images/banners/map.jpg';
        record.alias = slugify(record.name);

        // remove parameters sent by the backend that were renamed
        delete record.reviews;
        delete record.overallScore;

        record.__normalized = true;

        return record;
    }

    function salary(record){
        record.date = $filter('review-date')(record.dateAdded);

        record.formattedIncome = $filter('salary')(record.income);
        record.formattedAverageSalary = $filter('salary')(record.avgSalary);
        record.formattedMaxSalary = $filter('salary')(record.maxSalary);
        record.formattedMinSalary = $filter('salary')(record.minSalary);

        record.currencyName = record.currency;
        record.currencyPrefix = record.prefix;

        record.alias = slugify(record.currentJobPosition + ' ' + record.currentSeniority);

        // remove parameters sent by the backend that were renamed
        delete record.currency;
        delete record.prefix;

        return record;
    }

    function createAgencyTags(agency){
        var tags = ['atl', 'digital', 'integral', 'media', 'production', 'seo'];

        return _.filter(tags, function(tag){
            return agency[tag];
        });
    }

    function reviewComment(record){
        record.date = $filter('review-date')(record.dateAdded);
        record.alias = slugify(record.title);
        review.aliasAgency = slugify(review.name);
        return record;
    }

    function like(record){
        return record;
    }

    function review(review, options){
        options = options || {};

        if( review.__normalized ){
            return review;
        }

        review.score = {
            overall: review.overallScore
        };

        // if the title contains only numbers, the backend sends it as number type
        review.title = review.title.toString().substr(0, LENGTH_CONFIG.REVIEW_TITLE_MAX);
        review.alias = slugify(review.title);
        review.aliasAgency = slugify(review.name);

        // review.text should be an array, but if it's not,
        // we will normalize it.
        if( !_.isArray(review.content) ){
            review.content = [review.content];
        }

        if( options.cropText ){
            review.requireEllipsis = review.content[0].length > LENGTH_CONFIG.REVIEW_SHORT;
            review.content = [$filter('ellipsis')(review.content[0], LENGTH_CONFIG.REVIEW_SHORT)];
        }

        review.descriptionForSocialNetworks = [$filter('ellipsis')(review.content[0], LENGTH_CONFIG.REVIEW_SHORT)];

        review.totalComments = review.comments;
        review.agencyName = review.name;
        review.currentJobPosition = review.currentJobPosition || 'Fake Position';

        review.isFullLengthText = !options.cropText;
        review.date = $filter('review-date')(review.dateAdded);

        // remove parameters sent by the backend that were renamed
        delete review.overallScore;
        delete review.comments;
        delete review.name;

        review.__normalized = true;

        return review;
    }

    function weburl(originalUrl){
        var normalized = originalUrl;

        if( normalized.indexOf('www') === -1 ){
            normalized = 'www.' + normalized;
        }

        if( normalized.indexOf('http') === -1 ){
            normalized = 'http://' + normalized;
        }

        // after our changes, let's make sure that the url resultant is a valid one, before
        // replacing what the user entered. If the result is not valid, let's stick with what
        // the user entered.
        if( RegExpSrv.web.test(normalized) ){
            return normalized;
        }

        return originalUrl;
    }

    // NOTE(andres): we wil be getting profile from differnet providers (FB, g+)
    // so we may get different names for the same data. We will normalize it before usint it
    function profileFromVendor(record, provider){
        function extractWork(arr){
            if( !arr || arr.length === 0){
                return '';
            }

            var item = arr[0];

            if( !item ){
                return '';
            }

            item.employer = item.employer || {};

            return item.employer.name;
        }

        var profile = {};
        if( !record || _.isEmpty(record) ){
            return profile;
        }

        if( provider === 'fb' ){
            // ignore variables not in camel case, since those are sent by FB in that fashion
            /* jshint ignore:start */
            profile.firstName = record.first_name;
            profile.lastName = record.last_name;
            /* jshint ignore:end */
            profile.name = record.name;
            profile.gender = record.gender;
            profile.email = record.email;
            profile.picture = record.picture;
            profile.locale = record.locale;
            profile.id = record.id;
            profile.loginService = 'facebook';
            profile.link = record.link;
            profile.workOnFB = extractWork(record.work);
        }

        return profile;
    }

    function profile(record){
        record.hasEnteredSalary = record.salaries > 0;

        return record;
    }

    function salaryRange(record){
        return record;
    }

    function currency(record){
        record.normalizedCountry = record.country.toLowerCase();
        return record;
    }

    function news(record){
        record.category = record.category || 'Fake Category';

        record.totalComments = record.comments;

        record.contentShort = _str.unescapeHTML(_str.stripTags(record.content).substr(0, LENGTH_CONFIG.NEWS_SHORT));

        record.alias = slugify(record.title);

        // remove parameters sent by the backend that were renamed
        delete record.comments;

        return record;
    }

    this.agency = agency;
    this.createAgencyTags = createAgencyTags;
    this.review = review;
    this.reviewComment = reviewComment;
    this.like = like;
    this.weburl = weburl;
    this.salary = salary;
    this.profileFromVendor = profileFromVendor;
    this.profile = profile;
    this.salaryRange = salaryRange;
    this.currency = currency;
    this.news = news;
});
