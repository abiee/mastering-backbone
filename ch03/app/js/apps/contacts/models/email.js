'use strict';

App.Models = App.Models || {};

class Email extends Backbone.Model {
  get defaults() {
    return {
      description: '',
      email: ''
    };
  }
}

App.Models.Email = Email;
