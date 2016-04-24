'use strict';

angular.module('tempApp')
  .controller('TodaysFlightsCtrl', function ($scope, $http, $interval, $q, uiGridConstants,tcFactory) {
    this.date = tcFactory.getDate();
    this.getRes= function(){
      tcFactory.setDate(this.date);
    };
    
  });
