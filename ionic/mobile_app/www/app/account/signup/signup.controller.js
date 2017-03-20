'use strict';

angular.module('tempApp')
  .controller('SignupController', function (Auth, $location, Modal) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.Auth = Auth;
    this.$location = $location;
    this.quickModal=Modal.confirm.quickMessage();

  this.register = function(form) {
    this.submitted = true;

    if (form.$valid) {

      this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
        this.$location.path('/');
      })
      .catch(err => {
        err = err.data;
        this.quickModal(err.errors[0].message);
        this.errors = {};
        // Update validity of form fields that match the sequelize errors
        if (err.name) {
          angular.forEach(err.fields, field => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = err.message;
          });
        }
      });
    }
  }
});
