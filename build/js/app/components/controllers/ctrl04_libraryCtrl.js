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