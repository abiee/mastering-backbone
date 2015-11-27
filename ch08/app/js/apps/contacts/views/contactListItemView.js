'use strict';

var App = require('../../../app');
var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactListItem.tpl');

class ContactListItemView extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
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

module.exports = ContactListItemView;
