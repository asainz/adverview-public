'use strict';

App.controller('AddAgenciesCtrl', function(
    $scope,
    ContextSrv,
    AgenciesSrv,
    DialogSrv,
    NavigationSrv,
    PathsManagerSrv,
    NotificationsSrv,
    HeaderSrv,
    AgenciesCategoriesSrv,
    RegExpSrv,
    COPY,
    LENGTH_CONFIG,
    NormalizersSrv
){
    function handleCreationError(msg){
        NotificationsSrv.add(msg);
    }

    function isTypeSelected(type){
        var option = _.findWhere($scope.model.type.value, {value: type});

        if( _.isEmpty(option) ){
            return false;
        }

        return option.selected;
    }

    $scope.model = {
        agencyName: {
            label: '',
            value: '',
            name: 'agencyName',
            placeholder: COPY.FORM_LABELS.AGENCY_NAME,
            validations: {
                maxlength: LENGTH_CONFIG.AGENCY_NAME_MAX
            }
        },
        web: {
            label: '',
            value: '',
            name: 'web',
            placeholder: COPY.FORM_LABELS.AGENCY_WEB,
            validations: {
                maxlength: 60,
                pattern: RegExpSrv.web
            }
        },
        type: {
            label: '',
            value: '',
            name: 'type',
            options: [],
            validations: {}
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
            label: COPY.FORM_LABELS.SUBMIT_AGENCY
        }
    };

    $scope.goToAgency = function(){
        var agency;
        AgenciesSrv.fetch().then(function(agencies){
            _.each(agencies, function(_agency){
                if( _agency.name.toLowerCase() === $scope.model.agencyName.value.toLowerCase() ){
                    agency = _agency;
                }
            });

            if( agency ){
                NavigationSrv.go(PathsManagerSrv.getPath('agency'), {
                    idAgency: agency.idAgency,
                    aliasAgency: agency.alias
                });
            }
        });
    };

    $scope.submit = function(done){
        var errorMessage = COPY.NOTIFICATIONS.COULD_NOT_ADD_AGENCY;
        var idJob = _.findWhere(ContextSrv.get('jobs'), { job: $scope.model.currentJobPosition.value }).idJob;
        var currentlyEmployed = $scope.model.currentlyEmployed.value === COPY.FORM_DATA.CURRENTLY_EMPLOYED.YES;

        var params = {
            emailUser: ContextSrv.get('profile').email,
            name: $scope.model.agencyName.value,
            web: NormalizersSrv.weburl($scope.model.web.value),
            address: '',
            location: '',
            town: '',
            latitude: '',
            longitude: '',
            province: '',
            idJob: idJob,
            currentlyEmployed: currentlyEmployed,
            currentJobPosition: $scope.model.currentJobPosition.value,
            currentSeniority: $scope.model.currentSeniority.value
        };

        // iterate over all the agencies types and set the selected state for every one
        _.each($scope.model.type.options, function(value){
            params[value] = isTypeSelected(value);
        });

        AgenciesSrv.save(params).then(function(response){
            done();

            if( response && response.idAgency ){
                // clear everything to avoid sending the same form more thatn once
                _.each($scope.model, function(model){
                    model.value = '';
                });

                DialogSrv.show({
                    title: COPY.DIALOG.AGENCY_ENTERED.TITLE,
                    content: COPY.DIALOG.AGENCY_ENTERED.CONTENT
                }).then(function(){
                    NavigationSrv.go(PathsManagerSrv.getPath('agencies'));
                });
            }else{
                if( response.error === 'agency-already-exists' ){
                    errorMessage = COPY.NOTIFICATIONS.AGENCY_ALREADY_EXISTS;
                    $scope.isAgencyAlreadyAdded = true;
                }

                handleCreationError(errorMessage);
            }
        }, function(){
            handleCreationError(errorMessage);
            done();
        });
    };

    AgenciesCategoriesSrv.query().then(function(response){
        var categories = _.map(response, function(category){
            if( category.selectable ){
                return category.alias;
            }
        });

        $scope.model.type.options = _.compact(categories);
    });

    ContextSrv.safe(function(){
        $scope.bannerData = ContextSrv.get('banners').addAgency;
    });

    HeaderSrv.setBackArrow();
});