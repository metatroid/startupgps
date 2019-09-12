angular.module('signalapp.directives')
  .directive('searchFilter', ['$timeout', 'msgSrv',
    function($timeout, msgSrv){
      return {
        restrict: 'A',
        scope: true,
        link: function($scope, $element, $attrs){
          angular.element($element).on('click', function(e){
            $timeout(function(){$scope.$apply(function(){
              var filter = $attrs.searchFilter;
              if(typeof $scope.filters === 'undefined'){
                $scope.filters = {};
              }
              if($scope.searchFilter.filter === filter){
                $scope.searchFilter.filter = 'all';
                $scope.filters.resource_action = '';
                $scope.filters.theme = '';
                $scope.filters.topic = '';
              } else {
                $scope.searchFilter.filter = filter;
                $scope.filters.resource_action = filter;
                $scope.filters.theme = '';
                $scope.filters.topic = '';
              }
              msgSrv.emitMsg('loadResources', {offset: 0, reset: true});
              return false;
            });});
          });
        }
      };
    }]
  )
;