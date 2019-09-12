angular.module('signalapp.controllers')
  .controller('aboutCtrl', ['$scope', 
                           '$state', 
                           '$log',
                           '$sce',
                           'apiSrv',
    function($scope, $state, $log, $sce, apiSrv){
      $scope.supporters = [];
      $scope.collaborators = [];
      $scope.partners = [];
      function supporterHandler(data){
        data.forEach(function(item, index){
          if(item.link){
            item.linkUrl = (item.link.substr(0,7) === 'http://') ? item.link : "http://"+item.link;
            item.linkText = (item.link.substr(0,7) !== 'http://') ? item.link : item.link.replace("http://", "");
          }
          if(item.supporter_type === 'supporter'){
            $scope.supporters.push(item);
          } else if(item.supporter_type === 'collaborator'){
            $scope.collaborators.push(item);
          } else {
            $scope.partners.push(item);
          }
        });
      }
      apiSrv.request('GET', 'supporters', {}, supporterHandler, function(err){
        $log.error(err);
      });
    }
  ])
;