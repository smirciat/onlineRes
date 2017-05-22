'use strict';

angular.module('tempApp', [
  'tempApp.auth',
  'tempApp.admin',
  'tempApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMaterial',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'validation.match',
  'ui.select',
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
  'emoji',
  'angularMoment'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
