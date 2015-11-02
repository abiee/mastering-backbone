'use strict';

var Backbone = require('backbone');

class Phone extends Backbone.Model {
  get defaults() {
    return {
      description: '',
      phone: ''
    };
  }
}

module.exports = Phone;
