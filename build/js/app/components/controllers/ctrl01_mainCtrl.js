angular.module('signalapp.controllers')
  .controller('mainCtrl', ['$rootScope',
                           '$scope',
                           '$state', 
                           '$log',
                           '$sce',
                           'apiSrv',
                           'msgSrv',
                           '$http',
                           '$localStorage',
                           '$window',
    function($rootScope, $scope, $state, $log, $sce, apiSrv, msgSrv, $http, $localStorage, $window){
      var resetting = false;
      $scope.htmlSafe = $sce.trustAsHtml;
      $scope.menuOpen = false;
      $scope.filtersOpen = false;
      $scope.finderObj = {};
      $scope.assLoadReady = false;
      $scope.assFeedback = "";
      $scope.pastAssLoad = function(assCode){
        assCode = assCode.toLowerCase();
        apiSrv.request('GET', 'finderobj/'+assCode+'/', {}, function(data){
          // $scope.resetForm();
          $scope.finderCode = assCode;
          $scope.$storage.finderCode = assCode;
          $scope.formData = data;
          $rootScope.formData = data;
          $scope.$storage.formData = data;
          $scope.finderObj.data = data;
          //$scope.assFeedback = "The answers from "+assCode+" have been loaded into Pathfinder. Please complete the assessment <a href='/#/finder'>here</a>.";
          if($state.current.name === 'finder'){
            msgSrv.emitMsg('scrolltopathfinder');
            $state.go($state.current, {}, {reload: true}).then(function(){
              smoothScroll(document.getElementById('pathfinder'), {offset: 100});
            });
          } else {
            msgSrv.emitMsg('scrolltopathfinder');
            $state.go('finder').then(function(){
              smoothScroll(document.getElementById('pathfinder'), {offset: 100});
            });
          }
        }, function(err){
          $log.error(err);
        });
      };
      //
      $scope.miscNavOpen = false;
      $scope.toggleMiscNav = function(){
        if($scope.miscNavOpen){
          $scope.miscNavOpen = false;
        } else {
          $scope.miscNavOpen = true;
        }
      };
      //
      apiSrv.request('GET', 'blocks', {}, function(data){
        $scope.blocks = data;
        data.forEach(function(item, index){
          $scope[item.url] = item;
        });
      }, function(err){
        $log.error(err);
      });
      //get csrf cookie
      if(document.cookie.indexOf('csrftoken') === -1){$http({method: 'GET',url: '/admin'}).then(function(data){}, function(err){});}
      //setup formData
      $scope.$storage = $localStorage;
      $rootScope.formData = {};
      $rootScope.questions = [];
      function manipulateFormData(){
        $rootScope.questions.forEach(function(question, index){
          $rootScope.formData[question.id] = {
            "question": question.question_text,
            "theme": question.theme,
            "topic": question.topic,
            "other_topic": question.other_topic,
            "sector": question.question_tags,
            "customer_type": "",
            "product_category": "",
            "user_response": [],
            "choices": [],
            "weight": question.score_percentage,
            "possible": question.possible_score,
            "total_possible": question.total_possible_score,
            "score": ""
          };
          if(question.question_type === 'multi'){
            question.choices.forEach(function(choice, ix){
              $rootScope.formData[question.id].choices[ix] = {
                "answer_text": "",
                "answer_score": ""
              };
            });
          }
          if(!$scope.$storage.formData){
            $scope.$storage.formData = $rootScope.formData;
          }
        });
      }
      function setupForm(data){
        $rootScope.questions = data;
        if($scope.$storage.formData){
          $rootScope.formData = $scope.$storage.formData;
        } else {
          manipulateFormData();
        }
        $scope.$storage.questions = $rootScope.questions;
        if(resetting){
          resetting = false;
          msgSrv.emitMsg('formReset');
        }
      }
      apiSrv.request('GET', 'questions', {}, setupForm, function(err){
        $log.error(err);
      });
      //
      $scope.$on('resetForm', function(){
        resetting = true;
        delete $scope.$storage.finderCode;
        delete $scope.$storage.formData;
        delete $scope.$storage.resources;
        delete $scope.$storage.savedResources;
        delete $scope.$storage.results;
        delete $scope.$storage.questions;
        $rootScope.formData = {};
        $rootScope.questions = [];
        apiSrv.request('GET', 'questions', {}, setupForm, function(err){
          $log.error(err);
        });
      });
      //
      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(fromState.name === "library" && typeof infScrollHandler != 'undefined'){
          angular.element($window).unbind('scroll', infScrollHandler);
        }
      });
      //
      $scope.filterToggle = function(){
        $scope.filtersOpen = !$scope.filtersOpen;
      };
    }
  ])
;