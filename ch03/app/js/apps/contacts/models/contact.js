'use strict';

App.Models = App.Models || {};

class Contact extends Backbone.Model {
  constructor(options) {
    super(options);
    this.urlRoot = '/api/contacts';

    this.validation = {
      name: {
        required: true,
        minLength: 3
      }
    };
  }

  get defaults() {
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

  toJSON() {
    var result = Backbone.Model.prototype.toJSON.call(this);

    if (result.phones && result.phones.length > 0) {
      result.phone = result.phones[0].phone;
    }

    if (result.emails && result.emails.length > 0) {
      result.email = result.emails[0].email;
    }

    return result;
  }
}

App.Models.Contact = Contact;
