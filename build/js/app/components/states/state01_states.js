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