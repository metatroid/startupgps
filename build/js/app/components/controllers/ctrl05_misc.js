angular.module('signalapp.controllers')
  .controller('miscCtrl', ['$rootScope','$scope','$log', 
    function($rootScope,$scope,$log){
      var bodyClass = $rootScope.$state.current.name;
      document.body.className = bodyClass;
    }
  ])
;