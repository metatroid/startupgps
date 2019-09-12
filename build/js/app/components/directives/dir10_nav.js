angular.module('signalapp.directives')
  .directive('navToggle', 
    function(){
      return {
        restrict: 'EA',
        link: function($scope, $element, $attrs){
          $element.on('click', function(e){
            e.preventDefault();
            var btn = $element[0],
                nav = document.getElementById('main-nav'),
                header = document.getElementById('header');
            if(btn.classList.contains('collapsed')){
              btn.classList.remove('collapsed');
              nav.classList.add('in');
              header.classList.add('menu-open');
            } else {
              btn.classList.add('collapsed');
              nav.classList.remove('in');
              header.classList.remove('menu-open');
            }
          });
        }
      };
    }
  )
;