'use strict';

angular.module('tempApp')
  .directive('chat', function ($http,Auth,socket,$timeout,webNotification,$location) {
    return {
      templateUrl: 'components/chat/chat.html',
			replace: true,
      restrict: 'E',
      scope: {
        showInit:'@'
      },
      link: function(scope, element, attrs){
        scope.shown=false;
        var tempArray =[];
        scope.inputPlaceholderText = 'Write message here...';
        scope.submitButtonText = 'Send';
        scope.title = 'Smokey Bay Chat';
        scope.http=$http;
        var messages;
        scope.messages=[{username:'a',content:'1'}];
        scope.username = Auth.getCurrentUser().name;
        scope.myUserId = Auth.getCurrentUser()._id;
        scope.$msgContainer = $('.msg-container-base'); // BS angular $el jQuery lite won't work for scrolling
  			scope.$chatInput = $(element).find('.chat-input');
        scope.visible = true;
        var vm = scope;
        scope.isHidden = false;
    		scope.theme = 'chat-th-material';
    		scope.writingMessage = '';
    		scope.panelStyle = {'display': 'block'};
    		scope.chatButtonClass= 'fa-angle-double-down icon_minim';
    		
  			var elWindow = scope.$msgContainer[0];
  			scope.$msgContainer.bind('scroll', _.throttle(function() {
  				var scrollHeight = elWindow.scrollHeight;
  				if (elWindow.scrollTop <= 10) {
  					scope.historyLoading = true; // disable jump to bottom
  					scope.$apply(scope.infiniteScroll);
  					$timeout(function() {
  						scope.historyLoading = false;
  						if (scrollHeight !== elWindow.scrollHeight) // don't scroll down if nothing new added
  							scope.$msgContainer.scrollTop(360); // scroll down for loading 4 messages
  					}, 150);
  				}
  			}, 300));
        $http.get('/api/chats').then(function(response){
          if (!scope.username) {
            scope.username = Auth.getCurrentUser().name;
            scope.myUserId = Auth.getCurrentUser()._id;
          }
          tempArray=response.data;
          messages = tempArray.filter(function(response){
            return true;
          });
          socket.syncUpdates('chat', messages, function(event, item, array){
            if ((!scope.shown||document.hidden||!document.hasFocus())&&item.fromUserId!=scope.myUserId) {
              webNotification.showNotification('New Chat Message in Reservations', {
                  body: item.content + '\nfrom: ' + item.username,
                  icon: '../bower_components/HTML5-Desktop-Notifications2/alert.ico',
                  onClick: function onNotificationClicked() {
                    //var NewWin = window.open('/admin');
                    window.focus();
                    $timeout(function(){
                      //NewWin.focus();
                      window.focus();
                      $location.path('/admin');
                    },60);
                  }//,
                  //autoClose: 10000 //auto close the notification after 10 seconds (you can manually close it via hide function)
              }, function onShow(error, hide) {
                  if (error) {
                      window.alert('Unable to show notification: ' + error.message);
                  } else {
                      //console.log('Notification Shown.');
                        // The document is not on focus // so, let's handle this } else { // The document is on focus // do our things. } 
                      //setTimeout(function hideNotification() {
                          //console.log('Hiding notification....');
                          //hide(); //manually close the notification (you can skip this if you use the autoClose option)
                      //}, 5000);
                  }
              });
            }
            array.sort(function(a,b){
              return a.date>b.date;
            });
            scope.scroll();
          });
          scope.scroll();
          scope.visible = true;
          scope.expandOnNew = true;
        
          return scope.messages;
        });
        
        scope.sendMessage = function(message, username) {
          if(message && message !== '' && username) {
            var msg = {
              'username': username,
              'content': message,
              'date': new Date(Date.now()),
              'fromUserId' : scope.myUserId
            };
            scope.messages.push(msg);
            scope.http.post('/api/chats',msg);
            
          }
        };
        
        scope.toggleVisible = function(){
          $timeout(function(){
            $('#myModal').modal('show');
            scope.shown = !scope.shown;
            scope.scroll();
          },300);
          
        };
        
        scope.scroll = function(){
          if (messages) scope.messages = messages.slice(-50);
          $timeout(function(){
            scope.messages = messages.slice(-51);
          },200);
        };
        
        scope.$on('$destroy', function () {
          socket.unsyncUpdates('chat');
        });
        
        
    		scope.submitFunction =  function() {
    			if (!scope.username) {
            scope.username = Auth.getCurrentUser().name;
            scope.myUserId = Auth.getCurrentUser()._id;
          }
    			scope.sendMessage(scope.writingMessage, scope.username);
    			scope.writingMessage = '';
    			scope.scrollToBottom();
    		};
    		
    		scope.$watch('visible', function() { // make sure scroll to bottom on visibility change w/ history items
    			
    			$timeout(function() {
    				scope.scrollToBottom();
    				scope.$chatInput.focus();
    			}, 250);
    		});
    		
    		scope.$watch('shown', function() { // make sure scroll to bottom on visibility change w/ history items
    			
    			$timeout(function() {
    				scope.scrollToBottom();
    				scope.$chatInput.focus();
    			}, 250);
    		});
    		
    		scope.$watch('messages.length', function() {
    			if (!scope.historyLoading) scope.scrollToBottom(); // don't scrollToBottom if just loading history
                if (scope.expandOnNew && vm.isHidden) {
                    scope.toggle();
                }
    		});
    
    		scope.scrollToBottom = function() {
    			$timeout(function() { // use $timeout so it runs after digest so new height will be included
    				scope.$msgContainer.scrollTop(scope.$msgContainer[0].scrollHeight);
    			}, 200, false);
    			
    		};
    
    		scope.close = function() {
    			scope.visible = false;
    		};
    
    		scope.toggle = function() {
    			if(scope.isHidden) {
    				scope.chatButtonClass = 'fa-angle-double-down icon_minim';
    				scope.panelStyle = {'display': 'block'};
    				scope.isHidden = false;
    				scope.scrollToBottom();
    			} else {
    				scope.chatButtonClass = 'fa-expand icon_minim';
    				scope.panelStyle = {'display': 'none'};
    				scope.isHidden = true;
    			}
    		}
        
        if (scope.showInit==='true') {
          scope.toggleVisible();
        }
      }
    };
    
  });
