angular.module('signalapp.directives')
  .directive('resourcesort', ['$timeout',
    function($timeout){
      return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs){
          angular.element($element).on('click', function(e){
            $timeout(function(){$scope.$apply(function(){
              var topic = ($attrs.resourcesort === 'Models & Metrics') ? 'Metrics' : $attrs.resourcesort,
                  target = document.querySelector("#"+topic+"_include ."+topic+"-resources ."+topic+"_resources"),
                  container = document.querySelector("#"+topic+"_include ."+topic+"-resources .col-xs-12"),
                  childLength = container.children.length;
              for(var i=0;i<childLength;i++){
                if(target.previousElementSibling){
                  if(target.previousElementSibling.classList.toString().indexOf("saved-resources") === -1){
                    container.appendChild(target.previousElementSibling);
                  }
                } else {
                  break;
                }
              }
              $scope.showAllResourcesFor = (topic === 'Models & Metrics') ? 'Metrics' : topic;
              return false;
            });});
          });
        }
      };
    }]
  )
;