'use strict';

class SettingsController {
  //start-non-standard
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $http, $location,Modal) {
    this.Auth = Auth;
    this.quickMessage = Modal.confirm.quickMessage();
    this.$http = $http;
    this.$location = $location;
    this.user = Auth.getCurrentUser();
    $http.get('/api/userAttributes/user/' + this.user._id).then(response => {
      if (response.data.length===0) {
         console.log(response.data);
         this.$http.post('/api/userAttributes', {uid:this.user._id}).then(response => {
            console.log(response.data);
            this.userAtt = response.data;
            //this.$http.get('/api/userAttributes/user/' + this.user._id).then(response => {
            //  console.log(response.data);
            //  this.userAtt = response.data[0];
            //});
            
         });
      }
      else {
        
        this.userAtt = response.data[response.data.length-1];
        console.log(this.userAtt);
      }
    });
  }

  changePhone() {
    console.log(this.userAtt);
    this.$http.put('/api/userAttributes/' + this.userAtt._id, this.userAtt).then(response => {
      this.$location.path( "/" );
    });
  }
  
  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
  
  changeEmail(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changeEmail(this.user.newEmail)
        .then(() => {
          this.emailMessage = 'Email successfully changed.';
        })
        .catch((err) => {
          form.newEmail.$setValidity('mongoose', false);
          this.quickMessage(err.data.errors[0].message);
          this.emailMessage = '';
        });
    }
  }
}

angular.module('tempApp')
  .controller('SettingsController', SettingsController);
  
