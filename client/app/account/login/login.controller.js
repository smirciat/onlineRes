'use strict';

class LoginController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard
  
  constructor(Auth, $location,email,Modal) {
    this.Auth = Auth;
    this.$location = $location;
    this.email=email;
    this.quickMessage=Modal.confirm.quickMessage();
  }

  lostPassword() {
    if (this.user.email&&this.user.email!==""){
        this.email.lostPassword(this.user);
        this.quickMessage("Password reset requested.  You should receive an email with password reset information at the address you entered above.");
    }
    else this.quickMessage("Please enter an email address above first.");
  }

  login(form) {
    this.submitted = true;
    //this.Auth.login({});//hack to make up for lusca bug that fails first CSRF token check after page load
    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        if (this.Auth.hasRole('admin')) this.$location.path('/oneFlight');
        else this.$location.path('/');
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('tempApp')
  .controller('LoginController', LoginController);
