'use strict';

angular.module('tempApp')
  .controller('TimeclockCtrl', function ($scope,Auth,$http,moment,$timeout) {
    this.timesheets=[];
    this.hours=0;
    this.in=false;
    this.newRecord = {};
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
        current = this.setHours(current);
        
        $http.put('/api/timesheets/' + current._id,current).then((response)=>{
          this.getCurrent();
          this.getRecords();
        });
      }
      else this.in=false;
    };
    
    this.setHours = function(timesheet){//decide how much of this timesheet record is regular and overtime
      var timeOut= moment();
      if (timesheet.timeOut) {
        timeOut = moment(timesheet.timeOut);
      }
      var regularHours=  moment.duration(timeOut.diff(moment(timesheet.timeIn))).asHours();
      var otHours=0;
      if (regularHours>10){
        otHours = regularHours-10;
        regularHours=10;
      }
      timesheet.timeOut = timeOut.toDate();
      timesheet.regularHours = regularHours;
      timesheet.otHours = otHours;
      //will need promise chain to search the whole week
      return timesheet;
    };
    
    this.add = function(){
      this.newRecord = this.setHours(this.newRecord);
      if (this.newRecord._id){
        $http.put('/api/timesheets/' + this.newRecord._id,this.newRecord).then(()=>{
          this.getCurrent();
          this.getRecords();
          this.newRecord={};
        });
      }
      else {
        $http.post('/api/timesheets',this.newRecord).then(()=>{
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
    
    this.setApi();
    this.getCurrent();
    this.setPayrollPeriod();
    this.getRecords();
  });
