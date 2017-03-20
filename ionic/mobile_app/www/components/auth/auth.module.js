'use strict';

angular.module('tempApp.auth', [
  'tempApp.constants',
  'tempApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
