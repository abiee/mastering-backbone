'use strict';

class ContactListLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = '#contact-list-layout';
    this.regions = {
      actions: '.actions-bar-container',
      list: '.list-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

class ContactListActionBar extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-list-action-bar';
  }

  get className() {
    return 'options-bar col-xs-12';
  }

  get events() {
    return {
      'click button': 'createContact'
    };
  }

  createContact() {
    App.router.navigate('contacts/new', true);
  }
}

class ContactListItemView extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-list-item';
  }

  get className() {
    return 'col-xs-12 col-sm-6 col-md-3';
  }

  get events() {
    return {
      'click #delete': 'deleteContact',
      'click #view': 'viewContact'
    };
  }

  initialize(options) {
    this.listenTo(options.model, 'change', this.render);
  }

  deleteContact() {
    this.trigger('contact:delete', this.model);
  }

  viewContact() {
    var contactId = this.model.get('id');
    App.router.navigate(`contacts/view/${contactId}`, true);
  }
}

class ContactListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = ContactListItemView;
  }

  get className() {
    return 'contact-list';
  }
}

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
