'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var App = require('../../app');
var ContactListLayout = require('./views/contactListLayout');
var ContactListActionBar = require('./views/contactListActionBar');
var ContactListView = require('./views/contactListView');

class ContactList {
  constructor(options) {
    // Region where the application will be placed
    this.region = options.region;

    // Allow subapplication to listen and trigger events,
    // useful for subapplication wide events
    _.extend(this, Backbone.Events);
  }

  showList(contacts) {
    // Create the views
    var layout = new ContactListLayout();
    var actionBar = new ContactListActionBar();
    var contactList = new ContactListView({collection: contacts});

    // Show the views
    this.region.show(layout);
    layout.getRegion('actions').show(actionBar);
    layout.getRegion('list').show(contactList);

    this.listenTo(contactList, 'item:contact:delete', this.deleteContact);
  }

  deleteContact(view, contact) {
    App.askConfirmation('The contact will be deleted', (isConfirm) => {
      if (isConfirm) {
        contact.destroy({
          success() {
            App.notifySuccess('Contact was deleted');
          },
          error() {
            App.notifyError('Ooops... Something went wrong');
          }
        });
      }
    });
  }

  // Close any active view and remove event listeners
  // to prevent zombie functions
  destroy() {
    this.region.remove();
    this.stopListening();
  }
}

module.exports = ContactList;
