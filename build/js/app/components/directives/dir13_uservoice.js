angular.module('signalapp.directives')
  .directive('uvTarget', function () {
      return {
          restrict: 'A',
          link: function (scope, element, attr) {
            UserVoice=window.UserVoice||[];
            (function(){
              var uv=document.createElement('script');
              uv.type='text/javascript';
              uv.async=true;
              uv.src='//widget.uservoice.com/UPGlP3H9aDhP907Urex5Q.js';
              var s=document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(uv,s);
            })();
            UserVoice.push(['set', {
              target: '#thoughts',
              accent_color: '#6aba2e',
              strings: {
                post_suggestion_title: 'Send us a message'
              }
            }]);
            UserVoice.push(['autoprompt', {}]);
          }
      };
  })
;