'use strict';

// TODO: enable pagination
class ContactsApp {
  constructor(options) {
    this.region = options.region;
  }

  showContactList() {
    App.trigger('loading:start');
    App.trigger('app:contacts:started');

    new ContactCollection().fetch({
      success: (collection) => {
        // Show the contact list subapplication if
        // the list can be fetched
        this.showList(collection);
        App.trigger('loading:stop');
      },
      fail: (collection, response) => {
        // Show error message if something goes wrong
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showNewContactForm() {
    App.trigger('app:contacts:new:started');
    this.showEditor(new Contact());
  }

  showContactEditorById(contactId) {
    App.trigger('loading:start');
    App.trigger('app:contacts:started');

    new Contact({id: contactId}).fetch({
      success: (model) => {
        this.showEditor(model);
        App.trigger('loading:stop');
      },
      fail: (collection, response) => {
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showContactById(contactId) {
    App.trigger('loading:start');
    App.trigger('app:contacts:started');

    new Contact({id: contactId}).fetch({
      success: (model) => {
        this.showViewer(model);
        App.trigger('loading:stop');
      },
      fail: (collection, response) => {
        App.trigger('loading:stop');
        App.trigger('server:error', response);
      }
    });
  }

  showList(contacts) {
    var contactList = this.startController(ContactList);
    contactList.showList(contacts);
  }

  showEditor(contact) {
    var contactEditor = this.startController(ContactEditor);
    contactEditor.showEditor(contact);
  }

  showViewer(contact) {
    var contactViewer = this.startController(ContactViewer);
    contactViewer.showContact(contact);
  }

  startController(Controller) {
    if (this.currentController &&
        this.currentController instanceof Controller) {
      return this.currentController;
    }

    if (this.currentController && this.currentController.destroy) {
      this.currentController.destroy();
    }

    this.currentController = new Controller({region: this.region});
    return this.currentController;
  }
}
