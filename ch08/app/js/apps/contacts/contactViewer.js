'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var App = require('../../app');
var ContactViewLayout = require('./views/contactViewLayout');
var ContactWidget = require('./views/contactWidget');
var ContactAbout = require('./views/contactAbout');
var ContactCallLog = require('./views/contactCallLog');

class ContactViewer {
  constructor(options) {
    // Region where the application will be placed
    this.region = options.region;

    // Allow subapplication to listen and trigger events,
    // useful for subapplication wide events
    _.extend(this, Backbone.Events);
  }

  showContact(contact) {
    // Create the views
    var layout = new ContactViewLayout();
    var contactWidget = new ContactWidget({model: contact});
    var contactAbout = new ContactAbout({model: contact});
    var contactCalls = new ContactCallLog({model: contact});

    // Show the views
    this.region.show(layout);
    layout.getRegion('widget').show(contactWidget);
    layout.getRegion('about').show(contactAbout);
    layout.getRegion('calls').show(contactCalls);

    this.listenTo(contactAbout, 'contact:delete', this._deleteContact);
  }

  _deleteContact(contact) {
    App.askConfirmation('The contact will be deleted', isConfirm => {
      if (isConfirm) {
        contact.destroy({
          success() {
            // Regirect user to the contacts list after
            // deletion
            App.notifySuccess('Contact was deleted');
            App.router.navigate('/contacts', true);
          },
          error() {
            // Show error message when something is wrong
            App.notifyError('Something goes wrong');
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

module.exports = ContactViewer;
