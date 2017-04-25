'use strict';

angular.module('tempApp')
  .controller('SmsLogCtrl', function ($scope,$http,moment,socket) {
    this.sms = {};
    this.sms.to='+1';
    this.sms.body="Message from Smokey Bay Air, Reply to this number. "
    this.class=function(message){
      if (message.to==='+19073414906') return 'danger';
      else return "success";
    }
    this.newSms = "btn btn-default";//or "button-flashing"
    this.messages=[];
    this.names=[];
    
    this.refresh = function(){
      $http.get('/api/smsNames').then((response)=>{
        this.names=response.data;
        $http.get('/api/sms').then((response)=>{
          this.messages=response.data;
          this.insertNames();
          socket.unsyncUpdates('sm');
          socket.syncUpdates('sm', this.messages, function(event, item, array){
             array.sort((a,b)=>{
               return moment(b.sent).diff(moment(a.sent));
             });
             this.insertNames();
          });
        });
      });
    };
    
    this.send = function(){
      this.sms.sent = moment().toDate();
      $http.post('/api/sms',this.sms).then((res)=>{
        this.refresh();
        this.sms = {};
      },(err)=>{console.log(err)});
    };
    
    this.insertNames = function(){
      this.messages.forEach((message)=>{
        var namesFrom = this.names.filter((name)=>{
          return name.phone===message.from;
        });
        var namesTo = this.names.filter((name)=>{
          return name.phone===message.to;
        });
        if (namesFrom.length>0) message.fromName = namesFrom[0].name;
        if (namesTo.length>0) message.toName = namesTo[0].name;
      });
    };
    
    this.noName = function(name){
      return name===undefined;
    };
    
    this.addName = function(name,phone){
      $http.post('/api/smsNames',{name:name,phone:phone}).then((response)=>{
        this.refresh();
      });
    };
    
    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('sm');
    });
    
    this.refresh();
  });
