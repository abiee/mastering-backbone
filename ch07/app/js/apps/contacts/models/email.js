'use strict';

var Backbone = require('backbone');

class Email extends Backbone.Model {
  get defaults() {
    return {
      description: '',
      email: ''
    };
  }
}

module.exports = Email;
