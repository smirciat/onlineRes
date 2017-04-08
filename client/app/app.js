'use strict';

angular.module('tempApp', [
  'tempApp.auth',
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
  'emoji'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
