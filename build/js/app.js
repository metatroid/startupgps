angular.module('signalapp', [
               'signalapp.controllers',
               'signalapp.states',
               'signalapp.services',
               'signalapp.directives',
               'signalapp.filters',
               'djangoRESTResources',
               'ngPageTitle',
               'ngStorage',
               'ngAria',
               'ngAnimate',
               'angular-google-analytics'
]);

angular.module('signalapp.states', []);
angular.module('signalapp.services', []);
angular.module('signalapp.directives', []);
angular.module('signalapp.filters', []);

angular.module('signalapp')
  .config(['$httpProvider', '$compileProvider', 'AnalyticsProvider', function($httpProvider, $compileProvider, AnalyticsProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common['X-Api-Key'] = 'CfeEiAD3y81CbWPC5mC9Ba6BS1f29ENg0jnsIxT3';
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel):/);
    $compileProvider.debugInfoEnabled(false);
    AnalyticsProvider.setAccount('UA-74506555-1');
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    AnalyticsProvider.setDomainName('startupgps.org');
  }
]);
angular.module('signalapp.controllers', []);
angular.module('signalapp.directives', []);
angular.module('signalapp.services', []);
angular.module('signalapp.states', ['ui.router', 'uiRouterStyles']);
function makeUnique(array, links){
  var tmpArr = [],
      skipped = 0,
      previouslySkipped = array.length - links.length -20;
  array.forEach(function(item){
    var compare = item.title;
    var duplicate = false;
    tmpArr.forEach(function(i){
      if(compare === i.title){
        duplicate = true;
      }
    });
    if(!duplicate){
      tmpArr.push(item);
    } else {
      skipped++;
    }
  });
  var skipping = skipped - previouslySkipped;
  return {r: tmpArr, n: skipping};
}
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
function extractAnswers(data){
  var output = [];
  for(var q in data){
    var other;
    var resp = data[q].user_response;
    var tmp = [];
    if(typeof(resp.length) === "undefined"){
      for(var u in resp){
        tmp.push(resp[u].answer_text);
      }
    } else {
      tmp = data[q].user_response.map(function(r){return r.answer_text;});
      other = data[q].user_response.map(function(r){return r.answer_text_other;}).clean();
      other = other.length ? other : undefined;
    }
    var qObj = {
      id: q,
      question: data[q].question,
      answer: tmp,
      other: other
    };
    output.push(qObj);
  }
  return output;
}
Array.prototype.getIndexBy = function(name, value){
  for(var i=0;i<this.length;i++){
    if(this[i][name] == value){
      return i;
    }
  }
  return -1;
};
Array.prototype.getThemeByName = function(value){
  for(var i=0;i<this.length;i++){
    if(this[i].name == value){
      return this[i];
    }
  }
  return -1;
};
function getThemeFromTopic(topic){
  switch (topic) {
    case "Impact":
    case "Venture":
    case "Crowdfunding":
    case "Grants":
    case "impact":
    case "venture":
    case "crowdfunding":
    case "grants":
      return "Funding";
    case "Productivity":
    case "Models & Metrics":
    case "Models_Metrics":
    case "Legal":
    case "productivity":
    case "models & metrics":
    case "models_metrics":
    case "legal":
      return "Operations";
    case "Brand":
    case "Competition":
    case "Distribution":
    case "Customers":
    case "brand":
    case "competition":
    case "distribution":
    case "customers":
      return "Market";
    case "Advisory":
    case "Culture":
    case "Sales":
    case "Technical":
    case "advisory":
    case "culture":
    case "sales":
    case "technical":
      return "Team";
    case "Development":
    case "Manufacturing":
    case "development":
    case "manufacturing":
      return "Product";
    default:
      return "";
  }
}
function waitForEl(selector, fn){
  var el = document.querySelectorAll(selector)[0];
  if(typeof el === 'undefined' || el.length < 1){
    setTimeout(function(){waitForEl(selector, fn);}, 500);
  } else {
    fn();
  }
}
Array.prototype.removeValue = function(name, value){
 var array = this.map(function(v,i){
    return v[name] === value ? null : v;
 });
 this.length = 0;
 var that = this;
 for(var n = 0;n<array.length;n++){
  if(array[n]){
    that.push(array[n]);
  }
 }
};
var generateNewFinderCode = function(){
  var code = Date.now();
  code = ''+code;
  code = code.substring(0, code.length-1);
  code = code.match(/.{1,4}/g);
  tmp = '';
  code.forEach(function(n,i){
    tmp += parseInt(n).toString(16);
  });
  code = tmp.toLowerCase();
  return code;
};

var combineTags = function(a, b){
  var combined = '';
  if(a){
    combined += a;
    if(b){
      combined += ",";
    }
  }
  if(b){
    combined += b;
  }
  return combined;
};

var getDataByTopic = function(data, topic){
  var info = {
    score: 0,
    scores: [],
    sector: [],
    customer_type: [],
    product_category: []
  };
  for(var item in data){
    if((data[item].topic && data[item].topic.name === topic) || (data[item].resources_topic && data[item].resources_topic.name === topic) || (data[item].other_topic && data[item].other_topic.name === topic)){
      if(data[item].weight && data[item].total_possible && data[item].possible){
        info.score += (data[item].score/data[item].possible) * ((data[item].weight/100)*data[item].total_possible);
      } else {
        info.score += data[item].score;
      }
      if(data[item].score){info.scores.push(data[item].score>5?5:data[item].score);}
      if(data[item].sector){info.sector.push(data[item].sector);}
      if(data[item].customer_type){info.customer_type.push(data[item].customer_type);}
      if(data[item].product_category){info.product_category.push(data[item].product_category);}
    }
  }
  return info;
};
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
angular.module('signalapp.controllers')
  .controller('finderResultsCtrl', ['$rootScope',
                                    '$scope', 
                                    '$state', 
                                    '$log',
                                    '$timeout',
                                    '$sce',
                                    '$localStorage',
                                    '$http',
                                    'msgSrv',
                                    'apiSrv',
                                    '$compile',
                                    '$location',
    function($rootScope, $scope, $state, $log, $timeout, $sce, $localStorage, $http, msgSrv, apiSrv, $compile, $location){
      $scope.goTo = $state.go.bind($state);
      $scope.scrollVer = $rootScope.$state.current.name === "finder.result";
      var bodyClass = $rootScope.$state.current.name;
      document.body.className = bodyClass.replace(/\./g, "-");
      // $scope.data = msgSrv.getFinderObj();
      $scope.Math = window.Math;
      $scope.$storage = $localStorage;
      $scope.formData = $scope.$storage.formData;
      $scope.finderCode = $scope.$storage.finderCode;
      $scope.results = $scope.$storage.results || [];
      $scope.manufacturingItem = (typeof $scope.results[0] === 'undefined') ? {} : $scope.results[0];
      $scope.developmentItem = (typeof $scope.results[1] === 'undefined') ? {} : $scope.results[1];
      $scope.technicalItem = (typeof $scope.results[2] === 'undefined') ? {} : $scope.results[2];
      $scope.salesItem = (typeof $scope.results[3] === 'undefined') ? {} : $scope.results[3];
      $scope.advisoryItem = (typeof $scope.results[4] === 'undefined') ? {} : $scope.results[4];
      $scope.customersItem = (typeof $scope.results[5] === 'undefined') ? {} : $scope.results[5];
      $scope.distributionItem = (typeof $scope.results[6] === 'undefined') ? {} : $scope.results[6];
      $scope.competitionItem = (typeof $scope.results[7] === 'undefined') ? {} : $scope.results[7];
      $scope.brandItem = (typeof $scope.results[8] === 'undefined') ? {} : $scope.results[8];
      $scope.legalItem = (typeof $scope.results[9] === 'undefined') ? {} : $scope.results[9];
      $scope.metricsItem = (typeof $scope.results[10] === 'undefined') ? {} : $scope.results[10];
      $scope.productivityItem = (typeof $scope.results[11] === 'undefined') ? {} : $scope.results[11];
      $scope.resources = $scope.$storage.resources || {};
      //apparently these need to be in a specific order...
      $scope.resources.Development = $scope.resources.Development || {};
      $scope.resources.Customers = $scope.resources.Customers || {};
      $scope.resources.Distribution = $scope.resources.Distribution || {};
      $scope.resources.Competition = $scope.resources.Competition || {};
      $scope.resources.Brand = $scope.resources.Brand || {};
      $scope.resources.Sales = $scope.resources.Sales || {};
      $scope.resources.Technical = $scope.resources.Technical || {};
      $scope.resources.Advisory = $scope.resources.Advisory || {};
      $scope.resources.Productivity = $scope.resources.Productivity || {};
      $scope.resources["Models & Metrics"] = $scope.resources["Models & Metrics"] || {};
      $scope.resources.Legal = $scope.resources.Legal || {};
      $scope.resources.Manufacturing = $scope.resources.Manufacturing || {};
      $scope.$storage.resources = $scope.resources;
      //
      $scope.resourceFilter = [];
      //
      $scope.topicList = [];
      var possibilityTable = {
        'Manufacturing': 4,
        'Development': 5,
        'Customers': 5,
        'Distribution': 3,
        'Competition': 3,
        'Brand': 3,
        'Sales': 10,
        'Technical': 10,
        'Advisory': 6,
        'Productivity': 5,
        'Models & Metrics': 3,
        'Legal': 4
      };
      //
      apiSrv.request('GET', 'topics', {}, function(data){
        data.removeValue('name', 'Culture');
        $scope.topicList = data;
        data.forEach(function(topic, index){
          var topicData = getDataByTopic($scope.formData, topic.name);
          $scope.results[index] = {
            topic: topic.name,
            theme: topic.theme.name,
            possible: possibilityTable[topic.name],
            score: topicData.score,
            scores: topicData.scores,
            sector: topicData.sector,
            customer_type: topicData.customer_type,
            product_category: topicData.product_category,
            questions: topic.topic_questions.concat(topic.othertopic_questions)
          };
          $scope.results[index].questions.forEach(function(q,i){
            q.answer = $scope.formData[q.id].user_response;
          });
          //
          $scope.manufacturingItem = (typeof $scope.results[0] === 'undefined') ? {} : $scope.results[0];
          $scope.developmentItem = (typeof $scope.results[1] === 'undefined') ? {} : $scope.results[1];
          $scope.technicalItem = (typeof $scope.results[2] === 'undefined') ? {} : $scope.results[2];
          $scope.salesItem = (typeof $scope.results[3] === 'undefined') ? {} : $scope.results[3];
          $scope.advisoryItem = (typeof $scope.results[4] === 'undefined') ? {} : $scope.results[4];
          $scope.customersItem = (typeof $scope.results[5] === 'undefined') ? {} : $scope.results[5];
          $scope.distributionItem = (typeof $scope.results[6] === 'undefined') ? {} : $scope.results[6];
          $scope.competitionItem = (typeof $scope.results[7] === 'undefined') ? {} : $scope.results[7];
          $scope.brandItem = (typeof $scope.results[8] === 'undefined') ? {} : $scope.results[8];
          $scope.legalItem = (typeof $scope.results[9] === 'undefined') ? {} : $scope.results[9];
          $scope.metricsItem = (typeof $scope.results[10] === 'undefined') ? {} : $scope.results[10];
          $scope.productivityItem = (typeof $scope.results[11] === 'undefined') ? {} : $scope.results[11];
          //
          $scope.themes = {
            "Team": [],
            "Market": [],
            "Product": [],
            "Operations": []
          };
          apiSrv.getResources({
            theme: topic.theme.name.toLowerCase(),
            topic: topic.name.toLowerCase().replace(" & ", "_"),
            scores: topicData.scores.join(','),
            sector: topicData.sector.join(','),
            customer_type: topicData.customer_type.join(','),
            product_category: topicData.product_category.join(','),
            limit: 3
          }, function(resources){
            $scope.resources[topic.name] = resources;
            $scope.$storage.resources[topic.name] = resources;
            markSavedResources();
            for(var tpc in $scope.resources){
              if(typeof($scope.resources[tpc].result) !== 'undefined' && $scope.resources[tpc].result.length > 0){
                for(var i=0;i<$scope.resources[tpc].result.length;i++){
                  var thematics = $scope.themes[$scope.resources[tpc].result[i].theme.name];
                  if(thematics.indexOf(tpc) === -1){
                    thematics.push(tpc);
                  }
                }
              }
            }
          }, function(err){
            $log.error(err);
          });
          $scope.$storage.results = $scope.results;
        });
        //
        msgSrv.setResults($scope.results);
        var el = document.getElementById('graph');
        el.innerHTML = "<div id='graphObj' graph='graph'></div>";
        $compile(document.getElementById('graphObj'))($scope);
        //
        function resultsMail(){
          var answers = $scope.$storage.answers;
          var name = answers[0].answer[0];
          var email = answers[30].answer[0];
          var mailOpts = {
            email: email,
            name: name,
            code: $scope.finderCode
          };
          $http({
            method: 'POST',
            url: '/api/results-mailer/',
            data: JSON.stringify(mailOpts) 
          }).then(function mailSuccess(res){
            $scope.$storage.emailsent = true;
          }, function mailError(err){
            $log.error(err);
          });
        }
        if($scope.$storage.emailsent !== true){
          resultsMail();
        }
        //
        $timeout(function(){
          apiSrv.generateImg($scope.finderCode, function(data){
            var imgEl = document.getElementById('graphImg').querySelector('img');
            var imgPath = "/static/uploads/assessments/"+$scope.finderCode+"/"+$scope.finderCode+".jpg";
            $timeout(function(){
              imgEl.setAttribute('src', imgPath+"?"+new Date().getTime());
              imgEl.setAttribute('class', 'loaded');
            }, 2000);
          }, function(err){
            $log.error(err);
          });
        }, 5000);
      }, function(err){
        $log.error(err);
      });
      //
      $scope.activeResources = [];
      $scope.showAllResources = false;
      $scope.showAllResourcesFor = "null";
      $scope.activeOverviews = [];
      $scope.showAllOverviews = false;
      $scope.compareModalActive = false;
      $scope.codeModalActive = false;
      $scope.shareModalActive = false;
      $scope.interpetModalActive = false;
      //
      $scope.bulb = function(){
        $scope.interpretModalActive = true;
        var bulbPosition = document.getElementById('bulb').getBoundingClientRect();
        var modal = document.querySelector('.interpret-modal');
        var overlay = document.querySelector('.overlay.interpret-overlay');
        modal.style.top = bulbPosition.top+window.pageYOffset+'px';
        modal.style.left = bulbPosition.left+'px';
        modal.style.transform = "none";
        modal.style.WebkitTransform = "none";
        modal.style.webkitTransform = "none";
        modal.style.MozTransform = "none";
        modal.style.marginLeft = "65px";
        overlay.style.position = "absolute";
        overlay.style.height = document.body.clientHeight+'px';
      };
      //
      $scope.blocks = [];
      apiSrv.request('GET', 'blocks', {}, function(data){
        $scope.blocks = data;
        data.forEach(function(item, index){
          $scope[item.url] = item;
        });
      }, function(err){
        $log.error(err);
      });
      //
      $scope.priorityResource = {};
      if(typeof($scope.formData[4]) !== "undefined" && typeof($scope.formData[4].user_response) !== "undefined" && $scope.formData[4].user_response.length && typeof($scope.formData[4].user_response[0].answer_text_other) !== "undefined" && $scope.formData[4].user_response[0].answer_text_other.length){
        $scope.topPriority = ''; //$scope.formData[4].user_response[0].answer_text_other;
        apiSrv.getResources({offset:(Math.floor(Math.random() * 100) + 1),limit:1}, function(data){
          $scope.priorityResource = data.result[0];
          $scope.topPriority = data.result[0].theme.name;
          apiSrv.request('GET', 'resources/', {}, function(data){
            data.forEach(function(resource, index){
              if(resource.top_priority_resource === $scope.topPriority){
                $scope.priorityResource.intro_text = resource.intro_text;
              }
            });
          }, function(err){
            $log.error(err);
          });
        }, function(err){
          $log.error(err);
        });
      } else if(typeof($scope.formData[4]) !== "undefined" && typeof($scope.formData[4].resources_theme) !== "undefined"){
        $scope.topPriority = $scope.formData[4].resources_theme.name;
        apiSrv.request('GET', 'resources/', {}, function(data){
          data.forEach(function(resource, index){
            if(resource.top_priority_resource === $scope.topPriority){
              $scope.priorityResource = resource;
            }
          });
        }, function(err){
          $log.error(err);
        });
      }
      //
      $scope.savedResources = $scope.$storage.savedResources || [];
      $scope.hideSavedResources = true;
      $scope.assessmentsLoaded = [];
      $scope.shareForm = {
        emailto: '',
        emailfrom: $scope.$storage.answers[30].answer[0],
        emailmsg: '',
        sharenecec: false
      };
      //
      $scope.$on('updateFinderObj', function(){
        $scope.formData = $scope.$storage.formData;
        $scope.finderCode = $scope.$storage.finderCode;
      });
      $scope.finderObj = {};
      apiSrv.request('GET', 'assessments/'+$scope.finderCode+'/', {}, function(data){
        $scope.finderObj = data;
      }, function(err){
        $log.error(err);
      });
      $scope.classable = function(string){
        var classSafe = string.replace(/ /g, "_");
        classSafe = (classSafe === "Models_&_Metrics") ? "Metrics" : classSafe;
        return classSafe;
      };
      $scope.showAllResourcesPopup = function(){
        $scope.showAllResources = true;
        $scope.goTo("finder.results.links");
      };
      //
      var getExceptionValue = function(msg){
        $log.info(msg);
        var regex = /Exception Value: \{(.*?)\}/;
        var matches = msg.data.match(regex);
        var exception = matches[1];
        $log.info(exception);
        return exception;
      };
      $scope.shareFinder = function(){
        var btn = document.getElementById("share_btn");
        btn.disabled = true;
        var answers = $scope.$storage.answers;
        if(!answers.length){
          $scope.shareError = "Assessment not found";
          btn.disabled = false;
          btn.innerHTML = "Share Finder";
          return false;
        } else if(!answers[0].answer.length){
          $scope.shareError = "Assessment not found";
          btn.disabled = false;
          btn.innerHTML = "Share Finder";
          return false;
        }
        var sender_name = answers[0].answer[0],
            sender_company = answers[1].answer[0];
        var mailOpts = {
          mailTo: $scope.shareForm.emailto,
          mailFrom: $scope.shareForm.emailfrom,
          message: $scope.shareForm.emailmsg,
          necec: $scope.shareForm.sharenecec,
          sender_name: sender_name,
          sender_company: sender_company,
          code: $scope.finderCode
        };
        if($scope.assessmentsLoaded.length>0){
          mailOpts.assessments = $scope.assessmentsLoaded.map(function(a){return a.code;});
        } else {
          mailOpts.assessments = [];
        }
        if(!$scope.shareForm.emailfrom){
          $scope.shareError = "Please enter your email address";
          btn.disabled = false;
          btn.innerHTML = "Share Finder";
          return false;
        }
        if(!$scope.shareForm.emailto){
          $scope.shareError = "Please enter the recipient's email address";
          btn.disabled = false;
          btn.innerHTML = "Share Finder";
          return false;
        }
        $http({
          method: 'POST',
          url: '/api/mail/',
          data: JSON.stringify(mailOpts) 
        }).then(function mailSuccess(res){
          $scope.assessmentsLoaded = [];
          $scope.shareError = "";
          $scope.shareForm.emailto = $scope.$storage.answers[30].answer[0];
          $scope.shareForm.emailfrom = "";
          $scope.shareForm.emailmsg = "";
          $scope.shareModalActive = false;
        }, function mailError(err){
          var ex = getExceptionValue(err);
          $log.error(ex);
          $scope.shareError = ex;
          btn.disabled = false;
          btn.innerHTML = "Share Finder";
        });
      };
      $scope.assLoadErrors = '';
      $scope.loadAssessment = function(code){
        apiSrv.request('GET', 'assessments/'+code+'/', {}, function(data){
          $scope.assessmentsLoaded.push(data);
          $scope.compareModalActive = false;
        }, function(err){
          $log.error(err);
          $scope.assLoadErrors = "Loading Error: "+err.detail;
        });
        return false;
      };
      $scope.removeAssessment = function(assessment){
        var index = $scope.assessmentsLoaded.indexOf(assessment);
        $scope.assessmentsLoaded.splice(index, 1);
      };
      //
      $scope.vote = function(resource, vote){
        var votes = (typeof $localStorage.votes === 'undefined') ? "{}" : $localStorage.votes;
        votes = JSON.parse(votes);
        if(votes[resource.id] !== vote){
          apiSrv.vote({id: resource.id, vote: vote}, function(data){
            resource.votes = data.votes;
            votes[resource.id] = vote;
            $localStorage.votes = JSON.stringify(votes);
          }, function(err){
            $log.error(err);
          });
        } else {
          var row = document.querySelector('#resourceLink_' + resource.id);
          row.className = row.className + " voted";
          $timeout(function(){
            row.className = row.className.replace('voted', '');
          }, 2000);
        }
      };
      //
      $scope.bookMark = function(resource){
        var el = document.querySelectorAll(".book-marker");
        for(var i=0;i<el.length;i++){
          el[i].classList.add("saving");
        }
        $timeout(function(){
          var el = document.querySelectorAll(".book-marker");
          for(var i=0;i<el.length;i++){
            el[i].classList.remove("saving");
          }
        }, 1100);
        if(resource.saved){
          resource.saved = false;
          $scope.savedResources.splice($scope.savedResources.indexOf(resource), 1);
        } else {
          resource.saved = true;
          $scope.savedResources.push(resource);
        }
        var serial = JSON.stringify($scope.savedResources);
        apiSrv.request('PUT', 'assessments/'+$scope.finderCode+'/', {saved_resources: serial}, function(data){
          $scope.$storage.savedResources = JSON.parse(data.saved_resources);
          $scope.finderObj = data;
          markSavedResources();
        }, function(err){
          $log.error(err);
        });
      };
      //
      function markSavedResources(){
        for(var i=0;i<$scope.savedResources.length;i++){
          var title = $scope.savedResources[i].title;
          for(var theme in $scope.resources){
            var resourceIndex = $scope.resources[theme].result.getIndexBy('title', title);
            if(resourceIndex !== -1 && $scope.resources[theme].result[resourceIndex]){
              $scope.resources[theme].result[resourceIndex].saved = true;
            }
          }
        }
      }
      //
      $scope.showSavedResources = function(){
        var el = document.querySelector(".book-marker");
        if($scope.hideSavedResources){
          $scope.hideSavedResources = false;
        } else {
          $scope.hideSavedResources = true;
        }
      };
      //
      apiSrv.request('GET', 'questions/9/', {}, function(data){
        $scope.team_technical_question_text = data.question_text;
      }, function(err){
        $log.error(err);
      });
      //
      $scope.$on('showResults', function(){
        var topic = msgSrv.msgArgs.args.topic;
        if($scope.scrollVer){
          $scope.$apply(function(){
            $scope.activeOverviews = [topic];
          });
          smoothScroll(document.querySelectorAll("#overviews")[0], {offset: 0});
        } else {
          $scope.$apply(function(){
            $scope.activeOverviews = [topic];
          });
          if(topic.length){
            waitForEl('.topic-overview:not(.ng-hide)', function(){
              document.querySelectorAll('.topic-overview:not(.ng-hide)')[0].style.minHeight = document.body.clientHeight+'px';
              document.querySelector('body').scrollTop = 0;
              $scope.goTo("finder.results.overview");
            });
          } else {
            $scope.activeOverviews = [];
            document.querySelectorAll('.topic-overview:not(.ng-hide)')[0].style.minHeight = "none";
          }
        }
      });
      $scope.unsetActiveOverview = function(){
        if($scope.scrollVer){
          $scope.activeOverviews = [];
          smoothScroll(document.querySelectorAll("#finder")[0], {offset: 0});
        } else {
          $scope.goTo("finder.results");
        }
      };
      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(fromState.name === "finder.results.overview"){
          $scope.activeOverviews = [];
        }
        if(fromState.name === "finder.results.links"){
          $scope.showAllResources = false;
        }
      });
      $scope.showResources = function(){
        $scope.showAllResources = true;
      };
      //
      $scope.updateCode = function(code){
        if(!code){
          $scope.updateCodeError = "Please enter an alphanumeric string of at least 5 characters in length.";
          return false;
        } else {
          code = code.toLowerCase();
        }
        if(code.length < 5){
          $scope.updateCodeError = "Code must be at least 5 characters in length";
          return false;
        }
        if(!code.match(/^[a-z0-9]+$/i)){
          $scope.updateCodeError = "Code may only container letters and numbers. No spaces or special characters.";
          return false;
        }
        apiSrv.request('PUT', 'assessments/'+$scope.finderCode+'/', {code: code}, function(data){
          $scope.$storage.finderCode = data.code;
          $scope.finderCode = data.code;
          msgSrv.emitMsg('updateFinderObj');
          $scope.updateCodeError = null;
          $scope.codeModalActive = false;
          $scope.finderObj = data;
        }, function(err){
          $log.error(err);
          if(err.code && err.code.length){$scope.updateCodeError = err.code[0].replace('FinderObject', 'Assessment');}
        });
      };
      //
      $scope.activateModal = function(modal){
        switch(modal){
          case 'share':
            $scope.shareModalActive = true;
            $scope.codeModalActive = false;
            break;
          default:
            break;
        }
      };
      //
      $scope.valuedQuestion = function(question){
        var n = 0;
        choices.map(function(c){n+=c.choice_value;});
        return n>0;
      };
      //
      function updateResults(){
        var data = $scope.topicList;
        $timeout(function(){
          $scope.$apply(function(){
            data.forEach(function(topic, index){
              var topicData = getDataByTopic($scope.formData, topic.name);
              $scope.results[index] = {
                topic: topic.name,
                theme: topic.theme.name,
                possible: possibilityTable[topic.name],
                score: topicData.score,
                scores: topicData.scores,
                sector: topicData.sector,
                customer_type: topicData.customer_type,
                product_category: topicData.product_category,
                questions: topic.topic_questions.concat(topic.othertopic_questions)
              };
              $scope.results[index].questions.forEach(function(q,i){
                q.answer = $scope.formData[q.id].user_response;
              });
              $scope.manufacturingItem = (typeof $scope.results[0] === 'undefined') ? {} : $scope.results[0];
              $scope.developmentItem = (typeof $scope.results[1] === 'undefined') ? {} : $scope.results[1];
              $scope.technicalItem = (typeof $scope.results[2] === 'undefined') ? {} : $scope.results[2];
              $scope.salesItem = (typeof $scope.results[3] === 'undefined') ? {} : $scope.results[3];
              $scope.advisoryItem = (typeof $scope.results[4] === 'undefined') ? {} : $scope.results[4];
              $scope.customersItem = (typeof $scope.results[5] === 'undefined') ? {} : $scope.results[5];
              $scope.distributionItem = (typeof $scope.results[6] === 'undefined') ? {} : $scope.results[6];
              $scope.competitionItem = (typeof $scope.results[7] === 'undefined') ? {} : $scope.results[7];
              $scope.brandItem = (typeof $scope.results[8] === 'undefined') ? {} : $scope.results[8];
              $scope.legalItem = (typeof $scope.results[9] === 'undefined') ? {} : $scope.results[9];
              $scope.metricsItem = (typeof $scope.results[10] === 'undefined') ? {} : $scope.results[10];
              $scope.productivityItem = (typeof $scope.results[11] === 'undefined') ? {} : $scope.results[11];
              //
              apiSrv.getResources({
                theme: topic.theme.name.toLowerCase(),
                topic: topic.name.toLowerCase().replace(" & ", "_"),
                scores: topicData.scores.join(','),
                sector: topicData.sector.join(','),
                customer_type: topicData.customer_type.join(','),
                product_category: topicData.product_category.join(','),
                limit: 3
              }, function(resources){
                $scope.resources[topic.name] = resources;
                $scope.$storage.resources[topic.name] = resources;
                markSavedResources();
              }, function(err){
                $log.error(err);
              });
            });
            var answers = extractAnswers($scope.formData);
            $scope.$storage.answers = answers;
          });
          $scope.$storage.results = $scope.results;
        });
      }
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
            if($scope.formData[question.id].choices[i].answer_text){
              var tmp = {
                answer_text: "",
                answer_score: question.choices[i].choice_value || ""
              };
              if($scope.formData[question.id].choices[i].other_text){
                tmp.answer_text = $scope.formData[question.id].choices[i].other_text || "";
              } else {
                tmp.answer_text = question.choices[i].choice_text || "";
              }
              $scope.formData[question.id].user_response.push(tmp);
            }
          }
          $scope.formData[question.id].score = 0;
          $scope.formData[question.id].user_response.forEach(function(r, i){
            $scope.formData[question.id].score += r.answer_score;
          });
        } else{
          if(question.question_type !== 'text'){
            $scope.formData[question.id].user_response[0].answer_text = choice.choice_text || "";
            $scope.formData[question.id].user_response[0].answer_score = choice.choice_value || 0;
            $scope.formData[question.id].score = choice.choice_value || 0;
          }
        }
        $scope.$storage.formData = $scope.formData;
        updateResults();
        msgSrv.setResults($scope.results);
        var el = document.getElementById('graph');
        el.innerHTML = "<div id='graphObj' graph='graph'></div>";
        $timeout(function(){$compile(document.getElementById('graphObj'))($scope);}, 100);
      };
      //
      $scope.sendPDF = function(){
        var url = "/static/uploads/assessments/"+$scope.finderObj.code+"/"+$scope.finderObj.code+".pdf";
        if($scope.finderObj.svg){
          window.open(url);
        } else {
          $scope.saveSVG(url);
        }
      };
      $scope.saveSVG = function(url){
        var svg = document.getElementById('canvas').outerHTML;
        apiSrv.request('PUT', 'assessments/'+$scope.finderCode+'/', {svg: svg}, function(data){
          $scope.finderObj = data;
          if(url){
            window.open(url);
          }
        }, function(err){
          $log.error(err);
        });
      };
      //
      $scope.$on('svgReady', function(){
        $scope.saveSVG();
      });
      //
      $scope.filterResourcesBy = function(topic){
        $scope.resourceFilter = [topic];
        $scope.filtersOpen = false;
      };
    }
  ])
;
angular.module('signalapp.controllers')
  .controller('libraryCtrl', ['$rootScope',
                              '$scope', 
                              '$state', 
                              '$log',
                              '$localStorage',
                              '$sce',
                              '$timeout',
                              'apiSrv',
                              'msgSrv',
    function($rootScope, $scope, $state, $log, $localStorage, $sce, $timeout, apiSrv, msgSrv){
      var bodyClass = $rootScope.$state.current.name;
      document.body.className = bodyClass;
      //
      $scope.filters = {
        theme: '',
        topic: '',
        resource_action: '',
        scores: '0,1,2,3,4,5',
        limit: 20,
        offset: 0
      };
      $scope.selectedTheme = null;
      $scope.searchFilter = {filter: "all"};
      $scope.activeQuery = 0;
      $scope.queryCount = 5;
      //
      var searchResources = function(opts){
        $scope.allResources = [];
        showLoadingSpinner('#rLoader');
        if(opts && opts.fetchAll){
          $scope.filters = {
            theme: '',
            topic: '',
            resource_action: '',
            scores: '0,1,2,3,4,5',
            limit: 20,
            offset: 0
          };
        }
        $scope.fetchResources();
      };
      //
      $scope.classable = function(string){
        var classSafe = string.replace(/ /g, "_");
        classSafe = (classSafe === "Models_&_Metrics") ? "Metrics" : classSafe;
        return classSafe.toLowerCase();
      };
      //
      $scope.terms = '';
      $scope.resSearch = function(terms){
        $scope.allResources = [];
        showLoadingSpinner('#rLoader');
        $scope.selectedTheme = null;
        $scope.filters = {
          theme: '',
          topic: '',
          resource_action: '',
          scores: '',
          limit: 200,
          offset: 0,
          terms: terms
        };
        $scope.fetchResources();
      };
      //
      $scope.vote = function(resource, vote){
        var votes = (typeof $localStorage.votes === 'undefined') ? "{}" : $localStorage.votes;
        votes = JSON.parse(votes);
        if(votes[resource.id] !== vote){
          apiSrv.vote({id: resource.id, vote: vote}, function(data){
            resource.votes = data.votes;
            votes[resource.id] = vote;
            $localStorage.votes = JSON.stringify(votes);
          }, function(err){
            $log.error(err);
          });
        } else {
          var row = document.querySelector('#resourceLink_' + resource.id);
          row.className = row.className + " voted";
          $timeout(function(){
            row.className = row.className.replace('voted', '');
          }, 2000);
        }
      };
      //
      $scope.showLibInfo = function(){
        $scope.libraryInfo = {show: true};
      };
      //
      $scope.$storage = $localStorage;
      $scope.finderCode = $scope.$storage.finderCode;
      $scope.libraryInfo = {show: false};
      if($scope.$storage.formData){
        $scope.formData = $scope.$storage.formData;
      } else {
        $scope.formData = {};
      }
      //
      $scope.themes = [];
      function themeHandler(themes){
        $scope.themes[0] = themes[3];
        $scope.themes[1] = themes[2];
        $scope.themes[2] = themes[4];
        $scope.themes[3] = themes[1];
        $scope.themes[4] = themes[0];
        //
        if($rootScope.$stateParams && $rootScope.$stateParams.filter){
          var urlFilter = $rootScope.$stateParams.filter;
          if($scope.themes.getThemeByName(urlFilter) !== -1){
            $scope.selectedTheme = $scope.themes.getThemeByName(urlFilter);
            $scope.filters.theme = urlFilter.toLowerCase();
            $scope.searchFilter.filter = urlFilter.toLowerCase();
          } else {
            $scope.selectedTheme = $scope.themes.getThemeByName(getThemeFromTopic(urlFilter));
            $scope.filters.theme = getThemeFromTopic(urlFilter).toLowerCase();
            $scope.filters.topic = urlFilter.toLowerCase();
            $scope.searchFilter.filter = urlFilter.toLowerCase();
          }
          $scope.fetchResources();
        } else {
          $scope.fetchResources();
        }
      }
      apiSrv.request('GET', 'libthemes', {}, themeHandler, function(err){
        $log.error(err);
      });
      //
      $scope.resetLibrary = function(){
        $scope.selectedTheme = null;
        searchResources({fetchAll: true});
        document.querySelector('.resource-search form input').value = '';
        $scope.filtersOpen = false;
      };
      //
      $scope.queries = {};
      function queryHandler(questions){
        apiSrv.request('GET', 'themes/5/', {}, function(data){
          var library_info_blurb = data.library_info_blurb;
          questions.map(function(q){
            q.question_text = q.question_text.replace("For the following 4 questions, please give", "Give");
            return q;
          });
          questions.forEach(function(q, i){
            if(q.id === 31){
              q.theme = {
                'id': 5,
                'name': 'Funding',
                'library_info_blurb': library_info_blurb
              };
            }
          });
          $scope.queries = questions;
        }, function(err){
          $log.error(err);
        });
      }
      $scope.prevQuery = function(selectedTheme){
        var idx = $scope.themes.indexOf(selectedTheme);
        $scope.selectedTheme.expanded = false;
        $scope.selectedTheme = (idx > 0) ? $scope.themes[idx-1] : $scope.themes[$scope.themes.length-1];
        $scope.selectedTheme.expanded = true;
        $scope.activeQuery = ($scope.activeQuery>0) ? $scope.activeQuery-1 : 0;
      };
      $scope.nextQuery = function(selectedTheme){
        var idx = $scope.themes.indexOf(selectedTheme);
        $scope.selectedTheme.expanded = false;
        $scope.selectedTheme = (idx < $scope.themes.length - 1) ? $scope.themes[idx+1] : $scope.themes[0];
        $scope.selectedTheme.expanded = true;
        $scope.activeQuery = ($scope.activeQuery<$scope.queryCount) ? $scope.activeQuery+1 : $scope.queryCount;
      };
      function extractLibQueries(questions){
        var libqueries = [];
        questions.forEach(function(question, index){
          if(question.use_in_library){
            libqueries.push(question);
          }
        });
        return libqueries;
      }
      $scope.questions = $scope.$storage.questions;
      var extractedLibQueries = extractLibQueries($scope.questions);
      queryHandler(extractedLibQueries);
      //
      $scope.savedResources = $scope.$storage.savedResources || [];
      $scope.hideSavedResources = true;
      $scope.bookMark = function(resource){
        var el = document.querySelector(".book-marker");
        el.classList.add("saving");
        $timeout(function(){
          el.classList.remove("saving");
        }, 1100);
        if(resource.saved){
          resource.saved = false;
          $scope.savedResources.splice($scope.savedResources.getIndexBy('title', resource.title), 1);
        } else {
          resource.saved = true;
          $scope.savedResources.push(resource);
        }
        var serial = JSON.stringify($scope.savedResources);
        apiSrv.request('PUT', 'assessments/'+$scope.finderCode+'/', {saved_resources: serial}, function(data){
          $scope.$storage.savedResources = JSON.parse(data.saved_resources);
          markSavedResources();
        }, function(err){
          $log.error(err);
        });
      };
      $scope.showSavedResources = function(){
        var el = document.querySelector(".book-marker");
        if($scope.hideSavedResources){
          $scope.hideSavedResources = false;
        } else {
          $scope.hideSavedResources = true;
        }
      };
      function markSavedResources(){
        for(var i=0;i<$scope.savedResources.length;i++){
          var title = $scope.savedResources[i].title;
          var resourceIndex = $scope.allResources.getIndexBy('title', title);
          if(resourceIndex !== -1 && $scope.allResources[resourceIndex]){
            $scope.allResources[resourceIndex].saved = true;
          }
        }
      }
      //
      $scope.allResources = [];
      // var allResourcesTmp = [];
      $scope.resourceOffset = 20;
      $scope.resourceTotal = 1000;
      function resourceHandler(resources){
        // $log.info(resources);
        if(resources.result && resources.result.length > 0){
          $scope.resourceTotal = resources.metadata.resultset.count;
          // allResourcesTmp.push.apply(allResourcesTmp, resources.result);
          // var x = makeUnique(allResourcesTmp, $scope.allResources);
          // $scope.allResources = x.r;
          $scope.allResources.push.apply($scope.allResources, resources.result);
          markSavedResources();
          var offset = isNaN(parseInt(resources.metadata.resultset.offset)) ? 0 : parseInt(resources.metadata.resultset.offset);
          // var incrementedOffset = offset + (20-x.n);
          var incrementedOffset = offset + 20;
          $scope.resourceOffset = incrementedOffset;
        } else {
          document.querySelector('#rLoader').innerHTML = "<a onclick='document.querySelector(\"body\").scrollTop = 0;'><span class='fa fa-angle-double-up'></span><span>back to top</span></a>";
          return false;
        }
      }
      $scope.expandTheme = function(theme){
        $scope.selectedTheme = theme;
        $scope.selectedTheme.expanded = true;
      };
      //
      $scope.selectThemeAndTopic = function(selection){
        document.querySelector('.resource-search form input').value = '';
        var theme = selection.theme,
            topic = selection.topic;
        //
        $scope.filtersOpen = false;
        document.getElementById('resources').setAttribute('infinitescroll', 20);
        $scope.resourceTotal = 1000;
        //
        if(theme === $scope.selectedTheme){
          $scope.allResources = [];
          showLoadingSpinner('#rLoader');
          $scope.filters.offset = 0;
          $scope.filters.resource_action = '';
          $scope.filters.theme = theme.name.toLowerCase();
          var topicList = $scope.filters.topic.length > 0 ? $scope.filters.topic.split(",") : [];
          var tpc = topic.name.toLowerCase().replace(" & ", "_");
          if(topicList.indexOf(tpc) !== -1){
            topicList.splice(topicList.indexOf(tpc), 1);
          } else {
            topicList.push(tpc);
          }
          $scope.filters.topic = topicList.join(",");
          $scope.searchFilter.filter = topic.name.toLowerCase(); 
          searchResources();
        } else {
          $scope.selectedTheme = theme;
          $scope.filters.theme = theme.name.toLowerCase();
          $scope.filters.topic = '';
          $scope.filters.terms = '';
          // $scope.searchFilter = {filter: "all"};
          $scope.allResources = [];
          showLoadingSpinner('#rLoader');
          $scope.filters.offset = 0;
          $scope.filters.resource_action = '';
          var topicList2 = $scope.filters.topic.length > 0 ? $scope.filters.topic.split(",") : [];
          var tpc2 = topic.name.toLowerCase().replace(" & ", "_");
          if(topicList2.indexOf(tpc2) !== -1){
            topicList2.splice(topicList2.indexOf(tpc2), 1);
          } else {
            topicList2.push(tpc2);
          }
          $scope.filters.topic = topicList2.join(",");
          $scope.searchFilter.filter = topic.name.toLowerCase(); 
          searchResources();
        }
      };
      //
      $scope.selectTheme = function(theme){
        document.querySelector('.resource-search form input').value = '';
        $scope.filtersOpen = false;
        document.getElementById('resources').setAttribute('infinitescroll', 20);
        $scope.resourceTotal = 1000;
        if($scope.selectedTheme === theme){
          $scope.selectedTheme = null;
          searchResources({fetchAll: true});
        } else {
          $scope.selectedTheme = theme;
          $scope.filters.theme = theme.name;
          $scope.filters.topic = '';
          $scope.filters.offset = 0;
          $scope.filters.terms = '';
          $scope.filters.resource_action = '';
          $scope.searchFilter = {filter: "all"};
          searchResources();
        }
      };
      $scope.selectTopic = function(resOpts){
        document.querySelector('.resource-search form input').value = '';
        $scope.allResources = [];
        showLoadingSpinner('#rLoader');
        $scope.filters.offset = 0;
        $scope.filters.resource_action = '';
        $scope.filters.theme = resOpts.theme.toLowerCase();
        var topicList = $scope.filters.topic.length > 0 ? $scope.filters.topic.split(",") : [];
        var tpc = resOpts.topic.toLowerCase().replace(" & ", "_");
        if(topicList.indexOf(tpc) !== -1){
          topicList.splice(topicList.indexOf(tpc), 1);
        } else {
          topicList.push(tpc);
        }
        $scope.filters.topic = topicList.join(",");
        $scope.searchFilter.filter = resOpts.topic.toLowerCase(); 
        // $scope.searchFilter = {filter: "all"};
        searchResources();
      };
      $scope.fetchResources = function(){
        var theme = (typeof $scope.filters.theme === 'undefined') ? '' : $scope.filters.theme.toLowerCase(),
            topic = (typeof $scope.filters.topic === 'undefined') ? '' : $scope.filters.topic.toLowerCase(),
            resource_action = (typeof $scope.filters.resource_action === 'undefined') ? '' : $scope.filters.resource_action.toLowerCase(),
            scores = (typeof $scope.filters.scores === 'undefined') ? '0,1,2,3,4,5' : $scope.filters.scores,
            limit = (typeof $scope.filters.limit === 'undefined') ? 20 : $scope.filters.limit,
            offset = (typeof $scope.filters.offset === 'undefined') ? 0 : $scope.filters.offset,
            terms = (typeof $scope.filters.terms === 'undefined') ? '' : $scope.filters.terms.toLowerCase();
        apiSrv.getResources({
          limit: limit,
          offset: offset,
          theme: theme,
          topic: topic,
          resource_action: resource_action,
          scores: scores,
          q: terms
        }, resourceHandler, function(err){
          $log.error(err);
        });
      };
      // $scope.fetchResources();
      //
      $scope.$on('loadResources', function(){
        var offset = msgSrv.msgArgs.args.offset;
        if(msgSrv.msgArgs.args.reset){
          $scope.allResources = [];
          showLoadingSpinner('#rLoader');
        }
        $scope.filters.offset = offset;
        $scope.fetchResources();
      });
      //
      var qSet = [];
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
            if($scope.formData[question.id].choices[i].answer_text){
              var tmp = {
                answer_text: "",
                answer_score: question.choices[i].choice_value || ""
              };
              if($scope.formData[question.id].choices[i].other_text){
                tmp.answer_text = $scope.formData[question.id].choices[i].other_text || "";
              } else {
                tmp.answer_text = question.choices[i].choice_text || "";
              }
              $scope.formData[question.id].user_response.push(tmp);
            }
          }
          $scope.formData[question.id].score = 0;
          $scope.formData[question.id].user_response.forEach(function(r, i){
            $scope.formData[question.id].score += r.answer_score;
          });
        } else{
          if(question.question_type !== 'text'){
            $scope.formData[question.id].user_response[0].answer_text = choice.choice_text || "";
            $scope.formData[question.id].user_response[0].answer_score = choice.choice_value || 0;
            $scope.formData[question.id].score = choice.choice_value || 0;
          }
        }
        $scope.$storage.formData = $scope.formData;
        //
        qSet.push({
          theme: $scope.formData[question.id].resources_theme.name.toLowerCase(),
          scores: $scope.formData[question.id].score,
          topic: typeof($scope.formData[question.id].resources_topic) !== "undefined" ? typeof($scope.formData[question.id].resources_topic.name) !== "undefined" ? $scope.formData[question.id].resources_topic.name.toLowerCase().replace(" & ", "_") : "" : ""
        });
        var theme = qSet.map(function(q){return q.theme;}),
            topic = qSet.map(function(q){return q.topic;}),
            scores = qSet.map(function(q){return q.scores;});
        $scope.filters.theme = theme.clean("").join(",").toLowerCase();
        $scope.filters.topic = topic.clean("").join(",").toLowerCase();
        $scope.filters.scores = scores.clean("").join(",").toLowerCase();
        $scope.filters.offset = 0;
        $scope.filters.resource_action = '';
        $scope.allResources = [];
        showLoadingSpinner('#rLoader');
        $scope.searchFilter = {filter: "all"};
        $scope.fetchResources();
        var answers = extractAnswers($scope.formData);
        $scope.$storage.answers = answers;
      };
    }
  ])
;
angular.module('signalapp.controllers')
  .controller('miscCtrl', ['$rootScope','$scope','$log', 
    function($rootScope,$scope,$log){
      var bodyClass = $rootScope.$state.current.name;
      document.body.className = bodyClass;
    }
  ])
;
angular.module('signalapp.controllers')
  .controller('aboutCtrl', ['$scope', 
                           '$state', 
                           '$log',
                           '$sce',
                           'apiSrv',
    function($scope, $state, $log, $sce, apiSrv){
      $scope.supporters = [];
      $scope.collaborators = [];
      $scope.partners = [];
      function supporterHandler(data){
        data.forEach(function(item, index){
          if(item.link){
            item.linkUrl = (item.link.substr(0,7) === 'http://') ? item.link : "http://"+item.link;
            item.linkText = (item.link.substr(0,7) !== 'http://') ? item.link : item.link.replace("http://", "");
          }
          if(item.supporter_type === 'supporter'){
            $scope.supporters.push(item);
          } else if(item.supporter_type === 'collaborator'){
            $scope.collaborators.push(item);
          } else {
            $scope.partners.push(item);
          }
        });
      }
      apiSrv.request('GET', 'supporters', {}, supporterHandler, function(err){
        $log.error(err);
      });
    }
  ])
;
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
Array.prototype.includeAll = function(values){
  var includes = true;
  for(var i=0;i<values.length;i++){
    if(!this.includes(values[i])){
      includes = false;
    }
  }
  return values.length > 0 && includes;
};
var smoothScroll = function(element, options){
  options = options || {};
  var duration = 800,
      offset = options.offset || 0;

  var easing = function(n){
    return n < 0.5 ? 8 * Math.pow(n, 4) : 1 - 8 * (--n) * Math.pow(n, 3);
  };

  var getScrollLocation = function(){
    return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
  };

  setTimeout(function(){
    var startLocation = getScrollLocation(),
        timeLapsed = 0,
        percentage, position;

    var getEndLocation = function(element){
      var location = 0;
      if(element.offsetParent){
        do {
          location += element.offsetTop;
          element = element.offsetParent;
        } while (element);
      }
      location = Math.max(location - offset, 0);
      return location;
    };

    var endLocation = getEndLocation(element);
    var distance = endLocation - startLocation;

    var stopAnimation = function(){
      var currentLocation = getScrollLocation();
      if(position == endLocation || currentLocation == endLocation || ((window.innerHeight + currentLocation) >= document.body.scrollHeight)){
        clearInterval(runAnimation);
      }
    };

    var animateScroll = function(){
      timeLapsed += 16;
      percentage = (timeLapsed / duration);
      percentage = (percentage > 1) ? 1 : percentage;
      position = startLocation + (distance * easing(percentage));
      window.scrollTo(0, position);
      stopAnimation();
    };

    var runAnimation = setInterval(animateScroll, 16);
  }, 0);
};

function showLoadingSpinner(container){
  var el = document.querySelector(container);
  el.innerHTML = "<div class='loading'><img src='/static/assets/img/load.svg' alt='Loading'></div>";
}
function clearLoadingSpinner(container){
  var el = document.querySelector(container),
      l = el.querySelector('.loading');
  if(l){l.remove();}
}
function scrollToTop(){
  document.querySelector('body').scrollTop = 0;
  return false;
}
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
angular.module('signalapp.directives')
  .directive('graph', ['$localStorage', '$timeout', 'msgSrv',
    function($localStorage, $timeout, msgSrv){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          function saveSVG(){
            msgSrv.emitMsg('svgReady');
          }
          var rawData = msgSrv.getResults();

          var clickmanufacturing_arc,
              clickdevelopment_arc,
              clickcustomers_arc,
              clickdistribution_arc,
              clickcompetition_arc,
              clickbrand_arc,
              clicksales_arc,
              clicktechnical_arc,
              clickadvisory_arc,
              clickprocess_arc,
              clickmetrics_arc,
              clicklegal_arc,
              bulb,
              bulbImg;

          function removeGlows(){
            if(clickmanufacturing_arc.g){clickmanufacturing_arc.g.remove();}
            if(clickdevelopment_arc.g){clickdevelopment_arc.g.remove();}
            if(clickcustomers_arc.g){clickcustomers_arc.g.remove();}
            if(clickdistribution_arc.g){clickdistribution_arc.g.remove();}
            if(clickcompetition_arc.g){clickcompetition_arc.g.remove();}
            if(clickbrand_arc.g){clickbrand_arc.g.remove();}
            if(clicksales_arc.g){clicksales_arc.g.remove();}
            if(clicktechnical_arc.g){clicktechnical_arc.g.remove();}
            if(clickadvisory_arc.g){clickadvisory_arc.g.remove();}
            if(clickprocess_arc.g){clickprocess_arc.g.remove();}
            if(clickmetrics_arc.g){clickmetrics_arc.g.remove();}
            if(clicklegal_arc.g){clicklegal_arc.g.remove();}
          }
          //
          window.clickedSlices = window.clickedSlices||[];
          function fillOuterRing(){
            console.log(clickedSlices);
            // if(clickedSlices.includeAll(["Manufacturing", "Development"])){
            if(clickedSlices.indexOf("Manufacturing") !== -1 && clickedSlices.indexOf("Development") !== -1){
              // document.getElementById("p0").classList.add("hidden");
              document.getElementById("p0").setAttribute("class", "hidden");
              // document.getElementById("p1").classList.remove("hidden");
              document.getElementById("p1").setAttribute("class", document.getElementById("p1").getAttribute("class").replace("hidden", ""));
            }
            // if(clickedSlices.includeAll(["Customers", "Distribution", "Competition", "Brand"])){
            if(clickedSlices.indexOf("Customers") !== -1 && clickedSlices.indexOf("Distribution") !== -1 && clickedSlices.indexOf("Competition") !== -1 && clickedSlices.indexOf("Brand") !== -1){
              // document.getElementById("m0").classList.add("hidden");
              document.getElementById("m0").setAttribute("class", "hidden");
              // document.getElementById("m1").classList.remove("hidden");
              document.getElementById("m1").setAttribute("class", document.getElementById("m1").getAttribute("class").replace("hidden", ""));
            }
            // if(clickedSlices.includeAll(["Sales", "Technical", "Advisory"])){
            if(clickedSlices.indexOf("Sales") !== -1 && clickedSlices.indexOf("Technical") !== -1 && clickedSlices.indexOf("Advisory") !== -1){
              // document.getElementById("t0").classList.add("hidden");
              document.getElementById("t0").setAttribute("class", "hidden");
              // document.getElementById("t1").classList.remove("hidden");
              document.getElementById("t1").setAttribute("class", document.getElementById("t1").getAttribute("class").replace("hidden", ""));
            }
          }
          //
          var clickedSlice;
          function sliceClick(topic, slice){
            clickedSlices.push(topic);
            fillOuterRing();
            // if(clickedSlices.includeAll(["Productivity", "Metrics", "Legal"])){
            if(clickedSlices.indexOf("Productivity") !== -1 && clickedSlices.indexOf("Metrics") !== -1 && clickedSlices.indexOf("Legal") !== -1){
              // document.getElementById("o0").classList.add("hidden");
              document.getElementById("o0").setAttribute("class", "hidden");
              // document.getElementById("o1").classList.remove("hidden");
              document.getElementById("o1").setAttribute("class", document.getElementById("o1").getAttribute("class").replace("hidden", ""));
            }
            if(clickedSlice === topic){
              clickedSlice = null;
              removeGlows();
              msgSrv.emitMsg('showResults', {topic: ''});
            } else {
              topicClicked = true;
              msgSrv.emitMsg('showResults', {topic: topic});
              removeGlows();
              slice.g = slice.glow({
                color: "#fff",
                fill: true,
                width: 25,
                opacity: 0.5
              });
              clickedSlice = topic;
              $timeout(function(){
                slice.g.remove();
                clickedSlice = null;
              }, 1000);
            }
          }

          function waitForResults(){
            if(rawData.length < 1){
              rawData = msgSrv.getResults();
              $timeout(waitForResults, 500);
            } else {
              var data = [
                {
                  "data": {}
                }
              ];
              for(var i in rawData){
                data[0].data[rawData[i].topic] = Math.ceil(rawData[i].score);
              }
              //
              var paper = Raphael('graphObj');
              paper.canvas.id = "canvas";
              // var outer_circle = paper.image("/static/assets/img/outer.svg", 0, -1, 820, 820);
              //
              var outer_circle_p0 = paper.image("/static/assets/img/svg/radar map/product_off.svg", 0, -1, 820, 820);
              outer_circle_p0[0].id = "p0";
              // outer_circle_p0[0].classList.add("initial");
              outer_circle_p0[0].setAttribute("class", "initial");
              var outer_circle_p1 = paper.image("/static/assets/img/svg/radar map/product_on.svg", 0, -1, 820, 820);
              outer_circle_p1[0].id = "p1";
              // outer_circle_p1[0].classList.add("hidden");
              outer_circle_p1[0].setAttribute("class", "hidden");
              //
              var outer_circle_m0 = paper.image("/static/assets/img/svg/radar map/market_off.svg", 0, -1, 820, 820);
              outer_circle_m0[0].id = "m0";
              // outer_circle_m0[0].classList.add("initial");
              outer_circle_m0[0].setAttribute("class", "initial");
              var outer_circle_m1 = paper.image("/static/assets/img/svg/radar map/market_on.svg", 0, -1, 820, 820);
              outer_circle_m1[0].id = "m1";
              // outer_circle_m1[0].classList.add("hidden");
              outer_circle_m1[0].setAttribute("class", "hidden");
              //
              var outer_circle_t0 = paper.image("/static/assets/img/svg/radar map/team_off.svg", 0, -1, 820, 820);
              outer_circle_t0[0].id = "t0";
              // outer_circle_t0[0].classList.add("initial");
              outer_circle_t0[0].setAttribute("class", "initial");
              var outer_circle_t1 = paper.image("/static/assets/img/svg/radar map/team_on.svg", 0, -1, 820, 820);
              outer_circle_t1[0].id = "t1";
              // outer_circle_t1[0].classList.add("hidden");
              outer_circle_t1[0].setAttribute("class", "hidden");
              //
              var outer_circle_o0 = paper.image("/static/assets/img/svg/radar map/operations_off.svg", 0, -1, 820, 820);
              outer_circle_o0[0].id = "o0";
              // outer_circle_o0[0].classList.add("initial");
              outer_circle_o0[0].setAttribute("class", "initial");
              var outer_circle_o1 = paper.image("/static/assets/img/svg/radar map/operations_on.svg", 0, -1, 820, 820);
              outer_circle_o1[0].id = "o1";
              // outer_circle_o1[0].classList.add("hidden");
              outer_circle_o1[0].setAttribute("class", "hidden");
              //
              var inner_circle = paper.circle(410, 410, 290);
              inner_circle.attr('stroke', '#fff');
              inner_circle.attr('stroke-width', 10);

              var circle = paper.circle(410, 410, 285);
              // //
              var manufacturing_score = data[0].data.Manufacturing,
                  development_score = data[0].data.Development,
                  customers_score = data[0].data.Customers,
                  distribution_score = data[0].data.Distribution,
                  competition_score = data[0].data.Competition,
                  brand_score = data[0].data.Brand,
                  sales_score = data[0].data.Sales,
                  technical_score = data[0].data.Technical,
                  advisory_score = data[0].data.Advisory,
                  process_score = data[0].data.Productivity,
                  metrics_score = data[0].data['Models & Metrics'],
                  legal_score = data[0].data.Legal;
              //
              var manufacturing_total = 4,
                  development_total = 5,
                  customers_total = 5,
                  distribution_total = 3,
                  competition_total = 3,
                  brand_total = 3,
                  sales_total = 10,
                  technical_total = 10,
                  advisory_total = 6,
                  process_total = 5,
                  metrics_total = 3,
                  legal_total = 4;
              var startPointX = 410,
                  startPointY = 410,
                  radius = 286,
                  product_startAngle = 315,
                  product_endAngle = 225,
                    manufacturing_startAngle = 225,
                    manufacturing_endAngle = 270,
                    development_startAngle = 270,
                    development_endAngle = 315,
                  market_startAngle = 45,
                  market_endAngle = 315,
                    customers_startAngle = 315,
                    customers_endAngle = 337,
                    distribution_startAngle = 337,
                    distribution_endAngle = 0,
                    competition_startAngle = 0,
                    competition_endAngle = 22,
                    brand_startAngle = 22,
                    brand_endAngle = 45,
                  team_startAngle = 135,
                  team_endAngle = 45,
                    sales_startAngle = 45,
                    sales_endAngle = 80,
                    technical_startAngle = 80,
                    technical_endAngle = 115,
                    advisory_startAngle = 115,
                    advisory_endAngle = 135,
                  operations_startAngle = 225,
                  operations_endAngle = 135,
                    process_startAngle = 135,
                    process_endAngle = 165,
                    metrics_startAngle = 165,
                    metrics_endAngle = 195,
                    legal_startAngle = 195,
                    legal_endAngle = 225;
              var product_x1 = startPointX + radius * Math.cos(Math.PI * product_startAngle/180); 
              var product_y1 = startPointY + radius * Math.sin(Math.PI * product_startAngle/180);     
              var product_x2 = startPointX + radius * Math.cos(Math.PI * product_endAngle/180);
              var product_y2 = startPointY + radius * Math.sin(Math.PI * product_endAngle/180);
              var product_path = "M410,410 L" + product_x1 + "," + product_y1 + " A285,285 0 0,0 " + product_x2 + "," + product_y2 + " z";
              var product_arc = paper.path(product_path);
              product_arc.attr("stroke-width", 1);
              product_arc.attr("stroke", "#fff");
              product_arc.attr("fill", "#e1edfb");
              //
                var manufacturing_x1 = startPointX + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_startAngle/180); 
                var manufacturing_y1 = startPointY + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_startAngle/180);     
                var manufacturing_x2 = startPointX + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_endAngle/180);
                var manufacturing_y2 = startPointY + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_endAngle/180);
                var manufacturing_path = "M410,410 L" + manufacturing_x1 + "," + manufacturing_y1 + " A"+(radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total)))+","+(radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total)))+" 0 0,1 " + manufacturing_x2 + "," + manufacturing_y2 + " z";
                var manufacturing_arc = paper.path(manufacturing_path);
                manufacturing_arc.attr("stroke-width", 1);
                manufacturing_arc.attr("stroke", "#fff");
                manufacturing_arc.attr("fill", "#8bbbeb");
                //
                  for(var i2=0;i2<manufacturing_total;i2++){
                    var _manufacturing_x1 = startPointX + (radius - (i2*(radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_startAngle/180); 
                    var _manufacturing_y1 = startPointY + (radius - (i2*(radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_startAngle/180);     
                    var _manufacturing_x2 = startPointX + (radius - (i2*(radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_endAngle/180);
                    var _manufacturing_y2 = startPointY + (radius - (i2*(radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_endAngle/180);
                    var _manufacturing_path = "M410,410 L" + _manufacturing_x1 + "," + _manufacturing_y1 + " A"+(radius - (i2*(radius/manufacturing_total)))+","+(radius - (i2*(radius/manufacturing_total)))+" 0 0,1 " + _manufacturing_x2 + "," + _manufacturing_y2 + " z";
                    var _manufacturing_arc = paper.path(_manufacturing_path);
                    _manufacturing_arc.attr("stroke-width", 1);
                    _manufacturing_arc.attr("stroke", "#fff");
                  }
                //
                var clickmanufacturing_x1 = startPointX + 345 * Math.cos(Math.PI * manufacturing_startAngle/180); 
                var clickmanufacturing_y1 = startPointY + 345 * Math.sin(Math.PI * manufacturing_startAngle/180);     
                var clickmanufacturing_x2 = startPointX + 345 * Math.cos(Math.PI * manufacturing_endAngle/180);
                var clickmanufacturing_y2 = startPointY + 345 * Math.sin(Math.PI * manufacturing_endAngle/180);
                var clickmanufacturing_path = "M410,410 L" + clickmanufacturing_x1 + "," + clickmanufacturing_y1 + " A345,345 0 0,1 " + clickmanufacturing_x2 + "," + clickmanufacturing_y2 + " z";
                clickmanufacturing_arc = paper.path(clickmanufacturing_path);
                clickmanufacturing_arc.attr("stroke-width", 0);
                clickmanufacturing_arc.attr("stroke", "#fff");
                clickmanufacturing_arc.attr("fill", "#000");
                clickmanufacturing_arc.attr("fill-opacity", "0.0");
                clickmanufacturing_arc.click(function(e){
                  sliceClick("Manufacturing", this);
                });

                //
                var development_x1 = startPointX + (radius - ((development_total-development_score) * (radius/development_total))) * Math.cos(Math.PI * development_startAngle/180); 
                var development_y1 = startPointY + (radius - ((development_total-development_score) * (radius/development_total))) * Math.sin(Math.PI * development_startAngle/180);     
                var development_x2 = startPointX + (radius - ((development_total-development_score) * (radius/development_total))) * Math.cos(Math.PI * development_endAngle/180);
                var development_y2 = startPointY + (radius - ((development_total-development_score) * (radius/development_total))) * Math.sin(Math.PI * development_endAngle/180);
                var development_path = "M410,410 L" + development_x1 + "," + development_y1 + " A"+(radius - ((development_total-development_score) * (radius/development_total)))+","+(radius - ((development_total-development_score) * (radius/development_total)))+" 0 0,1 " + development_x2 + "," + development_y2 + " z";
                var development_arc = paper.path(development_path);
                development_arc.attr("stroke-width", 1);
                development_arc.attr("stroke", "#fff");
                development_arc.attr("fill", "#8bbbeb");
                //
                  for(var i3=0;i3<development_total;i3++){
                    var _development_x1 = startPointX + (radius - (i3*(radius/development_total))) * Math.cos(Math.PI * development_startAngle/180); 
                    var _development_y1 = startPointY + (radius - (i3*(radius/development_total))) * Math.sin(Math.PI * development_startAngle/180);     
                    var _development_x2 = startPointX + (radius - (i3*(radius/development_total))) * Math.cos(Math.PI * development_endAngle/180);
                    var _development_y2 = startPointY + (radius - (i3*(radius/development_total))) * Math.sin(Math.PI * development_endAngle/180);
                    var _development_path = "M410,410 L" + _development_x1 + "," + _development_y1 + " A"+(radius - (i3*(radius/development_total)))+","+(radius - (i3*(radius/development_total)))+" 0 0,1 " + _development_x2 + "," + _development_y2 + " z";
                    var _development_arc = paper.path(_development_path);
                    _development_arc.attr("stroke-width", 1);
                    _development_arc.attr("stroke", "#fff");
                  }
                //
                var clickdevelopment_x1 = startPointX + 345 * Math.cos(Math.PI * development_startAngle/180); 
                var clickdevelopment_y1 = startPointY + 345 * Math.sin(Math.PI * development_startAngle/180);     
                var clickdevelopment_x2 = startPointX + 345 * Math.cos(Math.PI * development_endAngle/180);
                var clickdevelopment_y2 = startPointY + 345 * Math.sin(Math.PI * development_endAngle/180);
                var clickdevelopment_path = "M410,410 L" + clickdevelopment_x1 + "," + clickdevelopment_y1 + " A345,345 0 0,1 " + clickdevelopment_x2 + "," + clickdevelopment_y2 + " z";
                clickdevelopment_arc = paper.path(clickdevelopment_path);
                clickdevelopment_arc.attr("stroke-width", 0);
                clickdevelopment_arc.attr("stroke", "#fff");
                clickdevelopment_arc.attr("fill", "#000");
                clickdevelopment_arc.attr("fill-opacity", "0.0");
                clickdevelopment_arc.click(function(e){
                  sliceClick("Development", this);
                });
                //
              var market_x1 = startPointX + radius * Math.cos(Math.PI * market_startAngle/180); 
              var market_y1 = startPointY + radius * Math.sin(Math.PI * market_startAngle/180);     
              var market_x2 = startPointX + radius * Math.cos(Math.PI * market_endAngle/180);
              var market_y2 = startPointY + radius * Math.sin(Math.PI * market_endAngle/180);
              var market_path = "M410,410 L" + market_x1 + "," + market_y1 + " A285,285 0 0,0 " + market_x2 + "," + market_y2 + " z";
              var market_arc = paper.path(market_path);
              market_arc.attr("stroke-width", 1);
              market_arc.attr("stroke", "#fff");
              market_arc.attr("fill", "#fff4c8");
              //
                var customers_x1 = startPointX + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.cos(Math.PI * customers_startAngle/180); 
                var customers_y1 = startPointY + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.sin(Math.PI * customers_startAngle/180);     
                var customers_x2 = startPointX + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.cos(Math.PI * customers_endAngle/180);
                var customers_y2 = startPointY + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.sin(Math.PI * customers_endAngle/180);
                var customers_path = "M410,410 L" + customers_x1 + "," + customers_y1 + " A"+(radius - ((customers_total-customers_score) * (radius/customers_total)))+","+(radius - ((customers_total-customers_score) * (radius/customers_total)))+" 0 0,1 " + customers_x2 + "," + customers_y2 + " z";
                var customers_arc = paper.path(customers_path);
                customers_arc.attr("stroke-width", 1);
                customers_arc.attr("stroke", "#fff");
                customers_arc.attr("fill", "#ffcf2a");
                //
                  for(var i4=0;i4<customers_total;i4++){
                    var _customers_x1 = startPointX + (radius - (i4*(radius/customers_total))) * Math.cos(Math.PI * customers_startAngle/180); 
                    var _customers_y1 = startPointY + (radius - (i4*(radius/customers_total))) * Math.sin(Math.PI * customers_startAngle/180);     
                    var _customers_x2 = startPointX + (radius - (i4*(radius/customers_total))) * Math.cos(Math.PI * customers_endAngle/180);
                    var _customers_y2 = startPointY + (radius - (i4*(radius/customers_total))) * Math.sin(Math.PI * customers_endAngle/180);
                    var _customers_path = "M410,410 L" + _customers_x1 + "," + _customers_y1 + " A"+(radius - (i4*(radius/customers_total)))+","+(radius - (i4*(radius/customers_total)))+" 0 0,1 " + _customers_x2 + "," + _customers_y2 + " z";
                    var _customers_arc = paper.path(_customers_path);
                    _customers_arc.attr("stroke-width", 1);
                    _customers_arc.attr("stroke", "#fff");
                  }
                //
                var clickcustomers_x1 = startPointX + 345 * Math.cos(Math.PI * customers_startAngle/180); 
                var clickcustomers_y1 = startPointY + 345 * Math.sin(Math.PI * customers_startAngle/180);     
                var clickcustomers_x2 = startPointX + 345 * Math.cos(Math.PI * customers_endAngle/180);
                var clickcustomers_y2 = startPointY + 345 * Math.sin(Math.PI * customers_endAngle/180);
                var clickcustomers_path = "M410,410 L" + clickcustomers_x1 + "," + clickcustomers_y1 + " A345,345 0 0,1 " + clickcustomers_x2 + "," + clickcustomers_y2 + " z";
                clickcustomers_arc = paper.path(clickcustomers_path);
                clickcustomers_arc.attr("stroke-width", 0);
                clickcustomers_arc.attr("stroke", "#fff");
                clickcustomers_arc.attr("fill", "#000");
                clickcustomers_arc.attr("fill-opacity", "0.0");
                clickcustomers_arc.click(function(e){
                  sliceClick("Customers", this);
                });
                //
                var distribution_x1 = startPointX + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.cos(Math.PI * distribution_startAngle/180); 
                var distribution_y1 = startPointY + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.sin(Math.PI * distribution_startAngle/180);     
                var distribution_x2 = startPointX + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.cos(Math.PI * distribution_endAngle/180);
                var distribution_y2 = startPointY + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.sin(Math.PI * distribution_endAngle/180);
                var distribution_path = "M410,410 L" + distribution_x1 + "," + distribution_y1 + " A"+(radius - ((distribution_total-distribution_score) * (radius/distribution_total)))+","+(radius - ((distribution_total-distribution_score) * (radius/distribution_total)))+" 0 0,1 " + distribution_x2 + "," + distribution_y2 + " z";
                var distribution_arc = paper.path(distribution_path);
                distribution_arc.attr("stroke-width", 1);
                distribution_arc.attr("stroke", "#fff");
                distribution_arc.attr("fill", "#ffcf2a");
                //
                  for(var i5=0;i5<distribution_total;i5++){
                    var _distribution_x1 = startPointX + (radius - (i5*(radius/distribution_total))) * Math.cos(Math.PI * distribution_startAngle/180); 
                    var _distribution_y1 = startPointY + (radius - (i5*(radius/distribution_total))) * Math.sin(Math.PI * distribution_startAngle/180);     
                    var _distribution_x2 = startPointX + (radius - (i5*(radius/distribution_total))) * Math.cos(Math.PI * distribution_endAngle/180);
                    var _distribution_y2 = startPointY + (radius - (i5*(radius/distribution_total))) * Math.sin(Math.PI * distribution_endAngle/180);
                    var _distribution_path = "M410,410 L" + _distribution_x1 + "," + _distribution_y1 + " A"+(radius - (i5*(radius/distribution_total)))+","+(radius - (i5*(radius/distribution_total)))+" 0 0,1 " + _distribution_x2 + "," + _distribution_y2 + " z";
                    var _distribution_arc = paper.path(_distribution_path);
                    _distribution_arc.attr("stroke-width", 1);
                    _distribution_arc.attr("stroke", "#fff");
                  }
                //
                var clickdistribution_x1 = startPointX + 345 * Math.cos(Math.PI * distribution_startAngle/180); 
                var clickdistribution_y1 = startPointY + 345 * Math.sin(Math.PI * distribution_startAngle/180);     
                var clickdistribution_x2 = startPointX + 345 * Math.cos(Math.PI * distribution_endAngle/180);
                var clickdistribution_y2 = startPointY + 345 * Math.sin(Math.PI * distribution_endAngle/180);
                var clickdistribution_path = "M410,410 L" + clickdistribution_x1 + "," + clickdistribution_y1 + " A345,345 0 0,1 " + clickdistribution_x2 + "," + clickdistribution_y2 + " z";
                clickdistribution_arc = paper.path(clickdistribution_path);
                clickdistribution_arc.attr("stroke-width", 0);
                clickdistribution_arc.attr("stroke", "#fff");
                clickdistribution_arc.attr("fill", "#000");
                clickdistribution_arc.attr("fill-opacity", "0.0");
                clickdistribution_arc.click(function(e){
                  sliceClick("Distribution", this);
                });
                //
                var competition_x1 = startPointX + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.cos(Math.PI * competition_startAngle/180); 
                var competition_y1 = startPointY + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.sin(Math.PI * competition_startAngle/180);     
                var competition_x2 = startPointX + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.cos(Math.PI * competition_endAngle/180);
                var competition_y2 = startPointY + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.sin(Math.PI * competition_endAngle/180);
                var competition_path = "M410,410 L" + competition_x1 + "," + competition_y1 + " A"+(radius - ((competition_total-competition_score) * (radius/competition_total)))+","+(radius - ((competition_total-competition_score) * (radius/competition_total)))+" 0 0,1 " + competition_x2 + "," + competition_y2 + " z";
                var competition_arc = paper.path(competition_path);
                competition_arc.attr("stroke-width", 1);
                competition_arc.attr("stroke", "#fff");
                competition_arc.attr("fill", "#ffcf2a");
                //
                  for(var i6=0;i6<competition_total;i6++){
                    var _competition_x1 = startPointX + (radius - (i6*(radius/competition_total))) * Math.cos(Math.PI * competition_startAngle/180); 
                    var _competition_y1 = startPointY + (radius - (i6*(radius/competition_total))) * Math.sin(Math.PI * competition_startAngle/180);     
                    var _competition_x2 = startPointX + (radius - (i6*(radius/competition_total))) * Math.cos(Math.PI * competition_endAngle/180);
                    var _competition_y2 = startPointY + (radius - (i6*(radius/competition_total))) * Math.sin(Math.PI * competition_endAngle/180);
                    var _competition_path = "M410,410 L" + _competition_x1 + "," + _competition_y1 + " A"+(radius - (i6*(radius/competition_total)))+","+(radius - (i6*(radius/competition_total)))+" 0 0,1 " + _competition_x2 + "," + _competition_y2 + " z";
                    var _competition_arc = paper.path(_competition_path);
                    _competition_arc.attr("stroke-width", 1);
                    _competition_arc.attr("stroke", "#fff");
                  }
                //
                var clickcompetition_x1 = startPointX + 345 * Math.cos(Math.PI * competition_startAngle/180); 
                var clickcompetition_y1 = startPointY + 345 * Math.sin(Math.PI * competition_startAngle/180);     
                var clickcompetition_x2 = startPointX + 345 * Math.cos(Math.PI * competition_endAngle/180);
                var clickcompetition_y2 = startPointY + 345 * Math.sin(Math.PI * competition_endAngle/180);
                var clickcompetition_path = "M410,410 L" + clickcompetition_x1 + "," + clickcompetition_y1 + " A345,345 0 0,1 " + clickcompetition_x2 + "," + clickcompetition_y2 + " z";
                clickcompetition_arc = paper.path(clickcompetition_path);
                clickcompetition_arc.attr("stroke-width", 0);
                clickcompetition_arc.attr("stroke", "#fff");
                clickcompetition_arc.attr("fill", "#000");
                clickcompetition_arc.attr("fill-opacity", "0.0");
                clickcompetition_arc.click(function(e){
                  sliceClick("Competition", this);
                });
                //
                var brand_x1 = startPointX + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.cos(Math.PI * brand_startAngle/180); 
                var brand_y1 = startPointY + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.sin(Math.PI * brand_startAngle/180);     
                var brand_x2 = startPointX + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.cos(Math.PI * brand_endAngle/180);
                var brand_y2 = startPointY + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.sin(Math.PI * brand_endAngle/180);
                var brand_path = "M410,410 L" + brand_x1 + "," + brand_y1 + " A"+(radius - ((brand_total-brand_score) * (radius/brand_total)))+","+(radius - ((brand_total-brand_score) * (radius/brand_total)))+" 0 0,1 " + brand_x2 + "," + brand_y2 + " z";
                var brand_arc = paper.path(brand_path);
                brand_arc.attr("stroke-width", 1);
                brand_arc.attr("stroke", "#fff");
                brand_arc.attr("fill", "#ffcf2a");
                //
                  for(var i7=0;i7<brand_total;i7++){
                    var _brand_x1 = startPointX + (radius - (i7*(radius/brand_total))) * Math.cos(Math.PI * brand_startAngle/180); 
                    var _brand_y1 = startPointY + (radius - (i7*(radius/brand_total))) * Math.sin(Math.PI * brand_startAngle/180);     
                    var _brand_x2 = startPointX + (radius - (i7*(radius/brand_total))) * Math.cos(Math.PI * brand_endAngle/180);
                    var _brand_y2 = startPointY + (radius - (i7*(radius/brand_total))) * Math.sin(Math.PI * brand_endAngle/180);
                    var _brand_path = "M410,410 L" + _brand_x1 + "," + _brand_y1 + " A"+(radius - (i7*(radius/brand_total)))+","+(radius - (i7*(radius/brand_total)))+" 0 0,1 " + _brand_x2 + "," + _brand_y2 + " z";
                    var _brand_arc = paper.path(_brand_path);
                    _brand_arc.attr("stroke-width", 1);
                    _brand_arc.attr("stroke", "#fff");
                  }
                //
                var clickbrand_x1 = startPointX + 345 * Math.cos(Math.PI * brand_startAngle/180); 
                var clickbrand_y1 = startPointY + 345 * Math.sin(Math.PI * brand_startAngle/180);     
                var clickbrand_x2 = startPointX + 345 * Math.cos(Math.PI * brand_endAngle/180);
                var clickbrand_y2 = startPointY + 345 * Math.sin(Math.PI * brand_endAngle/180);
                var clickbrand_path = "M410,410 L" + clickbrand_x1 + "," + clickbrand_y1 + " A345,345 0 0,1 " + clickbrand_x2 + "," + clickbrand_y2 + " z";
                clickbrand_arc = paper.path(clickbrand_path);
                clickbrand_arc.attr("stroke-width", 0);
                clickbrand_arc.attr("stroke", "#fff");
                clickbrand_arc.attr("fill", "#000");
                clickbrand_arc.attr("fill-opacity", "0.0");
                clickbrand_arc.click(function(e){
                  sliceClick("Brand", this);
                });
                //
              var team_x1 = startPointX + radius * Math.cos(Math.PI * team_startAngle/180); 
              var team_y1 = startPointY + radius * Math.sin(Math.PI * team_startAngle/180);     
              var team_x2 = startPointX + radius * Math.cos(Math.PI * team_endAngle/180);
              var team_y2 = startPointY + radius * Math.sin(Math.PI * team_endAngle/180);
              var team_path = "M410,410 L" + team_x1 + "," + team_y1 + " A285,285 0 0,0 " + team_x2 + "," + team_y2 + " z";
              var team_arc = paper.path(team_path);
              team_arc.attr("stroke-width", 1);
              team_arc.attr("stroke", "#fff");
              team_arc.attr("fill", "#e4f9f8");
              //
                var sales_x1 = startPointX + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.cos(Math.PI * sales_startAngle/180); 
                var sales_y1 = startPointY + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.sin(Math.PI * sales_startAngle/180);     
                var sales_x2 = startPointX + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.cos(Math.PI * sales_endAngle/180);
                var sales_y2 = startPointY + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.sin(Math.PI * sales_endAngle/180);
                var sales_path = "M410,410 L" + sales_x1 + "," + sales_y1 + " A"+(radius - ((sales_total-sales_score) * (radius/sales_total)))+","+(radius - ((sales_total-sales_score) * (radius/sales_total)))+" 0 0,1 " + sales_x2 + "," + sales_y2 + " z";
                var sales_arc = paper.path(sales_path);
                sales_arc.attr("stroke-width", 1);
                sales_arc.attr("stroke", "#fff");
                sales_arc.attr("fill", "#97eae6");
                //
                  for(var i8=0;i8<sales_total;i8++){
                    var _sales_x1 = startPointX + (radius - (i8*(radius/sales_total))) * Math.cos(Math.PI * sales_startAngle/180); 
                    var _sales_y1 = startPointY + (radius - (i8*(radius/sales_total))) * Math.sin(Math.PI * sales_startAngle/180);     
                    var _sales_x2 = startPointX + (radius - (i8*(radius/sales_total))) * Math.cos(Math.PI * sales_endAngle/180);
                    var _sales_y2 = startPointY + (radius - (i8*(radius/sales_total))) * Math.sin(Math.PI * sales_endAngle/180);
                    var _sales_path = "M410,410 L" + _sales_x1 + "," + _sales_y1 + " A"+(radius - (i8*(radius/sales_total)))+","+(radius - (i8*(radius/sales_total)))+" 0 0,1 " + _sales_x2 + "," + _sales_y2 + " z";
                    var _sales_arc = paper.path(_sales_path);
                    _sales_arc.attr("stroke-width", 1);
                    _sales_arc.attr("stroke", "#fff");
                  }
                //
                var clicksales_x1 = startPointX + 345 * Math.cos(Math.PI * sales_startAngle/180); 
                var clicksales_y1 = startPointY + 345 * Math.sin(Math.PI * sales_startAngle/180);     
                var clicksales_x2 = startPointX + 345 * Math.cos(Math.PI * sales_endAngle/180);
                var clicksales_y2 = startPointY + 345 * Math.sin(Math.PI * sales_endAngle/180);
                var clicksales_path = "M410,410 L" + clicksales_x1 + "," + clicksales_y1 + " A345,345 0 0,1 " + clicksales_x2 + "," + clicksales_y2 + " z";
                clicksales_arc = paper.path(clicksales_path);
                clicksales_arc.attr("stroke-width", 0);
                clicksales_arc.attr("stroke", "#fff");
                clicksales_arc.attr("fill", "#000");
                clicksales_arc.attr("fill-opacity", "0.0");
                clicksales_arc.click(function(e){
                  sliceClick("Sales", this);
                });
                //
                var technical_x1 = startPointX + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.cos(Math.PI * technical_startAngle/180); 
                var technical_y1 = startPointY + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.sin(Math.PI * technical_startAngle/180);     
                var technical_x2 = startPointX + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.cos(Math.PI * technical_endAngle/180);
                var technical_y2 = startPointY + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.sin(Math.PI * technical_endAngle/180);
                var technical_path = "M410,410 L" + technical_x1 + "," + technical_y1 + " A"+(radius - ((technical_total-technical_score) * (radius/technical_total)))+","+(radius - ((technical_total-technical_score) * (radius/technical_total)))+" 0 0,1 " + technical_x2 + "," + technical_y2 + " z";
                var technical_arc = paper.path(technical_path);
                technical_arc.attr("stroke-width", 1);
                technical_arc.attr("stroke", "#fff");
                technical_arc.attr("fill", "#97eae6");
                //
                  for(var i9=0;i9<technical_total;i9++){
                    var _technical_x1 = startPointX + (radius - (i9*(radius/technical_total))) * Math.cos(Math.PI * technical_startAngle/180); 
                    var _technical_y1 = startPointY + (radius - (i9*(radius/technical_total))) * Math.sin(Math.PI * technical_startAngle/180);     
                    var _technical_x2 = startPointX + (radius - (i9*(radius/technical_total))) * Math.cos(Math.PI * technical_endAngle/180);
                    var _technical_y2 = startPointY + (radius - (i9*(radius/technical_total))) * Math.sin(Math.PI * technical_endAngle/180);
                    var _technical_path = "M410,410 L" + _technical_x1 + "," + _technical_y1 + " A"+(radius - (i9*(radius/technical_total)))+","+(radius - (i9*(radius/technical_total)))+" 0 0,1 " + _technical_x2 + "," + _technical_y2 + " z";
                    var _technical_arc = paper.path(_technical_path);
                    _technical_arc.attr("stroke-width", 1);
                    _technical_arc.attr("stroke", "#fff");
                  }
                //
                var clicktechnical_x1 = startPointX + 345 * Math.cos(Math.PI * technical_startAngle/180); 
                var clicktechnical_y1 = startPointY + 345 * Math.sin(Math.PI * technical_startAngle/180);     
                var clicktechnical_x2 = startPointX + 345 * Math.cos(Math.PI * technical_endAngle/180);
                var clicktechnical_y2 = startPointY + 345 * Math.sin(Math.PI * technical_endAngle/180);
                var clicktechnical_path = "M410,410 L" + clicktechnical_x1 + "," + clicktechnical_y1 + " A345,345 0 0,1 " + clicktechnical_x2 + "," + clicktechnical_y2 + " z";
                clicktechnical_arc = paper.path(clicktechnical_path);
                clicktechnical_arc.attr("stroke-width", 0);
                clicktechnical_arc.attr("stroke", "#fff");
                clicktechnical_arc.attr("fill", "#000");
                clicktechnical_arc.attr("fill-opacity", "0.0");
                clicktechnical_arc.click(function(e){
                  sliceClick("Technical", this);
                });
                //
                var advisory_x1 = startPointX + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.cos(Math.PI * advisory_startAngle/180); 
                var advisory_y1 = startPointY + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.sin(Math.PI * advisory_startAngle/180);     
                var advisory_x2 = startPointX + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.cos(Math.PI * advisory_endAngle/180);
                var advisory_y2 = startPointY + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.sin(Math.PI * advisory_endAngle/180);
                var advisory_path = "M410,410 L" + advisory_x1 + "," + advisory_y1 + " A"+(radius - ((advisory_total-advisory_score) * (radius/advisory_total)))+","+(radius - ((advisory_total-advisory_score) * (radius/advisory_total)))+" 0 0,1 " + advisory_x2 + "," + advisory_y2 + " z";
                var advisory_arc = paper.path(advisory_path);
                advisory_arc.attr("stroke-width", 1);
                advisory_arc.attr("stroke", "#fff");
                advisory_arc.attr("fill", "#97eae6");
                //
                  for(var i10=0;i10<advisory_total;i10++){
                    var _advisory_x1 = startPointX + (radius - (i10*(radius/advisory_total))) * Math.cos(Math.PI * advisory_startAngle/180); 
                    var _advisory_y1 = startPointY + (radius - (i10*(radius/advisory_total))) * Math.sin(Math.PI * advisory_startAngle/180);     
                    var _advisory_x2 = startPointX + (radius - (i10*(radius/advisory_total))) * Math.cos(Math.PI * advisory_endAngle/180);
                    var _advisory_y2 = startPointY + (radius - (i10*(radius/advisory_total))) * Math.sin(Math.PI * advisory_endAngle/180);
                    var _advisory_path = "M410,410 L" + _advisory_x1 + "," + _advisory_y1 + " A"+(radius - (i10*(radius/advisory_total)))+","+(radius - (i10*(radius/advisory_total)))+" 0 0,1 " + _advisory_x2 + "," + _advisory_y2 + " z";
                    var _advisory_arc = paper.path(_advisory_path);
                    _advisory_arc.attr("stroke-width", 1);
                    _advisory_arc.attr("stroke", "#fff");
                  }
                //
                var clickadvisory_x1 = startPointX + 345 * Math.cos(Math.PI * advisory_startAngle/180); 
                var clickadvisory_y1 = startPointY + 345 * Math.sin(Math.PI * advisory_startAngle/180);     
                var clickadvisory_x2 = startPointX + 345 * Math.cos(Math.PI * advisory_endAngle/180);
                var clickadvisory_y2 = startPointY + 345 * Math.sin(Math.PI * advisory_endAngle/180);
                var clickadvisory_path = "M410,410 L" + clickadvisory_x1 + "," + clickadvisory_y1 + " A345,345 0 0,1 " + clickadvisory_x2 + "," + clickadvisory_y2 + " z";
                clickadvisory_arc = paper.path(clickadvisory_path);
                clickadvisory_arc.attr("stroke-width", 0);
                clickadvisory_arc.attr("stroke", "#fff");
                clickadvisory_arc.attr("fill", "#000");
                clickadvisory_arc.attr("fill-opacity", "0.0");
                clickadvisory_arc.click(function(e){
                  sliceClick("Advisory", this);
                });
                //
              var operations_x1 = startPointX + radius * Math.cos(Math.PI * operations_startAngle/180); 
              var operations_y1 = startPointY + radius * Math.sin(Math.PI * operations_startAngle/180);     
              var operations_x2 = startPointX + radius * Math.cos(Math.PI * operations_endAngle/180);
              var operations_y2 = startPointY + radius * Math.sin(Math.PI * operations_endAngle/180);
              var operations_path = "M410,410 L" + operations_x1 + "," + operations_y1 + " A285,285 0 0,0 " + operations_x2 + "," + operations_y2 + " z";
              var operations_arc = paper.path(operations_path);
              operations_arc.attr("stroke-width", 1);
              operations_arc.attr("stroke", "#fff");
              operations_arc.attr("fill", "#f6e9d3");
              //
                var process_x1 = startPointX + (radius - ((process_total-process_score) * (radius/process_total))) * Math.cos(Math.PI * process_startAngle/180); 
                var process_y1 = startPointY + (radius - ((process_total-process_score) * (radius/process_total))) * Math.sin(Math.PI * process_startAngle/180);     
                var process_x2 = startPointX + (radius - ((process_total-process_score) * (radius/process_total))) * Math.cos(Math.PI * process_endAngle/180);
                var process_y2 = startPointY + (radius - ((process_total-process_score) * (radius/process_total))) * Math.sin(Math.PI * process_endAngle/180);
                var process_path = "M410,410 L" + process_x1 + "," + process_y1 + " A"+(radius - ((process_total-process_score) * (radius/process_total)))+","+(radius - ((process_total-process_score) * (radius/process_total)))+" 0 0,1 " + process_x2 + "," + process_y2 + " z";
                var process_arc = paper.path(process_path);
                process_arc.attr("stroke-width", 1);
                process_arc.attr("stroke", "#fff");
                process_arc.attr("fill", "#dea754");
                //
                  for(var i11=0;i11<process_total;i11++){
                    var _process_x1 = startPointX + (radius - (i11*(radius/process_total))) * Math.cos(Math.PI * process_startAngle/180); 
                    var _process_y1 = startPointY + (radius - (i11*(radius/process_total))) * Math.sin(Math.PI * process_startAngle/180);     
                    var _process_x2 = startPointX + (radius - (i11*(radius/process_total))) * Math.cos(Math.PI * process_endAngle/180);
                    var _process_y2 = startPointY + (radius - (i11*(radius/process_total))) * Math.sin(Math.PI * process_endAngle/180);
                    var _process_path = "M410,410 L" + _process_x1 + "," + _process_y1 + " A"+(radius - (i11*(radius/process_total)))+","+(radius - (i11*(radius/process_total)))+" 0 0,1 " + _process_x2 + "," + _process_y2 + " z";
                    var _process_arc = paper.path(_process_path);
                    _process_arc.attr("stroke-width", 1);
                    _process_arc.attr("stroke", "#fff");
                  }
                //
                var clickprocess_x1 = startPointX + 345 * Math.cos(Math.PI * process_startAngle/180); 
                var clickprocess_y1 = startPointY + 345 * Math.sin(Math.PI * process_startAngle/180);     
                var clickprocess_x2 = startPointX + 345 * Math.cos(Math.PI * process_endAngle/180);
                var clickprocess_y2 = startPointY + 345 * Math.sin(Math.PI * process_endAngle/180);
                var clickprocess_path = "M410,410 L" + clickprocess_x1 + "," + clickprocess_y1 + " A345,345 0 0,1 " + clickprocess_x2 + "," + clickprocess_y2 + " z";
                clickprocess_arc = paper.path(clickprocess_path);
                clickprocess_arc.attr("stroke-width", 0);
                clickprocess_arc.attr("stroke", "#fff");
                clickprocess_arc.attr("fill", "#000");
                clickprocess_arc.attr("fill-opacity", "0.0");
                clickprocess_arc.click(function(e){
                  sliceClick("Productivity", this);
                });
                //
                var metrics_x1 = startPointX + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.cos(Math.PI * metrics_startAngle/180); 
                var metrics_y1 = startPointY + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.sin(Math.PI * metrics_startAngle/180);     
                var metrics_x2 = startPointX + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.cos(Math.PI * metrics_endAngle/180);
                var metrics_y2 = startPointY + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.sin(Math.PI * metrics_endAngle/180);
                var metrics_path = "M410,410 L" + metrics_x1 + "," + metrics_y1 + " A"+(radius - ((metrics_total-metrics_score) * (radius/metrics_total)))+","+(radius - ((metrics_total-metrics_score) * (radius/metrics_total)))+" 0 0,1 " + metrics_x2 + "," + metrics_y2 + " z";
                var metrics_arc = paper.path(metrics_path);
                metrics_arc.attr("stroke-width", 1);
                metrics_arc.attr("stroke", "#fff");
                metrics_arc.attr("fill", "#dea754");
                //
                  for(var i12=0;i12<metrics_total;i12++){
                    var _metrics_x1 = startPointX + (radius - (i12*(radius/metrics_total))) * Math.cos(Math.PI * metrics_startAngle/180); 
                    var _metrics_y1 = startPointY + (radius - (i12*(radius/metrics_total))) * Math.sin(Math.PI * metrics_startAngle/180);     
                    var _metrics_x2 = startPointX + (radius - (i12*(radius/metrics_total))) * Math.cos(Math.PI * metrics_endAngle/180);
                    var _metrics_y2 = startPointY + (radius - (i12*(radius/metrics_total))) * Math.sin(Math.PI * metrics_endAngle/180);
                    var _metrics_path = "M410,410 L" + _metrics_x1 + "," + _metrics_y1 + " A"+(radius - (i12*(radius/metrics_total)))+","+(radius - (i12*(radius/metrics_total)))+" 0 0,1 " + _metrics_x2 + "," + _metrics_y2 + " z";
                    var _metrics_arc = paper.path(_metrics_path);
                    _metrics_arc.attr("stroke-width", 1);
                    _metrics_arc.attr("stroke", "#fff");
                  }
                //
                var clickmetrics_x1 = startPointX + 345 * Math.cos(Math.PI * metrics_startAngle/180); 
                var clickmetrics_y1 = startPointY + 345 * Math.sin(Math.PI * metrics_startAngle/180);     
                var clickmetrics_x2 = startPointX + 345 * Math.cos(Math.PI * metrics_endAngle/180);
                var clickmetrics_y2 = startPointY + 345 * Math.sin(Math.PI * metrics_endAngle/180);
                var clickmetrics_path = "M410,410 L" + clickmetrics_x1 + "," + clickmetrics_y1 + " A345,345 0 0,1 " + clickmetrics_x2 + "," + clickmetrics_y2 + " z";
                clickmetrics_arc = paper.path(clickmetrics_path);
                clickmetrics_arc.attr("stroke-width", 0);
                clickmetrics_arc.attr("stroke", "#fff");
                clickmetrics_arc.attr("fill", "#000");
                clickmetrics_arc.attr("fill-opacity", "0.0");
                clickmetrics_arc.click(function(e){
                  sliceClick("Metrics", this);
                });
                //
                var legal_x1 = startPointX + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.cos(Math.PI * legal_startAngle/180); 
                var legal_y1 = startPointY + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.sin(Math.PI * legal_startAngle/180);     
                var legal_x2 = startPointX + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.cos(Math.PI * legal_endAngle/180);
                var legal_y2 = startPointY + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.sin(Math.PI * legal_endAngle/180);
                var legal_path = "M410,410 L" + legal_x1 + "," + legal_y1 + " A"+(radius - ((legal_total-legal_score) * (radius/legal_total)))+","+(radius - ((legal_total-legal_score) * (radius/legal_total)))+" 0 0,1 " + legal_x2 + "," + legal_y2 + " z";
                var legal_arc = paper.path(legal_path);
                legal_arc.attr("stroke-width", 1);
                legal_arc.attr("stroke", "#fff");
                legal_arc.attr("fill", "#dea754");
                //
                  for(var i13=0;i13<legal_total;i13++){
                    var _legal_x1 = startPointX + (radius - (i13*(radius/legal_total))) * Math.cos(Math.PI * legal_startAngle/180); 
                    var _legal_y1 = startPointY + (radius - (i13*(radius/legal_total))) * Math.sin(Math.PI * legal_startAngle/180);     
                    var _legal_x2 = startPointX + (radius - (i13*(radius/legal_total))) * Math.cos(Math.PI * legal_endAngle/180);
                    var _legal_y2 = startPointY + (radius - (i13*(radius/legal_total))) * Math.sin(Math.PI * legal_endAngle/180);
                    var _legal_path = "M410,410 L" + _legal_x1 + "," + _legal_y1 + " A"+(radius - (i13*(radius/legal_total)))+","+(radius - (i13*(radius/legal_total)))+" 0 0,1 " + _legal_x2 + "," + _legal_y2 + " z";
                    var _legal_arc = paper.path(_legal_path);
                    _legal_arc.attr("stroke-width", 1);
                    _legal_arc.attr("stroke", "#fff");
                  }
                //

                //
                var clicklegal_x1 = startPointX + 345 * Math.cos(Math.PI * legal_startAngle/180); 
                var clicklegal_y1 = startPointY + 345 * Math.sin(Math.PI * legal_startAngle/180);     
                var clicklegal_x2 = startPointX + 345 * Math.cos(Math.PI * legal_endAngle/180);
                var clicklegal_y2 = startPointY + 345 * Math.sin(Math.PI * legal_endAngle/180);
                var clicklegal_path = "M410,410 L" + clicklegal_x1 + "," + clicklegal_y1 + " A345,345 0 0,1 " + clicklegal_x2 + "," + clicklegal_y2 + " z";
                clicklegal_arc = paper.path(clicklegal_path);
                clicklegal_arc.attr("stroke-width", 0);
                clicklegal_arc.attr("stroke", "#fff");
                clicklegal_arc.attr("fill", "#000");
                clicklegal_arc.attr("fill-opacity", "0.0");
                clicklegal_arc.click(function(e){
                  sliceClick("Legal", this);
                });
                //
              bulb = paper.circle(410, 410, 25);
              bulb[0].id = "bulb";
              bulb.attr('stroke', '#fff');
              bulb.attr('stroke-width', 2);
              bulb.attr('fill', '#eb2c15');
              bulbImg = paper.image("/static/assets/img/bulb.svg", 401, 396, 18, 29);
              bulbImg[0].id = "bulbImg";
              //
              // bulbImg.click(function(e){
              //   $scope.interpretModalActive = true;
              // });
              //
              var glow = function(){
                this.g = this.glow({
                  color: "#fff",
                  fill: true,
                  width: 25,
                  opacity: 0.5
                });
              };
              var unglow = function(){
                this.g.remove();
              };
              clickmanufacturing_arc.hover(glow, unglow);
              clickdevelopment_arc.hover(glow, unglow);
              clickcustomers_arc.hover(glow, unglow);
              clickdistribution_arc.hover(glow, unglow);
              clickcompetition_arc.hover(glow, unglow);
              clickbrand_arc.hover(glow, unglow);
              clicksales_arc.hover(glow, unglow);
              clicktechnical_arc.hover(glow, unglow);
              clickadvisory_arc.hover(glow, unglow);
              clickprocess_arc.hover(glow, unglow);
              clickmetrics_arc.hover(glow, unglow);
              clicklegal_arc.hover(glow, unglow);
              //
              saveSVG();
              //
              $timeout(function(){
                slice = clicklegal_arc;
                // flashSlice();
              }, 500);
            }
            fillOuterRing();
          }
          waitForResults();
        }
      };
    }
  ])
;
angular.module('signalapp.directives')
  .directive('scrollfix', ['$window', '$timeout',
    function($window, $timeout){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          var offset = $attrs.scrollfix,
              initial = angular.element($element)[0].offsetTop - offset;
          $timeout(function(){initial = angular.element($element)[0].offsetTop - offset;}, 500);
          if(offset === 0 || offset === '0'){
            angular.element($window).bind('scroll', function(){
              if(angular.element($element)[0].getBoundingClientRect().top <= 0){
                document.querySelector('body').classList.add('fix-element');
              }
              if($window.pageYOffset <= initial){
                document.querySelector('body').classList.remove('fix-element');
              }
            });
          } else {
            var triggerY = 0;
            angular.element($window).bind('scroll', function(){
              if(angular.element($element)[0].getBoundingClientRect().top <= offset){
                angular.element($element)[0].classList.add('fix-position');
                if(triggerY===0){
                  triggerY = $window.pageYOffset;
                }
              }
              if(triggerY !== 0 && $window.pageYOffset < triggerY){
                angular.element($element)[0].classList.remove('fix-position');
              }
            });
          }
        }
      };
    }
  ])
;
angular.module('signalapp.directives')
  .directive('resourcesort', ['$timeout',
    function($timeout){
      return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs){
          angular.element($element).on('click', function(e){
            $timeout(function(){$scope.$apply(function(){
              var topic = ($attrs.resourcesort === 'Models & Metrics') ? 'Metrics' : $attrs.resourcesort,
                  target = document.querySelector("#"+topic+"_include ."+topic+"-resources ."+topic+"_resources"),
                  container = document.querySelector("#"+topic+"_include ."+topic+"-resources .col-xs-12"),
                  childLength = container.children.length;
              for(var i=0;i<childLength;i++){
                if(target.previousElementSibling){
                  if(target.previousElementSibling.classList.toString().indexOf("saved-resources") === -1){
                    container.appendChild(target.previousElementSibling);
                  }
                } else {
                  break;
                }
              }
              $scope.showAllResourcesFor = (topic === 'Models & Metrics') ? 'Metrics' : topic;
              return false;
            });});
          });
        }
      };
    }]
  )
;
angular.module('signalapp.directives')
  .directive('searchFilter', ['$timeout', 'msgSrv',
    function($timeout, msgSrv){
      return {
        restrict: 'A',
        scope: true,
        link: function($scope, $element, $attrs){
          angular.element($element).on('click', function(e){
            $timeout(function(){$scope.$apply(function(){
              var filter = $attrs.searchFilter;
              if(typeof $scope.filters === 'undefined'){
                $scope.filters = {};
              }
              if($scope.searchFilter.filter === filter){
                $scope.searchFilter.filter = 'all';
                $scope.filters.resource_action = '';
                $scope.filters.theme = '';
                $scope.filters.topic = '';
              } else {
                $scope.searchFilter.filter = filter;
                $scope.filters.resource_action = filter;
                $scope.filters.theme = '';
                $scope.filters.topic = '';
              }
              msgSrv.emitMsg('loadResources', {offset: 0, reset: true});
              return false;
            });});
          });
        }
      };
    }]
  )
;
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
angular.module('signalapp.directives')
  .directive('scrollnav', ['$window', '$timeout',
    function($window, $timeout){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          // angular.element($window).bind('scroll', function(){
          //   //
          // });
        }
      };
    }
  ])
;
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
angular.module('signalapp.directives')
    .directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if(attr && attr.stopEvent)
                    element.bind(attr.stopEvent, function (e) {
                        e.stopPropagation();
                    });
            }
        };
    })
;
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
angular.module('signalapp.services')
  .factory('apiSrv', ['$http', 
    function($http){
      var apiSrv = {};
      apiSrv.request = function(method, url, args, successFn, errorFn){
        return $http({
          method: method,
          url: '/api/' + url,
          data: JSON.stringify(args)
        }).success(successFn).error(errorFn);
      };
      apiSrv.getResources = function(args, successFn, errorFn){
        return $http({
          method: 'GET',
          url: 'https://n8aqqjt48j.execute-api.us-west-2.amazonaws.com/prod/v1/resources',
          headers: {
            'X-Api-Key': 'CfeEiAD3y81CbWPC5mC9Ba6BS1f29ENg0jnsIxT3'
          },
          params: args
        }).success(successFn).error(errorFn);
      };
      apiSrv.vote = function(args, successFn, errorFn){
        return $http({
          method: 'post',
          url: 'https://n8aqqjt48j.execute-api.us-west-2.amazonaws.com/prod/v1/resources',
          headers: {
            'X-Api-Key': 'CfeEiAD3y81CbWPC5mC9Ba6BS1f29ENg0jnsIxT3'
          },
          params: {vote: args.vote, id: args.id}
        }).success(successFn).error(errorFn);
      };
      apiSrv.generateImg = function(code, successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/api/gen-img/'+code,
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;
angular.module('signalapp.services')
  .factory('msgSrv', ['$rootScope',
    function($rootScope){
      var msgSrv = {};

      msgSrv.finder = {};
      msgSrv.state = true;
      msgSrv.results = [];
      msgSrv.setFinderObj = function(obj){
        this.finder = obj;
      };
      msgSrv.getFinderObj = function(){
        return this.finder;
      };
      msgSrv.setState = function(state){
        this.state = state;
      };
      msgSrv.getState = function(){
        return this.state;
      };
      msgSrv.emitMsg = function(message, data){
        msgSrv.msgArgs = {args: data};
        $rootScope.$broadcast(message);
      };
      msgSrv.setResults = function(data){
        msgSrv.results = data;
      };
      msgSrv.getResults = function(){
        return msgSrv.results;
      };
      
      return msgSrv;
    }
  ])
;
angular.module('signalapp.states')
  .run(['$rootScope', 
        '$state', 
        '$stateParams',
        'Analytics',
    function($rootScope, $state, $stateParams, Analytics){
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .config(['$stateProvider', 
           '$urlRouterProvider',
           '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider){
      var templateDir = 'angular/partials',
          cssDir = "static/assets/css";

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('main', {
          url: '/',
          views: {
            'main': {
              templateUrl: templateDir + '/main.html'
            },
            'header@main':{
              templateUrl: templateDir + '/header.html'
            },
            'misc@main': {
              templateUrl: templateDir + '/homepage.html',
              controller: 'miscCtrl'
            }
          },
          data: {
            pageTitle: "StartupGPS"
          }
        })
        .state('about', {
          url: "/about",
          views: {
            'main': {
              templateUrl: templateDir + '/main.html'
            },
            'header@about':{
              templateUrl: templateDir + '/header.html'
            },
            'misc@about': {
              templateUrl: templateDir + '/about.html',
              controller: 'miscCtrl'
            }
          },
          data: {
            pageTitle: "StartupGPS: About Us"
          }
        })
        .state('faq', {
          url: "/faq/:index",
          views: {
            'main': {
              templateUrl: templateDir + '/main.html'
            },
            'header@faq':{
              templateUrl: templateDir + '/header.html'
            },
            'misc@faq': {
              templateUrl: templateDir + '/faq.html',
              controller: 'miscCtrl'
            }
          },
          data: {
            pageTitle: "StartupGPS: Frequently Asked Questions"
          }
        })
        .state('terms', {
          url: "/terms",
          views: {
            'main': {
              templateUrl: templateDir + '/main.html'
            },
            'header@terms':{
              templateUrl: templateDir + '/header.html'
            },
            'misc@terms': {
              templateUrl: templateDir + '/terms.html',
              controller: 'miscCtrl'
            }
          },
          data: {
            pageTitle: "StartupGPS: Terms of Service"
          }
        })
        // .state('cookies', {
        //   url: "/cookies",
        //   views: {
        //     'main': {
        //       templateUrl: templateDir + '/main.html'
        //     },
        //     'header@cookies':{
        //       templateUrl: templateDir + '/header.html'
        //     },
        //     'misc@cookies': {
        //       templateUrl: templateDir + '/cookies.html',
        //       controller: 'miscCtrl'
        //     }
        //   }
        // })
        .state('finder', {
          url: '/pathfinder',
          views: {
            'main': {
              templateUrl: templateDir + '/main.html'
            },
            'header@finder':{
              templateUrl: templateDir + '/header.html'
            },
            'finder@finder': {
              templateUrl: templateDir + '/finder.html',
              controller: 'finderCtrl'
            }
          },
          data: {
            pageTitle: "StartupGPS: Pathfinder"
          }
        })
        .state('finder.results', {
          url: '/results',
          views: {
            'finder@finder': {
              templateUrl: templateDir + '/finder-results.html',
              controller: 'finderResultsCtrl'
            },
            'graph@finder.results': {
              templateUrl: templateDir + '/graph.html'
            },
            'modal@finder.results': {
              templateUrl: templateDir + '/code-modal.html'
            },
            'share-modal@finder.results': {
              templateUrl: templateDir + '/share-modal.html'
            }
          },
          data: {
            pageTitle: "StartupGPS: Pathfinder Results"
          }
        })
        .state('finder.result', {
          url: '/result',
          views: {
            'finder@finder': {
              templateUrl: templateDir + '/finder-result.html',
              controller: 'finderResultsCtrl'
            },
            'graph@finder.result': {
              templateUrl: templateDir + '/graph.html'
            },
            'modal@finder.result': {
              templateUrl: templateDir + '/code-modal.html'
            },
            'share-modal@finder.result': {
              templateUrl: templateDir + '/share-modal.html'
            },
            'interpret-modal@finder.result': {
              templateUrl: templateDir + '/interpret-modal.html'
            },
            'compare-modal@finder.result': {
              templateUrl: templateDir + '/compare-modal.html'
            },
          },
          data: {
            pageTitle: "StartupGPS: Pathfinder Results"
          }
        })
        // .state('finder.results.overview', {
        //   url: '/overview'
        // })
        // .state('finder.results.links', {
        //   url: '/links'
        // })
        .state('library', {
          url: '/library/:filter',
          views: {
            'main': {
              templateUrl: templateDir + '/main.html'
            },
            'header@library':{
              templateUrl: templateDir + '/header.html'
            },
            'library@library': {
              templateUrl: templateDir + '/library.html',
              controller: 'libraryCtrl'
            }
          },
          data: {
            pageTitle: "StartupGPS: Library"
          }
        })
      ;

      $locationProvider.html5Mode(true);
    }
  ])
;