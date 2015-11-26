'use strict';

var Backbone = require('backbone');

class ContactsRouter extends Backbone.Router {
  constructor(options) {
    super(options);

    this.routes = {
      'contacts': 'showContactList',
      'contacts/page/:page': 'showContactList',
      'contacts/new': 'createContact',
      'contacts/view/:id': 'showContact',
      'contacts/edit/:id': 'editContact'
    };

    this._bindRoutes();
  }

  showContactList(page) {
    // Page should be a postive number grater than 0
    page = page || 1;
    page = page > 0 ? page : 1;

    var app = this.startApp();
    app.showContactList(page);
  }

  createContact() {
    var app = this.startApp();
    app.showNewContactForm();
  }

  showContact(contactId) {
    var app = this.startApp();
    app.showContactById(contactId);
  }

  editContact(contactId) {
    var app = this.startApp();
    app.showContactEditorById(contactId);
  }

  startApp() {
    var App = require('../../app');
    var ContactsApp = require('./app');
    return App.startSubApplication(ContactsApp);
  }
}

module.exports = new ContactsRouter();
