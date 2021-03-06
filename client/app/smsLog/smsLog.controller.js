'use strict';

angular.module('tempApp')
  .controller('SmsLogCtrl', function ($scope,$http,moment,socket) {
    this.sms = {};
    this.sms.to='+1';
    this.sms.body="Message from Smokey Bay Air, Reply to this number. "
    this.class=function(message){
      if (message.to==='+19073414906'||message.to==='+19073022700') return 'danger';
      else return "success";
    }
    this.newSms = "btn btn-default";//or "button-flashing"
    this.messages=[];
    this.names=[];
    
    this.setNumber = function(phone){
      this.refresh(phone);
    };
    
    this.refresh = function(number){
      $http.get('/api/smsNames').then((response)=>{
        this.names=response.data.sort((a,b)=>{
          return a.name.localeCompare(b.name);
        });
        this.names.unshift({name:'All',phone:''});
        $http.post('/api/sms/all').then((response)=>{
          response.data=response.data.filter(sm=>{
            return !sm.autoSMS;
          });
          if (number==="") this.messages=response.data;
          else {
            this.messages=response.data.filter(sm=>{
              return sm.to===number||sm.from===number;
            });
          }
          this.insertNames();
          socket.unsyncUpdates('sm');
          socket.syncUpdates('sm', this.messages, (event, item, array)=>{
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
      switch (this.sms.to.length){
        case 7: this.sms.to = '+1907' + this.sms.to;
            break;
        case 10: this.sms.to = '+1' + this.sms.to;
            break;
        case 11: this.sms.to = '+' + this.sms.to;
            break;
        default: break;
      }
      if (this.sms.body&&this.sms.to&&this.sms.to.length>6&&this.sms.body.length>3) {
        $http.post('/api/sms/twilio',this.sms).then((res)=>{
          this.refresh("");
          this.sms = {};
          this.sms.to='+1';
          this.sms.body="Message from Smokey Bay Air, Reply to this number. ";
        },(err)=>{console.log(err)});
      }
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
    
    this.addName = function(name,phone){
      if (phone&&name&&phone!==""&&name!=="") {
        $http.post('/api/smsNames',{name:name,phone:phone}).then((response)=>{
          this.refresh("");
        });
      }
    };
    
    this.reply = function(from){
      this.sms.to=from;
    };
    
    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('sm');
    });
    
    this.refresh("");
  });
