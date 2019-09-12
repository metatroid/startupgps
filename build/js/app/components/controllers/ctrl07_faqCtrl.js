angular.module('signalapp.controllers')
  .controller('faqCtrl', ['$scope', 
                            '$rootScope',
                           '$state', 
                           '$log',
                           '$sce',
                           'apiSrv',
                           '$http',
    function($scope, $rootScope, $state, $log, $sce, apiSrv, $http){
      $scope.faqs = [];
      $scope.searchFilter = {filter: 'all'};
      //
      function faqHandler(data){
        if(data.data){
          $scope.faqs = data.data;
        } else {
          $scope.faqs = data;
        }
      }
      //
      apiSrv.request('GET', 'faqs', {}, faqHandler, function(err){
        $log.error(err);
      });
      //
      $scope.searchFaq = function(terms){
        $http({
          method: 'POST',
          url: '/api/search/faqs/',
          data: terms
        }).then(faqHandler, function(err){
          $log.error(err);
        });
      };
      //
      $scope.selectFaq = function(faq){
        //
      };
      //
      if($rootScope.$stateParams && $rootScope.$stateParams.index){
        var faqIndex = $rootScope.$stateParams.index;
        waitForEl(".faq-nav-list li", function(){
          var faqQuestion = document.querySelectorAll('.faq-nav-list li')[faqIndex].querySelector('a').getAttribute('search-filter');
          $scope.searchFilter.filter = faqQuestion;
        });
      }
    }
  ])
;