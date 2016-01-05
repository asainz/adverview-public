'use strict';

App.controller('AddSalaryCtrl', function(
    $scope,
    $location,
    ContextSrv,
    AgenciesSrv,
    CurrencySrv,
    HeaderSrv,
    SalariesSrv,
    NotificationsSrv,
    DialogSrv,
    NavigationSrv,
    PathsManagerSrv,
    COPY,
    RegExpSrv,
    SalariesRangeSrv
){

    function handleCreationError(msg){
        NotificationsSrv.add(msg);
    }

    function saveSalary(params){
        var errorMessage = COPY.NOTIFICATIONS.COULD_NOT_ADD_SALARY;
        return SalariesSrv.save(params).then(function(response){
            if( response && response.idSalary ){
                // clear everything to avoid sending the same form more thatn once
                _.each($scope.model, function(model){
                    model.value = '';
                });

                // update the context with the entered salary
                // so the user can continue to view the average salaries
                var profile = ContextSrv.get('profile');
                profile.hasEnteredSalary = true;
                ContextSrv.update('profile', profile);

                DialogSrv.show({
                    title: COPY.DIALOG.SALARY_ENTERED.TITLE,
                    content: COPY.DIALOG.SALARY_ENTERED.CONTENT
                }).then(function(){
                    if( !$location.search().query || !_.isString($location.search().query) ){
                        NavigationSrv.go(PathsManagerSrv.getPath('salaries'));
                        return true;
                    }

                    var data = JSON.parse( $location.search().query );
                    var isPathValid = PathsManagerSrv.validate(data.path);

                    if( isPathValid && _.isObject(data.params) ){
                        NavigationSrv.go(data.path, data.params, {replace: true});
                    }
                });
                return true;
            }else{
                handleCreationError(errorMessage);
                return false;
            }
        });
    }

    $scope.model = {
        salary: {
            label: COPY.FORM_LABELS.SALARY,
            value: '',
            name: 'salary',
            validations:{
                required: true,
                minlength: 1,
                maxlength: 24,
                type: 'number',
                pattern: RegExpSrv.number
            }
        },
        agencyName: {
            label: COPY.FORM_LABELS.AGENCY_NAME,
            name: 'agencyName',
            value: undefined,
            options: [
                'asd', 'assd'
            ]
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
        currency: {
            label: COPY.FORM_LABELS.CURRENCY,
            name: 'currency',
            value: undefined,
            options: [
                'arg peso', 'dolar'
            ]
        },
        submit: {
            label: COPY.FORM_LABELS.SUBMIT_SALARY
        }
    };

    $scope.handleNewSearchOptionSelected = function(selectedOption){
        console.log(selectedOption + ' selected.');
    };

    $scope.submit = function(done){
        var selectedAgency = _.findWhere($scope.allAgencies, { name: $scope.model.agencyName.value });
        var idAgency;

        if( selectedAgency ){
            idAgency = selectedAgency.idAgency;
        }else{
            NotificationsSrv.add(COPY.NOTIFICATIONS.AGENCY_NAME_NOT_VALID);
            done();
            return;
        }

        var idJob = _.findWhere(ContextSrv.get('jobs'), { job: $scope.model.currentJobPosition.value }).idJob;
        var currentlyEmployed = $scope.model.currentlyEmployed.value === COPY.FORM_DATA.CURRENTLY_EMPLOYED.YES;
        var idCurrency = _.findWhere($scope.allCurrencies, { currency: $scope.model.currency.value }).idCurrency;

        var params = {
            email: ContextSrv.get('profile').email,
            idAgency: idAgency,
            idJob: idJob,
            income: $scope.model.salary.value,
            currentSeniority: $scope.model.currentSeniority.value,
            seniority: $scope.model.currentSeniority.value,
            currentJobPosition: $scope.model.currentJobPosition.value,
            currentlyEmployed: currentlyEmployed,
            idCurrency: idCurrency
        };

        SalariesRangeSrv.query({
            idJob: idJob,
            seniority: $scope.model.currentSeniority.value.toLowerCase()
        }).then(function(range){
            var salary = $scope.model.salary.value;

            if( salary < range.lowerLimit || salary > range.upperLimit ){
                NotificationsSrv.add(COPY.NOTIFICATIONS.SALARY_OUT_OF_RANGE.replace('{LOWER_LIMIT}', range.lowerLimit).replace('{UPPER_LIMIT}', range.upperLimit));

                done();
                return;
            }

            saveSalary(params).then(done);
        });
    };

    ContextSrv.safe(function(){
        $scope.bannerData = ContextSrv.get('banners').addSalary;
    });

    CurrencySrv.fetch().then(function(response){
        $scope.allCurrencies = response;
        $scope.model.currency.options = _.map(response, function(item){
            return item.currency;
        });
    });

    AgenciesSrv.fetch().then(function(response){
        $scope.allAgencies = response;

        $scope.agenciesForSuggestion = _.map(response, function(agencie){
            return agencie.name;
        });
    });

    HeaderSrv.setBackArrow({
      destination: {
        path: PathsManagerSrv.getPath('salaries')
      }
    });
});
