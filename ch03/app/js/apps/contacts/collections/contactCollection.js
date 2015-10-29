'use strict';

App.Collections = App.Collections || {};

class ContactCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
    this.url = '/api/contacts';
  }

  get model() {
    return App.Models.Contact;
  }
}

App.Collections.ContactCollection = ContactCollection;
