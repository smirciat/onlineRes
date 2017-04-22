'use strict';

angular.module('tempApp')
  .controller('TimeclockCtrl', function ($scope,Auth,User,$http,moment,$timeout) {
    this.timesheets=[];
    this.hours=0;
    this.in=false;
    this.newRecord = {};
    this.users = User.query();
    var user = Auth.getCurrentUser;
    var now = moment();
    var current;
    
    this.setApi = function(){
      if (Auth.hasRole('superadmin')){
        this.api='/api/timesheets/all';
      }
      else {
        this.api='/api/timesheets/user';
      }
    };
    
    this.getCurrent = function(){
      if (user()&&user()._id){
        this.setApi();
        $http.post('/api/timesheets/current',{uid:user()._id}).then((response)=>{
          
          if (response.data.length===0){
            this.in=false;
            this.hours=0;
          }
          else{
            current = response.data[0];
            this.in=true;
            var end = moment();
            this.hours = moment.duration(end.diff(moment(current.timeIn))).asHours();
          }
        },(err)=>{console.log(err)});
      }
      else {
        $timeout(()=>{
          this.getCurrent();
          this.getRecords();
        },100);
      }
    };
    
    this.setPayrollPeriod = function(){
      if (now.date()<=15) {
        this.startDate=moment(now).startOf('month');
        this.endDate=moment(now).date(16);
      }
      else {
        this.startDate=moment(now).date(16);
        this.endDate=moment(now).add(1,'month').startOf('month');
      }
      this.lastDate=moment(this.endDate).subtract(1,'day');
    };
    
    this.plus = function(){
      now.add(15,'days');
      this.setPayrollPeriod();
      this.getRecords();
    };
    
    this.minus = function(){
      now.subtract(15,'days');
      this.setPayrollPeriod();
      this.getRecords();
    };
    
    this.getRecords = function(){
      $http.post(this.api,{uid:user()._id,date:this.startDate.toDate(),endDate:this.endDate.toDate()}).then(response=>{
        this.timesheets=response.data;
      });
    };
    
    this.clockIn = function(){
      $http.post('/api/timesheets/',{name:user().name,timeIn:moment().toDate(),uid:user()._id}).then((response)=>{
        this.getCurrent();
        this.getRecords();
      });
    };
    
    this.clockOut = function(){
      if (current){
        current.timeOut = moment();
        current = this.update(current);
      }  
        
      else this.in=false;
    };
    
    this.update = function(timesheet){//decide how much of this timesheet record is regular and overtime
      var timeOut;
      if (timesheet.timeOut) {
        timeOut = moment(timesheet.timeOut);
        timesheet.regularHours =  moment.duration(timeOut.diff(moment(timesheet.timeIn))).asHours();
        timesheet.otHours = 0;
        if (timesheet.regularHours>10){
          timesheet.otHours = timesheet.regularHours-10;
          timesheet.regularHours = 10;
        }
        timesheet.timeOut = timeOut.toDate();
        var timeIn = moment(timesheet.timeIn);
        var startDate = moment(timeIn).startOf('week');
        var endDate = moment(timeIn).endOf('week');
        $http.post('/api/timesheets/user',{uid:timesheet.uid,date:startDate.toDate(),endDate:endDate.toDate()}).then(response=>{
          var timesheets = response.data.reverse();
          var index;
          var todaysHours = 0;
          var totalHours = 0;
          if (timesheet._id) index = timesheets.findIndex(function(element){
                      return element._id===timesheet._id;
                    });
          if (index) timesheets.splice(index,1);
          timesheets.forEach(function(ts){
            totalHours += ts.regularHours;
            if (moment(ts.timeIn).day()===moment(timesheet.timeIn).day()){
              todaysHours +- ts.regularHours;
            }
          });
          if ((todaysHours + timesheet.regularHours)>10){
            timesheet.otHours = timesheet.regularHours - 10;
            timesheet.regularHours = 10 - todaysHours;
          }
          var over = totalHours + timesheet.regularHours-40;
          if (over>0) {
            if (totalHours>40) {
              timesheet.otHours += timesheet.regularHours;
              timesheet.regularHours = 0 ;
            }
            else{
              timesheet.otHours += over;
              timesheet.regularHours -= over;
            }
          }
          this.commit(timesheet);
        });
      }
      else this.commit(timesheet);
    };
    
    this.commit = function(timesheet){
      if (timesheet._id){
        $http.put('/api/timesheets/' + timesheet._id,timesheet).then(()=>{
          this.getCurrent();
          this.getRecords();
          this.newRecord={};
        });
      }
      else {
        $http.post('/api/timesheets',timesheet).then(()=>{
          this.getCurrent();
          this.getRecords();
          this.newRecord={};
        });
      }
    };
    
    this.cancel = function(){
      this.newRecord={};
    };
    
    this.edit = function(timesheet){
      if (timesheet.timeIn) timesheet.timeIn = moment(timesheet.timeIn).format('MMM DD, YYYY, h:mm:ss A');
      if (timesheet.timeOut) timesheet.timeOut = moment(timesheet.timeOut).format('MMM DD, YYYY, h:mm:ss A');
      this.newRecord = timesheet;
    };
    
    this.delete = function(timesheet){
      $http.delete('/api/timesheets/' + timesheet._id).then(()=>{
        this.getCurrent();
        this.getRecords();
      });
    };
    
    this.nameLookup = function(uid){
      var index = this.users.findIndex((element)=>{
        return element._id===uid;
      });
      if (index>-1&&(this.users[index].role==='admin'||this.users[index].role==='superadmin')){
        this.newRecord.name = this.users[index].name;
      }
    };
    
    
    this.setApi();
    this.getCurrent();
    this.setPayrollPeriod();
    this.getRecords();
    
  });
