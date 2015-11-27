'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactViewWidget.tpl');

class ContactWidget extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'box contact-summary';
  }
}

module.exports = ContactWidget;
