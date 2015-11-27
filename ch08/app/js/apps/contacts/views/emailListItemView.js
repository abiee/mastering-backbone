'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactFormEmailItem.tpl');

class EmailListItemView extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'form-group';
  }

  get events() {
    return {
      'change .description': 'updateDescription',
      'change .phone': 'updateEmail',
      'click a': 'deleteEmail'
    };
  }

  updateDescription() {
    var $el = this.$('.description');
    this.model.set('description', $el.val());
  }

  updateEmail() {
    var $el = this.$('.email');
    this.model.set('email', $el.val());
  }

  deleteEmail(event) {
    event.preventDefault();
    this.trigger('email:deleted', this.model);
  }
}

module.exports = EmailListItemView;
