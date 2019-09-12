angular.module('signalapp.services')
  .factory('apiSrv', ['$http', 
    function($http){
      var apiSrv = {};
      apiSrv.request = function(method, url, args, successFn, errorFn){
        return $http({
          method: method,
          url: '/api/' + url,
          data: JSON.stringify(args)
        }).success(successFn).error(errorFn);
      };
      apiSrv.getResources = function(args, successFn, errorFn){
        return $http({
          method: 'GET',
          url: 'https://n8aqqjt48j.execute-api.us-west-2.amazonaws.com/prod/v1/resources',
          headers: {
            'X-Api-Key': 'CfeEiAD3y81CbWPC5mC9Ba6BS1f29ENg0jnsIxT3'
          },
          params: args
        }).success(successFn).error(errorFn);
      };
      apiSrv.vote = function(args, successFn, errorFn){
        return $http({
          method: 'post',
          url: 'https://n8aqqjt48j.execute-api.us-west-2.amazonaws.com/prod/v1/resources',
          headers: {
            'X-Api-Key': 'CfeEiAD3y81CbWPC5mC9Ba6BS1f29ENg0jnsIxT3'
          },
          params: {vote: args.vote, id: args.id}
        }).success(successFn).error(errorFn);
      };
      apiSrv.generateImg = function(code, successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/api/gen-img/'+code,
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;