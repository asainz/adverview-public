'use strict';

App.controller('AgenciesCtrl', function(
    $scope,
    TemplatesManagerSrv,
    AgenciesSrv,
    PubSubSrv,
    SelectListSrv,
    FiltersManagerSrv,
    NavigationSrv,
    ContextSrv,
    PathsManagerSrv,
    ReviewsSrv,
    AgenciesCategoriesSrv
){
    var filtersManagerSrv = FiltersManagerSrv.getInstance('agencies', AgenciesCategoriesSrv);

    function updateSelectedFilterInScope(){
        $scope.selectedFilterOption = filtersManagerSrv.getSelected().name;
    }

    $scope.searchText = '';

    var agencies;
    $scope.agenciesForSuggestion = [];

    AgenciesSrv.fetch().then(function(response){
        agencies = response;
        $scope.agenciesForSuggestion = _.map(response, function(agencie){
            return agencie.name;
        });
    });

    $scope.$on('autocomplete.suggestions.on', function(){
        PubSubSrv.publish('screenBlocker.change', {show: true});
    });

    $scope.$on('autocomplete.suggestions.off', function(){
        PubSubSrv.publish('screenBlocker.change', {show: false});
    });

    $scope.handleNewSearchOptionSelected = function(selectedOption){
        var agency = _.findWhere(agencies, {name: selectedOption});

        NavigationSrv.go(PathsManagerSrv.getPath('agency'), {
            idAgency: agency.idAgency,
            aliasAgency: agency.alias
        });
    };

    $scope.showFilterOptions = function(){
        SelectListSrv.show({
            options: filtersManagerSrv.getAll(),
            selected: filtersManagerSrv.getSelected().index
        }).then(function(selected){
            filtersManagerSrv.select(selected.index);
            updateSelectedFilterInScope();
        });
    };

    $scope.goToAllReviews = function(){
        NavigationSrv.go(PathsManagerSrv.getPath('reviews'));
    };

    $scope.agenciesContentPartial = TemplatesManagerSrv.getUrl('agencies-list');

    filtersManagerSrv.query().then(function(){
        updateSelectedFilterInScope();

        // (andres):The first time this controller is executed, getSelected() will
        // return an empty object since the user didn't select a option yet,
        // so we force select the first one.
        // If the user goes to a another page and comes back, we will have already a selected
        // option, so we don't want to force select anyhitng. We will keep using the one that's
        // already selected.
        if( _.isEmpty(filtersManagerSrv.getSelected()) ){
            filtersManagerSrv.select(0);
        }
    });

    ContextSrv.safe(function(){
        $scope.bannerBackgroundImage = ContextSrv.get('banners').agencies.background;
    });


    ReviewsSrv.count().then(function(totalReviews){
        $scope.totalReviews = totalReviews;
    });
});
