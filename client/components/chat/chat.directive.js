'use strict';

angular.module('tempApp')
  .directive('chat', function ($http,Auth,socket,$timeout) {
    return {
      templateUrl: 'components/chat/chat.html',
			replace: true,
      restrict: 'E',
      link: function(scope, element, attrs){
        var tempArray =[];
        
        scope.http=$http;
        var messages;
        scope.messages=[{username:'a',content:'1'}];
        scope.username = Auth.getCurrentUser().name;
        
        $http.get('/api/chats').then(function(response){
          tempArray=response.data;
          messages = tempArray.filter(function(response){
            return true;
          });
          
          socket.syncUpdates('chat', messages, function(event, item, array){
            array.sort(function(a,b){
              return a.date>b.date;
            });
            scope.scroll();
          });
          scope.messages = messages.slice(-20);
          scope.messages = messages.slice(-21);
          scope.visible = true;
          scope.expandOnNew = true;
        
          return scope.messages;
        });
        
        
        scope.sendMessage = function(message, username) {
          if(message && message !== '' && username) {
            var msg = {
              'username': username,
              'content': message,
              'date': new Date(Date.now())
            };
            scope.messages.push(msg);
            scope.http.post('/api/chats',msg);
            
          }
        };
        
        scope.scroll = function(){
          scope.messages = messages.slice(-20);
          $timeout(function(){
            scope.messages = messages.slice(-21);
          },200);
        };
        
        scope.$on('$destroy', function () {
          socket.unsyncUpdates('chat');
        });
        
        
      }
    };
  });
