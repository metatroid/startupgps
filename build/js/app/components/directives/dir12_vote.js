angular.module('signalapp.directives')
  .directive('vote', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          $element.on('click', function(e){
            var id = $element[0].getAttribute('data-resource_id'),
                dir = $attrs.vote;
            var voteData = {vote: dir};
            var request = new XMLHttpRequest();
            request.open('GET', 'https://n8aqqjt48j.execute-api.us-west-2.amazonaws.com/api/v1/resources/'+id+'/vote?vote='+dir, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.onreadystatechange = function () {
              if (request.readyState == 4) {
                console.log(request.responseText);
              }
            };
            request.send(voteData);
          });
        }
      };
    }
  )
;