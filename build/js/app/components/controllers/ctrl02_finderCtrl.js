angular.module('signalapp.controllers')
  .controller('finderCtrl', ['$rootScope',
                             '$scope', 
                             '$state', 
                             '$log',
                             '$sce',
                             '$localStorage',
                             '$timeout',
                             'apiSrv',
                             'msgSrv',
                             '$location',
    function($rootScope, $scope, $state, $log, $sce, $localStorage, $timeout, apiSrv, msgSrv, $location){
      $scope.goTo = $state.go.bind($state);
      $scope.scrollVer = $location.$$url.indexOf("popup") === -1;
      var bodyClass = $rootScope.$state.current.name;
      document.body.className = bodyClass;
      $scope.$storage = $localStorage;
      $scope.finderCode = $scope.$storage.finderCode;
      $scope.formData = $scope.$storage.formData;
      $scope.finderObj = {};
      $scope.formCode = "";
      if(!$scope.finderCode){
        $scope.finderCode = generateNewFinderCode();
        $scope.$storage.finderCode = $scope.finderCode;
      } else {
        apiSrv.request('GET', 'assessments/', {}, function(data){
          data.forEach(function(assessment, index){
            if(assessment.code === $scope.finderCode){
              $scope.finderObj = assessment;
            }
          });
        }, function(err){
          $log.error(err);
        });
      }
      $scope.teamPercent = 0;
      $scope.productPercent = 0;
      $scope.marketPercent = 0;
      $scope.operationsPercent = 0;
      $scope.teamQuestions = [];
      $scope.productQuestions = [];
      $scope.marketQuestions = [];
      $scope.operationsQuestions = [];
      $scope.questions = $scope.$storage.questions;
      $scope.questions.forEach(function(question, index){
        if(question.theme){
          question.answered = false;
          if(question.theme.name === 'Team'){
            $scope.teamQuestions.push(question);
          }
          if(question.theme.name === 'Product'){
            $scope.productQuestions.push(question);
          }
          if(question.theme.name === 'Market'){
            $scope.marketQuestions.push(question);
          }
          if(question.theme.name === 'Operations'){
            $scope.operationsQuestions.push(question);
          }
        }
      });
      //get finder progress
      function calcFinderPercents(){
        var answered = 0,
            uncounted = 0;
        $scope.teamQuestions.forEach(function(q,i){
          if($scope.formData[q.id] && $scope.formData[q.id].user_response.length){
            answered++;
            q.answered = true;
          }
          if(q.choices.length === 0){
            uncounted++;
          }
        });
        $scope.teamPercent = (answered/($scope.teamQuestions.length-uncounted))*100;
        answered = 0;
        uncounted = 0;
        //
        $scope.productQuestions.forEach(function(q,i){
          if($scope.formData[q.id] && $scope.formData[q.id].user_response.length){
            answered++;
            q.answered = true;
          }
          if(q.choices.length === 0){
            uncounted++;
          }
        });
        $scope.productPercent = (answered/($scope.productQuestions.length-uncounted))*100;
        answered = 0;
        uncounted = 0;
        //
        $scope.marketQuestions.forEach(function(q,i){
          if($scope.formData[q.id] && $scope.formData[q.id].user_response.length){
            answered++;
            q.answered = true;
          }
          if(q.choices.length === 0){
            uncounted++;
          }
        });
        $scope.marketPercent = (answered/($scope.marketQuestions.length-uncounted))*100;
        answered = 0;
        uncounted = 0;
        //
        $scope.operationsQuestions.forEach(function(q,i){
          if($scope.formData[q.id] && $scope.formData[q.id].user_response.length){
            answered++;
            q.answered = true;
          }
          if(q.choices.length === 0){
            uncounted++;
          }
        });
        $scope.operationsPercent = (answered/($scope.operationsQuestions.length-uncounted))*100;
      }
      calcFinderPercents();
      //      
      $scope.resetForm = function(){
        msgSrv.emitMsg('resetForm');
        $scope.teamPercent = 0;
        $scope.productPercent = 0;
        $scope.marketPercent = 0;
        $scope.operationsPercent = 0;
      };
      $scope.$on('formReset', function(){
        $scope.finderCode = $scope.$storage.finderCode;
        $scope.finderObj = {};
        $scope.formData = $scope.$storage.formData;
      });
      //
      $scope.answer = function(question, choice){
        $scope.formData[question.id].theme = question.theme || choice.theme || "";
        $scope.formData[question.id].topic = question.topic || choice.topic || "";
        $scope.formData[question.id].other_topic = question.other_topic || "";
        $scope.formData[question.id].resources_theme = choice.theme || question.theme || "";
        $scope.formData[question.id].resources_topic = choice.topic || question.topic || "";
        $scope.formData[question.id].sector = combineTags(question.question_tags, choice.choice_tags) || "";
        $scope.formData[question.id].customer_type = choice.customer_type || "";
        $scope.formData[question.id].product_category = choice.product_category || "";
        if(question.question_type === 'multi'){
          $scope.formData[question.id].user_response = [];
          for(var i=0;i<question.choices.length;i++){
            if(typeof($scope.formData[question.id].choices[i]) !== "undefined" && $scope.formData[question.id].choices[i].answer_text){
              var tmp = {
                answer_text: "",
                answer_score: question.choices[i].choice_value || ""
              };
              if($scope.formData[question.id].choices[i].other_text){
                tmp.answer_text = "Other";
                tmp.answer_text_other = $scope.formData[question.id].choices[i].other_text || "";
              } else {
                tmp.answer_text = question.choices[i].choice_text || "";
              }
              $scope.formData[question.id].user_response.push(tmp);
              // $log.info(tmp);
            }
          }
          $scope.formData[question.id].score = 0;
          $scope.formData[question.id].user_response.forEach(function(r, i){
            $scope.formData[question.id].score += r.answer_score;
          });
        } else{
          if(question.question_type !== 'text'){
            $scope.formData[question.id].user_response[0].answer_text = choice.choice_text_other || choice.choice_text || "";
            $scope.formData[question.id].user_response[0].answer_score = choice.choice_value || 0;
            $scope.formData[question.id].score = choice.choice_value || 0;
          }
        }
        calcFinderPercents();
      };
      $scope.insertAnswer = function(id, text){
        $scope.formData[id].user_response[0].answer_text_other = text;
      };
      //
      var checkRequired = function(){
        var required = document.querySelectorAll("input[required]"),
            valid = true;
        for(var r=0;r<required.length;r++){
          if(required[r].value.length<1){
            valid = false;
            required[r].parentElement.classList.add("unanswered");
          } else {
            required[r].parentElement.classList.remove("unanswered");
          }
        }
        return valid;
      };
      $scope.assLoadErrors = '';
      $scope.loadPastAssessment = function(){
        apiSrv.request('GET', 'finderobj/'+$scope.formCode.toLowerCase(), {}, function(data){
          // $scope.resetForm();
          $scope.finderCode = $scope.formCode;
          $scope.$storage.finderCode = $scope.formCode;
          $scope.formData = data;
          $rootScope.formData = data;
          $scope.$storage.formData = data;
          $scope.finderObj.data = data;
          $scope.assLoadErrors = '';
          smoothScroll(document.getElementById('pathfinder'), {offset: 100});
          //$log.info(data);
          // data.forEach(function(assessment, index){
          //   if(assessment.code === $scope.formCode){
          //     $scope.finderObj = assessment;
          //     $scope.formData = JSON.parse(assessment.data);
          //     $log.info("new formdata");
          //     $log.info($scope.formData["1"]);
          //   }
          // });
        }, function(err){
          $log.error(err);
          $scope.assLoadErrors = "Assessment Load Error: "+err.detail;
        });
      };
      //
      $scope.sendData = function(){
        var resultState;
        if($scope.scrollVer){
          resultState = "finder.result";
        } else {
          resultState = "finder.results";
        }
        var formComplete = checkRequired();
        if(formComplete){
          var answers = extractAnswers($scope.formData);
          $scope.$storage.answers = answers;
          // $log.info($scope.formData);
          // $log.info(answers);
          if(!$scope.finderObj.data){
            var fCode = generateNewFinderCode();
            apiSrv.request('POST', 'assessments/', {data: $scope.formData, answers: answers, resources: {"0": "empty"}, code: fCode}, function(data){
              $scope.finderCode = data.code;
              $scope.$storage.finderCode = data.code;
              $rootScope.formData = $scope.formData;
              $scope.$storage.formData = $scope.formData;
              msgSrv.emitMsg('updateFinderObj');
              $scope.goTo(resultState);
            }, function(err){
              $log.error(err);
            });
          } else {
            msgSrv.setFinderObj($scope.formData);
            $scope.$storage.formData = $scope.formData;
            apiSrv.request('PUT', 'assessments/'+$scope.finderCode+'/', {data: $scope.formData, answers: answers, resources: {"0": "empty"}}, function(data){
              msgSrv.emitMsg('updateFinderObj');
              $scope.goTo(resultState);
            }, function(err){
              $log.error(err);
            });
          }
        } else {
          var unanswered = document.querySelectorAll(".unanswered")[0];
          smoothScroll(unanswered, {offset: 200});
          unanswered.classList.add("highlight");
        }
      };
    }
  ])
;