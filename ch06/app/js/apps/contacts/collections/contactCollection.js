'use strict';

var Backbone = require('backbone');
var Contact = require('../models/contact');

class ContactCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
    this.url = '/api/contacts';
    this.store = 'contacts';
  }

  get model() {
    return Contact;
  }
}

module.exports = ContactCollection;
