'use strict';

angular.module('tempApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sms', {
        templateUrl: 'app/smsLog/smsLog.html',
        controller: 'SmsLogCtrl',
        controllerAs: 'sms',
        authenticate: 'admin'
      });
  });
