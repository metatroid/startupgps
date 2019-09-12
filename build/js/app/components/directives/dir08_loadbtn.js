angular.module('signalapp.directives')
  .directive('loadbtn', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          $element.on('click', function(e){
            $element[0].innerHTML = "<div class='loading'><img src='/static/assets/img/load.svg' alt='Loading'></div>";
          });
        }
      };
    }
  )
;