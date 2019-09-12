angular.module('signalapp.directives')
  .directive('scrollfix', ['$window', '$timeout',
    function($window, $timeout){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          var offset = $attrs.scrollfix,
              initial = angular.element($element)[0].offsetTop - offset;
          $timeout(function(){initial = angular.element($element)[0].offsetTop - offset;}, 500);
          if(offset === 0 || offset === '0'){
            angular.element($window).bind('scroll', function(){
              if(angular.element($element)[0].getBoundingClientRect().top <= 0){
                document.querySelector('body').classList.add('fix-element');
              }
              if($window.pageYOffset <= initial){
                document.querySelector('body').classList.remove('fix-element');
              }
            });
          } else {
            var triggerY = 0;
            angular.element($window).bind('scroll', function(){
              if(angular.element($element)[0].getBoundingClientRect().top <= offset){
                angular.element($element)[0].classList.add('fix-position');
                if(triggerY===0){
                  triggerY = $window.pageYOffset;
                }
              }
              if(triggerY !== 0 && $window.pageYOffset < triggerY){
                angular.element($element)[0].classList.remove('fix-position');
              }
            });
          }
        }
      };
    }
  ])
;