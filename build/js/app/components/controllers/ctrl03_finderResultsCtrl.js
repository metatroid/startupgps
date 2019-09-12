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