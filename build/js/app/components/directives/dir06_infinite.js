angular.module('signalapp.directives')
  .directive('infinitescroll', ['$window', '$timeout', 'msgSrv',
    function($window, $timeout, msgSrv){
      return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs){
          var $resContainer = angular.element($element),
              winHeight = window.innerHeight,
              updating = false,
              prevOffset = 0,
              offset = 20,
              resAvail = 1000,
              resCount = 0,
              rLoading = false,
              footEl = document.querySelectorAll('#pagefoot'),
              footHeight = 350;
          if(!footEl.length){
            waitForEl('#pagefoot', function(){footHeight = document.querySelectorAll('#pagefoot')[0].clientHeight;});
          } else {
            footHeight = footEl[0].clientHeight;
          }
          //
          var dataEl = angular.element($element)[0];
          var infScrollHandler = function(){
            var scrollY = winHeight + window.pageYOffset;
            var triggerPoint = document.body.clientHeight-5-footHeight;
            if(scrollY >= triggerPoint){
              offset = $scope.resourceOffset;
              resAvail = $scope.resourceTotal;
              resCount = document.querySelectorAll('.resList li').length;
              if(resAvail > resCount && resCount > 0){
                showLoadingSpinner('#rLoader');
                if(!rLoading){
                  rLoading = true;
                  msgSrv.emitMsg('loadResources', {offset: offset});
                }
                $timeout(function(){
                  if($scope.resourceTotal <= resCount){
                    document.querySelector('#rLoader').innerHTML = "<a onclick='document.querySelector(\"body\").scrollTop = 0;'><span class='fa fa-angle-double-up'></span><span>back to top</span></a>";
                  } else {
                    rLoading = false;
                  }
                  // clearLoadingSpinner('#rLoader');
                }, 1000);
              } else {
                if(document.querySelector('#rLoader') !== null){
                  if(resCount > 0){
                    document.querySelector('#rLoader').innerHTML = "<a onclick='document.querySelector(\"body\").scrollTop = 0;'><span class='fa fa-angle-double-up'></span><span>back to top</span></a>";
                  } else {
                    document.querySelector('#rLoader').innerHTML = "<div class='loading'><img src='/static/assets/img/load.svg' alt='Loading'></div>";
                  }
                }
              }
            }
          };
          //
          angular.element($window).bind('scroll', infScrollHandler);
        }
      };
    }]
  )
;