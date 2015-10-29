'use strict';

class ContactViewLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = '#contact-view-layout';
    this.regions = {
      widget: '#contact-widget',
      about: '#about-container',
      calls: '#call-log-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

class ContactWidget extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-view-widget';
  }

  get className() {
    return 'box contact-summary';
  }
}

class ContactAbout extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-view-about';
  }

  get className() {
    return 'panel panel-simple';
  }

  get events() {
    return {
      'click #back': 'goToList',
      'click #delete': 'deleteContact',
      'click #edit': 'editContact'
    };
  }

  goToList() {
    App.router.navigate('contacts', true);
  }

  deleteContact() {
    this.trigger('contact:delete', this.model);
  }

  editContact() {
    var contactId = this.model.get('id');
    App.router.navigate(`contacts/edit/${contactId}`, true);
  }
}

class ContactCallLog extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-view-call-log';
  }

  get className() {
    return 'panel panel-simple';
  }
}

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
