'use strict';

App.service('FiltersManagerSrv', function(
    $q,
    PubSubSrv
){
    function Manager(_resource){
      var resource = _resource;
      var filters;
      var rawData;
      var selected;

      function addFilters(_filters){
          filters = _filters;
      }

      function getAll(){
          return filters;
      }

      function select(_selected){
          selected = _selected;
          PubSubSrv.publish('agenciesFilter.update', {value: filters[selected]});
      }

      function getSelected(){
          if( !_.isNumber(selected) || selected >= filters.length ){
              return {};
          }

          var selectedObj = {};

          _.map(rawData, function(item, index){
              if( item.name === filters[selected] ){
                  selectedObj = item;
                  selectedObj.index = index;
              }
          });

          return selectedObj;
      }

      function query(){
          if( filters && _.isNumber(selected) ){
              return $q.when(true);
          }

          return resource.query().then(function(response){
              rawData = response;

              var categories = _.map(response, function(category){
                  return category.name;
              });
              addFilters(categories);
              select(0);
          });
      }
      return {
        getAll: getAll,
        select: select,
        getSelected: getSelected,
        query: query
      };
    }

    var instances = {};
    this.getInstance = function(key, resource){
      var instance = instances[key];

      if( !instance ){
        instance = new Manager(resource);
        instances[key] = instance;
      }

      return instance;
    };
});
