'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var App = require('../../app');
var ContactFormLayout = require('./views/contactFormLayout');
var ContactPreview = require('./views/contactPreview');
var PhoneListView = require('./views/phoneListView');
var EmailListView = require('./views/emailListView');
var ContactForm = require('./views/contactForm');
var PhoneCollection = require('./collections/phoneCollection');
var EmailCollection = require('./collections/emailCollection');

class ContactEditor {
  constructor(options) {
    this.region = options.region;

    // Allow subapplication to listen and trigger events,
    // useful for subapplication wide events
    _.extend(this, Backbone.Events);
  }

  showEditor(contact) {
    // Data
    var phonesData = contact.get('phones') || [];
    var emailsData = contact.get('emails') || [];
    this.phones = new PhoneCollection(phonesData);
    this.emails = new EmailCollection(emailsData);

    // Create the views
    this.layout = new ContactFormLayout({model: contact});
    this.phonesView = new PhoneListView({collection: this.phones});
    this.emailsView = new EmailListView({collection: this.emails});
    this.contactForm = new ContactForm({model: contact});
    this.contactPreview = new ContactPreview({
      controller: this,
      model: contact
    });

    // Render the views
    this.region.show(this.layout);
    this.layout.getRegion('form').show(this.contactForm);
    this.layout.getRegion('preview').show(this.contactPreview);
    this.contactForm.getRegion('phones').show(this.phonesView);
    this.contactForm.getRegion('emails').show(this.emailsView);

    this.listenTo(this.contactForm, 'form:save', this.saveContact);
    this.listenTo(this.contactForm, 'form:cancel', this.cancel);
    this.listenTo(this.contactForm, 'phone:add', this.addPhone);
    this.listenTo(this.contactForm, 'email:add', this.addEmail);

    this.listenTo(this.phonesView, 'item:phone:deleted', (view, phone) => {
      this.deletePhone(phone);
    });
    this.listenTo(this.emailsView, 'item:email:deleted', (view, email) => {
      this.deleteEmail(email);
    });

    // When avatar is selected, we can save it inmediatly if the
    // contact already exists on the server, otherwise just
    // remember the file selected
    this.listenTo(this.contactPreview, 'avatar:selected', blob => {
      this.avatarSelected = blob;

      if (!contact.isNew()) {
        this.uploadAvatar(contact);
      }
    });
  }

  saveContact(contact) {
    var phonesData = this.phones.toJSON();
    var emailsData = this.emails.toJSON();

    contact.set({
      phones: phonesData,
      emails: emailsData
    });

    if (!contact.isValid(true)) {
      return;
    }

    var wasNew = contact.isNew();

    // The avatar attribute is read-only
    if (contact.has('avatar')) {
      contact.unset('avatar');
    }

    function notifyAndRedirect() {
      // Redirect user to contact list after save
      App.notifySuccess('Contact saved');
      App.router.navigate('contacts', true);
    }

    contact.save(null, {
      success: () => {
        // If we are not creating an user it's done
        if (!wasNew) {
          notifyAndRedirect();
          return;
        }

        // On user creation send the avatar to the server too
        this.uploadAvatar(contact, {
          success: notifyAndRedirect
        });
      },
      error() {
        // Show error message if something goes wrong
        App.notifyError('Something goes wrong');
      }
    });
  }

  addPhone() {
    this.phones.add({});
  }

  addEmail() {
    this.emails.add({});
  }

  deletePhone(phone) {
    this.phones.remove(phone);
  }

  deleteEmail(email) {
    this.emails.remove(email);
  }

  uploadAvatar(contact, options) {
    // Tell to others that upload will start
    this.trigger('avatar:uploading:start');

    contact.uploadAvatar(this.avatarSelected, {
      progress: (length, uploaded, percent) => {
        // Tell to others that upload is in progress
        this.trigger('avatar:uploading:progress',
                     length, uploaded, percent);
        if (options && _.isFunction(options.success)) {
          options.success();
        }
      },
      success: () => {
        // Tell to others that upload was done successfully
        this.trigger('avatar:uploading:done');
      },
      error: err => {
        // Tell to others that upload was error
        this.trigger('avatar:uploading:error', err);
      }
    });
  }

  cancel() {
    // Warn user before make redirection to prevent accidental
    // cencel
    App.askConfirmation('Changes will be lost', isConfirm => {
      if (isConfirm) {
        App.router.navigate('contacts', true);
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

module.exports = ContactEditor;
