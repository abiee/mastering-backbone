'use strict';

var Backbone = require('backbone');
var Phone = require('../models/phone');

class PhoneCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
  }

  get model() {
    return Phone;
  }
}

module.exports = PhoneCollection;
