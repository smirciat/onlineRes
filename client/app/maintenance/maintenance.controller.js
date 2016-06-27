'use strict';

angular.module('tempApp')
  .controller('MaintenanceCtrl', function ($scope, $http, $timeout,$compile,Modal) {
    var projectDate,thisDay;
    var projects=[];
    this.projects=projects;
    var daysDate=[]; 
    var today = new Date(Date.now());
    var weekDays=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    today=new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
    var startDay = new Date(today);
    
    this.setBins = function(t){
      daysDate=[]; 
      this.days=[];
      thisDay = new Date(t);
      projectDate=new Date();
      for (var i=0;i<6;i++){
        if (i>0) thisDay.setDate(thisDay.getDate() + 1);
        daysDate.push(new Date(thisDay));
        this.days.push(weekDays[thisDay.getDay()] + ' ' + (thisDay.getMonth()+ 1) + '/' + thisDay.getDate() + '/' + thisDay.getFullYear());
      };
      
      $http.get('/api/projects').then(function(response){
        projects.forEach(function(project){
          var item = document.getElementById(project._id);
          angular.element(item).remove();
        });
        
        $scope.maintenance.projects=projects=response.data;;
        projects.forEach(function(project){
          $scope.maintenance.paste(project);
        });
      });
    }
    
    this.weekBack = function(days){
      startDay.setDate(startDay.getDate() + days);
      this.setBins(startDay);
    }
    
    this.paste=function(project){
      var bin, item;
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
    }
    
    this.handleDrop = function(item, bin) {
      //update project date
      //find date of bin
      var itemDate = '';
      if (bin!=='storage') {
        var index = parseInt(bin.substring(3),10);
        if (index||index===0) itemDate = $scope.maintenance.days[index];
      }
      //$http put new date into project of item id
      var project = $scope.maintenance.projects.filter(function(p){
        return p._id===parseInt(item,10);
      })
      if (project.length>0) {
        project=project[0];
        project.date=itemDate;
        $http.put('/api/projects/' + item, project);
      }
    }
    
    this.handleDropDelete = function(i, bin) {
      $http.delete('/api/projects/' + i);
      var item = document.getElementById(i);
      angular.element(item).remove();
    }
    
    this.handleDropEdit = function(i, bin) {
      //use modal to gather user input.  Only update name of project
      $scope.maintenance.i=i;
      $scope.maintenance.editProject("Please enter the new name of the project:");
      //in modal function, update item in database, leave in current to bin
    }
    
    this.addItem = function(){
      $scope.maintenance.addProject("Please add the name of the new project:");
    }
    
    this.addProject = Modal.confirm.enterData(formData =>{
      var project = {name:formData.data};
      $http.post('/api/projects', project).then(response => {
        project=response.data;
        $scope.maintenance.projects.push(project);
        var item = '<div draggable=true id="' + project._id + '">' + project.name + '</div>'
        item = angular.element(item);
        var bin = document.getElementById('storage');
        $(bin).append($compile(item)($scope.maintenance));
      });
    });
    
    this.editProject = Modal.confirm.enterData(formData =>{
      var project = {name:formData.data};
      $http.put('/api/projects/' + $scope.maintenance.i, project).then(response => {
        project=response.data;
        var oldItem = _.find($scope.maintenance.projects, {_id: $scope.maintenance.i});
        var index = $scope.maintenance.projects.indexOf(oldItem);
        if (oldItem) $scope.maintenance.projects.splice(index, 1, project);
        var item = document.getElementById($scope.maintenance.i);
        angular.element(item).remove();
        $scope.maintenance.paste(project);
      });
    });
    
    this.setBins(today);
    
  });
