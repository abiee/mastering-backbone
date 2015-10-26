'use strict';

App.Models = App.Models || {};

class Contact extends Backbone.Model {
  constructor(options) {
    super(options);
    this.urlRoot = '/api/contacts';
  }

  defaults() {
    return {
      name: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      facebook: '',
      twitter: '',
      google: '',
      github: ''
    };
  }
}

App.Models.Contact = Contact;
