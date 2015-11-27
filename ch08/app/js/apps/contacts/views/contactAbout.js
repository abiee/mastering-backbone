'use strict';

var App = require('../../../app');
var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactViewAbout.tpl');

class ContactAbout extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
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

module.exports = ContactAbout;
