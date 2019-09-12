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