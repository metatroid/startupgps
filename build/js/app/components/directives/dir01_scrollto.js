angular.module('signalapp.directives')
  .directive('scrollto', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          var targetElement;
          
          $element.on('click', function(e){
            e.preventDefault();
            this.blur();
            var targetEl = $attrs.scrollto;

            targetElement = document.querySelectorAll(targetEl)[0];
            if(!targetElement) return; 

            smoothScroll(targetElement, {offset: $attrs.scrolloffset});

            return false;
          });
        }
      };
    }
  )
;