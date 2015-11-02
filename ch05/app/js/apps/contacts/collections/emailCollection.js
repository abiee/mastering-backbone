'use strict';

var Backbone = require('backbone');
var Email = require('../models/email');

class EmailCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
  }

  get model() {
    return Email;
  }
}

module.exports = EmailCollection;
