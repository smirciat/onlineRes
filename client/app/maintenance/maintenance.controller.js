'use strict';

angular.module('tempApp')
  .controller('MaintenanceCtrl', function ($scope, $http, $timeout,$compile) {
    var projects=[];
    this.projects=projects;
    var daysDate=[]; 
    this.days =[];
    var today = new Date(Date.now());
    today=new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
    var thisDay=new Date(today);
    var projectDate=new Date();
    for (var i=0;i<6;i++){
      thisDay.setDate(today.getDate() + i);
      daysDate.push(new Date(thisDay));
      this.days.push('' + (thisDay.getMonth()+1) + '/' + thisDay.getDate() + '/' + thisDay.getFullYear());
    };
    $http.get('/api/projects').then(function(response){
      var bin, item;
      $scope.maintenance.projects=projects=response.data;;
      projects.forEach(function(project){
        item = '<div draggable=true id="' + project._id + '">' + project.name + '</div>'
        item = angular.element(item);
        if (project.date){
          projectDate=new Date(project.date);
          for (var i=0;i<6;i++){
            if (projectDate.getTime()==daysDate[i].getTime()){
              project.bin = 'day' + i;
              bin = document.getElementById(project.bin);
              $(bin).append($compile(item)($scope.maintenance));
            }
          }
        }
        else {
          bin = document.getElementById('storage');
          $(bin).append($compile(item)($scope.maintenance));
        }
      });
    });
    this.handleDrop = function(item, bin) {
      //alert('Item ' + item + ' has been dropped into ' + bin);
    }
    
    this.handleDropDelete = function(i, bin) {
      var item = document.getElementById(i);
      angular.element(item).remove();
    }
  });
