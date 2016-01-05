'use strict';

App.controller('AddReviewCtrl', function(
    $scope,
    PubSubSrv,
    DialogSrv,
    NavigationSrv,
    PathsManagerSrv,
    ReviewsSrv,
    ContextSrv,
    NotificationsSrv,
    HeaderSrv,
    COPY,
    LENGTH_CONFIG,
    MetadataSrv
){
    function handleCreationError(msg){
        NotificationsSrv.add(msg);
    }

    PubSubSrv.suscribe('detailsPageCommon.dataLoaded', function(data){
        $scope.agency = data.details;
        $scope.agency.bannerBackground = 'images/banners/map.jpg';

        var metaTitle = MetadataSrv.getSEO().title.replace('{AGENCY_NAME}', $scope.agency.name);

        MetadataSrv.setSEO({
            title: metaTitle
        });

        MetadataSrv.setOG({
            title: metaTitle
        });
    });
    
    $scope.model = {
        overallScore: {
            label: COPY.FORM_LABELS.REVIEW_OVERALL_SCORE,
            value: '',
            name: 'overallScore',
            options: {
                from: 1,
                to: 10,
                mode: 'score'
            }
        },
        title: {
            label: COPY.FORM_LABELS.REVIEW_TITLE,
            value: '',
            name: 'title',
            placeholder: COPY.FORM_LABELS.REVIEW_TITLE_PLACEHOLDER,
            validations: {
                maxlength: LENGTH_CONFIG.REVIEW_TITLE_MAX,
                minlength: LENGTH_CONFIG.REVIEW_TITLE_MIN
            }
        },
        description: {
            label: COPY.FORM_LABELS.REVIEW_DESCRIPTION,
            value: '',
            name: 'description',
            placeholder: COPY.FORM_LABELS.REVIEW_DESCRIPTION_PLACEHOLDER,
            validations: {
                minWords: LENGTH_CONFIG.REVIEW_MIN_WORDS,
                maxlength: LENGTH_CONFIG.REVIEW_DESCRIPTION
            }
        },
        currentlyEmployed: {
            label: COPY.FORM_LABELS.CURRENTLY_EMPLOYED,
            name: 'currentlyEmployed',
            value: undefined,
            options: [
                COPY.FORM_DATA.CURRENTLY_EMPLOYED.YES, COPY.FORM_DATA.CURRENTLY_EMPLOYED.NO
            ]
        },
        currentJobPosition: {
            label: COPY.FORM_LABELS.CURRENT_JOB_POSITION,
            name: 'currentJobPosition',
            value: '',
            options: _.map(ContextSrv.get('jobs'), function(job){
                return job.job;
            })
        },
        currentSeniority: {
            label: COPY.FORM_LABELS.CURRENT_SENIORITY,
            name: 'currentSeniority',
            value: '',
            options: [
                COPY.FORM_DATA.SENIORITY.JUNIOR,
                COPY.FORM_DATA.SENIORITY.SEMI_SENIOR,
                COPY.FORM_DATA.SENIORITY.SENIOR
            ]
        },
        submit: {
            label: COPY.FORM_LABELS.SUBMIT_REVIEW
        }
    };

    $scope.submit = function(done){
        var errorMessage = COPY.NOTIFICATIONS.COULD_NOT_ADD_REVIEW;
        var idJob = _.findWhere(ContextSrv.get('jobs'), { job: $scope.model.currentJobPosition.value }).idJob;
        var currentlyEmployed = $scope.model.currentlyEmployed.value === COPY.FORM_DATA.CURRENTLY_EMPLOYED.YES;

        ReviewsSrv.save({
            idAgency: $scope.agency.idAgency,
            email: ContextSrv.get('profile').email,
            title: $scope.model.title.value,
            content: $scope.model.description.value,
            overallScore: $scope.model.overallScore.value,
            idJob: idJob,
            currentlyEmployed: currentlyEmployed,
            currentJobPosition: $scope.model.currentJobPosition.value,
            currentSeniority: $scope.model.currentSeniority.value
        }).then(function(response){
            done();

            if( response && response.idReview ){
                // clear everything to avoid sending the same form more thatn once
                _.each($scope.model, function(model){
                    model.value = '';
                });

                DialogSrv.show({
                    title: COPY.DIALOG.REVIEW_ENTERED.TITLE,
                    content: COPY.DIALOG.REVIEW_ENTERED.CONTENT
                }).then(function(){
                    NavigationSrv.go(PathsManagerSrv.getPath('agencies'));
                });
            }else{
                handleCreationError(errorMessage);
            }
        }, function(){
            handleCreationError(errorMessage);

            done();
        });
    };

    HeaderSrv.setBackArrow();

});