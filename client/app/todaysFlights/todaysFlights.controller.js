'use strict';

angular.module('tempApp')
  .controller('TodaysFlightsCtrl', function ($scope, $http, $interval, $q, uiGridConstants) {
    var d=new Date(Date.now());
    this.date = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
    this.getRes= function(){
      //$scope.$apply();
    };
    
  });
