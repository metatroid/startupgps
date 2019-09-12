angular.module('signalapp.directives')
  .directive('labelFake', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          $element.on('click', function(e){
            var inpt = $element[0].querySelector('input');
            if(e.target.tagName.toLowerCase() !== 'label'){
              inpt.click();
            }
          });
        }
      };
    }
  )
;