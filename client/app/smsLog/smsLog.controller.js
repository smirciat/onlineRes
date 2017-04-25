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
    
    this.refresh = function(){
      $http.get('/api/sms').then((response)=>{
        this.messages=response.data;
        socket.unsyncUpdates('sm');
        socket.syncUpdates('sm', this.messages, function(event, item, array){
           array.sort((a,b)=>{
             return moment(b.sent).diff(moment(a.sent));
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
    
    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('sm');
    });
    
    this.refresh();
  });
