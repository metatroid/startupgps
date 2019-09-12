angular.module('signalapp.services')
  .factory('msgSrv', ['$rootScope',
    function($rootScope){
      var msgSrv = {};

      msgSrv.finder = {};
      msgSrv.state = true;
      msgSrv.results = [];
      msgSrv.setFinderObj = function(obj){
        this.finder = obj;
      };
      msgSrv.getFinderObj = function(){
        return this.finder;
      };
      msgSrv.setState = function(state){
        this.state = state;
      };
      msgSrv.getState = function(){
        return this.state;
      };
      msgSrv.emitMsg = function(message, data){
        msgSrv.msgArgs = {args: data};
        $rootScope.$broadcast(message);
      };
      msgSrv.setResults = function(data){
        msgSrv.results = data;
      };
      msgSrv.getResults = function(){
        return msgSrv.results;
      };
      
      return msgSrv;
    }
  ])
;