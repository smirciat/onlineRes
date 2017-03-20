'use strict';

var modules = ['tempApp.auth',
  'tempApp.admin',
  'tempApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'validation.match',
  'ui.select',
  'ngTouch',
  '720kb.datepicker',
  'ui.grid',
  'ui.grid.cellNav',
  'ui.grid.edit', 
  'ui.grid.rowEdit',
  'ui.grid.selection', 
  'ui.grid.exporter',
  'AngularPrint',
  'luegg.directives',
  'angular-web-notification',
  'emoji'];
  
var isMobile = typeof(ionic)!=='undefined' && (ionic.Platform.is("ios") || ionic.Platform.is("android"));
if(isMobile) {
    modules.push('ionic');
}

var ngModule = angular.module('tempApp', modules)
    .config(function ($locationProvider, $compileProvider, $routeProvider) {
       $locationProvider.html5Mode(true); // enable html5 mode
       $routeProvider
        .otherwise({
          redirectTo: '/'
        });
    });
    



