angular.module('signalapp.directives')
  .directive('scrollnav', ['$window', '$timeout',
    function($window, $timeout){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          // angular.element($window).bind('scroll', function(){
          //   //
          // });
        }
      };
    }
  ])
;